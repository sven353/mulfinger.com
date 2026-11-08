// Content of the Spanish, German and French landing pages (v66). Written from the confirmed facts on the
// English site only: who-is answer, career, doctorate, IESE, the 1:1 Advisory terms and the figures.
// Register: usted, Sie, vous. Client quotes stay in English, verbatim. Sven reviews every line before launch.
import type { Lang } from './i18n';

type Page = {
  title: string; description: string;
  tag: string; h1: string; lead: string; cta: string; note: string; alt: string;
  who: { note: string; heading: string; paras: string[]; figures: [string, string][] };
  when: { note: string; heading: string; intro: string; items: { t: string; b: string }[] };
  how: { note: string; heading: string; intro?: string; rows: [string, string][]; sequence: string; kuma: [string, string] };
  voices: { note: string; heading: string; intro: string; all: string };
  more: { note: string; heading: string; links: [string, string][] };
  invite: { heading: string; body: string };
};

export const langPages: Record<Exclude<Lang, 'en'>, Page> = {
  es: {
    title: 'Dr. Sven Mulfinger | Asesor independiente para fundadores y CEOs en Barcelona y Madrid',
    description: 'Asesoramiento individual y confidencial para fundadores y CEOs: un criterio independiente para las decisiones que no se pueden delegar. En Barcelona, Madrid y online.',
    tag: 'Dr. Sven Mulfinger · Asesoramiento independiente para fundadores y CEOs',
    h1: 'Un criterio independiente para las decisiones que no puede delegar.',
    lead: 'Cuando la empresa llega a un punto de inflexión, el equipo directivo no consigue ponerse de acuerdo o hay una decisión importante que nadie puede tomar por usted.',
    cta: 'Hablemos de su situación',
    note: 'Leo personalmente cada mensaje. Confidencial y sin compromiso.',
    alt: 'Una conversación de asesoramiento 1:1 junto a la ventana, en una oficina con vistas a la ciudad',
    who: {
      note: 'Quién soy',
      heading: 'He estado al otro lado de la mesa.',
      paras: [
        'Soy asesor independiente de fundadores y CEOs, con base en Barcelona, y socio fundador de Kuma Partners. Llevo veinte años creando y dirigiendo empresas, como emprendedor y como CEO dentro de un gran grupo, y sé lo que supone decidir cuando la responsabilidad final recae sobre uno mismo.',
        'Cofundé trnd en el sur de Europa y, tras la entrada de Gruner + Jahr (Bertelsmann) en su capital, dirigí TERRITORY Influence en Europa occidental y meridional. También cofundé Dana, una plataforma digital de salud mental para mujeres.',
        'Soy doctor ingeniero (Dr.-Ing.) por la Universidad Técnica de Múnich (TUM) y ponente invitado en IESE Business School desde 2014. Trabajo en persona en Barcelona, Madrid, Múnich y Bruselas, y online con clientes de otros países.',
        'No llego con una respuesta preparada. Le ayudo a cuestionar las opciones, entender qué está bloqueando la decisión y encontrar una salida que pueda llevar a la práctica.',
      ],
      figures: [['20', 'años creando y dirigiendo empresas'], ['100+', 'fundadores, directores generales y altos directivos acompañados'], ['4', 'idiomas de trabajo']],
    },
    when: {
      note: 'Cuándo me llaman',
      heading: 'Cuando las decisiones empiezan a atascarse.',
      intro: 'No siempre hace falta una gran crisis para buscar una mirada externa. A veces el problema lleva meses sobre la mesa y nadie consigue resolverlo.',
      items: [
        { t: 'Una decisión que nunca acaba de tomarse', b: 'El problema está claro y se ha discutido varias veces, pero la decisión se pospone. O se toma y, poco después, vuelve a ponerse en cuestión.' },
        { t: 'Un equipo directivo que no consigue avanzar', b: 'Hay buenos profesionales, pero las responsabilidades se solapan y demasiadas decisiones acaban otra vez en su mesa.' },
        { t: 'Una empresa que ha crecido más rápido que su forma de organizarse', b: 'La empresa ya no es la de hace tres años, pero muchas decisiones se siguen tomando como entonces.' },
      ],
    },
    how: {
      note: 'Cómo trabajo',
      heading: 'Asesoramiento individual para fundadores y CEOs.',
      rows: [
        ['Duración', 'Seis o doce meses'],
        ['Sesiones', 'Dos sesiones al mes, de 60 a 90 minutos'],
        ['Dónde', 'Online, o en persona en Barcelona o Madrid'],
        ['Entre sesiones', 'Contacto directo conmigo cuando surge una decisión que no puede esperar'],
        ['Honorarios', 'Se concretan tras la primera conversación, cuando sepamos qué necesita'],
      ],
      sequence: 'Empezamos con una conversación para entender qué está ocurriendo. Si veo que puedo ayudarle, analizamos dónde se están atascando las decisiones y acordamos qué queremos conseguir; al final del periodo revisamos juntos los resultados.',
      kuma: ['Trabajo personalmente con fundadores y CEOs. Cuando el reto requiere intervenir con todo el equipo directivo, lo abordamos desde ', '.'],
    },
    voices: { note: 'Lo que dicen mis clientes', heading: 'Su experiencia, en sus propias palabras.', intro: 'Recomendaciones publicadas por mis clientes en LinkedIn. Se mantienen en su idioma original.', all: 'Todas las recomendaciones (en inglés)' },
    more: {
      note: 'Más información', heading: 'El resto de la web está en inglés.',
      links: [['/advisory', 'Cómo funciona el asesoramiento individual'], ['/about', 'Trayectoria y perspectiva'], ['/#research', 'Investigación y libro'], ['/recommendations', 'Recomendaciones']],
    },
    invite: { heading: 'Cuénteme qué le preocupa.', body: 'Explíqueme brevemente qué está ocurriendo, qué ha intentado hasta ahora y qué necesita resolver. Le responderé personalmente y, si creo que puedo ayudarle, concertaremos una primera conversación confidencial.' },
  },
  de: {
    title: 'Dr. Sven Mulfinger | Unabhängiger Sparringspartner für Gründer und CEOs',
    description: 'Vertrauliches Sparring für Gründer, Geschäftsführer und CEOs, für Entscheidungen, die nur Sie treffen können. Persönlich in Barcelona, Madrid, München und Brüssel, online weltweit.',
    tag: 'Dr. Sven Mulfinger · Unabhängiger Sparringspartner für Gründer und CEOs',
    h1: 'Ein Sparringspartner für Entscheidungen, die nur Sie treffen können.',
    lead: 'Wenn Ihr Unternehmen vor einem Wendepunkt steht, sich Ihr Führungsteam nicht einig wird oder eine Entscheidung ansteht, bei der Sie eine unabhängige Perspektive brauchen.',
    cta: 'Ein vertrauliches Gespräch vereinbaren',
    note: 'Ich lese jede Anfrage persönlich. Unverbindlich und vertraulich.',
    alt: 'Ein vertrauliches 1:1-Beratungsgespräch am Fenster, in einem Büro mit Blick auf die Stadt',
    who: {
      note: 'Über mich',
      heading: 'Ich weiß, wie es ist, selbst die Verantwortung zu tragen.',
      paras: [
        'Seit zwanzig Jahren baue und führe ich Unternehmen, als Gründer und als CEO innerhalb eines internationalen Konzerns. Ich kenne die Entscheidungen, die man nicht einfach weitergeben kann. Und ich weiß, wie hilfreich es ist, jemanden an seiner Seite zu haben, der unabhängig denkt, die richtigen Fragen stellt und auch widerspricht.',
        'Heute begleite ich von Barcelona aus Gründer, Geschäftsführer und CEOs bei wichtigen unternehmerischen Entscheidungen. Daneben bin ich Gründungspartner von Kuma Partners, wo wir mit ganzen Führungsteams arbeiten.',
        'Ich habe trnd in Südeuropa mitgegründet. Nach dem Einstieg von Gruner + Jahr (Bertelsmann) habe ich TERRITORY Influence in West- und Südeuropa geführt. Außerdem habe ich Dana mitgegründet, eine digitale Plattform für die psychische Gesundheit von Frauen.',
        'Ich bin promovierter Ingenieur (Dr.-Ing.) der Technischen Universität München und seit 2014 Gastreferent an der IESE Business School. Persönlich arbeite ich in Barcelona, Madrid, München und Brüssel, online mit Kunden weltweit.',
      ],
      figures: [['20', 'Jahre Erfahrung im Unternehmensaufbau'], ['100+', 'begleitete Gründer und Führungskräfte'], ['4', 'Sprachen: Deutsch, Englisch, Spanisch, Französisch']],
    },
    when: {
      note: 'Wann eine unabhängige Perspektive hilft',
      heading: 'Wenn die üblichen Antworten nicht mehr greifen.',
      intro: 'Manchmal hilft ein Gespräch mit jemandem, der ähnliche Entscheidungen selbst treffen musste und von außen auf die Sache schaut. Drei Situationen begegnen mir besonders häufig.',
      items: [
        { t: 'Eine Entscheidung, die einfach nicht vom Tisch kommt', b: 'Eigentlich ist klar, was entschieden werden muss. Trotzdem wird die Entscheidung vertagt, erneut diskutiert oder kurz nach der Einigung wieder infrage gestellt.' },
        { t: 'Ein Führungsteam, das sich selbst ausbremst', b: 'Die richtigen Leute sind da, und doch kommen wichtige Themen nicht voran. Verantwortlichkeiten überschneiden sich, Entscheidungen bleiben liegen, und am Ende landet vieles wieder bei Ihnen.' },
        { t: 'Ein Unternehmen, das anders geführt werden muss als früher', b: 'Was mit zehn oder zwanzig Mitarbeitern gut funktioniert hat, trägt nicht unbedingt auch bei hundert. Das Unternehmen ist gewachsen, Entscheidungswege und Verantwortlichkeiten haben nicht Schritt gehalten.' },
      ],
    },
    how: {
      note: 'Unsere Zusammenarbeit',
      heading: 'Vertrauliches Sparring für Gründer und CEOs.',
      intro: 'Ich arbeite direkt mit Ihnen, ohne wechselnde Ansprechpartner.',
      rows: [
        ['Dauer', 'Sechs oder zwölf Monate'],
        ['Gespräche', 'Zwei Arbeitssitzungen pro Monat, jeweils 60 bis 90 Minuten'],
        ['Ort', 'Online oder persönlich in Barcelona oder Madrid'],
        ['Zwischen den Terminen', 'Wenn eine wichtige Entscheidung nicht warten kann, bin ich direkt erreichbar'],
        ['Honorar', 'Vereinbaren wir, sobald klar ist, worum es geht'],
      ],
      sequence: 'Am Anfang steht ein vertrauliches Gespräch: was Sie beschäftigt, wo Sie nicht weiterkommen und was Sie bereits versucht haben. Wenn wir beide eine Zusammenarbeit für sinnvoll halten, schauen wir zuerst, wo Entscheidungen ins Stocken geraten, vereinbaren den Rahmen und legen fest, woran wir Fortschritte erkennen. Am Ende der Laufzeit ziehen wir gemeinsam Bilanz.',
      kuma: ['Als Sparringspartner arbeite ich persönlich mit Gründern und CEOs. Wenn es darum geht, ein ganzes Führungsteam auszurichten oder Veränderungen im Unternehmen umzusetzen, übernehmen wir das über ', '.'],
    },
    voices: { note: 'Was meine Kunden sagen', heading: 'In ihren eigenen Worten.', intro: 'Die Aussagen stammen aus Empfehlungen auf LinkedIn. Ich habe sie im englischen Original belassen.', all: 'Alle 14 Empfehlungen lesen (auf Englisch)' },
    more: {
      note: 'Mehr über meine Arbeit', heading: 'Die weiteren Seiten sind auf Englisch.',
      links: [['/advisory', 'Wie ich arbeite'], ['/about', 'Mein Werdegang'], ['/#research', 'Forschung und Buch'], ['/recommendations', 'Empfehlungen meiner Kunden']],
    },
    invite: { heading: 'Was beschäftigt Sie gerade?', body: 'Vielleicht steht eine Entscheidung an, bei der Sie eine zweite Perspektive brauchen, oder Sie kommen mit Ihrem Führungsteam nicht weiter. Schreiben Sie mir kurz, worum es geht. Ich antworte Ihnen persönlich, und gemeinsam finden wir heraus, ob und wie ich Sie unterstützen kann.' },
  },
  fr: {
    title: 'Dr. Sven Mulfinger | Conseiller stratégique pour fondateurs et dirigeants',
    description: 'Accompagnement confidentiel 1:1 pour fondateurs et CEO : un interlocuteur pour les décisions qui ne se délèguent pas. En personne à Barcelone, Madrid, Munich et Bruxelles et en ligne, en français, anglais, allemand et espagnol.',
    tag: 'Dr. Sven Mulfinger · Conseil confidentiel pour fondateurs et CEO',
    h1: 'Un interlocuteur pour les décisions que vous ne pouvez pas déléguer.',
    lead: 'Pour les moments qui pèsent le plus : un tournant pour l’entreprise, des frictions au sein du comité de direction ou une décision que vous seul pouvez prendre.',
    cta: 'Commencer une conversation confidentielle',
    note: 'Je lis personnellement chaque message. Sans engagement.',
    alt: 'Une conversation de conseil 1:1 près de la fenêtre, dans un bureau qui donne sur la ville',
    who: {
      note: 'Qui je suis',
      heading: 'J’ai occupé ce siège moi-même.',
      paras: [
        'Je suis conseiller indépendant de dirigeants, basé à Barcelone, et associé fondateur de Kuma Partners. Je travaille avec des fondateurs, des CEO et leurs équipes de direction sur des décisions lourdes de conséquences, les frictions au sein du comité de direction et les tournants de l’entreprise.',
        'Depuis vingt ans, je crée des entreprises, comme fondateur et comme CEO au sein d’un groupe. J’ai cofondé trnd en Europe du Sud, dont Gruner + Jahr (Bertelsmann) a pris une participation en 2014 puis la majorité en 2016, avant de diriger TERRITORY Influence pour l’Europe de l’Ouest et du Sud et de cofonder Dana, une plateforme numérique de santé mentale pour les femmes.',
        'Je suis docteur ingénieur (Dr.-Ing.) de l’Université technique de Munich (TUM) et intervenant invité à l’IESE Business School depuis 2014. Je travaille en personne à Barcelone, Madrid, Munich et Bruxelles, et en ligne partout dans le monde.',
      ],
      figures: [['20', 'ans à créer des entreprises'], ['100+', 'fondateurs, directeurs généraux et dirigeants accompagnés'], ['4', 'langues de travail']],
    },
    when: {
      note: 'Quand on m’appelle',
      heading: 'Quand les réponses habituelles ne suffisent plus.',
      intro: 'La plupart des fondateurs et CEO qui me contactent arrivent avec l’une de ces trois situations.',
      items: [
        { t: 'Une décision qui revient sans cesse', b: 'Tout le monde comprend le problème, mais la décision est reportée, diluée ou remise en cause.' },
        { t: 'Une équipe de direction devenue le goulot d’étranglement', b: 'Des personnes compétentes, des responsabilités qui se chevauchent et trop de décisions qui reviennent sur votre bureau.' },
        { t: 'Une entreprise qui a dépassé votre façon de la diriger', b: 'L’activité a grandi, mais la manière de prendre et de partager les décisions n’a pas suivi.' },
      ],
    },
    how: {
      note: 'Comment cela fonctionne',
      heading: 'Conseil exécutif 1:1.',
      rows: [
        ['Durée', '6 ou 12 mois'],
        ['Séances', 'Deux séances de travail de 60 à 90 minutes par mois'],
        ['Lieu', 'En ligne, ou en personne à Barcelone ou Madrid'],
        ['Entre les séances', 'Un accès direct et prioritaire par téléphone ou message quand une décision ne peut pas attendre'],
        ['Honoraires', 'Communiqués après la première conversation, une fois le périmètre clarifié'],
      ],
      sequence: 'Nous commençons par une conversation confidentielle. Si je peux vous aider, nous analysons d’abord où les décisions se bloquent et ce que nous voulons obtenir ; en fin de période, nous faisons le bilan ensemble.',
      kuma: ['Je travaille personnellement avec les fondateurs et les CEO. Quand l’enjeu concerne toute l’équipe de direction, nous l’abordons avec ', '.'],
    },
    voices: { note: 'Ce que disent les clients', heading: 'Dans leurs propres mots.', intro: 'Extraits de recommandations LinkedIn, en anglais, telles qu’elles ont été écrites.', all: 'Les quatorze recommandations (en anglais)' },
    more: {
      note: 'En savoir plus', heading: 'Le reste du site est en anglais.',
      links: [['/advisory', 'Comment se déroule le conseil 1:1'], ['/about', 'Parcours et regard'], ['/#research', 'Recherche et livre'], ['/recommendations', 'Recommandations']],
    },
    invite: { heading: 'Apportez le problème que vous n’avez pas encore pu résoudre.', body: 'Dites-moi ce qui se passe, ce que vous avez essayé et ce qui est en jeu. Nous verrons ensemble si travailler avec moi ferait la différence.' },
  },
};
