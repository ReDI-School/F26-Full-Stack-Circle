import type { MessageBubbleProps } from './MessageBubble.types';
import { messageBubbleStyles } from './MessageBubble.style';

function MessageBubble({ text, own, timestamp }: MessageBubbleProps) {
  const { base, timestamp: timestampClass } = messageBubbleStyles({ own });

  return (
    <div className={base()}>
      <p>{text}</p>
      {timestamp && <time className={timestampClass()}>{timestamp}</time>}
    </div>
  );
}

export default MessageBubble;
