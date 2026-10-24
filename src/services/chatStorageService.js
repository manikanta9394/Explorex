import { supabase } from '../lib/api/supabaseClient'

/**
 * Chat Storage Service for Conversations & Messages
 * Persists to Supabase Postgres (or LocalSupabaseEmulator) with full offline resilience.
 */

export async function fetchUserConversations(userId) {
  if (!userId) return []
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.warn('fetchUserConversations error:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.warn('fetchUserConversations error:', err)
    return []
  }
}

export async function createConversation(userId, initialTitle = 'New Conversation') {
  if (!userId) return null
  try {
    const newConv = {
      user_id: userId,
      title: initialTitle,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('conversations')
      .insert(newConv)
      .select()

    if (error) throw error
    return Array.isArray(data) ? data[0] : data
  } catch (err) {
    console.warn('createConversation error:', err)
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      title: initialTitle,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
}

export async function updateConversationTitle(conversationId, title) {
  if (!conversationId) return
  try {
    await supabase
      .from('conversations')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', conversationId)
  } catch (err) {
    console.warn('updateConversationTitle error:', err)
  }
}

export async function togglePinConversation(conversationId, isPinned) {
  if (!conversationId) return
  try {
    await supabase
      .from('conversations')
      .update({ is_pinned: isPinned, updated_at: new Date().toISOString() })
      .eq('id', conversationId)
  } catch (err) {
    console.warn('togglePinConversation error:', err)
  }
}

export async function deleteConversation(conversationId) {
  if (!conversationId) return
  try {
    // Delete messages first, then conversation
    await supabase.from('messages').delete().eq('conversation_id', conversationId)
    await supabase.from('conversations').delete().eq('id', conversationId)
  } catch (err) {
    console.warn('deleteConversation error:', err)
  }
}

export async function fetchConversationMessages(conversationId) {
  if (!conversationId) return []
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      console.warn('fetchConversationMessages error:', error)
      return []
    }
    return (data || []).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      citations: Array.isArray(m.citations) ? m.citations : [],
      model: m.model,
      feedback: m.feedback,
      createdAt: m.created_at,
    }))
  } catch (err) {
    console.warn('fetchConversationMessages error:', err)
    return []
  }
}

export async function saveMessage(conversationId, { role, content, citations = [], model = null }) {
  if (!conversationId || !content) return null
  try {
    const record = {
      conversation_id: conversationId,
      role,
      content,
      citations: Array.isArray(citations) ? citations : [],
      model,
      created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('messages')
      .insert(record)
      .select()

    // Also touch conversation's updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)

    if (error) throw error
    return Array.isArray(data) ? data[0] : data
  } catch (err) {
    console.warn('saveMessage error:', err)
    return {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role,
      content,
      citations,
      model,
      created_at: new Date().toISOString(),
    }
  }
}

export async function updateMessageFeedback(messageId, feedbackValue) {
  if (!messageId) return
  try {
    await supabase
      .from('messages')
      .update({ feedback: feedbackValue })
      .eq('id', messageId)
  } catch (err) {
    console.warn('updateMessageFeedback error:', err)
  }
}

/**
 * Group conversations into:
 * - Pinned
 * - Today
 * - Yesterday
 * - Earlier
 */
export function groupConversations(conversations = []) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000

  const pinned = []
  const today = []
  const yesterday = []
  const earlier = []

  conversations.forEach((conv) => {
    if (conv.is_pinned) {
      pinned.push(conv)
      return
    }

    const t = new Date(conv.updated_at || conv.created_at).getTime()
    if (t >= todayStart) {
      today.push(conv)
    } else if (t >= yesterdayStart) {
      yesterday.push(conv)
    } else {
      earlier.push(conv)
    }
  })

  return { pinned, today, yesterday, earlier }
}
