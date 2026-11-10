/* Question bank extracted from the four handwritten test papers.
   d = difficulty (1 easiest to memorise ... 5 hardest). Used for the initial
   easiest-first ranking; after that the app's own scheduling takes over. */

const DECKS = [
  { id: "c5p1", short: "Ch 5 · I",  title: "Chapter 5 — Part I",  sub: "Light to the Nations · pp. 115–124" },
  { id: "c5p2", short: "Ch 5 · II", title: "Chapter 5 — Part II", sub: "Light to the Nations · pp. 124–133" },
  { id: "c6p1", short: "Ch 6 · I",  title: "Chapter 6 — Part I",  sub: "Catholic History · pp. 139–150" },
  { id: "c6p2", short: "Ch 6 · II", title: "Chapter 6 — Part II", sub: "Catholic History · pp. 150–162" }
];

const QUESTIONS = [
  /* ---------------- Chapter 5 Part I (pp. 115-124) ---------------- */
  { id: "c5p1-1a", deck: "c5p1", n: "1a", d: 2,
    q: "When were the 'Dark Ages'?",
    a: "400 – 900 AD" },

  { id: "c5p1-1b", deck: "c5p1", n: "1b", d: 1,
    q: "Why were they called the 'Dark Ages'?",
    a: "They were thought to be a time with little learning." },

  { id: "c5p1-2", deck: "c5p1", n: "2", d: 4,
    q: "The Dark Ages had 6 significant challenges. Name any 4.",
    a: "• Warfare\n• Crop failure\n• Travel difficulties\n• Low living standards\n• Destruction of books",
    note: "The book lists six in total — these five cover every version of the answer." },

  { id: "c5p1-3", deck: "c5p1", n: "3", d: 2,
    q: "What name is given to the civilization that arose from the ancient civilizations of Greece, Rome and Israel?",
    a: "Christendom" },

  { id: "c5p1-4", deck: "c5p1", n: "4", d: 2,
    q: "The greatest ______ of peoples in human history took place in the 4th through 6th centuries.",
    a: "Migration",
    note: "The Germanic peoples had been spread across the lands of the Baltic Sea and the plains and river valleys of Eastern Europe." },

  { id: "c5p1-5", deck: "c5p1", n: "5", d: 1,
    q: "From the Blue Box: what is a demigod?",
    a: "A being who has more power than a human but less than a god." },

  { id: "c5p1-6", deck: "c5p1", n: "6", d: 3,
    q: "For the Germans, the word 'law' meant age-old ______. Laws were not written down but were ______ and passed along by the ______ or the council of ______.",
    a: "Custom · memorised · bards · elders",
    note: "Age-old custom, memorised, passed on by bards or the council of elders." },

  { id: "c5p1-7", deck: "c5p1", n: "7", d: 3,
    q: "After eyewitnesses, what 3 types of 'evidence' could the accused appeal to under Germanic law?",
    a: "• The oath\n• Ordeal\n• Trial by combat" },

  { id: "c5p1-8", deck: "c5p1", n: "8", d: 5,
    q: "Name the 7 gods after whom our 7 days of the week are named.",
    a: "Sun · Moon · Tiw · Woden · Thor · Freya · Saturn",
    note: "Sunday, Monday, Tuesday (Tiw), Wednesday (Woden), Thursday (Thor), Friday (Freya), Saturday (Saturn)." },

  { id: "c5p1-9", deck: "c5p1", n: "9", d: 3,
    q: "Germanic songs and poems celebrated courageous ______ as much as ______ and successes. Even when they became ______, the Germans saw courage as the greatest ______.",
    a: "Defeats · victories · Catholic · virtue" },

  { id: "c5p1-10", deck: "c5p1", n: "10", d: 4,
    q: "In 507, which people drove the Visigoths from most of Gaul, and where did the Visigoths then make their capital?",
    a: "The Franks drove them from most of Gaul. The Visigoths established their kingdom in the Roman province of Hispania, making Toledo their royal capital in the centre of the peninsula.",
    note: "Franks → Gaul · Visigoths → Hispania (Toledo)." },

  { id: "c5p1-11", deck: "c5p1", n: "11", d: 3,
    q: "Monasteries were centres of learning in Visigothic Spain. The monks were editors, ______, ______, and school ______.",
    a: "Copyists · librarians · teachers" },

  { id: "c5p1-12", deck: "c5p1", n: "12", d: 4,
    q: "Whose descendants greatly influenced the Visigothic kingdom of Spain for two generations, and how many of the family does the Church venerate as saints?",
    a: "The descendants of Severianus — the Church venerates 5 members of the family as saints." },

  { id: "c5p1-13a", deck: "c5p1", n: "13a", d: 2,
    q: "Why did Leovigild try to force Arianism upon his Catholic subjects?",
    a: "He wanted to unite his kingdom." },

  { id: "c5p1-13b", deck: "c5p1", n: "13b", d: 2,
    q: "What proportion of Leovigild's subjects were Catholics?",
    a: "About 90% — the overwhelming majority." },

  { id: "c5p1-14", deck: "c5p1", n: "14", d: 5,
    q: "King Leovigild married Goswintha. What was the name of her 13-year-old granddaughter, and which of Leovigild's sons did she marry?",
    a: "Ingund — she married Leovigild's eldest son, Hermenegild." },

  { id: "c5p1-15", deck: "c5p1", n: "15", d: 4,
    q: "Give any 2 facts about Hermenegild's rebellion against his father.",
    a: "• He converted to Catholicism\n• He declared independence from Toledo" },

  { id: "c5p1-16", deck: "c5p1", n: "16", d: 3,
    q: "Briefly describe how Hermenegild died.",
    a: "He was martyred for refusing communion from an Arian bishop." },

  { id: "c5p1-17", deck: "c5p1", n: "17", d: 4,
    q: "What happened on the 8th of May, 589?",
    a: "The public renunciation of Arianism in Spain.",
    note: "At the Third Council of Toledo the Visigothic kingdom formally became Catholic." },

  { id: "c5p1-18", deck: "c5p1", n: "18", d: 3,
    q: "The ______ of Toledo became one of the most important institutions of the Visigothic monarchy — a unique sign of the close ______ that developed between ______ and ______.",
    a: "Councils · cooperation · Church · State" },

  { id: "c5p1-19", deck: "c5p1", n: "19", d: 3,
    q: "The bishops helped the Visigothic kingdom with 3 things. Give any 2.",
    a: "• Political stability\n• Foreign affairs\n• (Church support / moral authority)" },

  { id: "c5p1-20", deck: "c5p1", n: "20", d: 3,
    q: "Which book did St. Isidore of Seville write, what did it do, and why did that matter?",
    a: "The 'Etymologiae'. It collected together all the learning known in his time and helped preserve much of Greek and Roman wisdom and knowledge." },

  /* ---------------- Chapter 5 Part II (pp. 124-133) ---------------- */
  { id: "c5p2-1", deck: "c5p2", n: "1", d: 3,
    q: "The Vandals crossed the Rhine river on the ______ of ______ in the year ______.",
    a: "31st of December, 406" },

  { id: "c5p2-2", deck: "c5p2", n: "2", d: 2,
    q: "Why did the Vandals make this crossing?",
    a: "They had not been paid for guarding the frontier." },

  { id: "c5p2-3a", deck: "c5p2", n: "3a", d: 3,
    q: "Which 2 impediments held back Genseric from becoming King of the Vandals?",
    a: "• A crippled foot\n• He was the son of a slave" },

  { id: "c5p2-3b", deck: "c5p2", n: "3b", d: 3,
    q: "Which 2 redeeming features did Genseric possess to overcome them?",
    a: "• Great rhetoric (a powerful speaker)\n• A good warrior" },

  { id: "c5p2-4a", deck: "c5p2", n: "4a", d: 2,
    q: "From the Blue Box: what is a garrison?",
    a: "Troops stationed in a territory, or a base camp." },

  { id: "c5p2-4b", deck: "c5p2", n: "4b", d: 1,
    q: "From the Blue Box: what is a menorah?",
    a: "A 7-branched candle holder." },

  { id: "c5p2-5", deck: "c5p2", n: "5", d: 2,
    q: "From the footnote: what is a serf?",
    a: "A peasant legally bound to the land." },

  { id: "c5p2-6", deck: "c5p2", n: "6", d: 3,
    q: "Having become soft from luxury, the Vandals did not survive as a distinct nation, but were defeated by the Eastern Emperor ______ in the year ______.",
    a: "Justinian · 534",
    note: "Belisarius won the Vandal War for Justinian in 533–534; Carthage fell in 533." },

  { id: "c5p2-7", deck: "c5p2", n: "7", d: 2,
    q: "The Frankish kings all claimed descent from a mythic hero called ______.",
    a: "Merovich (Merovech)" },

  { id: "c5p2-8", deck: "c5p2", n: "8", d: 3,
    q: "Give any 2 facts about how the Franks fought on the battlefield.",
    a: "• They fought without armour\n• They fought with spears (and swords), often on foot" },

  { id: "c5p2-9a", deck: "c5p2", n: "9a", d: 2,
    q: "What did Clotilde say to her husband Clovis about his battle against the Alamanni tribe?",
    a: "To rely on (trust in) God." },

  { id: "c5p2-9b", deck: "c5p2", n: "9b", d: 2,
    q: "In brief, what did Clovis say in return?",
    a: "He promised to convert if he won the victory." },

  { id: "c5p2-10", deck: "c5p2", n: "10", d: 4,
    q: "Where and by whom was King Clovis baptised, on what day, in what year?",
    a: "In the city of Rheims (Reims), by Bishop Remigius (St. Remi), on Christmas Day, 496." },

  { id: "c5p2-11", deck: "c5p2", n: "11", d: 4,
    q: "How did Clovis get rid of his last Meroving rival, the prince of Cologne?",
    a: "He persuaded the prince to murder his own father, then had the prince murdered." },

  { id: "c5p2-12", deck: "c5p2", n: "12", d: 1,
    q: "From the Blue Box: what is a chancellor?",
    a: "The secretary of the king." },

  { id: "c5p2-13", deck: "c5p2", n: "13", d: 4,
    q: "King Pepin the Short began the line of Frankish kings called the ______. They were named for Pepin's father, Charles ______ — 'Charles' is ______ in Frankish and ______ in Latin.",
    a: "Carolingians · Martel · Karl · Carolos" },

  { id: "c5p2-14", deck: "c5p2", n: "14", d: 4,
    q: "In the year ______ the Goth named ______ deposed the boy king Romulus ______, proclaimed himself 'king of the Germans in Italy', and sent the imperial regalia to the Eastern Emperor ______ in Constantinople.",
    a: "476 · Odoacer · Augustulus · Zeno" },

  { id: "c5p2-15", deck: "c5p2", n: "15", d: 2,
    q: "From the Blue Box: what are regalia?",
    a: "Symbols of royalty." },

  { id: "c5p2-16a", deck: "c5p2", n: "16a", d: 3,
    q: "Theodoric was sent by his father to the city of ______ to study for ______ years.",
    a: "Constantinople · 10" },

  { id: "c5p2-16b", deck: "c5p2", n: "16b", d: 3,
    q: "Besides the education he would receive, why did his father send Theodoric away from his own people?",
    a: "As a hostage to guarantee his father's agreement." },

  { id: "c5p2-17", deck: "c5p2", n: "17", d: 3,
    q: "What are 2 improvements made by Theodoric when he became King of Italy?",
    a: "• Repaired aqueducts\n• Restored public buildings" },

  { id: "c5p2-18", deck: "c5p2", n: "18", d: 3,
    q: "Because the Ostrogoths were Arians, this meant there were ______ churches in the one kingdom and constant ______ between the Roman Italians and the Ostrogoths.",
    a: "Different · frictions" },

  { id: "c5p2-19", deck: "c5p2", n: "19", d: 1,
    q: "From the footnote: what is a mediator?",
    a: "A person who helps two different sides understand one another." },

  { id: "c5p2-20", deck: "c5p2", n: "20", d: 4,
    q: "Toward the end of his life, Theodoric feared the Eastern Emperor ______ was plotting to kill him, so he condemned several ______ to death — including the philosopher ______.",
    a: "Justin · senators · Boethius" },

  /* ---------------- Chapter 6 Part I (pp. 139-150) ---------------- */
  { id: "c6p1-1", deck: "c6p1", n: "1", d: 1,
    q: "What does it mean to abdicate?",
    a: "To give up the right to rule." },

  { id: "c6p1-2a", deck: "c6p1", n: "2a", d: 3,
    q: "The Emperor Justinian reigned from the year ______ until ______.",
    a: "527 · 565" },

  { id: "c6p1-2b", deck: "c6p1", n: "2b", d: 2,
    q: "More than anything else, what did Justinian want to do as Emperor?",
    a: "Reunite the eastern and western empires under a Christian empire." },

  { id: "c6p1-3", deck: "c6p1", n: "3", d: 4,
    q: "Justinian brought 6 valuable assets to the throne. Give any 2 of them.",
    a: "• Highly organised\n• Willing to work long hours\n• Great physical stamina\n• A taste for the arts\n• The ability to inspire loyalty\n• His wife, Theodora" },

  { id: "c6p1-4", deck: "c6p1", n: "4", d: 4,
    q: "Justinian brought 6 valuable assets to the throne. Give another 2 of them.",
    a: "Any two you did not use before — e.g. a taste for the arts; the ability to inspire loyalty; his wife Theodora." },

  { id: "c6p1-5", deck: "c6p1", n: "5", d: 5,
    q: "The 'Nika Revolt' in the year ______ resulted in ______ people being slain by Belisarius and his Gothic mercenaries. The Greek word Nika means '______', and it resulted in the burning down of Hagia Sophia, a great cathedral built by ______ some 200 years earlier.",
    a: "532 · 30,000 · Victory (conquer) · Constantine" },

  { id: "c6p1-6", deck: "c6p1", n: "6", d: 4,
    q: "Hagia Sophia (Greek for 'Holy ______') was rebuilt in only ______ years, and worshippers were made to feel that they stood in the ______ of Heaven.",
    a: "Wisdom · 6 · forecourt" },

  { id: "c6p1-7", deck: "c6p1", n: "7", d: 5,
    q: "Give any 4 facts about mosaic art.",
    a: "• It was Roman\n• It was perfected in the East\n• Made of tiny pieces of glass and stone\n• Pasted onto concrete\n• Made to reflect light\n• Looks as if it is floating" },

  { id: "c6p1-8", deck: "c6p1", n: "8", d: 3,
    q: "Give the 2 reasons why Justinian ordered a new summary of Roman law.",
    a: "• To minimise corruption in the courts\n• To make fair judgement more easily accessible" },

  { id: "c6p1-9", deck: "c6p1", n: "9", d: 3,
    q: "The '______' was published between the years ______ and ______.",
    a: "Codex Justinianus · 529 · 534" },

  { id: "c6p1-10", deck: "c6p1", n: "10", d: 3,
    q: "From the Blue Box: what does the word 'Byzantine' mean?",
    a: "The civilization that comes from the city of Byzantium, where Constantinople was born." },

  { id: "c6p1-11", deck: "c6p1", n: "11", d: 4,
    q: "How did the Emperor Justinian celebrate his 80th birthday?",
    a: "With a week of festivities for the re-opening of Hagia Sophia." },

  { id: "c6p1-12", deck: "c6p1", n: "12", d: 1,
    q: "From the Blue Box: what does 'lay' mean?",
    a: "Any member of the Church who is not clergy." },

  { id: "c6p1-13", deck: "c6p1", n: "13", d: 3,
    q: "Strange as it may seem, it was those who sought nothing more than a life of ______ and the ______ of their ______ who became the true preservers of civilized life and thought.",
    a: "Prayer · salvation · souls" },

  { id: "c6p1-14a", deck: "c6p1", n: "14a", d: 4,
    q: "Born in the late ______s, Patrick, the son of a Christian ______, was carried off to slavery in Ireland when he was not quite ______ years old.",
    a: "300s · deacon · 16" },

  { id: "c6p1-14b", deck: "c6p1", n: "14b", d: 3,
    q: "Back in Britain, what words did Patrick hear in a vision?",
    a: "'Holy youth, come walk among us once again.'" },

  { id: "c6p1-15", deck: "c6p1", n: "15", d: 4,
    q: "Because of which 2 deficiencies did Patrick devote himself to 14 years of study?",
    a: "• He had not memorised enough of the Bible\n• He could not read well (he was not properly educated)" },

  { id: "c6p1-16", deck: "c6p1", n: "16", d: 3,
    q: "Preaching the Gospel to the Gaelic Irish was difficult because the Christian Gospel of ______ denied the heroic ______ on which their ______ depended.",
    a: "Forgiveness · traditions · society" },

  { id: "c6p1-17a", deck: "c6p1", n: "17a", d: 2,
    q: "From the Blue Box: what is a clan?",
    a: "An extended family that is loyal to the clan chief." },

  { id: "c6p1-17b", deck: "c6p1", n: "17b", d: 2,
    q: "From the Blue Box: what is a Druid?",
    a: "A Gaelic priest who came from the hereditary aristocracy, believed to be able to cast magic." },

  { id: "c6p1-18", deck: "c6p1", n: "18", d: 3,
    q: "Briefly describe what happened one Easter involving St. Patrick.",
    a: "He lit the Paschal candle, which angered the Druids, and they reported him to the king." },

  { id: "c6p1-19", deck: "c6p1", n: "19", d: 5,
    q: "St. Patrick established his church at ______ in the northern kingdom of ______. Within ______ years all of Ireland was at least nominally Catholic, and Patrick lived and worked in Ireland for almost ______ years until his death.",
    a: "Armagh · Ulster · 25 · 60" },

  { id: "c6p1-20", deck: "c6p1", n: "20", d: 4,
    q: "Provide any 4 facts about the monks and monasteries of Ireland.",
    a: "• Monasteries were centres of learning\n• Monks replaced the Druids' memorisation and learning\n• They memorised whole books\n• They left Ireland to spread the monastic life" },

  /* ---------------- Chapter 6 Part II (pp. 150-162) ---------------- */
  { id: "c6p2-1", deck: "c6p2", n: "1", d: 5,
    q: "Give any 4 facts about the family background and early life of Boethius.",
    a: "• His family was noble\n• He was of the Atricii family\n• He entered the Senate at a young age\n• Theodoric appointed him to high office\n• He translated Greek texts into Latin" },

  { id: "c6p2-2", deck: "c6p2", n: "2", d: 5,
    q: "List the Seven Liberal Arts.",
    a: "Grammar · Logic · Rhetoric · Arithmetic · Geometry · Astronomy · Music",
    note: "The first three (Grammar, Logic, Rhetoric) are the Trivium; the last four are the Quadrivium." },

  { id: "c6p2-3", deck: "c6p2", n: "3", d: 4,
    q: "Give any 4 facts from the backstory of how Boethius found himself in prison awaiting death.",
    a: "• King Theodoric was suspicious of a plot against him\n• Boethius was an Italian Catholic senator\n• He was tortured and questioned but would not confess" },

  { id: "c6p2-4", deck: "c6p2", n: "4", d: 4,
    q: "In his book 'The ______ of ______', Boethius did not use any arguments from Christian ______, but only those available to human reason.",
    a: "Consolation · Philosophy · revelation" },

  { id: "c6p2-5a", deck: "c6p2", n: "5a", d: 2,
    q: "According to Boethius, what is happiness?",
    a: "Happiness is seeing God in all things." },

  { id: "c6p2-5b", deck: "c6p2", n: "5b", d: 2,
    q: "From the Blue Box: what is Providence?",
    a: "God knowing before an event happens — His foreknowledge." },

  { id: "c6p2-6", deck: "c6p2", n: "6", d: 4,
    q: "Give any 4 facts from the backstory of St. Benedict before he founded Monte Cassino.",
    a: "• Born in 480 in Nursia\n• Studied in Rome and was disgusted by its immorality\n• His sister was St. Scholastica" },

  { id: "c6p2-7", deck: "c6p2", n: "7", d: 3,
    q: "Briefly tell the story of St. Benedict and his sister St. Scholastica at the cave at Subiaco.",
    a: "They met once a year. She asked him to stay longer; he refused. She prayed, a storm came, and he had to stay." },

  { id: "c6p2-8", deck: "c6p2", n: "8", d: 4,
    q: "How did St. Benedict do things differently for his community compared with the Egyptian hermits?",
    a: "• Communal prayer instead of praying alone\n• His rule on penance was less harsh\n• The community was self-sufficient" },

  { id: "c6p2-9", deck: "c6p2", n: "9", d: 3,
    q: "The Rule of St. Benedict prescribes ______ prayer 7 times a day, also commanding physical ______ as a balance to the monk's life of prayer and meditative reading.",
    a: "Common · labour" },

  { id: "c6p2-10", deck: "c6p2", n: "10", d: 1,
    q: "What is the Latin motto of the Benedictine monastic life, meaning 'Pray and work'?",
    a: "Ora et Labora" },

  { id: "c6p2-11", deck: "c6p2", n: "11", d: 2,
    q: "Why did the Benedictine monastic life appeal to more people than the monasteries of the East, such as in Egypt?",
    a: "It was an easier, more balanced life." },

  { id: "c6p2-12", deck: "c6p2", n: "12", d: 5,
    q: "Provide any 4 facts about Gregory the Great before he became Pope.",
    a: "• Made Prefect of Rome\n• Commanded armies\n• Donated his whole fortune\n• Turned his mansion into a monastery\n• Served as an ambassador" },

  { id: "c6p2-13", deck: "c6p2", n: "13", d: 2,
    q: "From the Blue Box: what does 'cloistered' mean?",
    a: "Closed off — from the Latin 'claustrum', a closed place." },

  { id: "c6p2-14", deck: "c6p2", n: "14", d: 3,
    q: "Give both the Latin and the English of how Pope St. Gregory signed all his letters.",
    a: "'Servus servorum Dei' — 'Servant of the servants of God'." },

  { id: "c6p2-15", deck: "c6p2", n: "15", d: 2,
    q: "Pope St. Gregory tried to establish a uniform liturgy. What is a uniform liturgy?",
    a: "The same basic prayers, ceremonies and customs used everywhere." },

  { id: "c6p2-16", deck: "c6p2", n: "16", d: 4,
    q: "In your own words, what did Ethelbert's advisor say about the bird flying through the hall?",
    a: "We don't know what is in the darkness outside the hall (the afterlife), but Christianity has an explanation, so we should listen to it." },

  { id: "c6p2-17", deck: "c6p2", n: "17", d: 3,
    q: "Describe the difference between the way Gaelic monks shaved their head compared with the Benedictine monks.",
    a: "Gaelic monks shaved the front and left the hair long at the back (a 'mullet'); Benedictine monks wore a crown tonsure." },

  { id: "c6p2-18", deck: "c6p2", n: "18", d: 3,
    q: "At the Synod of ______ in 664, King ______ of Northumbria called together bishops to decide whether the Church in Britain would follow Gaelic or Roman practices.",
    a: "Whitby · Oswy" },

  { id: "c6p2-19", deck: "c6p2", n: "19", d: 1,
    q: "From the Blue Box: what is a synod?",
    a: "A gathering of local clergy to discuss Church matters." },

  { id: "c6p2-20", deck: "c6p2", n: "20", d: 4,
    q: "Pope Gregory, even in old age, worked ______ hours a day, wrote the ______ (a guidebook for bishops) as well as the ______, to encourage future monks to a life of holiness.",
    a: "14 · Pastoral Rule · Dialogues" }
];
