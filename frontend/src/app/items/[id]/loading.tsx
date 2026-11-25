const ItemDetailLoading = () => (
  <div
    className="mx-auto w-full max-w-[1076px] px-8 py-7 pb-20"
    aria-label="Loading item details"
    aria-busy="true"
  >
    <div className="mb-6 h-5 w-36 animate-pulse rounded bg-muted" />
    <div className="grid grid-cols-1 items-start gap-8 min-[800px]:grid-cols-[1.1fr_1fr]">
      <div>
        <div className="h-[420px] animate-pulse rounded-[24px] border border-border bg-muted/40" />
        <div className="mt-3 flex gap-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-[84px] flex-1 animate-pulse rounded-[14px] bg-muted/40" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-8 w-44 animate-pulse rounded-pill bg-muted/40" />
        <div className="h-10 w-4/5 animate-pulse rounded bg-muted/40" />
        <div className="h-9 w-32 animate-pulse rounded bg-muted/40" />
        <div className="space-y-2">
          <div className="h-4 animate-pulse rounded bg-muted/40" />
          <div className="h-4 animate-pulse rounded bg-muted/40" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted/40" />
        </div>
        <div className="mt-2 h-28 animate-pulse rounded-card border border-border bg-muted/40" />
      </div>
    </div>
  </div>
);

export default ItemDetailLoading;
