interface MessageBubbleProps {
  /**
   * The text to be displayed in the message bubble
   */
  text: string
  /**
   * Whether the message bubble is owned by the current user or not
   */
  own: boolean
  /**
   * The timestamp of the message to be displayed in the message bubble
   */
  timestamp?: string
}

export type { MessageBubbleProps };