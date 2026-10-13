// Posts the tail of a failed Vercel build log as a comment on the pull
// request, because students cannot open the Vercel dashboard. Called by
// .github/workflows/vercel-build-logs.yml through actions/github-script.
//
// Each PR gets one comment, found by MARKER and edited in place, so a PR
// that fails five times still has a single comment showing the latest log.

const MARKER = '<!-- vercel-build-log -->';
const MAX_LINES = 150;
// GitHub rejects comments over 65,536 characters; leave room for the text
// around the log.
const MAX_CHARS = 50_000;
const GUIDE_PATH = 'ARCHITECTURE.md#7-a-check-went-red--what-now';

/** The Vercel status links to https://vercel.com/<team>/<project>/<id>. */
function deploymentIdFromUrl(targetUrl) {
  const id = new URL(targetUrl).pathname.split('/').filter(Boolean).pop();
  return id.startsWith('dpl_') ? id : `dpl_${id}`;
}

/**
 * The repo is public, so anything that looks like a credential is masked
 * before it is posted. Nothing in our build prints one today; this is for
 * the day someone adds `echo $POSTGRES_URL` while debugging.
 */
function redact(text, secrets = []) {
  let out = text
    // user:password@ in any URL, e.g. postgres://user:pass@host
    .replace(/(\b[a-z][a-z0-9+.-]*:\/\/)[^\s/@]+@/gi, '$1***@')
    // POSTGRES_PASSWORD=..., SUPABASE_SERVICE_ROLE_KEY: ..., token="..."
    .replace(
      /\b([a-z0-9_]*(?:password|passwd|secret|token|key|jwt)[a-z0-9_]*\s*[=:]\s*)(["']?)[^\s"']+\2/gi,
      '$1***'
    )
    // Bare values: JWTs (the older Supabase keys) and Supabase secret keys.
    .replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, '***')
    .replace(/\bsb_secret_[\w-]+/g, '***');
  for (const secret of secrets) {
    if (secret) out = out.split(secret).join('***');
  }
  return out;
}

/** Turns Vercel build events into the last lines of plain-text log. */
function formatLog(events) {
  const lines = events
    .filter((event) => event.type === 'stdout' || event.type === 'stderr')
    .map((event) => event.text ?? event.payload?.text ?? '')
    .join('\n')
    // Colour codes from the build tools.
    .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')
    .split('\n');

  let tail = lines.slice(-MAX_LINES);
  while (tail.length > 1 && tail.join('\n').length > MAX_CHARS) tail = tail.slice(1);
  return { text: tail.join('\n'), truncated: tail.length < lines.length };
}

/** A code fence longer than any run of backticks inside the log. */
function fence(text) {
  const longest = Math.max(0, ...(text.match(/`+/g) ?? []).map((run) => run.length));
  return '`'.repeat(Math.max(3, longest + 1));
}

function failureBody({ sha, errorMessage, log, guideUrl }) {
  const intro = log
    ? `${log.truncated ? `The last ${MAX_LINES} lines of the build log are` : 'The full build log is'} below. The error is usually near the bottom.`
    : 'The build log could not be fetched from Vercel. Post the PR link in Slack and a teacher will look it up.';
  const parts = [
    MARKER,
    '### ❌ The Vercel build failed',
    '',
    `**Commit:** \`${sha.slice(0, 7)}\`${errorMessage ? ` · **Vercel says:** ${errorMessage}` : ''}`,
    '',
    `${intro} [What to do when the Vercel check is red](${guideUrl}).`,
  ];
  if (log) {
    const f = fence(log.text);
    parts.push(
      '',
      '<details open><summary>Build log</summary>',
      '',
      `${f}text`,
      log.text,
      f,
      '',
      '</details>'
    );
  }
  parts.push('', '_This comment updates itself on every push to this pull request._');
  return parts.join('\n');
}

function fixedBody({ sha, previous }) {
  // Keep the old log, folded away, in case someone wants to compare.
  const old = previous.replace(MARKER, '').replace('<details open>', '<details>');
  return [
    MARKER,
    `### ✅ Fixed: the Vercel build for \`${sha.slice(0, 7)}\` succeeded`,
    '',
    '<details><summary>The earlier failure</summary>',
    '',
    old.trim(),
    '',
    '</details>',
  ].join('\n');
}

async function vercel(path, token) {
  const response = await fetch(`https://api.vercel.com${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Vercel API ${path} answered ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

/**
 * The pull requests to comment on. For a preview, the open PRs whose
 * latest commit is this one: an older commit's result would only confuse.
 * For production, the PR that was merged.
 */
async function pullRequestsFor({ github, context, sha, production }) {
  const { data } = await github.rest.repos.listPullRequestsAssociatedWithCommit({
    ...context.repo,
    commit_sha: sha,
  });
  return production
    ? data.filter((pr) => pr.merged_at)
    : data.filter((pr) => pr.state === 'open' && pr.head.sha === sha);
}

async function findComment({ github, context, number }) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo,
    issue_number: number,
    per_page: 100,
  });
  return comments.find(
    (comment) => comment.user?.type === 'Bot' && comment.body?.startsWith(MARKER)
  );
}

async function upsertComment({ github, context, number, body }) {
  const existing = await findComment({ github, context, number });
  if (existing) {
    await github.rest.issues.updateComment({ ...context.repo, comment_id: existing.id, body });
  } else {
    await github.rest.issues.createComment({ ...context.repo, issue_number: number, body });
  }
}

async function report({ github, context, core }) {
  const { sha, target_url: targetUrl } = context.payload;
  const token = process.env.VERCEL_TOKEN;
  const id = deploymentIdFromUrl(targetUrl);

  let deployment = {};
  let log = null;
  try {
    if (!token) throw new Error('VERCEL_TOKEN is not set for this job.');
    deployment = await vercel(`/v13/deployments/${id}`, token);
    const events = await vercel(`/v3/deployments/${id}/events?builds=1&limit=-1`, token);
    const formatted = formatLog(events);
    log = { ...formatted, text: redact(formatted.text, [token]) };
  } catch (error) {
    // Still tell the student the build failed, without the log.
    core.warning(`Could not fetch the build log for ${id}: ${error.message}`);
  }

  const production = deployment.target === 'production';
  const prs = await pullRequestsFor({ github, context, sha, production });
  if (prs.length === 0) {
    core.info(`No pull request to comment on for ${sha}.`);
    return;
  }

  const guideUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/blob/main/${GUIDE_PATH}`;
  const errorMessage = deployment.errorMessage ? redact(deployment.errorMessage, [token]) : '';
  const body = failureBody({ sha, errorMessage, log, guideUrl });
  for (const pr of prs) {
    await upsertComment({ github, context, number: pr.number, body });
    core.info(`Posted the build log on #${pr.number}.`);
  }
}

async function resolve({ github, context, core }) {
  const { sha } = context.payload;
  const prs = await pullRequestsFor({ github, context, sha, production: false });
  for (const pr of prs) {
    const existing = await findComment({ github, context, number: pr.number });
    // Only a comment that still shows a failure needs changing.
    if (!existing || !existing.body.includes('### ❌')) continue;
    await github.rest.issues.updateComment({
      ...context.repo,
      comment_id: existing.id,
      body: fixedBody({ sha, previous: existing.body }),
    });
    core.info(`Marked the build log on #${pr.number} as fixed.`);
  }
}

module.exports = {
  report,
  resolve,
  deploymentIdFromUrl,
  redact,
  formatLog,
  failureBody,
  fixedBody,
};
