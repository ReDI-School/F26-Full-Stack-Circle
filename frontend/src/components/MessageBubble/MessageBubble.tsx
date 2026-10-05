import type { MessageBubbleProps } from './MessageBubble.types';
import { messageBubbleStyles, messageBubbleTimestampStyles } from './MessageBubble.style';

function MessageBubble({ text, own, timestamp }: MessageBubbleProps) {
  return (
    <div className={messageBubbleStyles({ own })}>
      <p>{text}</p>
      {timestamp && <time className={messageBubbleTimestampStyles({ own })}>{timestamp}</time>}
    </div>
  );
}

export default MessageBubble;
