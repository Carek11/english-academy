export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metodo non consentito' })
  }

  const { name, email, message, corso } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Compila tutti i campi obbligatori.' })
  }

  if (!email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Email non valida.' })
  }

  return res.status(200).json({ success: true, message: 'Messaggio ricevuto! Ti contatteremo presto.' })
}
