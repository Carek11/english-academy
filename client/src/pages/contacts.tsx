import { useState } from "react";

const contactCards = [
  {
    icon: "📍",
    title: "Sede",
    content: ["Via della Marina, 14", "00100 Roma (RM)", "Italia"],
  },
  {
    icon: "📞",
    title: "Telefono",
    content: [<a key="tel" href="tel:+390612345678" className="text-academy-blue font-semibold">+39 06 1234 5678</a>, <span key="hours" className="text-xs text-academy-gray">Lun–Ven 9:00–18:00</span>],
  },
  {
    icon: "✉️",
    title: "Email",
    content: [<a key="e1" href="mailto:info@englishacademy.it" className="text-academy-blue font-semibold block">info@englishacademy.it</a>, <a key="e2" href="mailto:corsi@englishacademy.it" className="text-academy-blue font-semibold">corsi@englishacademy.it</a>],
  },
  {
    icon: "💬",
    title: "Social",
    content: ["Instagram · LinkedIn", "Facebook · YouTube"],
  },
];

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "-- Seleziona --",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", course: "-- Seleziona --", message: "" });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="space-y-16">
      <section className="text-center space-y-4">
        <h2 className="text-4xl font-bold font-display text-academy-dark">Contatti</h2>
        <p className="text-academy-gray">Siamo qui per aiutarti. Scrivici o chiamaci.</p>
        <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{card.icon}</div>
            <h4 className="font-bold text-academy-dark mb-3">{card.title}</h4>
            <div className="text-sm text-academy-gray space-y-1">
              {card.content.map((line, j) => (
                <div key={j}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="max-w-2xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-center text-academy-dark">📩 Scrivici un messaggio</h3>

        {submitted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center font-semibold">
            ✅ Messaggio inviato! Ti risponderemo entro 24 ore.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-academy-dark mb-2">NOME E COGNOME</label>
            <input
              type="text"
              placeholder="Mario Rossi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-academy-gray border-opacity-30 rounded-lg focus:outline-none focus:border-academy-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-academy-dark mb-2">EMAIL</label>
            <input
              type="email"
              placeholder="mario@email.it"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-academy-gray border-opacity-30 rounded-lg focus:outline-none focus:border-academy-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-academy-dark mb-2">CORSO DI INTERESSE</label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-academy-gray border-opacity-30 rounded-lg focus:outline-none focus:border-academy-blue"
            >
              <option>-- Seleziona --</option>
              <option>Inglese Base (A1–A2)</option>
              <option>Inglese Intermedio (B1–B2)</option>
              <option>Business English</option>
              <option>Inglese Navale – Marina Militare</option>
              <option>Preparazione IELTS / Cambridge</option>
              <option>Altro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-academy-dark mb-2">MESSAGGIO</label>
            <textarea
              placeholder="Scrivi qui la tua richiesta..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-academy-gray border-opacity-30 rounded-lg focus:outline-none focus:border-academy-blue"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-academy-blue text-white font-semibold rounded-lg hover:bg-academy-light-blue transition-colors"
          >
            Invia Messaggio ✉️
          </button>
        </form>
      </section>
    </div>
  );
}
