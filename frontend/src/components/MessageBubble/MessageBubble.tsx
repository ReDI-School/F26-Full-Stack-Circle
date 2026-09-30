import { MessageBubbleProps } from "./MessageBubble.types";
export type { MessageBubbleProps } from "./MessageBubble.types";
import { messageBubbleStyles } from "./MessageBubble.style";

const MessageBubble = ({ text, own, timestamp }: MessageBubbleProps) => {
  return (

    <div className={messageBubbleStyles({ own })}>
    
      <p>{text}</p>
    
      {timestamp && <span className="timestamp">{timestamp}</span>}
    
    </div>
  
);

};

export default MessageBubble;