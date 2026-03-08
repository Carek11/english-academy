<?php
/**
 * Genera data/hub_inglese.db con 3000 esercizi di inglese.
 * Esegui con: php init_english_db.php
 */

$dbPath = __DIR__ . '/data/hub_inglese.db';

if (!is_dir(__DIR__ . '/data')) mkdir(__DIR__ . '/data', 0755, true);
if (file_exists($dbPath)) unlink($dbPath);

$pdo = new PDO("sqlite:$dbPath");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec("
    CREATE TABLE esercizi (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        corso     TEXT NOT NULL,
        argomento TEXT NOT NULL,
        livello   TEXT NOT NULL,
        testo     TEXT NOT NULL,
        soluzione TEXT NOT NULL
    );
    CREATE INDEX idx_corso     ON esercizi(corso);
    CREATE INDEX idx_argomento ON esercizi(argomento);
    CREATE INDEX idx_livello   ON esercizi(livello);
");

// ─────────────────────────────────────────────────────────────────────────────
// DATI ESERCIZI (argomento, testo, soluzione)
// ─────────────────────────────────────────────────────────────────────────────

$base = [
    ["Articoli","Completa: ___ apple a day keeps the doctor away.","An apple a day keeps the doctor away."],
    ["Articoli","Scrivi l'articolo corretto: I need ___ umbrella.","I need an umbrella."],
    ["Articoli","Scegli: She is ___ engineer.","She is an engineer."],
    ["Articoli","Completa: He plays ___ guitar every evening.","He plays the guitar every evening."],
    ["Articoli","Scegli: ___ sun rises in the east.","The sun rises in the east."],
    ["Articoli","Scegli: ___ university is far. (a/an)","a university"],
    ["Presente Semplice","Coniuga: She ___ (to work) in a bank.","She works in a bank."],
    ["Presente Semplice","Forma negativa: He plays football.","He doesn't play football."],
    ["Presente Semplice","Forma la domanda: ___ you like coffee?","Do you like coffee?"],
    ["Presente Semplice","Completa: Water ___ (to boil) at 100°.","Water boils at 100°."],
    ["Presente Semplice","Coniuga: Every morning, I ___ (to brush) my teeth.","I brush my teeth."],
    ["Vocabolario Base","Traduci: 'casa'","house / home"],
    ["Vocabolario Base","Qual è il plurale di 'child'?","Children"],
    ["Vocabolario Base","Traduci: 'Buongiorno'","Good morning"],
    ["Vocabolario Base","Come si dice 'grazie'?","Thank you / Thanks"],
    ["Vocabolario Base","Traduci: 'Ho fame.'","I am hungry."],
    ["Vocabolario Base","Traduci: 'libro'","Book"],
    ["Vocabolario Base","Come si dice 'macchina'?","Car"],
    ["Pronomi","Sostituisci: Mary is a teacher → ___ is kind.","She is kind."],
    ["Pronomi","Usa il pronome: John and I →","We"],
    ["Pronomi","Completa: Give the book to ___ (io oggetto).","Give the book to me."],
    ["Pronomi","Scegli: This is ___ car. (mio)","This is my car."],
    ["Pronomi","Sostituisci: The dog → ___ is in the garden.","It is in the garden."],
    ["To Be","Coniuga: I ___ a student.","I am a student."],
    ["To Be","Forma negativa: He is tired.","He isn't tired."],
    ["To Be","Domanda: ___ they Italian?","Are they Italian?"],
    ["To Be","Completa: The books ___ on the table.","The books are on the table."],
    ["To Be","Risposta breve: Are you ready? Yes, ___.","Yes, I am."],
    ["Preposizioni","Scegli: The cat is ___ the box.","in"],
    ["Preposizioni","Completa: I wake up ___ 7 o'clock.","at"],
    ["Preposizioni","Scegli: She was born ___ 1990.","in"],
    ["Preposizioni","Completa: The picture is ___ the wall.","on"],
    ["Preposizioni","Scegli: I go to school ___ foot.","on"],
    ["Giorni e Mesi","Qual è il secondo mese?","February"],
    ["Giorni e Mesi","Traduci: 'lunedì'","Monday"],
    ["Giorni e Mesi","Quale giorno viene dopo Thursday?","Friday"],
    ["Giorni e Mesi","Completa: Christmas is on the 25th of ___.","December"],
    ["Numeri","Scrivi in lettere: 15","Fifteen"],
    ["Numeri","Scrivi ordinale: 3rd","Third"],
    ["Numeri","Traduci: 'Quanti anni hai?'","How old are you?"],
];

$preIntermedio = [
    ["Passato Semplice","Metti al passato: She goes to school.","She went to school."],
    ["Passato Semplice","Domanda: They watched a film last night.","Did they watch a film last night?"],
    ["Passato Semplice","Negativa: He arrived late.","He didn't arrive late."],
    ["Passato Semplice","Coniuga: I ___ (to see) a great film yesterday.","I saw a great film yesterday."],
    ["Passato Semplice","Completa: She ___ (to write) a letter.","She wrote a letter."],
    ["Passato Progressivo","Completa: At 8pm, they ___ (to have) dinner.","they were having dinner."],
    ["Passato Progressivo","Domanda: She was reading a book.","Was she reading a book?"],
    ["Passato Progressivo","Combina: I was sleeping. The phone rang.","I was sleeping when the phone rang."],
    ["Futuro","Completa con will: I think it ___ rain tomorrow.","it will rain"],
    ["Futuro","Usa going to: She ___ (to visit) Paris.","She is going to visit Paris."],
    ["Futuro","Scegli: Look at those clouds! It ___ rain.","It is going to rain."],
    ["Comparativi","Comparativo di 'tall'","taller"],
    ["Comparativi","Completa: London is ___ than my city. (big)","London is bigger than my city."],
    ["Comparativi","Superlativo: This is ___ film. (good)","the best film"],
    ["Comparativi","Confronta: A car is ___ a bicycle. (fast)","faster than"],
    ["Condizionale","Tipo 1: If it rains, I ___ (stay) at home.","I will stay at home."],
    ["Condizionale","Tipo 2: If I ___ rich, I would travel. (be)","If I were rich"],
    ["Condizionale","Tipo 0: If you heat ice, it ___ (melt).","it melts."],
    ["Verbi Modali","Permesso: ___ I open the window?","Can/May I open the window?"],
    ["Verbi Modali","Obbligo: You ___ wear a seatbelt.","must/have to"],
    ["Verbi Modali","Consiglio: You ___ see a doctor.","should"],
    ["Verbi Modali","Possibilità: It ___ be John calling.","might/could"],
    ["Present Perfect","Forma: She ___ (to visit) Rome twice.","She has visited Rome twice."],
    ["Present Perfect","Domanda: ___ you ever ___ sushi? (eat)","Have you ever eaten sushi?"],
    ["Present Perfect","Completa: I ___ here since 2019.","I have lived here since 2019."],
    ["Present Perfect","Completa: She ___ just ___ a book. (finish)","She has just finished a book."],
    ["Countable/Uncountable","Scegli: There is ___ milk. (some/any)","some"],
    ["Countable/Uncountable","Scegli: Are there ___ apples? (some/any)","any"],
    ["Countable/Uncountable","Usa much/many: How ___ water?","much"],
    ["Countable/Uncountable","Usa much/many: How ___ students?","many"],
    ["Preposizioni Avanzate","She is interested ___ art.","in"],
    ["Preposizioni Avanzate","He is afraid ___ spiders.","of"],
    ["Preposizioni Avanzate","I'm looking forward ___ meeting you.","to"],
    ["Preposizioni Avanzate","She is good ___ languages.","at"],
    ["Preposizioni Avanzate","He depends ___ his parents.","on"],
];

$intermedio = [
    ["Passivo","Trasforma: They built this bridge in 1890.","This bridge was built in 1890."],
    ["Passivo","Trasforma: Someone stole my wallet.","My wallet was stolen."],
    ["Passivo","Passivo presente: People speak English worldwide.","English is spoken worldwide."],
    ["Passivo","Passivo futuro: They will announce the results.","The results will be announced."],
    ["Periodo Ipotetico III","If she ___ harder, she would have passed. (study)","If she had studied harder"],
    ["Periodo Ipotetico III","Trasforma: He didn't study → He failed.","If he had studied, he wouldn't have failed."],
    ["Periodo Ipotetico III","Completa: I wish I ___ more time. (have)","I wish I had had more time."],
    ["Proposizioni Relative","Combina: The man is a doctor. He lives next door.","The man who lives next door is a doctor."],
    ["Proposizioni Relative","Scegli: The city ___ she was born is beautiful.","where"],
    ["Proposizioni Relative","Scegli: The woman ___ car was stolen.","whose"],
    ["Discorso Indiretto","Trasforma: She said 'I am tired'.","She said that she was tired."],
    ["Discorso Indiretto","Trasforma: He asked 'Do you speak English?'","He asked if/whether I spoke English."],
    ["Discorso Indiretto","Trasforma: 'Please close the door.'","She asked me to close the door."],
    ["Discorso Indiretto","Trasforma: 'I will call you tomorrow.'","He said he would call me the next day."],
    ["Phrasal Verbs","Traduci: 'rimandare'","to put off"],
    ["Phrasal Verbs","Traduci: 'arrendersi'","to give up"],
    ["Phrasal Verbs","Scegli: She decided to ___ smoking.","give up"],
    ["Phrasal Verbs","Traduci: 'crescere'","to grow up"],
    ["Connettivi","Scegli: She is rich; ___, she is unhappy. (however/therefore)","however"],
    ["Connettivi","Usa although: ___ it was raining, we went for a walk.","Although it was raining, we went for a walk."],
    ["Connettivi","Scegli: He didn't study; ___, he failed. (moreover/consequently)","consequently"],
    ["Gerundio/Infinito","Scegli: I enjoy ___ (swim/swimming).","swimming"],
    ["Gerundio/Infinito","Scegli: She decided ___ (to leave/leaving).","to leave"],
    ["Gerundio/Infinito","Scegli: He suggested ___ a taxi. (to take/taking)","taking"],
    ["Gerundio/Infinito","Scegli: I am looking forward to ___ you. (see/seeing)","seeing"],
    ["Inversione","Riscrivi: I have never seen such a thing.","Never have I seen such a thing."],
    ["Inversione","Riscrivi: She rarely goes to the cinema.","Rarely does she go to the cinema."],
    ["Inversione","Completa: Not only ___ he late, but he forgot his keys.","was he late"],
    ["Inversione","Completa: Hardly ___ he left when it started to rain.","had he left"],
];

$avanzato = [
    ["Idiomi","Spiega: 'It's raining cats and dogs.'","Sta piovendo a dirotto."],
    ["Idiomi","Spiega: 'To bite the bullet.'","Stringere i denti e affrontare una situazione difficile."],
    ["Idiomi","Spiega: 'The ball is in your court.'","Tocca a te decidere."],
    ["Idiomi","Spiega: 'To burn the midnight oil.'","Lavorare/studiare fino a tarda notte."],
    ["Idiomi","Spiega: 'To hit the nail on the head.'","Centrare il punto esatto."],
    ["Idiomi","Spiega: 'To let the cat out of the bag.'","Rivelare accidentalmente un segreto."],
    ["Idiomi","Spiega: 'Once in a blue moon.'","Molto raramente."],
    ["Idiomi","Spiega: 'To beat around the bush.'","Girare intorno al problema senza affrontarlo."],
    ["Idiomi","Spiega: 'To cost an arm and a leg.'","Costare molto."],
    ["Idiomi","Spiega: 'To break the ice.'","Rompere il ghiaccio in una situazione formale."],
    ["Registro Formale","Formale: 'Can you help me?'","I would be grateful if you could assist me."],
    ["Registro Formale","Formale: 'Sorry for the late reply.'","I apologize for the delayed response."],
    ["Registro Formale","Formale: 'I want to know more about...'","I would like to enquire about..."],
    ["Registro Formale","Quando si usa 'Yours sincerely'?","Quando conosci il nome del destinatario."],
    ["Collocazioni","Quale verbo si usa con 'decision'?","to make a decision"],
    ["Collocazioni","Completa: to ___ a mistake","make"],
    ["Collocazioni","Scegli: to ___ a shower (take/make/do)","take"],
    ["Collocazioni","Quale verbo si usa con 'research'?","to do / conduct research"],
    ["Connotazioni","'Slim' è positivo o negativo?","Positivo (snello/a)"],
    ["Connotazioni","Differenza: 'thrifty' vs 'stingy'","Thrifty = positivo, stingy = negativo (avaro)."],
    ["Cleft Sentences","Trasforma: John broke the window.","It was John who broke the window."],
    ["Cleft Sentences","Trasforma: I need a holiday, not money.","What I need is a holiday, not money."],
    ["Cleft Sentences","Completa: ___ that surprised me was his reaction.","What surprised me was his reaction."],
    ["Scrittura Accademica","Come si inizia un saggio accademico?","With a clear thesis statement."],
    ["Scrittura Accademica","Scrivi un topic sentence sull'inquinamento.","Air pollution poses a significant threat to public health."],
    ["Scrittura Accademica","Frase di transizione per aggiungere un punto.","Furthermore, / In addition, / Moreover,"],
    ["Pronuncia Avanzata","Differenza fonetica: 'ship' vs 'sheep'","/ɪ/ breve in 'ship', /iː/ lungo in 'sheep'."],
    ["Pronuncia Avanzata","Come si pronuncia 'Wednesday'?","/ˈwenz.deɪ/ — la 'd' centrale è silenziosa."],
    ["Pronuncia Avanzata","Come si riduce 'want to' nel parlato?","Wanna"],
];

$business = [
    ["Email Formali","Apertura email formale a cliente sconosciuto.","Dear Sir/Madam, I am writing to enquire about..."],
    ["Email Formali","Come si chiude un'email formale?","Yours faithfully / Yours sincerely, [Full Name]"],
    ["Email Formali","Frase per scusarsi di un ritardo.","I sincerely apologize for the inconvenience caused by the delay."],
    ["Email Formali","Come si esprime urgenza in un'email?","I would appreciate your prompt response."],
    ["Email Formali","Oggetto per comunicare una riunione.","Subject: Meeting Invitation – Q3 Review | 15 March 2025"],
    ["Email Formali","Come si declina un invito formalmente?","I regret to inform you that I am unable to attend."],
    ["Riunioni","Come si apre formalmente una riunione?","Good morning. Let's get started. / Shall we begin?"],
    ["Riunioni","Come si chiede la parola?","May I add something? / If I could just come in here..."],
    ["Riunioni","Come si riassume un punto?","So to summarize, we've agreed that..."],
    ["Riunioni","Come si rinvia un punto?","Let's table this for a later date."],
    ["Riunioni","Come si chiude una riunione?","I think that covers everything. Thank you all for attending."],
    ["Negoziazioni","Frase per fare un'offerta iniziale.","Our initial offer is... / We would be prepared to offer..."],
    ["Negoziazioni","Frase per chiedere una concessione.","Would you be willing to reconsider the price?"],
    ["Negoziazioni","Frase per guadagnare tempo.","I'll need to consult with my team before answering."],
    ["Negoziazioni","Frase per raggiungere un accordo.","I think we have a deal. / We've reached an agreement."],
    ["Presentazioni","Come si inizia una presentazione?","Good morning. My name is... and today I'd like to present..."],
    ["Presentazioni","Frase di transizione tra sezioni.","Moving on to... / Let's now turn to..."],
    ["Presentazioni","Come si fa riferimento a una slide?","As you can see on this slide..."],
    ["Presentazioni","Come si apre la sessione domande?","I'd now like to open the floor to questions."],
    ["Gergo Business","Cosa significa 'KPI'?","Key Performance Indicator."],
    ["Gergo Business","Cosa significa 'B2B'?","Business to Business."],
    ["Gergo Business","Cosa significa 'ROI'?","Return on Investment."],
    ["Gergo Business","Cosa significa 'leverage' in business?","Usare risorse per massimizzare il vantaggio."],
    ["Rapporti Scritti","Struttura di un report professionale.","Executive Summary, Introduction, Findings, Analysis, Recommendations, Conclusion."],
    ["Rapporti Scritti","Come si inizia la sezione 'Findings'?","The findings indicate that... / The data reveals..."],
    ["Rapporti Scritti","Come si formulano le raccomandazioni?","It is recommended that... / We strongly advise..."],
    ["Colloqui di Lavoro","Rispondi a: 'Tell me about yourself.'","I am a [role] with [X] years of experience..."],
    ["Colloqui di Lavoro","Come si chiede informazioni sullo stipendio?","Could you give me an indication of the salary range?"],
    ["Telefonate","Come si risponde al telefono professionalmente?","Good morning, [Company], [Name] speaking. How can I help?"],
    ["Telefonate","Come si chiede di parlare con qualcuno?","Could I speak to [Name], please?"],
];

$viaggi = [
    ["Aeroporto","Come si dice 'volo in ritardo'?","Delayed flight"],
    ["Aeroporto","Frase per fare il check-in.","I'd like to check in for my flight to London, please."],
    ["Aeroporto","Come si chiede dove sono i controlli sicurezza?","Excuse me, where is the security check?"],
    ["Aeroporto","Come si dichiara bagaglio in eccesso?","My baggage is overweight. What are the excess fees?"],
    ["Aeroporto","Come si chiede il gate di imbarco?","Which gate does the flight to Rome depart from?"],
    ["Albergo","Come si prenota una camera?","I'd like to book a double room for three nights, please."],
    ["Albergo","Frase per fare il check-in all'hotel.","I have a reservation under the name [Name]."],
    ["Albergo","Come si chiede un asciugamano in più?","Could I have some extra towels, please?"],
    ["Albergo","Come si segnala un problema in camera?","There seems to be a problem with the heating in my room."],
    ["Albergo","Come si chiede il conto?","Could I have the bill, please? I'd like to check out."],
    ["Ristorante","Come si prenotano tavoli?","I'd like to make a reservation for two for 8 pm, please."],
    ["Ristorante","Come si ordina?","I'll have the grilled salmon, please."],
    ["Ristorante","Come si chiede il conto?","Could we have the bill, please?"],
    ["Ristorante","Come si segnala un'allergia?","I'm allergic to nuts. Could you check this dish?"],
    ["Trasporti","Come si compra un biglietto del treno?","A return ticket to Edinburgh, please."],
    ["Trasporti","Come si chiede a che ora parte il prossimo bus?","What time does the next bus to the centre leave?"],
    ["Trasporti","Come si noleggia un'auto?","I'd like to rent a car for three days, please."],
    ["Trasporti","Come si chiede indicazioni?","Excuse me, could you tell me how to get to the museum?"],
    ["Emergenze","Come si chiede aiuto?","Help! / Can someone help me, please?"],
    ["Emergenze","Segnala il furto della borsa.","My bag has been stolen. I need to report it."],
    ["Emergenze","Come si chiede un medico?","I need to see a doctor. / Could you call an ambulance?"],
    ["Emergenze","Come si segnala la perdita del passaporto?","I've lost my passport. Can you help me contact the embassy?"],
    ["Acquisti","Come si chiede la taglia?","Do you have this in a medium / size 40?"],
    ["Acquisti","Come si chiede il prezzo?","How much does this cost?"],
    ["Acquisti","Come si chiede di cambiare un prodotto?","I'd like to exchange this. It doesn't fit."],
    ["Descrizione Luoghi","Come si dice 'punto di riferimento'?","Landmark"],
    ["Descrizione Luoghi","Come si chiede un consiglio turistico?","What would you recommend visiting here?"],
    ["Descrizione Luoghi","Traducini 'fuori dai sentieri battuti'.","Off the beaten track"],
];

$ielts = [
    ["Writing Task 1","Quale verbo si usa per descrivere un aumento?","Rise, increase, grow, climb, surge, soar"],
    ["Writing Task 1","Come si descrive un plateau?","Figures levelled off / remained stable at..."],
    ["Writing Task 1","Struttura ideale di un Task 1.","Introduction, Overview (main trends), Detailed paragraphs."],
    ["Writing Task 1","Frase per introdurre i dati principali.","The most notable feature is... / Overall, it is clear that..."],
    ["Writing Task 1","Come si descrive un calo?","Fall, drop, decline, plummet, dip, diminish"],
    ["Writing Task 2","Come si introduce una concessione?","Admittedly, / It is true that... / While it may be argued..."],
    ["Writing Task 2","Quali connettivi aggiungono un argomento?","Furthermore, Moreover, In addition, Additionally"],
    ["Writing Task 2","Come si introduce l'opinione finale?","In conclusion, / To sum up, / On balance, I believe..."],
    ["Writing Task 2","Scrivi un contro-argomento efficace.","On the other hand, / Conversely, / Critics argue that..."],
    ["Writing Task 2","Word count richiesto per Task 2?","Minimum 250 words. Aim for 270-290."],
    ["Reading","Cosa significa 'skimming'?","Leggere velocemente per capire l'idea generale."],
    ["Reading","Cosa significa 'scanning'?","Cercare informazioni specifiche scorrendo il testo."],
    ["Reading","Come si affrontano le domande TRUE/FALSE/NOT GIVEN?","TRUE = confermato. FALSE = contraddetto. NOT GIVEN = non menzionato."],
    ["Reading","Strategia per 'Matching Headings'.","Leggi prima i titoli, poi individua la main idea di ogni paragrafo."],
    ["Listening","Quante sezioni ha il Listening IELTS?","4 sezioni con difficoltà crescente."],
    ["Listening","Cosa fare durante il tempo di preparazione?","Leggere le domande e identificare keywords."],
    ["Listening","Come si gestisce una risposta persa?","Vai avanti alla domanda successiva."],
    ["Speaking","Frase per guadagnare tempo.","That's an interesting question. Let me think..."],
    ["Speaking","Come si raggiunge un Band 7+ in Speaking?","Fluency, coherence, varied vocabulary, accurate grammar."],
    ["Speaking","Cosa si valuta nel 'Lexical Resource'?","Varietà ed accuratezza del vocabolario, collocazioni, idiomi."],
    ["Vocabolario IELTS","Sinonimo di 'important' per IELTS.","Significant, crucial, vital, essential, pivotal"],
    ["Vocabolario IELTS","Sinonimo di 'show' per grafici.","Illustrate, depict, demonstrate, indicate, reveal"],
    ["Vocabolario IELTS","Vocabolario per contrasto.","However, nevertheless, on the other hand, in contrast, despite"],
    ["Vocabolario IELTS","Vocabolario per cause ed effetti.","As a result, consequently, therefore, due to, leads to"],
];

$navale = [
    ["Navi da Guerra","'portaerei' in inglese?","Aircraft carrier"],
    ["Navi da Guerra","Traduci: 'fregata'","Frigate"],
    ["Navi da Guerra","'sottomarino' in inglese?","Submarine"],
    ["Navi da Guerra","Traduci: 'cacciatorpediniere'","Destroyer"],
    ["Navi da Guerra","'nave da pattugliamento'?","Patrol vessel / Patrol boat"],
    ["Componenti Nave","'ponte di volo'?","Flight deck"],
    ["Componenti Nave","Traduci: 'periscopio'","Periscope"],
    ["Componenti Nave","'torre di comando' del sottomarino?","Conning tower"],
    ["Componenti Nave","Traduci: 'elica'","Propeller / Screw"],
    ["Componenti Nave","'timone'?","Rudder"],
    ["Componenti Nave","'prua'?","Bow"],
    ["Componenti Nave","'poppa'?","Stern"],
    ["Componenti Nave","'plancia di comando'?","Bridge"],
    ["Componenti Nave","Traduci: 'scafo'","Hull"],
    ["Componenti Nave","Traduci: 'albero maestro'","Main mast"],
    ["Comunicazioni NATO","'Alpha' nell'alfabeto NATO?","La lettera A."],
    ["Comunicazioni NATO","Come si dice 'capito' in radio?","Roger / Roger that"],
    ["Comunicazioni NATO","Come si dice 'confermato, obbedisco'?","Wilco (Will Comply)"],
    ["Manovre Navali","Cosa significa 'all stop'?","Ferma i motori, la nave si ferma."],
    ["Manovre Navali","Cosa significa 'ahead full'?","Avanza a tutta velocità."],
    ["Manovre Navali","Traduci: 'virare a dritta'","Turn to starboard / Hard to starboard"],
    ["Manovre Navali","'man overboard'?","Uomo in mare — emergenza."],
    ["Manovre Navali","'abandon ship'?","Ordine di evacuazione di emergenza."],
    ["Terminologia Operativa","Cosa significa 'SITREP'?","Situation Report."],
    ["Terminologia Operativa","Cosa significa 'ROE'?","Rules of Engagement."],
    ["Terminologia Operativa","Cosa significa 'ETA'?","Estimated Time of Arrival."],
    ["Sicurezza a Bordo","'giubbotto di salvataggio'?","Life jacket / Life vest"],
    ["Sicurezza a Bordo","Cosa significa 'MAYDAY'?","Segnale di soccorso internazionale (massima emergenza)."],
    ["Sicurezza a Bordo","Cosa significa 'PAN PAN'?","Segnale di urgenza (meno grave di MAYDAY)."],
    ["Gradi Navali","'ammiraglio' in inglese?","Admiral"],
    ["Gradi Navali","'capitano di fregata'?","Commander"],
    ["Gradi Navali","'guardiamarina'?","Midshipman / Ensign"],
    ["Gradi Navali","'capitano di vascello'?","Captain"],
];

// ─────────────────────────────────────────────────────────────────────────────
// GENERAZIONE
// ─────────────────────────────────────────────────────────────────────────────

$corsi = [
    ["Inglese Base (A1-A2)",           $base,          "A1-A2", 375],
    ["Inglese Pre-Intermedio (A2-B1)", $preIntermedio, "A2-B1", 375],
    ["Inglese Intermedio (B1-B2)",     $intermedio,    "B1-B2", 375],
    ["Inglese Avanzato (C1-C2)",       $avanzato,      "C1-C2", 375],
    ["Business English",               $business,      "B2-C1", 375],
    ["Inglese per Viaggi",             $viaggi,        "A2-B2", 375],
    ["Preparazione IELTS / Cambridge", $ielts,         "B2-C2", 375],
    ["Inglese Navale - Marina Militare",$navale,       "B1-C1", 375],
];

$stmt = $pdo->prepare("INSERT INTO esercizi (corso, argomento, livello, testo, soluzione) VALUES (?,?,?,?,?)");

$totaleInseriti = 0;

foreach ($corsi as [$corso, $esercizi, $livello, $target]) {
    $pool = $esercizi;

    // Aggiungi varianti fino al target
    $variante = 1;
    while (count($pool) < $target) {
        foreach ($esercizi as $ex) {
            if (count($pool) >= $target) break;
            $pool[] = [$ex[0], "[Variante {$variante}] " . $ex[1], $ex[2]];
            $variante++;
        }
    }

    // Shuffle e prendi solo $target esercizi
    shuffle($pool);
    $pool = array_slice($pool, 0, $target);

    foreach ($pool as [$argomento, $testo, $soluzione]) {
        $stmt->execute([$corso, $argomento, $livello, $testo, $soluzione]);
        $totaleInseriti++;
    }
}

$count = $pdo->query("SELECT COUNT(*) FROM esercizi")->fetchColumn();
echo "✅ Database creato: $dbPath\n";
echo "✅ Esercizi inseriti: $count / 3000\n";
