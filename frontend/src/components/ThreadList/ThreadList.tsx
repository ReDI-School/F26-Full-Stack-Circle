import type { ThreadListProps, Thread } from './ThreadList.types';
import { threadListStyles } from './ThreadList.styles';
import ThreadRow from './ThreadRow';
const ThreadList = ({ activeId, threads, onSelect }: ThreadListProps) => {
  const ListStyles = threadListStyles();

  return (
    <ul className={ListStyles.root()}>
      {threads.map((thread: Thread) => {
        return (
          <ThreadRow
            key={thread.id}
            isActive={activeId === thread.id}
            thread={thread}
            onSelect={onSelect}
          />
        );
      })}
    </ul>
  );
};

export default ThreadList;
