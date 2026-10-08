import type { ThreadListProps, Thread } from './ThreadList.types';
import { threadListStyles } from './ThreadList.styles';
import ThreadRow from './ThreadRow';
import React from 'react';
const ThreadList = ({ activeId, threads, onSelect }: ThreadListProps) => {
  const ListStyles = threadListStyles();

  const handleSelect = React.useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect]
  );

  return (
    <ul className={ListStyles.root()}>
      {threads.map((thread: Thread) => {
        return (
          <ThreadRow
            key={thread.id}
            isActive={activeId === thread.id}
            thread={thread}
            onSelect={handleSelect}
          />
        );
      })}
    </ul>
  );
};

export default ThreadList;
