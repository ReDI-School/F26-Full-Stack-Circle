import React from 'react';
import type { ThreadRowProps } from './ThreadList.types';
import { threadListStyles } from './ThreadList.styles';

const ThreadRow = React.memo(({ thread, isActive, onSelect }: ThreadRowProps) => {
  const itemStyles = threadListStyles({
    active: isActive,
  });
  return (
    <li className={itemStyles.row()} key={thread.id}>
      <button
        aria-current={isActive ? 'true' : undefined}
        className={itemStyles.button()}
        onClick={() => onSelect(thread.id)}
      >
        <div className={itemStyles.headerRow()}>
          <span className={itemStyles.withName()}>
            {thread.withName}
            {thread.unread && (
              <>
                <span className={itemStyles.unreaddot()} aria-hidden="true" />
                <span className="sr-only">unread</span>
              </>
            )}
          </span>
          <span className={itemStyles.time()}>{thread.time}</span>
        </div>
        <div className={itemStyles.itemTitle()}>{thread.itemTitle}</div>
        <div className={itemStyles.lastMessage()}>{thread.lastMessage}</div>
      </button>
    </li>
  );
});
export default ThreadRow;
