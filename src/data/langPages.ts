// Content of the Spanish, German and French landing pages (v66). Written from the confirmed facts on the
// English site only: who-is answer, career, doctorate, IESE, the 1:1 Advisory terms and the figures.
// Register: usted, Sie, vous. Client quotes stay in English, verbatim. Sven reviews every line before launch.
import type { Lang } from './i18n';

type Page = {
  title: string; description: string;
  tag: string; h1: string; lead: string; cta: string; note: string; alt: string;
  who: { note: string; heading: string; paras: string[]; figures: [string, string][] };
  when: { note: string; heading: string; intro: string; items: { t: string; b: string }[] };
  how: { note: string; heading: string; rows: [string, string][]; sequence: string };
  voices: { note: string; heading: string; intro: string; all: string };
  more: { note: string; heading: string; links: [string, string][] };
  invite: { heading: string; body: string };
};

export const langPages: Record<Exclude<Lang, 'en'>, Page> = {
  es: {
    title: 'Dr. Sven Mulfinger | Asesor estratégico para fundadores y CEOs en Barcelona y Madrid',
    description: 'Asesoramiento confidencial 1:1 para fundadores y CEOs: un interlocutor para las decisiones que no se pueden delegar. En Barcelona, Madrid y online, en español, inglés, alemán y francés.',
    tag: 'Dr. Sven Mulfinger · Asesoramiento confidencial para fundadores y CEOs',
    h1: 'Un interlocutor para las decisiones que no puede delegar.',
    lead: 'Para los momentos de más peso: un punto de inflexión en la empresa, fricción en el comité de dirección o una decisión que solo usted puede tomar.',
    cta: 'Iniciar una conversación confidencial',
    note: 'Leo personalmente cada mensaje. Sin compromiso.',
    alt: 'Una conversación de asesoramiento 1:1 junto a la ventana, en una oficina con vistas a la ciudad',
    who: {
      note: 'Quién soy',
      heading: 'He ocupado ese mismo asiento.',
      paras: [
        'Soy asesor ejecutivo independiente en Barcelona y Founding Partner de Kuma Partners. Trabajo con fundadores, CEOs y sus equipos directivos en decisiones de gran calado, fricciones en el comité de dirección y momentos de cambio en la empresa.',
        'Llevo veinte años creando empresas, como fundador y como CEO dentro de un grupo corporativo. Cofundé trnd en el sur de Europa, en la que Gruner + Jahr (Bertelsmann) tomó una participación en 2014 y la mayoría del capital en 2016; después dirigí TERRITORY Influence para Europa occidental y del sur y cofundé Dana, una plataforma digital de salud mental para mujeres.',
        'Soy doctor ingeniero (Dr.-Ing.) por la Technische Universität München y ponente invitado en IESE Business School desde 2014. Trabajo en persona en Barcelona, Madrid, Múnich y Bruselas y online en todo el mundo.',
      ],
      figures: [['20', 'años creando empresas'], ['100+', 'fundadores, directores generales y altos directivos acompañados'], ['4', 'idiomas de trabajo']],
    },
    when: {
      note: 'Cuándo me llaman',
      heading: 'Cuando las respuestas habituales dejan de funcionar.',
      intro: 'La mayoría de los fundadores y CEOs que me contactan llegan con una de estas tres situaciones.',
      items: [
        { t: 'Una decisión que siempre vuelve', b: 'Todos entienden el problema, pero la decisión se aplaza, se diluye o se revierte.' },
        { t: 'Un equipo directivo que se ha convertido en el cuello de botella', b: 'Personas capaces, responsabilidades solapadas y demasiadas decisiones que siguen volviendo a su mesa.' },
        { t: 'Una empresa que ha superado su forma de dirigirla', b: 'El negocio ha crecido, pero la manera de tomar y compartir decisiones no ha cambiado con él.' },
      ],
    },
    how: {
      note: 'Cómo funciona',
      heading: 'Asesoramiento ejecutivo 1:1.',
      rows: [
        ['Duración', '6 o 12 meses'],
        ['Sesiones', 'Dos sesiones de trabajo de 60 a 90 minutos al mes'],
        ['Dónde', 'Online, o en persona en Barcelona o Madrid'],
        ['Entre sesiones', 'Acceso directo y prioritario por voz o mensaje cuando una decisión no puede esperar'],
        ['Honorarios', 'Se comparten tras la primera conversación, una vez claro el alcance'],
      ],
      sequence: 'Empezamos con una conversación confidencial. Si tiene sentido, analizamos la situación en un breve Strategic Friction Diagnostic antes de firmar nada; después siguen las sesiones y, al final del periodo, una revisión conjunta de los resultados.',
    },
    voices: { note: 'Lo que dicen los clientes', heading: 'En sus propias palabras.', intro: 'Extractos de recomendaciones en LinkedIn, en inglés, tal como las escribieron.', all: 'Las catorce recomendaciones (en inglés)' },
    more: {
      note: 'Más información', heading: 'El resto de la web está en inglés.',
      links: [['/advisory', 'Cómo funciona el asesoramiento 1:1'], ['/about', 'Trayectoria y perspectiva'], ['/#research', 'Investigación y libro'], ['/recommendations', 'Recomendaciones']],
    },
    invite: { heading: 'Traiga el problema que aún no ha podido resolver.', body: 'Cuénteme qué está pasando, qué ha intentado y qué está en juego. Veremos juntos si trabajar conmigo marcaría la diferencia.' },
  },
  de: {
    title: 'Dr. Sven Mulfinger | Strategischer Sparringspartner für Gründer und CEOs',
    description: 'Vertrauliche 1:1-Beratung für Gründer und CEOs: ein Sparringspartner für die Entscheidungen, die sich nicht delegieren lassen. Persönlich in Barcelona, Madrid, München und Brüssel und online, auf Deutsch, Englisch, Spanisch und Französisch.',
    tag: 'Dr. Sven Mulfinger · Vertrauliche Beratung für Gründer und CEOs',
    h1: 'Ein Sparringspartner für die Entscheidungen, die Sie nicht delegieren können.',
    lead: 'Für die Momente, die am schwersten wiegen: ein Wendepunkt für das Unternehmen, Reibung im Führungsteam oder eine Entscheidung, die nur Sie treffen können.',
    cta: 'Ein vertrauliches Gespräch beginnen',
    note: 'Ich lese jede Nachricht persönlich. Unverbindlich.',
    alt: 'Ein vertrauliches 1:1-Beratungsgespräch am Fenster, in einem Büro mit Blick auf die Stadt',
    who: {
      note: 'Wer ich bin',
      heading: 'Ich saß selbst auf diesem Stuhl.',
      paras: [
        'Ich bin unabhängiger Berater für Geschäftsführer und CEOs mit Sitz in Barcelona und Founding Partner von Kuma Partners. Ich arbeite mit Gründern, CEOs und ihren Führungsteams an folgenreichen Entscheidungen, an Reibung im Führungsteam und an Wendepunkten für das Unternehmen.',
        'Seit zwanzig Jahren baue ich Unternehmen auf, als Gründer und als CEO innerhalb eines Konzerns. Ich habe trnd in Südeuropa mitgegründet, an dem Gruner + Jahr (Bertelsmann) 2014 eine Beteiligung und 2016 die Mehrheit übernahm, danach TERRITORY Influence für West- und Südeuropa geleitet und Dana mitgegründet, eine digitale Plattform für die psychische Gesundheit von Frauen.',
        'Ich bin promovierter Ingenieur (Dr.-Ing.) der Technischen Universität München und seit 2014 Gastreferent an der IESE Business School. Persönlich arbeite ich in Barcelona, Madrid, München und Brüssel, online weltweit.',
      ],
      figures: [['20', 'Jahre Unternehmensaufbau'], ['100+', 'begleitete Gründer, Geschäftsführer und C-Level-Führungskräfte'], ['4', 'Arbeitssprachen']],
    },
    when: {
      note: 'Wann man mich anruft',
      heading: 'Wenn die üblichen Antworten nicht mehr greifen.',
      intro: 'Die meisten Gründer und CEOs, die sich bei mir melden, stecken in einer dieser drei Situationen.',
      items: [
        { t: 'Eine Entscheidung, die immer wiederkommt', b: 'Alle verstehen das Problem, und doch wird die Entscheidung vertagt, verwässert oder zurückgenommen.' },
        { t: 'Ein Führungsteam, das zum Engpass geworden ist', b: 'Fähige Leute, sich überschneidende Verantwortlichkeiten und zu viele Entscheidungen, die wieder auf Ihrem Tisch landen.' },
        { t: 'Ein Unternehmen, das Ihrer Art zu führen entwachsen ist', b: 'Das Geschäft ist gewachsen, aber die Art, wie Entscheidungen getroffen und geteilt werden, ist dieselbe geblieben.' },
      ],
    },
    how: {
      note: 'So funktioniert es',
      heading: '1:1 Executive Advisory.',
      rows: [
        ['Laufzeit', '6 oder 12 Monate'],
        ['Sitzungen', 'Zwei Arbeitssitzungen von 60 bis 90 Minuten pro Monat'],
        ['Ort', 'Online oder persönlich in Barcelona oder Madrid'],
        ['Zwischen den Sitzungen', 'Direkter, priorisierter Zugang per Telefon oder Nachricht, wenn eine Entscheidung nicht warten kann'],
        ['Honorar', 'Nach dem ersten Gespräch, sobald der Umfang klar ist'],
      ],
      sequence: 'Wir beginnen mit einem vertraulichen Gespräch. Wenn es passt, analysieren wir die Lage in einer kurzen Strategic Friction Diagnostic, bevor etwas unterschrieben wird; danach folgen die Arbeitssitzungen und am Ende der Laufzeit eine gemeinsame Bilanz.',
    },
    voices: { note: 'Was Klienten sagen', heading: 'In ihren eigenen Worten.', intro: 'Auszüge aus LinkedIn-Empfehlungen, auf Englisch, so wie sie geschrieben wurden.', all: 'Alle vierzehn Empfehlungen (auf Englisch)' },
    more: {
      note: 'Mehr erfahren', heading: 'Der Rest der Website ist auf Englisch.',
      links: [['/advisory', 'So funktioniert die 1:1-Beratung'], ['/about', 'Werdegang und Perspektive'], ['/#research', 'Forschung und Buch'], ['/recommendations', 'Empfehlungen']],
    },
    invite: { heading: 'Bringen Sie das Problem mit, das Sie noch nicht lösen konnten.', body: 'Erzählen Sie mir, was los ist, was Sie bereits versucht haben und was auf dem Spiel steht. Gemeinsam klären wir, ob eine Zusammenarbeit den Unterschied machen würde.' },
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
        'Je suis conseiller indépendant de dirigeants, basé à Barcelone, et Founding Partner de Kuma Partners. Je travaille avec des fondateurs, des CEO et leurs équipes de direction sur des décisions lourdes de conséquences, les frictions au sein du comité de direction et les tournants de l’entreprise.',
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
      sequence: 'Nous commençons par une conversation confidentielle. Si cela a du sens, nous analysons la situation lors d’un court Strategic Friction Diagnostic avant toute signature ; viennent ensuite les séances de travail et, en fin de période, un bilan commun.',
    },
    voices: { note: 'Ce que disent les clients', heading: 'Dans leurs propres mots.', intro: 'Extraits de recommandations LinkedIn, en anglais, telles qu’elles ont été écrites.', all: 'Les quatorze recommandations (en anglais)' },
    more: {
      note: 'En savoir plus', heading: 'Le reste du site est en anglais.',
      links: [['/advisory', 'Comment se déroule le conseil 1:1'], ['/about', 'Parcours et regard'], ['/#research', 'Recherche et livre'], ['/recommendations', 'Recommandations']],
    },
    invite: { heading: 'Apportez le problème que vous n’avez pas encore pu résoudre.', body: 'Dites-moi ce qui se passe, ce que vous avez essayé et ce qui est en jeu. Nous verrons ensemble si travailler avec moi ferait la différence.' },
  },
};
