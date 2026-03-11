import { teamMembers } from "@/lib/quizData";

export default function TeamPage() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-4">
        <h2 className="text-4xl font-bold font-display text-academy-dark">Chi Siamo</h2>
        <p className="text-academy-gray">Il team dietro English Academy</p>
        <div className="h-1 w-20 bg-academy-gold mx-auto rounded"></div>
      </section>

      <section className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold font-display text-academy-dark">La nostra missione</h2>
        <p className="text-academy-gray leading-relaxed">
          English Academy nasce dall'idea che imparare l'inglese debba essere accessibile, efficace e contestualizzato. Ogni corso è progettato per rispondere a esigenze reali.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {teamMembers.map((member, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-4">{member.avatar}</div>
            <h4 className="text-xl font-bold text-academy-dark mb-1">{member.name}</h4>
            <div className="text-xs font-semibold text-academy-blue mb-3">{member.role}</div>
            <p className="text-academy-gray text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
