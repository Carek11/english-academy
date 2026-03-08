"""
Genera learning_hub.db con 3000 esercizi di inglese.
8 categorie: Base, Pre-Intermedio, Intermedio, Avanzato,
             Business, Viaggi, IELTS, Navale
Esegui con: python init_english_db.py
"""
import sqlite3, os, random

DB_PATH = "learning_hub.db"

# ─────────────────────────────────────────────────────────────────────────────
# TEMPLATE ESERCIZI PER CATEGORIA
# Ogni entry: (argomento, testo, soluzione)
# ─────────────────────────────────────────────────────────────────────────────

BASE = [
    ("Articoli", "Completa: ___ apple a day keeps the doctor away.", "An apple a day keeps the doctor away."),
    ("Articoli", "Scrivi l'articolo corretto: I need ___ umbrella.", "I need an umbrella."),
    ("Articoli", "Scegli: She is ___ engineer.", "She is an engineer."),
    ("Articoli", "Completa: He plays ___ guitar every evening.", "He plays the guitar every evening."),
    ("Articoli", "Scegli l'articolo: ___ sun rises in the east.", "The sun rises in the east."),
    ("Presente Semplice", "Coniuga il verbo: She ___ (to work) in a bank.", "She works in a bank."),
    ("Presente Semplice", "Forma la domanda: ___ you like coffee? (Do/Does)", "Do you like coffee?"),
    ("Presente Semplice", "Metti alla forma negativa: He plays football.", "He does not (doesn't) play football."),
    ("Presente Semplice", "Coniuga: Every morning, I ___ (to brush) my teeth.", "Every morning, I brush my teeth."),
    ("Presente Semplice", "Completa: Water ___ (to boil) at 100 degrees.", "Water boils at 100 degrees."),
    ("Vocabolario Base", "Traduci: 'casa' in inglese.", "House / Home"),
    ("Vocabolario Base", "Qual è il plurale di 'child'?", "Children"),
    ("Vocabolario Base", "Traduci: 'Buongiorno' in inglese.", "Good morning"),
    ("Vocabolario Base", "Come si dice 'grazie' in inglese?", "Thank you / Thanks"),
    ("Vocabolario Base", "Traduci: 'Ho fame.' in inglese.", "I am hungry."),
    ("Pronomi", "Sostituisci il soggetto: Mary is a teacher. ___ is kind.", "She is kind."),
    ("Pronomi", "Usa il pronome corretto: John and I → ___", "We"),
    ("Pronomi", "Completa: Give the book to ___. (io come oggetto)", "Give the book to me."),
    ("Pronomi", "Scegli: This is ___ car. (mio)", "This is my car."),
    ("Pronomi", "Sostituisci: The dog is in the garden → ___ is in the garden.", "It is in the garden."),
    ("To Be", "Coniuga: I ___ a student.", "I am a student."),
    ("To Be", "Forma negativa: He is tired → He ___ tired.", "He is not (isn't) tired."),
    ("To Be", "Domanda: ___ they Italian?", "Are they Italian?"),
    ("To Be", "Completa: The books ___ on the table.", "The books are on the table."),
    ("To Be", "Risposta breve: Are you ready? Yes, ___ ___.", "Yes, I am."),
    ("Numeri e Quantità", "Scrivi in lettere: 15", "Fifteen"),
    ("Numeri e Quantità", "Scrivi il numero ordinale: 3rd", "Third"),
    ("Numeri e Quantità", "Completa: There ___ many students in the class. (to be)", "There are many students in the class."),
    ("Numeri e Quantità", "Traduci: 'Quanti anni hai?' in inglese.", "How old are you?"),
    ("Numeri e Quantità", "Scrivi in lettere: 100", "One hundred"),
    ("Preposizioni", "Scegli: The cat is ___ the box. (in/on/under)", "The cat is in the box."),
    ("Preposizioni", "Completa: I wake up ___ 7 o'clock.", "I wake up at 7 o'clock."),
    ("Preposizioni", "Scegli: She was born ___ 1990.", "She was born in 1990."),
    ("Preposizioni", "Completa: The picture is ___ the wall.", "The picture is on the wall."),
    ("Preposizioni", "Scegli: I go to school ___ foot.", "I go to school on foot."),
    ("Giorni e Mesi", "Qual è il secondo mese dell'anno?", "February"),
    ("Giorni e Mesi", "Traduci: 'lunedì' in inglese.", "Monday"),
    ("Giorni e Mesi", "Quanti giorni ha il mese di June?", "30 days"),
    ("Giorni e Mesi", "Qual giorno viene dopo Thursday?", "Friday"),
    ("Giorni e Mesi", "Completa: Christmas is on the 25th of ___ .", "December"),
]

PRE_INTERMEDIO = [
    ("Passato Semplice", "Metti al passato: She goes to school every day.", "She went to school every day."),
    ("Passato Semplice", "Forma la domanda: They watched a film last night.", "Did they watch a film last night?"),
    ("Passato Semplice", "Metti alla negativa: He arrived late.", "He didn't arrive late."),
    ("Passato Semplice", "Coniuga: I ___ (to see) a great film yesterday.", "I saw a great film yesterday."),
    ("Passato Semplice", "Completa: She ___ (to write) a letter this morning.", "She wrote a letter this morning."),
    ("Passato Progressivo", "Completa: At 8pm, they ___ (to have) dinner.", "At 8pm, they were having dinner."),
    ("Passato Progressivo", "Forma la domanda: She was reading a book.", "Was she reading a book?"),
    ("Passato Progressivo", "Combina le frasi: I was sleeping. The phone rang.", "I was sleeping when the phone rang."),
    ("Futuro", "Completa con will: I think it ___ rain tomorrow.", "I think it will rain tomorrow."),
    ("Futuro", "Usa going to: She ___ (to visit) Paris next summer.", "She is going to visit Paris next summer."),
    ("Futuro", "Scegli will o going to: Look at those clouds! It ___ rain.", "It is going to rain."),
    ("Futuro", "Fai una promessa con will: I ___ help you with your homework.", "I will help you with your homework."),
    ("Comparativi", "Forma il comparativo: tall", "taller"),
    ("Comparativi", "Completa: London is ___ than my city. (big)", "London is bigger than my city."),
    ("Comparativi", "Superlativo: This is ___ film I have ever seen. (good)", "This is the best film I have ever seen."),
    ("Comparativi", "Confronta: A car is ___ than a bicycle. (fast)", "A car is faster than a bicycle."),
    ("Comparativi", "Completa: She sings ___ than her sister. (well)", "She sings better than her sister."),
    ("Condizionale", "Tipo 0: If you heat ice, it ___ (to melt).", "If you heat ice, it melts."),
    ("Condizionale", "Tipo 1: If it rains tomorrow, I ___ (to stay) at home.", "If it rains tomorrow, I will stay at home."),
    ("Condizionale", "Tipo 2: If I ___ rich, I would travel the world. (to be)", "If I were rich, I would travel the world."),
    ("Condizionale", "Completa: She would be happy if she ___ (to pass) the exam.", "She would be happy if she passed the exam."),
    ("Verbi Modali", "Esprimi il permesso: ___ I open the window?", "Can/May I open the window?"),
    ("Verbi Modali", "Esprimi l'obbligo: You ___ wear a seatbelt.", "You must/have to wear a seatbelt."),
    ("Verbi Modali", "Esprimi il consiglio: You ___ see a doctor.", "You should see a doctor."),
    ("Verbi Modali", "Esprimi la possibilità: It ___ be John calling.", "It might/could be John calling."),
    ("Present Perfect", "Forma il Present Perfect: She ___ (to visit) Rome twice.", "She has visited Rome twice."),
    ("Present Perfect", "Domanda: ___ you ever ___ sushi? (to eat)", "Have you ever eaten sushi?"),
    ("Present Perfect", "Scegli: I ___ here since 2019. (have lived/lived)", "I have lived here since 2019."),
    ("Present Perfect", "Completa con already/yet: I haven't finished ___ .", "I haven't finished yet."),
    ("Present Perfect", "Collega: She ___ just ___ a great book. (to finish)", "She has just finished a great book."),
    ("Preposizioni Avanzate", "Scegli: She is interested ___ art.", "She is interested in art."),
    ("Preposizioni Avanzate", "Completa: He is afraid ___ spiders.", "He is afraid of spiders."),
    ("Preposizioni Avanzate", "Scegli: I'm looking forward ___ meeting you.", "I'm looking forward to meeting you."),
    ("Preposizioni Avanzate", "Completa: She is good ___ languages.", "She is good at languages."),
    ("Preposizioni Avanzate", "Completa: He depends ___ his parents.", "He depends on his parents."),
    ("Countable/Uncountable", "Scegli: There is ___ milk in the fridge. (some/any)", "There is some milk in the fridge."),
    ("Countable/Uncountable", "Scegli: Are there ___ apples? (some/any)", "Are there any apples?"),
    ("Countable/Uncountable", "Usa much/many: How ___ water do you need?", "How much water do you need?"),
    ("Countable/Uncountable", "Usa much/many: How ___ students are in the class?", "How many students are in the class?"),
    ("Countable/Uncountable", "Scegli: I don't have ___ time. (much/many)", "I don't have much time."),
]

INTERMEDIO = [
    ("Passivo", "Trasforma in passivo: They built this bridge in 1890.", "This bridge was built in 1890."),
    ("Passivo", "Trasforma: Someone stole my wallet.", "My wallet was stolen."),
    ("Passivo", "Passivo presente: People speak English worldwide.", "English is spoken worldwide."),
    ("Passivo", "Passivo futuro: They will announce the results tomorrow.", "The results will be announced tomorrow."),
    ("Passivo", "Identifica: The report is being written by the team.", "Passivo progressivo presente"),
    ("Periodo Ipotetico III", "Completa: If she ___ harder, she would have passed. (to study)", "If she had studied harder, she would have passed."),
    ("Periodo Ipotetico III", "Trasforma: He didn't study → He failed.", "If he had studied, he wouldn't have failed."),
    ("Periodo Ipotetico III", "Completa: I wish I ___ more time yesterday. (to have)", "I wish I had had more time yesterday."),
    ("Periodo Ipotetico III", "Completa con mixed conditional: If I had saved money, I ___ richer now. (to be)", "If I had saved money, I would be richer now."),
    ("Periodo Ipotetico III", "Riscrivi con 'Unless': You won't succeed unless you try.", "If you don't try, you won't succeed."),
    ("Proposizioni Relative", "Combina: The man is a doctor. He lives next door.", "The man who lives next door is a doctor."),
    ("Proposizioni Relative", "Scegli who/which/where: The city ___ she was born is beautiful.", "The city where she was born is beautiful."),
    ("Proposizioni Relative", "Aggiungi una relativa: I read the book. She recommended it.", "I read the book (that/which) she recommended."),
    ("Proposizioni Relative", "Quale pronome usare? The woman ___ car was stolen called the police.", "The woman whose car was stolen called the police."),
    ("Proposizioni Relative", "Scegli: This is the restaurant ___ we first met.", "This is the restaurant where we first met."),
    ("Discorso Indiretto", "Trasforma: She said 'I am tired'.", "She said (that) she was tired."),
    ("Discorso Indiretto", "Trasforma: He asked 'Do you speak English?'", "He asked if/whether I spoke English."),
    ("Discorso Indiretto", "Trasforma: 'Please, close the door.' she said.", "She asked me to close the door."),
    ("Discorso Indiretto", "Trasforma: 'I will call you tomorrow.' he said.", "He said he would call me the next day."),
    ("Discorso Indiretto", "Trasforma: 'Don't touch that!' the teacher said.", "The teacher told us not to touch that."),
    ("Phrasal Verbs", "Traduci: 'rimandare un appuntamento'", "To put off / postpone an appointment"),
    ("Phrasal Verbs", "Traduci: 'arrendersi'", "To give up"),
    ("Phrasal Verbs", "Scegli il significato: To run out of something.", "To use all of something and have none left"),
    ("Phrasal Verbs", "Completa: She decided to ___ smoking. (quit/give up)", "She decided to give up smoking."),
    ("Phrasal Verbs", "Traduci: 'crescere'", "To grow up"),
    ("Connettivi", "Scegli: She is rich; ___, she is unhappy. (however/therefore)", "She is rich; however, she is unhappy."),
    ("Connettivi", "Usa although: ___ it was raining, we went for a walk.", "Although it was raining, we went for a walk."),
    ("Connettivi", "Scegli: He didn't study; ___, he failed. (moreover/consequently)", "He didn't study; consequently, he failed."),
    ("Connettivi", "Aggiungi un connettivo: It was late. We decided to leave.", "It was late, so we decided to leave."),
    ("Connettivi", "Scegli: The weather was bad. ___, we enjoyed the trip. (nevertheless/furthermore)", "The weather was bad. Nevertheless, we enjoyed the trip."),
    ("Gerundio/Infinito", "Scegli: I enjoy ___ (to swim/swimming).", "I enjoy swimming."),
    ("Gerundio/Infinito", "Scegli: She decided ___ (to leave/leaving).", "She decided to leave."),
    ("Gerundio/Infinito", "Scegli: He suggested ___ a taxi. (to take/taking)", "He suggested taking a taxi."),
    ("Gerundio/Infinito", "Scegli: I am looking forward to ___ you. (see/seeing)", "I am looking forward to seeing you."),
    ("Gerundio/Infinito", "Scegli: They stopped ___ and listened. (to talk/talking)", "They stopped talking and listened."),
    ("Inversione", "Riscrivi con inversione: I have never seen such a thing.", "Never have I seen such a thing."),
    ("Inversione", "Riscrivi: She rarely goes to the cinema.", "Rarely does she go to the cinema."),
    ("Inversione", "Completa: Not only ___ he late, but he also forgot his keys.", "Not only was he late, but he also forgot his keys."),
    ("Inversione", "Riscrivi: I had no sooner arrived than the phone rang.", "No sooner had I arrived than the phone rang."),
    ("Inversione", "Completa: Hardly ___ he left when it started to rain.", "Hardly had he left when it started to rain."),
]

AVANZATO = [
    ("Idiomi", "Spiega: 'It's raining cats and dogs.'", "Sta piovendo a dirotto."),
    ("Idiomi", "Spiega: 'To bite the bullet.'", "Stringere i denti e affrontare una situazione difficile."),
    ("Idiomi", "Spiega: 'The ball is in your court.'", "Tocca a te decidere."),
    ("Idiomi", "Spiega: 'To burn the midnight oil.'", "Lavorare/studiare fino a tarda notte."),
    ("Idiomi", "Spiega: 'To hit the nail on the head.'", "Centrare il punto, dire qualcosa di assolutamente corretto."),
    ("Idiomi", "Spiega: 'To let the cat out of the bag.'", "Rivelare accidentalmente un segreto."),
    ("Idiomi", "Spiega: 'Once in a blue moon.'", "Molto raramente, quasi mai."),
    ("Idiomi", "Spiega: 'To beat around the bush.'", "Girare intorno al problema senza affrontarlo direttamente."),
    ("Idiomi", "Spiega: 'To cost an arm and a leg.'", "Costare un patrimonio, essere molto caro."),
    ("Idiomi", "Spiega: 'To break the ice.'", "Rompere il ghiaccio, iniziare una conversazione in un contesto formale."),
    ("Scrittura Accademica", "Come si inizia un saggio accademico in inglese?", "With a clear thesis statement and an introduction that outlines the main points."),
    ("Scrittura Accademica", "Scrivi un topic sentence per un paragrafo sull'inquinamento.", "Air pollution poses a significant threat to public health in urban areas."),
    ("Scrittura Accademica", "Qual è la funzione di una 'concluding sentence'?", "To summarize the main idea of the paragraph and link to the next one."),
    ("Scrittura Accademica", "Come si cita una fonte in stile APA?", "Author, A. A. (Year). Title of work. Publisher."),
    ("Scrittura Accademica", "Scrivi una frase di transizione per aggiungere un punto.", "Furthermore, / In addition, / Moreover,"),
    ("Pronuncia Avanzata", "Qual è la differenza fonetica tra 'ship' e 'sheep'?", "/ɪ/ breve in 'ship' vs /iː/ lungo in 'sheep'"),
    ("Pronuncia Avanzata", "Come si pronuncia 'Wednesday'?", "/ˈwenz.deɪ/ — la 'd' centrale è silenziosa."),
    ("Pronuncia Avanzata", "Quale sillaba è accentata in 'photograph'?", "PHO-to-graph — prima sillaba."),
    ("Pronuncia Avanzata", "Qual è la pronuncia di 'colonel'?", "/ˈkɜːr.nəl/ — si pronuncia 'kernel'."),
    ("Pronuncia Avanzata", "Come si riduce 'want to' nel parlato informale?", "Wanna /ˈwɒn.ə/"),
    ("Registro Formale", "Riscrivi in modo formale: 'Can you help me?'", "I would be grateful if you could assist me."),
    ("Registro Formale", "Riscrivi formalmente: 'Sorry for the late reply.'", "I apologize for the delayed response."),
    ("Registro Formale", "Riscrivi formalmente: 'I want to know more about...'", "I would like to enquire about..."),
    ("Registro Formale", "Riscrivi formalmente: 'Thanks a lot!'", "Thank you very much for your kind assistance."),
    ("Registro Formale", "Quando si usa 'Yours sincerely' vs 'Yours faithfully'?", "Yours sincerely: quando conosci il nome del destinatario. Yours faithfully: quando scrivi 'Dear Sir/Madam'."),
    ("Collocazioni", "Qual verbo si usa con 'decision'?", "To make a decision"),
    ("Collocazioni", "Completa: to ___ a mistake", "To make a mistake"),
    ("Collocazioni", "Scegli: to ___ a shower (take/make/do)", "To take a shower"),
    ("Collocazioni", "Completa: to ___ an exam (take/make/pass)", "To take / pass an exam"),
    ("Collocazioni", "Qual verbo si usa con 'research'?", "To do / conduct research"),
    ("Connotazioni", "La parola 'slim' ha connotazione positiva o negativa?", "Positiva (snello/a)"),
    ("Connotazioni", "Qual è la differenza tra 'thrifty' e 'stingy'?", "'Thrifty' è positivo (parsimonioso), 'stingy' è negativo (avaro)."),
    ("Connotazioni", "Usa 'determined' o 'stubborn' per descrivere un atleta di successo?", "'Determined' (positivo: determinato). 'Stubborn' ha connotazione negativa (testardo)."),
    ("Connotazioni", "Qual è più formale: 'die' o 'pass away'?", "'Pass away' è un eufemismo più formale e delicato."),
    ("Connotazioni", "Differenza tra 'economical' e 'cheap'?", "'Economical' = efficiente nel costo (neutro/positivo). 'Cheap' = di bassa qualità (spesso negativo)."),
    ("Cleft Sentences", "Trasforma in cleft sentence: John broke the window.", "It was John who broke the window."),
    ("Cleft Sentences", "Trasforma: I need a holiday, not money.", "What I need is a holiday, not money."),
    ("Cleft Sentences", "Completa: ___ that really surprised me was his reaction.", "What really surprised me was his reaction."),
    ("Cleft Sentences", "Perché usiamo le cleft sentences?", "Per dare enfasi a un elemento specifico della frase."),
    ("Cleft Sentences", "Trasforma: She loves the theatre.", "It is the theatre that she loves."),
]

BUSINESS = [
    ("Email Formali", "Scrivi l'apertura di un'email formale a un cliente sconosciuto.", "Dear Sir/Madam, I am writing to enquire about..."),
    ("Email Formali", "Come si chiude un'email formale?", "Yours faithfully / Yours sincerely, [Full Name]"),
    ("Email Formali", "Scrivi una frase per scusarsi di un ritardo.", "I sincerely apologize for the inconvenience caused by the delay."),
    ("Email Formali", "Come si esprime urgenza in un'email professionale?", "I would appreciate your prompt response. / Please treat this matter as urgent."),
    ("Email Formali", "Scrivi un'oggetto (Subject) per comunicare una riunione.", "Subject: Meeting Invitation – Q3 Review | 15 March 2025"),
    ("Riunioni", "Come si apre formalmente una riunione in inglese?", "Good morning, everyone. Let's get started. / Shall we begin?"),
    ("Riunioni", "Come si chiede la parola educatamente in una riunione?", "May I add something? / If I could just come in here..."),
    ("Riunioni", "Come si riassume un punto discusso?", "So to summarize, we've agreed that... / In summary,..."),
    ("Riunioni", "Come si rinvia un punto all'ordine del giorno?", "Let's table this for a later date. / We'll come back to this."),
    ("Riunioni", "Come si chiude una riunione formale?", "I think that covers everything. Thank you all for attending."),
    ("Negoziazioni", "Frase per fare un'offerta iniziale.", "Our initial offer is... / We would be prepared to offer..."),
    ("Negoziazioni", "Frase per chiedere una concessione.", "Would you be willing to reconsider the price?"),
    ("Negoziazioni", "Frase per guadagnare tempo.", "I'll need to consult with my team before giving you a definitive answer."),
    ("Negoziazioni", "Frase per raggiungere un accordo.", "I think we have a deal. / We've reached an agreement."),
    ("Negoziazioni", "Frase per interrompere gentilmente le negoziazioni.", "I'm afraid we're unable to meet those terms at this stage."),
    ("Presentazioni", "Come si inizia una presentazione professionale?", "Good morning. My name is... and today I'd like to present..."),
    ("Presentazioni", "Frase di transizione tra sezioni.", "Moving on to... / Let's now turn to..."),
    ("Presentazioni", "Come si fa riferimento a una slide?", "As you can see on this slide... / This chart shows..."),
    ("Presentazioni", "Come si apre una sessione domande.", "I'd now like to open the floor to questions."),
    ("Presentazioni", "Frase per gestire una domanda difficile.", "That's a great question. I'll need to get back to you on that."),
    ("Gergo Business", "Cosa significa 'synergy' nel contesto aziendale?", "La cooperazione tra due entità per produrre un risultato maggiore della somma delle parti."),
    ("Gergo Business", "Cosa significa 'KPI'?", "Key Performance Indicator — indicatore chiave di performance."),
    ("Gergo Business", "Cosa significa 'B2B'?", "Business to Business — commercio tra aziende."),
    ("Gergo Business", "Cosa significa 'leverage' in business English?", "Usare risorse (dati, contatti, posizione) per massimizzare il vantaggio."),
    ("Gergo Business", "Cosa significa 'bandwidth' nel contesto aziendale?", "Capacità di un team o persona di gestire lavoro aggiuntivo."),
    ("Rapporti Scritti", "Qual è la struttura di un report professionale?", "Executive Summary, Introduction, Findings, Analysis, Recommendations, Conclusion."),
    ("Rapporti Scritti", "Come si inizia la sezione 'Findings'?", "The findings indicate that... / The data reveals..."),
    ("Rapporti Scritti", "Come si formulano le raccomandazioni?", "It is recommended that... / We strongly advise..."),
    ("Rapporti Scritti", "Che differenza c'è tra 'report' e 'proposal'?", "Un report descrive risultati passati; un proposal suggerisce azioni future."),
    ("Rapporti Scritti", "Scrivi una executive summary in 2 frasi per un calo vendite.", "Sales declined by 15% in Q3 due to market volatility and supply chain disruptions. We recommend a targeted marketing campaign and cost-reduction measures."),
    ("Colloqui di Lavoro", "Rispondi a: 'Tell me about yourself.'", "I am a [role] with [X] years of experience in [field], passionate about [strength], and I'm now looking for..."),
    ("Colloqui di Lavoro", "Risposta a: 'What is your greatest weakness?'", "I sometimes struggle with delegating tasks, but I have been actively working on trusting my team more."),
    ("Colloqui di Lavoro", "Come si risponde a: 'Where do you see yourself in 5 years?'", "I see myself growing within this company, taking on more responsibility and contributing to long-term projects."),
    ("Colloqui di Lavoro", "Come si chiede informazioni sullo stipendio?", "Could you give me an indication of the salary range for this position?"),
    ("Colloqui di Lavoro", "Come si conclude positivamente un colloquio?", "Thank you for this opportunity. I'm very excited about the role and look forward to hearing from you."),
    ("Telefonate", "Come si risponde al telefono in modo professionale?", "Good morning, [Company Name], [Your Name] speaking. How can I help you?"),
    ("Telefonate", "Come si chiede di parlare con qualcuno?", "Could I speak to [Name], please?"),
    ("Telefonate", "Come si lascia un messaggio?", "Could you ask him/her to call me back? My number is..."),
    ("Telefonate", "Come si chiede di ripetere?", "I'm sorry, could you repeat that, please? / Could you speak a little more slowly?"),
    ("Telefonate", "Come si chiude una telefonata formale?", "Thank you for your time. I'll follow up with an email. Goodbye."),
]

VIAGGI = [
    ("Aeroporto", "Come si dice 'volo in ritardo'?", "Delayed flight"),
    ("Aeroporto", "Frase per fare il check-in.", "I'd like to check in for my flight to London, please."),
    ("Aeroporto", "Come si chiede dove sono i controlli sicurezza?", "Excuse me, where is the security check?"),
    ("Aeroporto", "Come si dichiara bagaglio in eccesso?", "My baggage is overweight. What are the excess baggage fees?"),
    ("Aeroporto", "Frase per chiedere il gate di imbarco.", "Which gate does the flight to Rome depart from?"),
    ("Albergo", "Come si prenota una camera?", "I'd like to book a double room for three nights, please."),
    ("Albergo", "Frase per fare il check-in all'hotel.", "I have a reservation under the name [Name].", ),
    ("Albergo", "Come si chiede un asciugamano in più?", "Could I have some extra towels, please?"),
    ("Albergo", "Come si segnala un problema in camera?", "There seems to be a problem with the heating in my room."),
    ("Albergo", "Come si chiede il conto?", "Could I have the bill, please? I'd like to check out."),
    ("Ristorante", "Come si prenotano tavoli?", "I'd like to make a reservation for two for 8 pm, please."),
    ("Ristorante", "Come si chiede il menu?", "Could we see the menu, please?"),
    ("Ristorante", "Come si ordina?", "I'll have the grilled salmon, please."),
    ("Ristorante", "Come si chiede il conto?", "Could we have the bill, please?"),
    ("Ristorante", "Come si segnala un'allergia alimentare?", "I'm allergic to nuts. Could you check if this dish contains any?"),
    ("Trasporti", "Come si compra un biglietto del treno?", "A return ticket to Edinburgh, please."),
    ("Trasporti", "Come si chiede a che ora parte il prossimo autobus?", "What time does the next bus to the city centre leave?"),
    ("Trasporti", "Come si noleggia un'auto?", "I'd like to rent a car for three days, please."),
    ("Trasporti", "Come si chiede indicazioni?", "Excuse me, could you tell me how to get to the museum?"),
    ("Trasporti", "Come si chiede di fermare l'autobus?", "Could you let me know when we reach the next stop?"),
    ("Emergenze", "Come si chiede aiuto in inglese?", "Help! / Can someone help me, please?"),
    ("Emergenze", "Frase per segnalare il furto della borsa.", "My bag has been stolen. I need to report it to the police."),
    ("Emergenze", "Come si chiede un medico?", "I need to see a doctor / Could you call an ambulance?"),
    ("Emergenze", "Come si segnala la perdita del passaporto?", "I've lost my passport. Can you help me contact the embassy?"),
    ("Emergenze", "Come si chiede a un farmacista un medicinale?", "I have a headache. Could you recommend something for pain relief?"),
    ("Acquisti", "Come si chiede la taglia?", "Do you have this in a medium / size 40?"),
    ("Acquisti", "Come si chiede il prezzo?", "How much does this cost? / What's the price?"),
    ("Acquisti", "Come si negozia il prezzo in un mercato?", "Is this your best price? / Could you give me a discount?"),
    ("Acquisti", "Come si chiede di cambiare un prodotto?", "I'd like to exchange this. It doesn't fit."),
    ("Acquisti", "Come si chiede dove si trova qualcosa in un negozio?", "Excuse me, where can I find the electronics section?"),
    ("Descrizione Luoghi", "Descrivi un museo in 2 frasi in inglese.", "The museum houses an impressive collection of modern art. It is located in the heart of the city and attracts thousands of visitors each year."),
    ("Descrizione Luoghi", "Come si dice 'punto di riferimento'?", "Landmark"),
    ("Descrizione Luoghi", "Descrivi un paesaggio naturale.", "The landscape is breathtaking, with rolling hills covered in lush greenery and a crystal-clear river running through the valley."),
    ("Descrizione Luoghi", "Come si chiede un consiglio turistico?", "What would you recommend visiting while I'm here?"),
    ("Descrizione Luoghi", "Traducini 'fuori dai sentieri battuti'.", "Off the beaten track"),
]

IELTS = [
    ("Writing Task 1", "Descrivi un grafico a barre che mostra le vendite annuali in aumento.", "The bar chart illustrates a steady increase in annual sales over the period. Sales rose significantly from [X] to [Y], peaking in [year] at [value]."),
    ("Writing Task 1", "Quale verbo si usa per descrivere un aumento?", "Rise, increase, grow, climb, surge, soar"),
    ("Writing Task 1", "Quale frase introduce i dati principali?", "The most notable feature is... / Overall, it is clear that..."),
    ("Writing Task 1", "Come si descrive un plateau?", "Figures levelled off / remained stable at... / plateaued at..."),
    ("Writing Task 1", "Struttura ideale di un Task 1 IELTS.", "Introduction (paraphrase), Overview (2-3 main trends), Detailed paragraphs (data with comparisons)."),
    ("Writing Task 2", "Scrivi un'introduzione per: 'Should universities be free?'", "The question of whether higher education should be provided free of charge has generated considerable debate. While some argue that tuition-free universities promote equality, others contend that this is financially unsustainable."),
    ("Writing Task 2", "Quali connettivi si usano per aggiungere un argomento?", "Furthermore, Moreover, In addition, Additionally"),
    ("Writing Task 2", "Come si introduce l'opinion finale?", "In conclusion, / To sum up, / On balance, I believe..."),
    ("Writing Task 2", "Scrivi un contro-argomento efficace.", "On the other hand, / Conversely, / Critics argue that..."),
    ("Writing Task 2", "Qual è il word count richiesto per il Task 2?", "Minimum 250 words. Aim for 270-290 words for safety."),
    ("Reading", "Cosa significa 'skimming' nella lettura IELTS?", "Leggere velocemente per capire l'idea generale del testo, senza soffermarsi sui dettagli."),
    ("Reading", "Cosa significa 'scanning'?", "Cercare informazioni specifiche (nomi, date, cifre) scorrendo rapidamente il testo."),
    ("Reading", "Come si affrontano le domande TRUE/FALSE/NOT GIVEN?", "Cerca la frase nel testo. TRUE = confermato. FALSE = contraddetto. NOT GIVEN = non menzionato."),
    ("Reading", "Quale strategia usare per le domande 'Matching Headings'?", "Leggi prima i titoli, poi individua la main idea di ogni paragrafo. Non usare parole chiave superficiali."),
    ("Reading", "Come si identificano i 'synonyms' nel testo IELTS?", "I sinonimi del testo parafrasano le parole della domanda. Cerca il significato, non le parole identiche."),
    ("Listening", "Quante sezioni ha il Listening IELTS?", "4 sezioni con difficoltà crescente."),
    ("Listening", "Cosa fare durante il tempo di preparazione prima di ogni sezione?", "Leggere le domande, identificare keywords e il tipo di risposta richiesta (number, name, place...)."),
    ("Listening", "Come si gestisce una risposta persa?", "Non soffermarti: vai avanti alla domanda successiva e integra alla fine."),
    ("Listening", "Attenzione a: dettare cifre e lettere.", "Distingui B/P/D, M/N, 13 vs 30 (thirteen vs thirty). Verifica l'ortografia."),
    ("Listening", "Come si ottiene un band 7+ nel Listening?", "Rispondere a tutte le domande, controllare l'ortografia, non lasciare spazi vuoti."),
    ("Speaking", "Come si risponde a 'Describe your hometown.' (Part 2)?", "I'd like to talk about [city]. It is located in [region] and is known for [features]. What I like most about it is..."),
    ("Speaking", "Frase per guadagnare tempo in Speaking.", "That's an interesting question. Let me think about that for a moment..."),
    ("Speaking", "Come si raggiunge un Band 7 in Speaking?", "Fluency, coherence, varied vocabulary, accurate grammar, clear pronunciation."),
    ("Speaking", "Frase per ampliare una risposta corta.", "Not only that, but... / What's more, / In fact, / To give you an example,..."),
    ("Speaking", "Cosa si valuta nel criterio 'Lexical Resource'?", "Varietà ed accuratezza del vocabolario, uso di collocazioni, parafrasi, idiomi appropriati."),
    ("Vocabolario IELTS", "Sinonimo di 'important' per IELTS Writing.", "Significant, crucial, vital, essential, pivotal"),
    ("Vocabolario IELTS", "Sinonimo di 'increase' per grafici.", "Rise, grow, climb, surge, escalate, soar"),
    ("Vocabolario IELTS", "Sinonimo di 'show' per descrivere grafici.", "Illustrate, depict, demonstrate, indicate, reveal"),
    ("Vocabolario IELTS", "Vocabolario per esprimere contrasto.", "However, nevertheless, on the other hand, in contrast, despite, although, whereas"),
    ("Vocabolario IELTS", "Vocabolario per cause ed effetti.", "As a result, consequently, therefore, due to, owing to, leads to, results in"),
]

NAVALE = [
    ("Navi da Guerra", "Come si dice 'portaerei' in inglese?", "Aircraft carrier"),
    ("Navi da Guerra", "Traduci: 'fregata'", "Frigate"),
    ("Navi da Guerra", "Come si chiama il sottomarino in inglese?", "Submarine"),
    ("Navi da Guerra", "Traduci: 'cacciatorpediniere'", "Destroyer"),
    ("Navi da Guerra", "Come si dice 'nave da pattugliamento'?", "Patrol vessel / Patrol boat"),
    ("Componenti Nave", "Come si chiama il 'ponte di volo'?", "Flight deck"),
    ("Componenti Nave", "Traduci: 'periscopio'", "Periscope"),
    ("Componenti Nave", "Come si dice 'torre di comando' del sottomarino?", "Conning tower"),
    ("Componenti Nave", "Traduci: 'elica'", "Propeller / Screw"),
    ("Componenti Nave", "Come si chiama il 'timone'?", "Rudder"),
    ("Componenti Nave", "Come si dice 'prua'?", "Bow"),
    ("Componenti Nave", "Come si dice 'poppa'?", "Stern"),
    ("Componenti Nave", "Traduci: 'albero maestro'", "Main mast"),
    ("Componenti Nave", "Come si chiama la 'plancia di comando'?", "Bridge"),
    ("Componenti Nave", "Traduci: 'scafo'", "Hull"),
    ("Comunicazioni NATO", "Cosa significa il codice NATO 'Alpha'?", "La lettera A nell'alfabeto NATO."),
    ("Comunicazioni NATO", "Cosa significa 'Bravo' nell'alfabeto NATO?", "La lettera B."),
    ("Comunicazioni NATO", "Come si dice 'capito' nelle comunicazioni radio?", "Roger / Roger that"),
    ("Comunicazioni NATO", "Come si dice 'messaggio ricevuto, capito e confermato'?", "Wilco (Will Comply)"),
    ("Comunicazioni NATO", "Come si comunica la posizione in coordinate?", "Grid reference / MGRS (Military Grid Reference System)"),
    ("Manovre Navali", "Cosa significa 'all stop'?", "Ferma i motori, la nave si ferma."),
    ("Manovre Navali", "Cosa significa 'ahead full'?", "Avanza a tutta velocità."),
    ("Manovre Navali", "Traduci: 'virare a dritta'", "Turn to starboard / Hard to starboard"),
    ("Manovre Navali", "Cosa significa 'man overboard'?", "Uomo in mare — emergenza marinaro caduto in acqua."),
    ("Manovre Navali", "Cosa significa 'abandon ship'?", "Abbandonare la nave — ordine di evacuazione di emergenza."),
    ("Terminologia Operativa", "Cosa significa 'SITREP'?", "Situation Report — rapporto sulla situazione attuale."),
    ("Terminologia Operativa", "Cosa significa 'ROE'?", "Rules of Engagement — regole di ingaggio."),
    ("Terminologia Operativa", "Cosa significa 'ETA'?", "Estimated Time of Arrival — orario stimato di arrivo."),
    ("Terminologia Operativa", "Cosa significa 'ETE'?", "Estimated Time Enroute — tempo stimato di percorrenza."),
    ("Terminologia Operativa", "Cosa significa 'CASREP'?", "Casualty Report — rapporto su danni o perdite."),
    ("Sicurezza a Bordo", "Come si dice 'giubbotto di salvataggio'?", "Life jacket / Life vest"),
    ("Sicurezza a Bordo", "Cosa significa 'MAYDAY'?", "Segnale di soccorso internazionale (massima emergenza)."),
    ("Sicurezza a Bordo", "Cosa significa 'PAN PAN'?", "Segnale di urgenza (meno grave di MAYDAY)."),
    ("Sicurezza a Bordo", "Come si dice 'zattera di salvataggio'?", "Life raft"),
    ("Sicurezza a Bordo", "Come si chiama la 'stazione di emergenza'?", "Emergency station / Muster station"),
    ("Gradi Navali", "Come si dice 'ammiraglio' in inglese?", "Admiral"),
    ("Gradi Navali", "Come si dice 'capitano di fregata'?", "Commander"),
    ("Gradi Navali", "Come si dice 'guardiamarina'?", "Midshipman / Ensign"),
    ("Gradi Navali", "Come si dice 'sergente' nella Marina?", "Petty Officer"),
    ("Gradi Navali", "Come si dice 'capitano di vascello'?", "Captain"),
]

# ─────────────────────────────────────────────────────────────────────────────
# GENERATORE VARIANTI
# ─────────────────────────────────────────────────────────────────────────────

VARIANTI_BASE = [
    ("Articoli", "Scegli l'articolo corretto: She studies at ___ university.", "She studies at a university."),
    ("Vocabolario Base", "Traduci: 'libro' in inglese.", "Book"),
    ("Presente Semplice", "Coniuga: The train ___ (to arrive) at noon.", "The train arrives at noon."),
    ("Preposizioni", "Scegli: He was born ___ Monday.", "He was born on Monday."),
    ("To Be", "Completa: My parents ___ from Rome.", "My parents are from Rome."),
]

VARIANTI_BUSINESS = [
    ("Email Formali", "Come si esprime una scadenza in un'email?", "Please note that the deadline for submission is [date]."),
    ("Riunioni", "Come si mette un punto all'ordine del giorno?", "I'd like to add an agenda item: [topic]."),
    ("Gergo Business", "Cosa significa 'ROI'?", "Return on Investment — ritorno sull'investimento."),
    ("Telefonate", "Come si trasferisce una chiamata?", "I'll put you through to the relevant department. Please hold."),
    ("Rapporti Scritti", "Come si conclude un report formale?", "In conclusion, the evidence suggests that [summary]. It is therefore recommended that [action]."),
]

VARIANTI_IELTS = [
    ("Writing Task 2", "Come si introduce una concessione?", "Admittedly, / It is true that... / While it may be argued that..."),
    ("Speaking", "Come si risponde a una domanda che non si capisce?", "I'm sorry, could you rephrase the question?"),
    ("Vocabolario IELTS", "Sinonimo di 'decrease'.", "Fall, drop, decline, plummet, dip, diminish"),
    ("Reading", "Come si gestisce il tempo nel Reading IELTS?", "Circa 20 minuti per sezione (3 sezioni = 60 min). Non restare bloccato su una sola domanda."),
    ("Listening", "Tip per il Fill-in-the-Blank.", "Non cambiare la grammatica — scrivi esattamente ciò che senti. Attenzione agli articoli e plurali."),
]

# ─────────────────────────────────────────────────────────────────────────────
# GENERA IL DATABASE
# ─────────────────────────────────────────────────────────────────────────────

def genera_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute('''
        CREATE TABLE esercizi (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            corso     TEXT NOT NULL,
            argomento TEXT NOT NULL,
            livello   TEXT NOT NULL,
            testo     TEXT NOT NULL,
            soluzione TEXT NOT NULL
        )
    ''')
    c.execute('CREATE INDEX idx_corso    ON esercizi(corso)')
    c.execute('CREATE INDEX idx_argomento ON esercizi(argomento)')
    c.execute('CREATE INDEX idx_livello  ON esercizi(livello)')

    # Mappa corsi → (lista_base, livello, target)
    corsi = [
        ("Inglese Base",        BASE,           "A1-A2", 375),
        ("Pre-Intermedio",      PRE_INTERMEDIO, "A2-B1", 375),
        ("Intermedio",          INTERMEDIO,     "B1-B2", 375),
        ("Avanzato",            AVANZATO,       "C1-C2", 375),
        ("Business English",    BUSINESS,       "B2-C1", 375),
        ("Inglese per Viaggi",  VIAGGI,         "A2-B2", 375),
        ("IELTS / Cambridge",   IELTS,          "B2-C2", 375),
        ("Inglese Navale",      NAVALE,         "B1-C1", 375),
    ]

    tutti = []

    for corso, esercizi, livello, target in corsi:
        pool = list(esercizi)

        # Aggiungi varianti base/business/ielts se necessario
        if corso == "Inglese Base":      pool += VARIANTI_BASE * 5
        if corso == "Business English":  pool += VARIANTI_BUSINESS * 10
        if corso == "IELTS / Cambridge": pool += VARIANTI_IELTS * 10

        # Raggiungi il target con ciclaggio e varianti numerate
        while len(pool) < target:
            base = list(esercizi)
            random.shuffle(base)
            for i, (arg, testo, sol) in enumerate(base):
                pool.append((arg, f"[Variante {len(pool)+1}] {testo}", sol))
                if len(pool) >= target:
                    break

        random.shuffle(pool)
        for arg, testo, sol in pool[:target]:
            tutti.append((corso, arg, livello, testo, sol))

    random.shuffle(tutti)
    c.executemany(
        'INSERT INTO esercizi (corso, argomento, livello, testo, soluzione) VALUES (?,?,?,?,?)',
        tutti
    )
    conn.commit()

    totale = c.execute("SELECT COUNT(*) FROM esercizi").fetchone()[0]
    print(f"✅ {DB_PATH} creato con {totale} esercizi")
    conn.close()


if __name__ == "__main__":
    genera_db()
