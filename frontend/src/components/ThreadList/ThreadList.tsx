import type { ThreadListProps, Thread } from './ThreadList.types';
import { threadListStyles } from './ThreadList.styles';
const ThreadList = ({ activeId, threads, onSelect }: ThreadListProps) => {
  const styles = threadListStyles();
  return (
    <ul className={threadListStyles().root()}>
      {threads.map((thread: Thread) => {
        const isActive = activeId === thread.id;
        const styles = threadListStyles({
          unread: thread.unread,
          active: isActive,
        });

        return (
          <li className={styles.row()} key={thread.id} aria-current={isActive ? 'true' : undefined}>
            <button className={styles.button()} onClick={() => onSelect(thread.id)}>
              <div className={styles.headerRow()}>
                <span className={styles.withName()}>
                  {thread.withName}
                  {thread.unread && <span className={styles.unreaddot({ unread: true })}>unread</span>}
                </span>
                <span className={styles.time()}>{thread.time}</span>
              </div>
              <div className={styles.itemTitle()}>{thread.itemTitle}</div>
              <div className={styles.lastMessage()}>{thread.lastMessage}</div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ThreadList;
