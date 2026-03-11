import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metodo non consentito' })
  }

  const { nome, cognome, email, password, corso } = req.body

  if (!nome || !cognome || !email || !password) {
    return res.status(400).json({ success: false, message: 'Compila tutti i campi obbligatori.' })
  }

  if (!email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Indirizzo email non valido.' })
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'La password deve essere di almeno 6 caratteri.' })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, cognome, corso_interesse: corso || '' }
    }
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return res.status(409).json({ success: false, message: 'Email già registrata. Prova ad accedere.' })
    }
    return res.status(500).json({ success: false, message: 'Errore registrazione.' })
  }

  return res.status(200).json({ success: true, message: `Benvenuto, ${nome}!`, nome })
}
