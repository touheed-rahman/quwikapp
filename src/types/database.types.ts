
export interface ReadReceipt {
  id: string;
  conversation_id: string;
  user_id: string;
  read_at: string;
  last_read_message_id: string;
}

export interface UserStatus {
  user_id: string;
  last_online: string;
  status: 'online' | 'offline';
}

export interface TypingPresence {
  isTyping: boolean;
  timestamp: string;
}
