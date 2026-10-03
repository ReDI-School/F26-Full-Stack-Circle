import type { ThreadListProps, Thread } from './ThreadList.types';
import { threadListStyles } from './ThreadList.styles';
const ThreadList = ({ activeId, threads, onSelect }: ThreadListProps) => {
  const ListStyles = threadListStyles();
  return (
    <ul className={ListStyles.root()}>
      {threads.map((thread: Thread) => {
        const isActive = activeId === thread.id;
        const itemStyles = threadListStyles({
          unread: thread.unread,
          active: isActive,
        });

        return (
          <li className={itemStyles.row()} key={thread.id} >
            <button aria-current={isActive ? 'true' : undefined} className={itemStyles.button()} onClick={() => onSelect(thread.id)}>
              <div className={itemStyles.headerRow()}>
                <span className={itemStyles.withName()}>
                  {thread.withName}
                  {thread.unread && <span className={itemStyles.unreaddot({ unread: true })}></span>}
                  {thread.unread && <span className={itemStyles.unreaddot({ unread: true })}>unread</span>}
                </span>
                <span className={itemStyles.time()}>{thread.time}</span>
              </div>
              <div className={itemStyles.itemTitle()}>{thread.itemTitle}</div>
              <div className={itemStyles.lastMessage()}>{thread.lastMessage}</div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ThreadList;
