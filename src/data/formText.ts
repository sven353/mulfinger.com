// Text of the short contact form in the invite band, per page language (v66).
// The full form on /contact stays in English. The Privacy Policy itself is in English, so the
// first-layer summary here is translated and points to it. Sven reviews the wording.
import type { Lang } from './i18n';

export type FormText = {
  req: string;
  name: string; nameErr: string;
  email: string; emailErr: string;
  msg: string; msgPh: string; msgErr: string;
  dp: string;
  dpRows: [string, string][]; // label, text; {owner} and {email} are filled in
  dpMorePre: string; dpMoreLink: string; dpMorePost: string; dpMoreLabel: string;
  consentPre: string; consentLink: string; consentPost: string; consentErr: string;
  note: string; submit: string; sending: string; failure: string;
  okLabel: string; okTitle: string; okBody: string;
  okLinks: [string, string][]; // href, label
  band: string; // the section name in the invite band
  more: [string, string, string]; // text before the link, link text, text after
};

export const formText: Record<Lang, FormText> = {
  en: {
    req: '(required)',
    name: 'Full name', nameErr: 'Please enter your full name.',
    email: 'Email', emailErr: 'Please enter a valid email address.',
    msg: 'What is happening', msgPh: 'What you have tried and what is at stake. A few sentences is enough.', msgErr: 'Please describe it in a sentence or two.',
    dp: 'Basic data protection information',
    dpRows: [
      ['Controller', '{owner}'],
      ['Purpose', 'Answer your message and assess whether we should work together.'],
      ['Legal basis', 'Your consent and steps taken at your request before a possible agreement.'],
      ['Recipients', 'No third parties except processors such as Netlify (hosting, under Standard Contractual Clauses).'],
      ['Rights', 'Access, rectification, erasure, restriction, objection, portability. Write to {email}.'],
    ],
    dpMoreLabel: 'More', dpMorePre: 'See the full ', dpMoreLink: 'Privacy Policy', dpMorePost: '.',
    consentPre: 'I have read the ', consentLink: 'Privacy Policy', consentPost: ' and consent to my data being processed to answer this message.', consentErr: 'Please accept the Privacy Policy to send your message.',
    note: 'I read every message myself. No obligation to continue.',
    submit: 'Start a confidential conversation', sending: 'Sending…', failure: 'Your message could not be sent. Please try again in a moment.',
    okLabel: 'Message received', okTitle: 'Thank you. I will read this myself.', okBody: 'You will hear from me within 24 to 48 hours. If it makes sense, we will arrange a confidential first conversation.',
    okLinks: [['/advisory', 'How engagements work'], ['/#research', 'Read about the research']],
    band: 'A first conversation',
    more: ['Prefer more room to explain? Use the ', 'full contact form', '.'],
  },
  es: {
    req: '(obligatorio)',
    name: 'Nombre y apellidos', nameErr: 'Indique su nombre y apellidos.',
    email: 'Correo electrónico', emailErr: 'Indique un correo electrónico válido.',
    msg: 'Qué está pasando', msgPh: 'Qué ha intentado y qué está en juego. Bastan unas frases.', msgErr: 'Descríbalo en una o dos frases.',
    dp: 'Información básica sobre protección de datos',
    dpRows: [
      ['Responsable', '{owner}'],
      ['Finalidad', 'Responder a su mensaje y valorar si deberíamos trabajar juntos.'],
      ['Legitimación', 'Su consentimiento y la aplicación de medidas precontractuales a petición suya.'],
      ['Destinatarios', 'No se ceden datos a terceros, salvo a encargados del tratamiento como Netlify (alojamiento, con cláusulas contractuales tipo).'],
      ['Derechos', 'Acceso, rectificación, supresión, limitación, oposición y portabilidad. Escriba a {email}.'],
    ],
    dpMoreLabel: 'Más', dpMorePre: 'Consulte la ', dpMoreLink: 'Política de privacidad', dpMorePost: ' completa (en inglés).',
    consentPre: 'He leído la ', consentLink: 'Política de privacidad', consentPost: ' y consiento el tratamiento de mis datos para responder a este mensaje.', consentErr: 'Acepte la Política de privacidad para enviar su mensaje.',
    note: 'Leo personalmente cada mensaje. Sin compromiso.',
    submit: 'Iniciar una conversación confidencial', sending: 'Enviando…', failure: 'No se ha podido enviar su mensaje. Inténtelo de nuevo en unos momentos.',
    okLabel: 'Mensaje recibido', okTitle: 'Gracias. Lo leeré personalmente.', okBody: 'Recibirá mi respuesta en un plazo de 24 a 48 horas. Si tiene sentido, concertaremos una primera conversación confidencial.',
    okLinks: [['/advisory', 'Cómo funciona el asesoramiento (en inglés)'], ['/#research', 'Sobre la investigación (en inglés)']],
    band: 'Una primera conversación',
    more: ['¿Necesita más espacio? Use el ', 'formulario completo', ' (en inglés); puede escribir en español.'],
  },
  de: {
    req: '(Pflichtfeld)',
    name: 'Vor- und Nachname', nameErr: 'Bitte geben Sie Ihren vollständigen Namen ein.',
    email: 'E-Mail', emailErr: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    msg: 'Worum es geht', msgPh: 'Was Sie bereits versucht haben und was auf dem Spiel steht. Ein paar Sätze genügen.', msgErr: 'Bitte beschreiben Sie es in ein oder zwei Sätzen.',
    dp: 'Grundlegende Informationen zum Datenschutz',
    dpRows: [
      ['Verantwortlicher', '{owner}'],
      ['Zweck', 'Ihre Nachricht beantworten und prüfen, ob eine Zusammenarbeit sinnvoll ist.'],
      ['Rechtsgrundlage', 'Ihre Einwilligung und vorvertragliche Maßnahmen auf Ihre Anfrage.'],
      ['Empfänger', 'Keine Weitergabe an Dritte, außer an Auftragsverarbeiter wie Netlify (Hosting, auf Grundlage von Standardvertragsklauseln).'],
      ['Ihre Rechte', 'Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit. Schreiben Sie an {email}.'],
    ],
    dpMoreLabel: 'Mehr', dpMorePre: 'Siehe die vollständige ', dpMoreLink: 'Datenschutzerklärung', dpMorePost: ' (auf Englisch).',
    consentPre: 'Ich habe die ', consentLink: 'Datenschutzerklärung', consentPost: ' gelesen und willige ein, dass meine Daten zur Beantwortung dieser Nachricht verarbeitet werden.', consentErr: 'Bitte akzeptieren Sie die Datenschutzerklärung, um Ihre Nachricht zu senden.',
    note: 'Ich lese jede Nachricht persönlich. Unverbindlich.',
    submit: 'Ein vertrauliches Gespräch beginnen', sending: 'Wird gesendet…', failure: 'Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es gleich noch einmal.',
    okLabel: 'Nachricht erhalten', okTitle: 'Vielen Dank. Ich lese sie persönlich.', okBody: 'Sie hören innerhalb von 24 bis 48 Stunden von mir. Wenn es passt, vereinbaren wir ein vertrauliches erstes Gespräch.',
    okLinks: [['/advisory', 'So funktioniert die Beratung (auf Englisch)'], ['/#research', 'Zur Forschung (auf Englisch)']],
    band: 'Ein erstes Gespräch',
    more: ['Mehr Raum für Ihre Schilderung? Nutzen Sie das ', 'ausführliche Kontaktformular', ' (auf Englisch); Sie können auf Deutsch schreiben.'],
  },
  fr: {
    req: '(obligatoire)',
    name: 'Nom et prénom', nameErr: 'Veuillez indiquer votre nom complet.',
    email: 'E-mail', emailErr: 'Veuillez indiquer une adresse e-mail valide.',
    msg: 'Ce qui se passe', msgPh: 'Ce que vous avez déjà essayé et ce qui est en jeu. Quelques phrases suffisent.', msgErr: 'Décrivez-le en une ou deux phrases.',
    dp: 'Informations de base sur la protection des données',
    dpRows: [
      ['Responsable', '{owner}'],
      ['Finalité', 'Répondre à votre message et évaluer si nous devrions travailler ensemble.'],
      ['Base juridique', 'Votre consentement et des mesures précontractuelles prises à votre demande.'],
      ['Destinataires', 'Aucune communication à des tiers, hormis des sous-traitants comme Netlify (hébergement, encadré par des clauses contractuelles types).'],
      ['Vos droits', 'Accès, rectification, effacement, limitation, opposition, portabilité. Écrivez à {email}.'],
    ],
    dpMoreLabel: 'Plus', dpMorePre: 'Consultez la ', dpMoreLink: 'politique de confidentialité', dpMorePost: ' complète (en anglais).',
    consentPre: 'J’ai lu la ', consentLink: 'politique de confidentialité', consentPost: ' et j’accepte que mes données soient traitées pour répondre à ce message.', consentErr: 'Veuillez accepter la politique de confidentialité pour envoyer votre message.',
    note: 'Je lis personnellement chaque message. Sans engagement.',
    submit: 'Commencer une conversation confidentielle', sending: 'Envoi…', failure: 'Votre message n’a pas pu être envoyé. Veuillez réessayer dans un instant.',
    okLabel: 'Message reçu', okTitle: 'Merci. Je le lirai personnellement.', okBody: 'Vous aurez ma réponse sous 24 à 48 heures. Si cela a du sens, nous conviendrons d’une première conversation confidentielle.',
    okLinks: [['/advisory', 'Comment se déroule l’accompagnement (en anglais)'], ['/#research', 'La recherche (en anglais)']],
    band: 'Une première conversation',
    more: ['Besoin de plus de place ? Utilisez le ', 'formulaire complet', ' (en anglais) ; vous pouvez écrire en français.'],
  },
};
