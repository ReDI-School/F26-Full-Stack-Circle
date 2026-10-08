interface Thread {
  id: string;
  withName: string;
  itemTitle: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}
interface ThreadRowProps {
  thread: Thread;
  isActive: boolean;
  onSelect: (id: string) => void;
}
interface ThreadListProps {
  activeId?: string;
  threads: Thread[];
  onSelect: (id: string) => void;
}

export type { ThreadListProps, Thread, ThreadRowProps };
