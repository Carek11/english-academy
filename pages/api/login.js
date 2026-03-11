import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metodo non consentito' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Inserisci email e password.' })
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return res.status(401).json({ success: false, message: 'Email o password non corretti.' })
  }

  const nome = data.user.user_metadata?.nome || email.split('@')[0]
  return res.status(200).json({ success: true, message: `Bentornato, ${nome}!`, nome })
}
