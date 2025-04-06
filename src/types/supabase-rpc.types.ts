
/**
 * This file documents the RPC functions used in the application.
 * These functions need to be created in Supabase SQL editor.
 */

// Define the RPC function types to be recognized by TypeScript
declare module '@supabase/supabase-js' {
  interface SupabaseClient<Database = any> {
    rpc<T = any>(
      fn: 'get_read_receipts_for_conversation' | 'update_read_receipt' | 'get_user_status',
      params?: object,
      options?: object
    ): { data: T; error: Error | null };
  }
}

/**
 * Function: get_read_receipts_for_conversation
 * 
 * CREATE OR REPLACE FUNCTION get_read_receipts_for_conversation(
 *   p_conversation_id UUID,
 *   p_current_user_id UUID
 * )
 * RETURNS TABLE (
 *   id UUID,
 *   conversation_id UUID,
 *   user_id UUID,
 *   read_at TIMESTAMP WITH TIME ZONE,
 *   last_read_message_id UUID
 * )
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * BEGIN
 *   RETURN QUERY
 *   SELECT * FROM read_receipts 
 *   WHERE conversation_id = p_conversation_id
 *   AND user_id <> p_current_user_id
 *   ORDER BY read_at DESC;
 * END;
 * $$;
 */

/**
 * Function: update_read_receipt
 * 
 * CREATE OR REPLACE FUNCTION update_read_receipt(
 *   p_conversation_id UUID,
 *   p_user_id UUID,
 *   p_message_id UUID
 * )
 * RETURNS VOID
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * BEGIN
 *   INSERT INTO read_receipts (conversation_id, user_id, read_at, last_read_message_id)
 *   VALUES (p_conversation_id, p_user_id, now(), p_message_id)
 *   ON CONFLICT (conversation_id, user_id)
 *   DO UPDATE SET 
 *     read_at = now(),
 *     last_read_message_id = p_message_id;
 * END;
 * $$;
 */

/**
 * Function: get_user_status
 * 
 * CREATE OR REPLACE FUNCTION get_user_status(
 *   user_id UUID
 * )
 * RETURNS JSON
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   status_data JSON;
 * BEGIN
 *   SELECT 
 *     json_build_object(
 *       'user_id', u.user_id,
 *       'last_online', u.last_online,
 *       'status', u.status
 *     ) INTO status_data
 *   FROM user_status u
 *   WHERE u.user_id = get_user_status.user_id;
 *   
 *   RETURN status_data;
 * END;
 * $$;
 */
