
export interface ConversationParticipant {
  id?: string;
  conversation_id: string;
  user_id: string;
  deleted_at?: string | null;
  created_at?: string;
}
