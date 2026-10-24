import { supabase } from './supabaseClient'

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUpWithEmail(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: displayName,
        full_name: displayName,
        is_anonymous: false,
      },
    },
  })
  if (error) throw error
  return data
}

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        name: 'Guest Explorer',
        is_anonymous: true,
      },
    },
  })
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const redirectUrl = `${window.location.origin}${window.location.pathname}`
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })
  if (error) throw error
  return data
}

/**
 * Converts an anonymous guest session into a permanent user account
 * retaining THE SAME user ID and all attached saved places / itineraries!
 */
export async function upgradeGuestAccount(email, password, displayName) {
  const { data, error } = await supabase.auth.updateUser({
    email,
    password,
    data: {
      name: displayName || email.split('@')[0],
      full_name: displayName || email.split('@')[0],
      is_anonymous: false,
    },
  })
  if (error) throw error

  // Also update public.profiles if configured
  try {
    if (data.user?.id) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        display_name: displayName || email.split('@')[0],
        is_guest: false,
      })
    }
  } catch {}

  return data
}

export async function resetPassword(email) {
  const redirectUrl = `${window.location.origin}${window.location.pathname}#/reset-password`
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data?.session || null
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data?.user || null
}
