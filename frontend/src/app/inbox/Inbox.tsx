'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ImageSlot } from '@/components/ImageSlot';
import { MessageBubble } from '@/components/MessageBubble';
import { ThreadList } from '@/components/ThreadList';
import type { ThreadListProps } from '@/components/ThreadList';
import { ApiError, api } from '@/config/api';
import { useToast } from '@/hooks';
import { formatPrice } from '@/lib/price';

/** One conversation in GET /api/threads. */
type ThreadSummary = {
  id: string;
  withName: string;
  item: { id: string; title: string; priceCents: number; photoUrl: string | null } | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unread: boolean;
};

type Message = {
  id: string;
  body: string;
  own: boolean;
  createdAt: string;
  readAt: string | null;
};

/** GET /api/threads/:id: the same conversation plus its messages, oldest first. */
type ThreadDetail = ThreadSummary & { messages: Message[] };

/** What the open conversation's panel shows; null thread means loading it failed. */
type OpenThread = { id: string; thread: ThreadDetail | null };

type ListThread = ThreadListProps['threads'][number];

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "10:24" today, "yesterday", otherwise "5 Nov", like the prototype. */
const formatTime = (iso: string) => {
  const date = new Date(iso);
  const daysAgo = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000);

  if (daysAgo <= 0) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  if (daysAgo === 1) {
    return 'yesterday';
  }

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const toListThread = (thread: ThreadSummary): ListThread => ({
  id: thread.id,
  withName: thread.withName,
  itemTitle: thread.item?.title ?? 'Item removed',
  lastMessage: thread.lastMessage ?? '',
  time: thread.lastMessageAt ? formatTime(thread.lastMessageAt) : '',
  unread: thread.unread,
});

const Inbox = () => {
  const toast = useToast();

  // The conversation list: null while it loads.
  const [threads, setThreads] = useState<ThreadSummary[] | null>(null);
  const [listFailed, setListFailed] = useState(false);
  const [listRequest, setListRequest] = useState(0);

  // Until someone picks a thread, the first one is open, so the panel is never blank.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId = selectedId ?? threads?.[0]?.id ?? null;

  // Kept together with its id, so switching threads never shows the previous one.
  const [open, setOpen] = useState<OpenThread | null>(null);
  const [threadRequest, setThreadRequest] = useState(0);
  const current = open?.id === activeId ? open : null;
  const thread = current?.thread ?? null;

  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    api.get<{ threads: ThreadSummary[] }>('/threads', { signal: controller.signal }).then(
      (data) => {
        if (controller.signal.aborted) return;
        setThreads(data?.threads ?? []);
        setListFailed(false);
      },
      () => {
        if (!controller.signal.aborted) setListFailed(true);
      }
    );

    return () => controller.abort();
  }, [listRequest]);

  const markRead = useCallback((id: string) => {
    api.post(`/threads/${id}/read`).then(
      () => {
        setThreads((list) => list?.map((t) => (t.id === id ? { ...t, unread: false } : t)) ?? list);
        // useUnreadCount refreshes the navbar badge on window focus. Nudge it,
        // so the badge drops now instead of on its next 10-second poll.
        window.dispatchEvent(new Event('focus'));
      },
      () => {
        // Not worth interrupting the user: the dot just stays until the next visit.
      }
    );
  }, []);

  // Selecting a thread loads it and marks it read.
  useEffect(() => {
    if (!activeId) return;
    const controller = new AbortController();

    api.get<{ thread: ThreadDetail }>(`/threads/${activeId}`, { signal: controller.signal }).then(
      (data) => {
        if (controller.signal.aborted || !data) return;
        setOpen({ id: activeId, thread: data.thread });
        if (data.thread.unread) markRead(activeId);
      },
      () => {
        if (!controller.signal.aborted) setOpen({ id: activeId, thread: null });
      }
    );

    return () => controller.abort();
  }, [activeId, threadRequest, markRead]);

  // A chat that opens at its oldest message feels broken: show the newest one
  // when a thread opens and after every send.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [thread]);

  const retryList = () => {
    setListFailed(false);
    setListRequest((n) => n + 1);
  };

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const threadId = activeId;
    const body = draft;

    // An empty or whitespace-only message does nothing, and never reaches the API.
    if (!threadId || !thread || !body.trim()) return;

    // Clear straight away so sending feels instant; the text comes back if it fails.
    setDraft('');

    try {
      const data = await api.post<{ message: Message }>(`/threads/${threadId}/messages`, { body });
      if (!data) return;
      const { message } = data;

      setOpen((shown) =>
        shown?.id === threadId && shown.thread
          ? { ...shown, thread: { ...shown.thread, messages: [...shown.thread.messages, message] } }
          : shown
      );
      // Newest conversation first, the same order the API uses.
      setThreads((list) => {
        const sent = list?.find((t) => t.id === threadId);
        if (!list || !sent) return list;
        return [
          { ...sent, lastMessage: message.body, lastMessageAt: message.createdAt },
          ...list.filter((t) => t.id !== threadId),
        ];
      });
    } catch (error) {
      // Never lose what they typed: put it back, unless they already started a new message.
      setDraft((typed) => typed || body);
      toast.error(
        error instanceof ApiError ? error.message : 'Your message was not sent. Please try again.'
      );
    }
  };

  if (listFailed) {
    return (
      <div className="py-10">
        <h1 className="mb-6">Inbox 💬</h1>
        <div role="alert" className="flex flex-wrap items-center gap-4">
          <p className="text-danger-text">We couldn&apos;t load your messages.</p>
          <Button variant="ghost" size="sm" onClick={retryList}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (threads === null) {
    return (
      <div className="py-10">
        <h1 className="mb-6">Inbox 💬</h1>
        <div role="status" aria-label="Loading conversations">
          <span className="sr-only">Loading conversations…</span>
          <div
            aria-hidden="true"
            className="grid grid-cols-[340px_1fr] items-start gap-5 max-[800px]:grid-cols-1"
          >
            <div className="h-[180px] rounded-card bg-border motion-safe:animate-pulse" />
            <div className="h-[440px] rounded-card bg-border motion-safe:animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="py-10">
        <h1 className="mb-6">Inbox 💬</h1>
        <EmptyState
          variant="boxed"
          emoji="📭"
          title="No messages yet"
          description={`Found something you like? Tap "I'm interested" on an item.`}
        />
      </div>
    );
  }

  return (
    <div className="py-10">
      <h1 className="mb-6">Inbox 💬</h1>
      <div className="grid grid-cols-[340px_1fr] items-start gap-5 max-[800px]:grid-cols-1">
        {/* ThreadList is 340px wide; in the single column it fills the width instead. */}
        <div className="max-[800px]:[&>ul]:w-full">
          <ThreadList
            threads={threads.map(toListThread)}
            activeId={activeId ?? undefined}
            onSelect={setSelectedId}
          />
        </div>

        {/* Capped to the screen height, so a long chat scrolls inside the panel
            (that is what the messages' overflow-y-auto is for) and Send stays visible. */}
        <section
          aria-label={thread ? `Conversation with ${thread.withName}` : 'Conversation'}
          className="flex max-h-[calc(100dvh-13rem)] min-h-[440px] flex-col overflow-hidden rounded-card border border-border bg-surface"
        >
          {!current ? (
            <p role="status" className="m-auto text-muted">
              Loading conversation…
            </p>
          ) : !thread ? (
            <div role="alert" className="m-auto flex flex-col items-center gap-3 p-5">
              <p className="text-danger-text">We couldn&apos;t load this conversation.</p>
              <Button variant="ghost" size="sm" onClick={() => setThreadRequest((n) => n + 1)}>
                Try again
              </Button>
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 border-b border-border px-5 py-4">
                {/* At 44px there is no room for ImageSlot's caption: a missing or
                    broken photo shows just the small image icon. */}
                <ImageSlot
                  value={thread.item?.photoUrl}
                  alt={thread.item?.title ?? 'Item removed'}
                  placeholder=""
                  className="size-11 shrink-0 [&_p]:hidden [&_svg]:size-5"
                />
                <div className="min-w-0">
                  <p className="truncate font-display text-[15px] font-extrabold text-ink">
                    {thread.item?.title ?? 'Item removed'}
                  </p>
                  <p className="text-[13px] text-muted">
                    {thread.item && `${formatPrice(thread.item.priceCents)} · `}with{' '}
                    {thread.withName}
                  </p>
                </div>
                {thread.item ? (
                  <Link
                    href={`/items/${thread.item.id}`}
                    className="ml-auto shrink-0 text-caption font-bold text-title hover:underline"
                  >
                    view item →
                  </Link>
                ) : (
                  // A removed item has no page to go to: show the link greyed out instead.
                  <span
                    aria-disabled="true"
                    className="ml-auto shrink-0 text-caption font-bold text-placeholder"
                  >
                    view item →
                  </span>
                )}
              </header>

              <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-5">
                {thread.messages.map((message) => (
                  <MessageBubble key={message.id} text={message.body} own={message.own} />
                ))}
                <div ref={endRef} />
              </div>

              <form
                onSubmit={send}
                className="flex items-center gap-2.5 border-t border-border px-4 py-3.5"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message…"
                  aria-label="Write a message"
                  maxLength={2000}
                  className="min-w-0 flex-1 rounded-pill border-[1.5px] border-border-input bg-surface px-4 py-2.5 text-body text-ink outline-none transition-all duration-150 placeholder:text-placeholder focus:border-primary focus:ring-[3px] focus:ring-primary-100"
                />
                <Button type="submit" variant="secondary">
                  Send
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Inbox;
