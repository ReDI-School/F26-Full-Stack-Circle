import { MessageBubbleProps } from "./MessageBubble.types";
export type { MessageBubbleProps } from "./MessageBubble.types";

const MessageBubble = ({ text, own, timestamp }: MessageBubbleProps) => {
  return (
    <div className={`message-bubble ${own ? 'own' : ''}`}>
      <p>{text}</p>
      {timestamp && <span className="timestamp">{timestamp}</span>}
    </div>
  );
};

export default MessageBubble;