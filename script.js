/* ==========================================================================
   ST. JAMES INSTITUTE — VOCATIONAL TEST — script.js (bilingual, v2)
   --------------------------------------------------------------------------
   Same 3-method design as v1 (MBTI = identity only, Big Five 70% + Holland
   30% = career score), now adapted to the new bilingual index.html:
     - UI dictionary (UI.en / UI.es) drives every data-i18n / -ph / -aria
       element, plus the strings the engine generates at runtime.
     - All descriptive content (career catalog, MBTI types, Big Five,
       Holland) exists in both languages, keyed by the SAME structural
       indices, so the scoring data (perfilesIdeales) is shared and never
       duplicated.
     - cambiarIdioma(lang) swaps the active language, re-applies the
       dictionary, and re-renders every screen already on the page.
   ========================================================================== */

const CONFIG = {
    PREGUNTAS_POR_PAGINA: 5,
    TOTAL_PREGUNTAS: 100,
    TOTAL_BLOQUES: 5,
    PESO_PERSONALIDAD: 0.70,
    PESO_HOLLAND: 0.30,
    UMBRAL_CONTRADICCION: 30,
    UMBRAL_MBTI_BIGFIVE: 20,
    NIVEL_ALTO: 60,
    NIVEL_BAJO: 40,
    // Compatibility level badges for the Top 5 (provisional cut points —
    // Psychology should calibrate these against a real student sample)
    NIVEL_MUY_ALTA: 70,
    NIVEL_ALTA: 55,
    MIN_OPCIONES_HOLLAND: 2,
    MAX_OPCIONES_HOLLAND: 3,
    CLAVE_STORAGE: "sjisga_vocational_test_v3"
};

const ORDEN_RIASEC = ["R", "I", "A", "S", "E", "C"];
const ORDEN_BIGFIVE = ["OPE", "CON", "EXT", "AGR", "EST"];
const COLUMNAS_PERFIL = ["R", "I", "A", "S", "E", "C", "OPE", "CON", "EXT", "AGR", "EST"];
const ORDEN_DICOTOMIAS = ["EI", "SN", "TF", "JP"];

// ==========================================================================
// BILINGUAL UI DICTIONARY
// Keys matching data-i18n / data-i18n-ph / data-i18n-aria in index.html,
// plus "rt.*" keys used only internally by script.js (dynamic strings that
// have no fixed spot in the HTML: progress text, validation messages,
// search results, cross-validation notes, block names, print title).
// ==========================================================================
const UI = {
en: {
"skip": "Skip to content",
"nav.home": "Home", "nav.catalog": "Career Catalog", "nav.methods": "Test Methods",
"nav.test": "Start Test", "nav.results": "Results", "nav.burger": "Open menu",
"hero.title": "Discover Your Professional Future",
"hero.sub": "Answer 100 questions and find the careers that fit you best.",
"hero.cta": "Start test",
"hero.chip1": "Your personality type (MBTI)", "hero.chip2": "Your personality traits (Big Five)", "hero.chip3": "Your interests (Holland)",
"cat.title": "Complete Career Catalog",
"cat.desc": "Explore technical-professional and public safety careers. Click any career to see what it involves, the skills you need and the subjects in the entrance exam.",
"cat.search": "Search by career, faculty or keyword...", "cat.searchLabel": "Search careers",
"mbti.title": "The 16 Personality Types",
"mbti.desc": "Myers-Briggs (MBTI) places you in one of 16 personality types, built from four pairs of opposite styles. Here's what each pair measures:",
"mbti.desc2": "Click a card below to see the full profile for each of the 16 types.",
"mbti.next": "Next: Big Five \u203a",
"dic.EI.pos": "Extraversion", "dic.EI.neg": "Introversion",
"dic.EI.texto": "Where you get your energy from: people and movement, or being alone and reflecting.",
"dic.SN.pos": "Intuition", "dic.SN.neg": "Sensing",
"dic.SN.texto": "How you process information: through possibilities and ideas, or concrete data and facts.",
"dic.TF.pos": "Feeling", "dic.TF.neg": "Thinking",
"dic.TF.texto": "How you decide: prioritizing how people feel, or prioritizing logic and facts.",
"dic.JP.pos": "Judging", "dic.JP.neg": "Perceiving",
"dic.JP.texto": "How you organize your life: with plans and structure, or with flexibility and improvisation.",
"bf.title": "The Big Five Model",
"bf.note": "Instead of putting you in one type, the Big Five shows how strong each of five traits is in you, from 0 to 100%. No score is good or bad. A high or low score is just a different style.",
"bf.desc": "Click a card to see what the trait measures, what a high and a low score mean, and which careers value it most.",
"bf.next": "Next: Holland (RIASEC) \u203a",
"ho.title": "The Holland (RIASEC) Model",
"ho.note": "MBTI and Big Five describe who you are. Holland shows what you enjoy doing, so it checks your result against real activities.",
"ho.desc": "Click a card to see that interest type, the activities it enjoys and related careers from our catalog.",
"ho.next": "Start the test \u203a",
"test.prev": "Previous", "test.next": "Next", "test.finish": "Finish test",
"res.emptyTitle": "No results yet",
"res.emptyText": "Take the test to see your personality type, your traits, your interests and your Top 5 careers here.",
"res.intro": "Your result comes from three methods. Your personality type helps you know yourself. Your Big Five traits and your Holland interests are compared with each of our 63 careers to build your Top 5.",
"res.mbtiExplain": "This method shows how you like to think, decide and deal with people. Each bar shows where you fall between two opposite styles. It helps you know yourself, but it does not change your career ranking.",
"res.bfBadge": "Big Five: your personality traits",
"res.bfExplain": "This method measures five parts of your personality. A higher percentage means that trait shows up more in you. It is the main part of your career match.",
"res.hoBadge": "Holland (RIASEC): your interests",
"res.hoExplain": "This method shows what kind of activities you enjoy most. The bars show how much each of the six interest types appeared in your answers to the 20 scenarios.",
"res.howTitle": "How your careers are chosen",
"res.howText": "We compare your personality traits and your interests with the ideal profile of each of the 63 careers. Personality counts for 70% and interests for 30%. Your Myers-Briggs type is only there to help you know yourself.",
"res.topTitle": "Your Top 5 Careers",
"res.topSub": "The careers that fit you best. Each one shows its compatibility percentage and a level: Very high, High or Medium.",
"res.note": "This result is a guide to help you think about your future. It is not a diagnosis or a promise of success in any career. The questions have not yet been tested with a large group of students.",
"res.retake": "Retake the test", "res.print": "Print / Save as PDF",
"footer": "Vocational Test",
"mod.related": "Related careers", "close": "Close",
"mod.high": "A high score means\u2026", "mod.low": "A low score means\u2026", "mod.bfCareers": "Careers where this trait matters most",
"mod.activities": "Activities this type enjoys", "mod.hoCareers": "Related careers from our catalog",
"mod.skills": "Skills and aptitudes that help", "mod.exam": "Subjects in the entrance exam", "mod.vector": "Career area",
// runtime
"rt.blockPersonality": "Personality \u2014 Myers-Briggs & Big Five",
"rt.blockHolland": "Practical scenarios \u2014 Holland (RIASEC)",
"rt.blockOf": "Block", "rt.of": "of", "rt.completed": "completed",
"rt.likertAgree": "Agree", "rt.likertDisagree": "Disagree",
"rt.likert7": "Strongly agree", "rt.likert6": "Agree", "rt.likert5": "Slightly agree", "rt.likert4": "Neutral",
"rt.likert3": "Slightly disagree", "rt.likert2": "Disagree", "rt.likert1": "Strongly disagree",
"rt.likertInstructions": "Rate how well each statement describes you. There are no right or wrong answers, so answer honestly rather than as you think you should.",
"rt.scenarioInstructions": "Read each situation and choose the 2 or 3 options that best describe what you would actually do.",
"rt.scenarioHint": "Choose the 2 or 3 options that best describe what you would do.",
"rt.scenarioLabel": "Scenario", "rt.scenarioOf": "of 20.",
"rt.optionsSelected": "Options selected on this page:", "rt.scenariosComplete": "Scenarios complete:",
"rt.alertScenarios": "Please choose 2 or 3 options in each highlighted scenario before continuing.",
"rt.alertQuestion": "Please answer the highlighted question before continuing.",
"rt.alertQuestions": "Please answer the highlighted questions before continuing.",
"rt.searchFoundOne": "career found for", "rt.searchFoundMany": "careers found for",
"rt.searchTotal": "careers available in the catalog",
"rt.searchNone1": "We couldn't find any careers matching \u201c", "rt.searchNone2": "\u201d. Try a different keyword.",
"rt.examSubjects": "Entrance exam subjects:", "rt.seeAllCareers": "See the complete career catalog.",
"rt.vectorLinkedTo": "shares affinity with careers that require",
"rt.careersAnalyzed": "careers analyzed",
"rt.alsoOfferedAs": "Also offered as:",
"rt.personalityFit": "Personality fit", "rt.interestsFit": "Interests fit",
"rt.levelVeryHigh": "Very high", "rt.levelHigh": "High", "rt.levelMedium": "Medium",
"rt.crossOk": "Cross-validation:", "rt.crossOkText": "your personality profile (Big Five) and your practical interests (Holland) point in the same direction for your recommended careers, and your Myers-Briggs type is consistent with your Big Five traits. This strengthens the result.",
"rt.crossTitle": "Cross-validation notes",
"rt.crossGapPrefix": "your", "rt.crossGapMid": "points toward this career much more than your", "rt.crossGapSuffix": "do", "rt.crossGapNote": "It is common and does not invalidate the result: it can mean the idea attracts you but your natural style is different.",
"rt.tPersonality": "personality", "rt.tInterests": "practical interests",
"rt.consistencyTitle": "Consistency check:", "rt.consistencyText": "two of your results describe the same trait but lean in different directions \u2014", "rt.consistencyEnd": "This is normal: MBTI puts you in a fixed category, while Big Five measures a continuous scale, so a score near the middle can fall on either side.",
"rt.yourNextInterest": "Your next strongest interest is", "rt.yourNextInterests": "Your next strongest interests are",
"rt.resetConfirm": "Retake the test? Your current answers and results will be erased.",
"rt.printTitle": "Vocational Test Results", "rt.printFrom": "St. James Institute",
"rt.noscriptTitle": "JavaScript is required",
"rt.noscriptText": "This vocational test needs JavaScript enabled in your browser to load the questions and calculate your results. Please enable it and reload the page.",
"rt.aboutTraitFallback": "See the complete career catalog."
},
es: {
"skip": "Ir al contenido",
"nav.home": "Inicio", "nav.catalog": "Cat\u00e1logo de Carreras", "nav.methods": "M\u00e9todos del Test",
"nav.test": "Iniciar Test", "nav.results": "Resultados", "nav.burger": "Abrir men\u00fa",
"hero.title": "Descubr\u00ed tu Futuro Profesional",
"hero.sub": "Respond\u00e9 100 preguntas y encontr\u00e1 las carreras que mejor se ajustan a vos.",
"hero.cta": "Iniciar test",
"hero.chip1": "Tu tipo de personalidad (MBTI)", "hero.chip2": "Tus rasgos de personalidad (Big Five)", "hero.chip3": "Tus intereses (Holland)",
"cat.title": "Cat\u00e1logo Completo de Carreras",
"cat.desc": "Explor\u00e1 carreras t\u00e9cnico-profesionales y de seguridad p\u00fablica. Hac\u00e9 clic en cualquier carrera para ver de qu\u00e9 se trata, las aptitudes que necesit\u00e1s y las materias del examen de ingreso.",
"cat.search": "Busc\u00e1 por carrera, facultad o palabra clave...", "cat.searchLabel": "Buscar carreras",
"mbti.title": "Los 16 Tipos de Personalidad",
"mbti.desc": "Myers-Briggs (MBTI) te ubica en uno de 16 tipos de personalidad, construido a partir de cuatro pares de estilos opuestos. Esto es lo que mide cada par:",
"mbti.desc2": "Hac\u00e9 clic en una tarjeta de abajo para ver el perfil completo de cada uno de los 16 tipos.",
"mbti.next": "Siguiente: Big Five \u203a",
"dic.EI.pos": "Extroversi\u00f3n", "dic.EI.neg": "Introversi\u00f3n",
"dic.EI.texto": "De d\u00f3nde sac\u00e1s energ\u00eda: de la gente y el movimiento, o de estar solo y reflexionar.",
"dic.SN.pos": "Intuici\u00f3n", "dic.SN.neg": "Sensaci\u00f3n",
"dic.SN.texto": "C\u00f3mo proces\u00e1s la informaci\u00f3n: por posibilidades e ideas, o por datos concretos y hechos.",
"dic.TF.pos": "Sentimiento", "dic.TF.neg": "Pensamiento",
"dic.TF.texto": "C\u00f3mo decid\u00eds: priorizando c\u00f3mo se siente la gente, o priorizando la l\u00f3gica y los hechos.",
"dic.JP.pos": "Juicio", "dic.JP.neg": "Percepci\u00f3n",
"dic.JP.texto": "C\u00f3mo organiz\u00e1s tu vida: con planes y estructura, o con flexibilidad e improvisaci\u00f3n.",
"bf.title": "El Modelo Big Five",
"bf.note": "En vez de ubicarte en un solo tipo, el Big Five muestra qu\u00e9 tan presente est\u00e1 cada uno de cinco rasgos en vos, de 0 a 100%. Ning\u00fan puntaje es bueno ni malo. Un puntaje alto o bajo es solo un estilo distinto.",
"bf.desc": "Hac\u00e9 clic en una tarjeta para ver qu\u00e9 mide el rasgo, qu\u00e9 significa un puntaje alto y uno bajo, y qu\u00e9 carreras lo valoran m\u00e1s.",
"bf.next": "Siguiente: Holland (RIASEC) \u203a",
"ho.title": "El Modelo Holland (RIASEC)",
"ho.note": "MBTI y Big Five describen c\u00f3mo sos. Holland muestra qu\u00e9 te gusta hacer, as\u00ed que contrasta tu resultado con actividades reales.",
"ho.desc": "Hac\u00e9 clic en una tarjeta para ver ese tipo de inter\u00e9s, las actividades que disfruta y carreras relacionadas de nuestro cat\u00e1logo.",
"ho.next": "Comenzar el test \u203a",
"test.prev": "Anterior", "test.next": "Siguiente", "test.finish": "Finalizar test",
"res.emptyTitle": "A\u00fan no hay resultados",
"res.emptyText": "Hac\u00e9 el test para ver ac\u00e1 tu tipo de personalidad, tus rasgos, tus intereses y tu Top 5 de carreras.",
"res.intro": "Tu resultado surge de tres m\u00e9todos. Tu tipo de personalidad te ayuda a conocerte. Tus rasgos Big Five y tus intereses Holland se comparan con cada una de nuestras 63 carreras para armar tu Top 5.",
"res.mbtiExplain": "Este m\u00e9todo muestra c\u00f3mo te gusta pensar, decidir y relacionarte con las personas. Cada barra muestra d\u00f3nde te ubic\u00e1s entre dos estilos opuestos. Te ayuda a conocerte, pero no cambia tu ranking de carreras.",
"res.bfBadge": "Big Five: tus rasgos de personalidad",
"res.bfExplain": "Este m\u00e9todo mide cinco partes de tu personalidad. Un porcentaje m\u00e1s alto significa que ese rasgo aparece m\u00e1s en vos. Es la parte principal de tu compatibilidad con las carreras.",
"res.hoBadge": "Holland (RIASEC): tus intereses",
"res.hoExplain": "Este m\u00e9todo muestra qu\u00e9 tipo de actividades disfrut\u00e1s m\u00e1s. Las barras muestran cu\u00e1nto apareci\u00f3 cada uno de los seis tipos de inter\u00e9s en tus respuestas a los 20 escenarios.",
"res.howTitle": "C\u00f3mo se eligen tus carreras",
"res.howText": "Comparamos tus rasgos de personalidad y tus intereses con el perfil ideal de cada una de las 63 carreras. La personalidad cuenta 70% y los intereses 30%. Tu tipo Myers-Briggs est\u00e1 ah\u00ed solo para ayudarte a conocerte.",
"res.topTitle": "Tu Top 5 de Carreras",
"res.topSub": "Las carreras que mejor se ajustan a vos. Cada una muestra su porcentaje de compatibilidad y un nivel: Muy alta, Alta o Media.",
"res.note": "Este resultado es una gu\u00eda para ayudarte a pensar tu futuro. No es un diagn\u00f3stico ni una promesa de \u00e9xito en ninguna carrera. Las preguntas todav\u00eda no fueron probadas con un grupo grande de estudiantes.",
"res.retake": "Volver a hacer el test", "res.print": "Imprimir / Guardar en PDF",
"footer": "Test Vocacional",
"mod.related": "Carreras relacionadas", "close": "Cerrar",
"mod.high": "Un puntaje alto significa\u2026", "mod.low": "Un puntaje bajo significa\u2026", "mod.bfCareers": "Carreras donde este rasgo importa m\u00e1s",
"mod.activities": "Actividades que disfruta este tipo", "mod.hoCareers": "Carreras relacionadas de nuestro cat\u00e1logo",
"mod.skills": "Aptitudes y habilidades que ayudan", "mod.exam": "Materias del examen de ingreso", "mod.vector": "\u00c1rea vocacional",
// runtime
"rt.blockPersonality": "Personalidad \u2014 Myers-Briggs y Big Five",
"rt.blockHolland": "Escenarios pr\u00e1cticos \u2014 Holland (RIASEC)",
"rt.blockOf": "Bloque", "rt.of": "de", "rt.completed": "completado",
"rt.likertAgree": "Acepto", "rt.likertDisagree": "Discrepo",
"rt.likert7": "Totalmente de acuerdo", "rt.likert6": "De acuerdo", "rt.likert5": "Algo de acuerdo", "rt.likert4": "Neutral",
"rt.likert3": "Algo en desacuerdo", "rt.likert2": "En desacuerdo", "rt.likert1": "Totalmente en desacuerdo",
"rt.likertInstructions": "Calific\u00e1 qu\u00e9 tan bien te describe cada afirmaci\u00f3n. No hay respuestas correctas ni incorrectas, as\u00ed que respond\u00e9 con honestidad y no como cre\u00e9s que deber\u00edas.",
"rt.scenarioInstructions": "Le\u00e9 cada situaci\u00f3n y eleg\u00ed las 2 o 3 opciones que mejor describen lo que realmente har\u00edas.",
"rt.scenarioHint": "Eleg\u00ed las 2 o 3 opciones que mejor describen lo que har\u00edas.",
"rt.scenarioLabel": "Escenario", "rt.scenarioOf": "de 20.",
"rt.optionsSelected": "Opciones elegidas en esta p\u00e1gina:", "rt.scenariosComplete": "Escenarios completos:",
"rt.alertScenarios": "Por favor eleg\u00ed 2 o 3 opciones en cada escenario resaltado antes de continuar.",
"rt.alertQuestion": "Por favor respond\u00e9 la pregunta resaltada antes de continuar.",
"rt.alertQuestions": "Por favor respond\u00e9 las preguntas resaltadas antes de continuar.",
"rt.searchFoundOne": "carrera encontrada para", "rt.searchFoundMany": "carreras encontradas para",
"rt.searchTotal": "carreras disponibles en el cat\u00e1logo",
"rt.searchNone1": "No encontramos carreras que coincidan con \u201c", "rt.searchNone2": "\u201d. Prob\u00e1 con otra palabra clave.",
"rt.examSubjects": "Materias del examen de ingreso:", "rt.seeAllCareers": "Mir\u00e1 el cat\u00e1logo completo de carreras.",
"rt.vectorLinkedTo": "comparte afinidad con carreras que requieren",
"rt.careersAnalyzed": "carreras analizadas",
"rt.alsoOfferedAs": "Tambi\u00e9n se ofrece como:",
"rt.personalityFit": "Afinidad de personalidad", "rt.interestsFit": "Afinidad de intereses",
"rt.levelVeryHigh": "Muy alta", "rt.levelHigh": "Alta", "rt.levelMedium": "Media",
"rt.crossOk": "Validaci\u00f3n cruzada:", "rt.crossOkText": "tu perfil de personalidad (Big Five) y tus intereses pr\u00e1cticos (Holland) apuntan en la misma direcci\u00f3n para tus carreras recomendadas, y tu tipo Myers-Briggs es consistente con tus rasgos Big Five. Esto refuerza el resultado.",
"rt.crossTitle": "Notas de validaci\u00f3n cruzada",
"rt.crossGapPrefix": "tu", "rt.crossGapMid": "apunta a esta carrera con mucha m\u00e1s fuerza que tu", "rt.crossGapSuffix": "", "rt.crossGapNote": "Es algo com\u00fan y no invalida el resultado: puede significar que la idea te atrae pero tu estilo natural es distinto.",
"rt.tPersonality": "personalidad", "rt.tInterests": "inter\u00e9s pr\u00e1ctico",
"rt.consistencyTitle": "Chequeo de consistencia:", "rt.consistencyText": "dos de tus resultados describen el mismo rasgo pero se inclinan en direcciones distintas \u2014", "rt.consistencyEnd": "Esto es normal: el MBTI te ubica en una categor\u00eda fija, mientras que el Big Five mide una escala continua, as\u00ed que un puntaje cercano al medio puede caer de cualquier lado.",
"rt.yourNextInterest": "Tu siguiente inter\u00e9s m\u00e1s fuerte es", "rt.yourNextInterests": "Tus siguientes intereses m\u00e1s fuertes son",
"rt.resetConfirm": "\u00bfVolver a hacer el test? Se borrar\u00e1n tus respuestas y resultados actuales.",
"rt.printTitle": "Resultados del Test Vocacional", "rt.printFrom": "Instituto St. James",
"rt.noscriptTitle": "Se necesita JavaScript",
"rt.noscriptText": "Este test vocacional necesita que JavaScript est\u00e9 habilitado en tu navegador para cargar las preguntas y calcular tus resultados. Habilitalo y record\u00e1 la p\u00e1gina.",
"rt.aboutTraitFallback": "Mir\u00e1 el cat\u00e1logo completo de carreras."
}
};



/* ==========================================================================
   DATA — language-independent (scoring engine)
   ========================================================================== */
const perfilesIdeales = [
    //   R      I      A      S      E      C   |  OPE    CON    EXT    AGR    EST
    [0.3400, 0.5800, 0.0200, 0.0200, 0.0200, 0.0200, 0.5800, 0.3400, 0.0200, 0.0200, 0.0400], //  1. Process Control Engineering
    [0.3400, 0.5800, 0.0200, 0.0200, 0.0200, 0.0200, 0.5800, 0.1400, 0.0200, 0.2200, 0.0400], //  2. Environmental Engineering
    [0.5400, 0.3800, 0.0200, 0.0200, 0.0200, 0.0200, 0.3800, 0.5400, 0.0200, 0.0200, 0.0400], //  3. Civil Engineering
    [0.3400, 0.5800, 0.0200, 0.0200, 0.0200, 0.0200, 0.3800, 0.5400, 0.0200, 0.0200, 0.0400], //  4. Food Engineering
    [0.5400, 0.3800, 0.0200, 0.0200, 0.0200, 0.0200, 0.3800, 0.5400, 0.0200, 0.0200, 0.0400], //  5. Electromechanical Engineering
    [0.5400, 0.3800, 0.0200, 0.0200, 0.0200, 0.0200, 0.2250, 0.6750, 0.0250, 0.0250, 0.0500], //  6. Electrical Engineering
    [0.3400, 0.5800, 0.0200, 0.0200, 0.0200, 0.0200, 0.7250, 0.1750, 0.0250, 0.0250, 0.0500], //  7. Electronic Engineering
    [0.5400, 0.3800, 0.0200, 0.0200, 0.0200, 0.0200, 0.5800, 0.3400, 0.0200, 0.0200, 0.0400], //  8. Mechanical Engineering
    [0.1400, 0.3800, 0.0200, 0.0200, 0.0200, 0.4200, 0.2250, 0.6750, 0.0250, 0.0250, 0.0500], //  9. Industrial Engineering
    [0.3400, 0.5800, 0.0200, 0.0200, 0.0200, 0.0200, 0.5800, 0.3400, 0.0200, 0.0200, 0.0400], // 10. Chemical Engineering
    [0.3400, 0.5800, 0.0200, 0.0200, 0.0200, 0.0200, 0.7250, 0.1750, 0.0250, 0.0250, 0.0500], // 11. Petroleum Engineering
    [0.6000, 0.1200, 0.0200, 0.0200, 0.0200, 0.2200, 0.1750, 0.7250, 0.0250, 0.0250, 0.0500], // 12. Civil Construction
    [0.6000, 0.1200, 0.0200, 0.0200, 0.0200, 0.2200, 0.1750, 0.7250, 0.0250, 0.0250, 0.0500], // 13. Industrial Electricity
    [0.6000, 0.3200, 0.0200, 0.0200, 0.0200, 0.0200, 0.1750, 0.7250, 0.0250, 0.0250, 0.0500], // 14. Electronics
    [0.6000, 0.1200, 0.0200, 0.0200, 0.0200, 0.2200, 0.1750, 0.7250, 0.0250, 0.0250, 0.0500], // 15. Industrial Mechanics
    [0.6000, 0.1200, 0.0200, 0.0200, 0.0200, 0.2200, 0.1750, 0.7250, 0.0250, 0.0250, 0.0500], // 16. Production Mechanics
    [0.6000, 0.3200, 0.0200, 0.0200, 0.0200, 0.0200, 0.1750, 0.7250, 0.0250, 0.0250, 0.0500], // 17. Automotive Mechanics
    [0.2000, 0.1200, 0.0200, 0.0200, 0.2200, 0.4200, 0.1750, 0.7250, 0.0250, 0.0250, 0.0500], // 18. Office Systems
    [0.6000, 0.3200, 0.0200, 0.0200, 0.0200, 0.0200, 0.1750, 0.7250, 0.0250, 0.0250, 0.0500], // 19. Surveying Engineering
    [0.4000, 0.5200, 0.0200, 0.0200, 0.0200, 0.0200, 0.6750, 0.2250, 0.0250, 0.0250, 0.0500], // 20. Metallurgical Engineering
    [0.4000, 0.5200, 0.0200, 0.0200, 0.0200, 0.0200, 0.6750, 0.2250, 0.0250, 0.0250, 0.0500], // 21. Materials Engineering
    [0.0800, 0.5800, 0.0200, 0.2800, 0.0200, 0.0200, 0.1400, 0.3200, 0.0200, 0.5000, 0.0200], // 22. Veterinary Medicine and Animal Science
    [0.0600, 0.3200, 0.0200, 0.5600, 0.0200, 0.0200, 0.0800, 0.3200, 0.0400, 0.5400, 0.0200], // 23. Medicine
    [0.0600, 0.1200, 0.0200, 0.5600, 0.0200, 0.2200, 0.0800, 0.3200, 0.0400, 0.5400, 0.0200], // 24. Nursing
    [0.4600, 0.1200, 0.0200, 0.3600, 0.0200, 0.0200, 0.0800, 0.5200, 0.0400, 0.3400, 0.0200], // 25. Dentistry
    [0.0600, 0.5800, 0.0200, 0.0600, 0.0200, 0.2600, 0.5400, 0.3600, 0.0200, 0.0600, 0.0200], // 26. Biochemistry
    [0.0600, 0.3800, 0.0200, 0.0600, 0.0200, 0.4600, 0.1750, 0.7000, 0.0250, 0.0750, 0.0250], // 27. Pharmacy
    [0.0200, 0.0800, 0.0400, 0.0400, 0.5600, 0.2600, 0.0800, 0.3200, 0.5400, 0.0400, 0.0200], // 28. Business Administration
    [0.0200, 0.0800, 0.2400, 0.0400, 0.5600, 0.0600, 0.2800, 0.1200, 0.5400, 0.0400, 0.0200], // 29. Commercial Engineering
    [0.0200, 0.4800, 0.0400, 0.0400, 0.1600, 0.2600, 0.6000, 0.1500, 0.1750, 0.0500, 0.0250], // 30. Economics
    [0.0200, 0.0800, 0.0400, 0.0400, 0.5600, 0.2600, 0.1000, 0.1500, 0.6750, 0.0500, 0.0250], // 31. International Trade
    [0.0200, 0.2800, 0.0400, 0.0400, 0.1600, 0.4600, 0.2800, 0.5200, 0.1400, 0.0400, 0.0200], // 32. Financial Engineering
    [0.0250, 0.0750, 0.0250, 0.0250, 0.0750, 0.7750, 0.0500, 0.7750, 0.0750, 0.0500, 0.0500], // 33. Public Accounting
    [0.0250, 0.0750, 0.0250, 0.0250, 0.0750, 0.7750, 0.0500, 0.7750, 0.0750, 0.0500, 0.0500], // 34. Public Accounting (Online)
    [0.0200, 0.2600, 0.0200, 0.0200, 0.0600, 0.6200, 0.2400, 0.6200, 0.0600, 0.0400, 0.0400], // 35. IT and Management Control
    [0.2600, 0.0400, 0.6200, 0.0400, 0.0200, 0.0200, 0.7750, 0.0750, 0.0750, 0.0500, 0.0250], // 36. Architecture
    [0.0750, 0.0500, 0.7750, 0.0500, 0.0250, 0.0250, 0.7750, 0.0750, 0.0750, 0.0500, 0.0250], // 37. Art
    [0.0600, 0.0400, 0.6200, 0.0400, 0.2200, 0.0200, 0.6200, 0.0600, 0.2600, 0.0400, 0.0200], // 38. Integral Design
    [0.0600, 0.0400, 0.6200, 0.0400, 0.0200, 0.2200, 0.6200, 0.2600, 0.0600, 0.0400, 0.0200], // 39. Territorial Planning
    [0.0200, 0.0800, 0.0800, 0.5600, 0.0400, 0.2200, 0.1400, 0.2600, 0.0800, 0.5000, 0.0200], // 40. Education Sciences
    [0.0200, 0.0800, 0.4800, 0.3600, 0.0400, 0.0200, 0.3400, 0.0600, 0.4800, 0.1000, 0.0200], // 41. Communication Sciences
    [0.0200, 0.4800, 0.0800, 0.3600, 0.0400, 0.0200, 0.6750, 0.0750, 0.1000, 0.1250, 0.0250], // 42. Sociology
    [0.0200, 0.2800, 0.0800, 0.5600, 0.0400, 0.0200, 0.3400, 0.0600, 0.0800, 0.5000, 0.0200], // 43. Psychology
    [0.0200, 0.0800, 0.0800, 0.3600, 0.4400, 0.0200, 0.1750, 0.0750, 0.6000, 0.1250, 0.0250], // 44. Tourism Management
    [0.0200, 0.0800, 0.2800, 0.5600, 0.0400, 0.0200, 0.6750, 0.0750, 0.1000, 0.1250, 0.0250], // 45. Modern Languages (English)
    [0.0200, 0.0800, 0.2800, 0.5600, 0.0400, 0.0200, 0.6750, 0.0750, 0.1000, 0.1250, 0.0250], // 46. Modern Languages (French)
    [0.0200, 0.0800, 0.2800, 0.5600, 0.0400, 0.0200, 0.6750, 0.0750, 0.1000, 0.1250, 0.0250], // 47. Modern Languages (Spanish)
    [0.4200, 0.0800, 0.0800, 0.3600, 0.0400, 0.0200, 0.1750, 0.0750, 0.6000, 0.1250, 0.0250], // 48. Physical Activity
    [0.0200, 0.0800, 0.0400, 0.2800, 0.5600, 0.0200, 0.3200, 0.0800, 0.5400, 0.0400, 0.0200], // 49. International Relations
    [0.0200, 0.2800, 0.0400, 0.0800, 0.5600, 0.0200, 0.1500, 0.1000, 0.6750, 0.0500, 0.0250], // 50. Political Science and Public Administration
    [0.0200, 0.2800, 0.0400, 0.0800, 0.5600, 0.0200, 0.1200, 0.2800, 0.5400, 0.0400, 0.0200], // 51. Law
    [0.0200, 0.2800, 0.0400, 0.0800, 0.5600, 0.0200, 0.1200, 0.2800, 0.5400, 0.0400, 0.0200], // 52. Law (Online)
    [0.0250, 0.1000, 0.0500, 0.6000, 0.2000, 0.0250, 0.1500, 0.1000, 0.1750, 0.5500, 0.0250], // 53. Social Work
    [0.3200, 0.6000, 0.0200, 0.0200, 0.0200, 0.0200, 0.5600, 0.3600, 0.0200, 0.0200, 0.0400], // 54. Computer Engineering
    [0.3200, 0.6000, 0.0200, 0.0200, 0.0200, 0.0200, 0.5600, 0.3600, 0.0200, 0.0200, 0.0400], // 55. Computer Engineering (Online)
    [0.1200, 0.4000, 0.0200, 0.0200, 0.0200, 0.4200, 0.3600, 0.5600, 0.0200, 0.0200, 0.0400], // 56. Systems Engineering
    [0.5200, 0.4000, 0.0200, 0.0200, 0.0200, 0.0200, 0.2000, 0.7000, 0.0250, 0.0250, 0.0500], // 57. Network and Telecommunications Engineering
    [0.3600, 0.5600, 0.0200, 0.0200, 0.0200, 0.0200, 0.6750, 0.1750, 0.0250, 0.0750, 0.0500], // 58. Biology
    [0.5600, 0.3600, 0.0200, 0.0200, 0.0200, 0.0200, 0.1750, 0.6750, 0.0250, 0.0750, 0.0500], // 59. Agronomic Engineering
    [0.5600, 0.3600, 0.0200, 0.0200, 0.0200, 0.0200, 0.6750, 0.1750, 0.0250, 0.0750, 0.0500], // 60. Forestry Engineering
    [0.5600, 0.3600, 0.0200, 0.0200, 0.0200, 0.0200, 0.1750, 0.6750, 0.0250, 0.0750, 0.0500], // 61. Agricultural Environmental Engineering
    [0.5800, 0.0400, 0.0200, 0.0400, 0.0600, 0.2600, 0.0400, 0.5800, 0.0600, 0.0400, 0.2800], // 62. Military Career
    [0.5800, 0.0400, 0.0200, 0.0400, 0.0600, 0.2600, 0.0400, 0.5800, 0.0600, 0.0400, 0.2800] // 63. Police Career
];

const VECTOR_CODES = ["ING", "MED", "MIL", "FIN", "ART", "POL", "CON"];
const coloresFacultad = [
    "#2563eb", "#b45309", "#0f766e", "#dc2626", "#7c3aed", "#047857", "#0e7490",
    "#db2777", "#ea580c", "#4338ca", "#0369a1", "#4d7c0f", "#475569"
];

// Dominant vocational vector suggested per MBTI type (cross-validation only)
const vectorSugeridoPorTipo = {
    INTJ: "ING", INTP: "ING", ENTJ: "FIN", ENTP: "ART",
    INFJ: "ART", INFP: "ART", ENFJ: "ART", ENFP: "ART",
    ISTJ: "CON", ISFJ: "MED", ESTJ: "FIN", ESFJ: "MED",
    ISTP: "ING", ISFP: "ART", ESTP: "MIL", ESFP: "POL"
};

// The four MBTI dichotomies. `pos` is the pole that grows when the student
// agrees with a non-reversed item; `bigfive` is the Big Five trait that
// dichotomy is known to correlate with (used only for the consistency note).
const dicotomiasMBTI = [
    { clave: "EI", pos: "E", neg: "I", bigfive: "EXT" },
    { clave: "SN", pos: "N", neg: "S", bigfive: "OPE" },
    { clave: "TF", pos: "F", neg: "T", bigfive: "AGR" },
    { clave: "JP", pos: "J", neg: "P", bigfive: "CON" }
];


/* ==========================================================================
   DATA — per language (text content)
   ========================================================================== */
const facultadesPorIdioma = {};
facultadesPorIdioma.en = [
    {
        nombre: "Exact Sciences and Technology",
        materiasExamen: "Mathematics (30 pts), Physics (30 pts), Chemistry (25 pts), Language and Literature (15 pts)",
        carreras: [
            { nombre: "Process Control Engineering", descripcion: "Designs and automates the systems that control entire industrial plants, from sensors to supervisory software. Ideal for those who enjoy understanding how a factory works from the inside and making it more efficient and safe.", aptitudes: ["Logical-mathematical thinking", "Curiosity about automated systems", "Precision and attention to detail", "Ability to solve technical problems under pressure"], vec: "ING" },
            { nombre: "Environmental Engineering", descripcion: "Focuses on measuring, preventing, and reducing human impact on air, water, and soil, designing technical solutions for more sustainable development. Combines science, environmental regulation, and fieldwork.", aptitudes: ["Ecological awareness", "Scientific rigor", "Environmental data analysis skills", "Fieldwork and laboratory work"], vec: "ING" },
            { nombre: "Civil Engineering", descripcion: "Trains professionals capable of calculating structures, designing foundations, and directing the construction of bridges, buildings, and roads, ensuring they withstand the loads they were designed for.", aptitudes: ["Strong mathematical calculation skills", "Spatial vision", "Responsibility for the safety of others", "Leadership on site"], vec: "ING" },
            { nombre: "Food Engineering", descripcion: "Oversees the industrial processes that turn raw materials into safe, quality food, applying chemistry, biology, and quality-control principles on a large scale.", aptitudes: ["Interest in chemistry and microbiology", "Meticulousness in quality control", "Process-oriented thinking", "Hygiene and technical discipline"], vec: "ING" },
            { nombre: "Electromechanical Engineering", descripcion: "Integrates the design of mechanical, electrical, and thermal systems to create and maintain complex industrial machinery, from motors to automated production lines.", aptitudes: ["Ability to combine several technical disciplines", "Practical skill with machinery", "Fault-diagnosis ability", "Systemic thinking"], vec: "ING" },
            { nombre: "Electrical Engineering", descripcion: "Designs and maintains the networks that generate, transmit, and distribute electrical energy on a large scale, including substations and high-voltage lines.", aptitudes: ["Command of physical-mathematical concepts", "Extreme care with safety", "Long-term planning ability", "Work under strict technical regulations"], vec: "ING" },
            { nombre: "Electronic Engineering", descripcion: "Develops microcircuits, embedded hardware, and industrial robotics systems, working at the frontier between electronics and programming.", aptitudes: ["Detailed analytical thinking", "Enjoyment of building and testing prototypes", "Patience for debugging technical errors", "Interest in technological innovation"], vec: "ING" },
            { nombre: "Mechanical Engineering", descripcion: "Designs, calculates, and optimizes heavy machinery and heat-transfer systems, applying physics and mathematics to problems of force, motion, and energy.", aptitudes: ["Solid foundation in physics and calculus", "Three-dimensional vision of mechanisms", "Practical skill with tools", "Rigor in design and safety"], vec: "ING" },
            { nombre: "Industrial Engineering", descripcion: "Mathematically optimizes an organization's logistics, timing, and resources so it produces more and better with less waste.", aptitudes: ["Analytical and statistical thinking", "Organization and planning skills", "Process leadership skills", "Continuous-improvement orientation"], vec: "ING" },
            { nombre: "Chemical Engineering", descripcion: "Transforms raw materials into mass-consumption products on an industrial scale, applying mass and energy balances in chemical plants.", aptitudes: ["Strength in chemistry and mathematics", "Stage-based process thinking", "Precision and responsibility for industrial safety", "Laboratory analytical skills"], vec: "ING" },
            { nombre: "Petroleum Engineering", descripcion: "Models underground reservoirs and designs hydrocarbon extraction methods, combining geology, fluid physics, and process engineering.", aptitudes: ["Interest in geosciences", "Mathematical modeling ability", "Tolerance for remote fieldwork", "Technical thinking under uncertainty"], vec: "ING" },
        ]
    },
    {
        nombre: "Polytechnic",
        materiasExamen: "Mathematics (30 pts), Physics (30 pts), Chemistry (25 pts), Language and Literature (15 pts)",
        carreras: [
            { nombre: "Civil Construction", descripcion: "Trains technicians who directly supervise the execution of civil works on site, interpreting blueprints and monitoring construction progress.", aptitudes: ["Practical on-site skill", "Precise blueprint reading", "Personnel-supervision ability", "Physical stamina for fieldwork"], vec: "ING" },
            { nombre: "Industrial Electricity", descripcion: "Trains for the assembly, diagnosis, and repair of power panels and electrical systems in industrial plants and buildings.", aptitudes: ["Manual and technical dexterity", "Practical knowledge of circuits", "Rigorous care with electrical safety", "Fast fault-resolution ability"], vec: "ING" },
            { nombre: "Electronics", descripcion: "Trains technicians specialized in programming and maintaining programmable logic controllers (PLCs) and automated systems used in industry.", aptitudes: ["Basic programming logic", "Skill with measuring instruments", "Patience for testing and adjustments", "Interest in automation"], vec: "ING" },
            { nombre: "Industrial Mechanics", descripcion: "Prepares professionals in the precise turning, milling, and grinding of mechanical parts and spares for industrial maintenance.", aptitudes: ["Manual precision", "Good handling of machine tools", "Ability to read technical tolerances", "Patience and persistence"], vec: "ING" },
            { nombre: "Production Mechanics", descripcion: "Trains technical operators capable of running machining and stamping lines in mass-production metalworking processes.", aptitudes: ["Sustained attention in repetitive processes", "Fine motor coordination", "Discipline with quality standards", "Plant teamwork"], vec: "ING" },
            { nombre: "Automotive Mechanics", descripcion: "Specializes in the predictive diagnosis and maintenance of modern engines with electronic injection and computerized vehicle systems.", aptitudes: ["Practical and diagnostic skill", "Enjoyment of mechanics and vehicle technology", "Patience for fault detection", "Constant updating in new technologies"], vec: "ING" },
            { nombre: "Office Systems", descripcion: "Trains professionals in the advanced management of databases, spreadsheets, and digital document workflows for office environments.", aptitudes: ["Digital order and organization", "Fluent use of office software", "Attention to administrative detail", "Clear written communication"], vec: "CON" },
            { nombre: "Surveying Engineering", descripcion: "Trains in digital topographic land surveying and the geographic modeling used in civil works and land registry.", aptitudes: ["Measurement precision", "Handling of surveying equipment and GIS software", "Constant fieldwork", "Geometric thinking"], vec: "ING" },
            { nombre: "Metallurgical Engineering", descripcion: "Studies the smelting, refining, and alloying processes of metals for industry, controlling their physical and chemical properties.", aptitudes: ["Interest in materials chemistry", "Rigor in thermal-process control", "Laboratory analytical skills", "Tolerance for industrial environments"], vec: "ING" },
            { nombre: "Materials Engineering", descripcion: "Researches and develops advanced polymers and composite materials for industrial and technological applications.", aptitudes: ["Scientific curiosity", "Experimental precision", "Innovative thinking", "Persistence in applied research"], vec: "ING" },
        ]
    },
    {
        nombre: "Veterinary Sciences",
        materiasExamen: "Mathematics (20 pts), Chemistry (30 pts), Biology (40 pts), Language and Literature (10 pts)",
        carreras: [
            { nombre: "Veterinary Medicine and Animal Science", descripcion: "Trains professionals who diagnose, surgically treat, and prevent diseases in animals, while also responsibly managing livestock production.", aptitudes: ["Love and respect for animals", "Emotional stability in difficult situations", "Manual dexterity for clinical procedures", "Solid biological foundation"], vec: "MED" },
        ]
    },
    {
        nombre: "Human Health Sciences",
        materiasExamen: "Physics (35 pts), Chemistry (35 pts), Biology (30 pts) — annual exam",
        carreras: [
            { nombre: "Medicine", descripcion: "Trains doctors capable of diagnosing, treating, and preventing disease, combining deep scientific knowledge with direct, human patient care in clinics, hospitals, and operating rooms.", aptitudes: ["Vocation of service and empathy", "Excellent memory and sustained study capacity", "Emotional stability under pressure", "Ethics and responsibility toward human life"], vec: "MED" },
            { nombre: "Nursing", descripcion: "Trains for continuous patient monitoring, treatment administration, and close human support within the healthcare team.", aptitudes: ["Empathy and patience", "Ability to work as a team under pressure", "Meticulous attention to vital signs", "Physical and emotional endurance"], vec: "MED" },
            { nombre: "Dentistry", descripcion: "Trains specialists in oral and maxillofacial health, rehabilitation, and aesthetics, combining surgical manual skill with biomedical knowledge.", aptitudes: ["Fine motor skills and manual precision", "Clinical eye for visual diagnosis", "Close patient relationships", "Patience for detailed procedures"], vec: "MED" },
        ]
    },
    {
        nombre: "Biochemical and Pharmaceutical Sciences",
        materiasExamen: "Mathematics (25 pts), Physics (25 pts), Chemistry (25 pts), Biology (25 pts)",
        carreras: [
            { nombre: "Biochemistry", descripcion: "Trains specialists in the clinical laboratory analysis of body samples, a fundamental pillar for precise medical diagnosis.", aptitudes: ["Laboratory rigor and precision", "Analytical thinking", "Patience for meticulous procedures", "Interest in the chemistry of life processes"], vec: "MED" },
            { nombre: "Pharmacy", descripcion: "Trains in the chemical design, quality control, and responsible dispensing of medications, acting as a bridge between chemistry and public health.", aptitudes: ["Solid foundation in chemistry", "Ethical responsibility in handling drugs", "Attention to detail in dosing", "Vocation for patient guidance"], vec: "MED" },
        ]
    },
    {
        nombre: "Economic, Administrative and Financial Sciences",
        materiasExamen: "Mathematics (40 pts), Physics (20 pts), History and Geography (20 pts), Language and Literature (20 pts)",
        carreras: [
            { nombre: "Business Administration", descripcion: "Trains leaders capable of strategically planning an organization's human, financial, and operational resources to achieve its goals.", aptitudes: ["Leadership and decision-making", "Strategic vision", "Communication skills", "Organizational ability"], vec: "FIN" },
            { nombre: "Commercial Engineering", descripcion: "Specializes in understanding consumer behavior, designing marketing strategies, and positioning brands in competitive markets.", aptitudes: ["Commercial creativity", "Analytical market thinking", "Persuasion skills", "Results orientation"], vec: "FIN" },
            { nombre: "Economics", descripcion: "Analyzes the behavior of markets, production, and macroeconomic policy to explain and project a country's economic activity.", aptitudes: ["Mathematical and statistical thinking", "Critical analysis ability", "Interest in economic and social affairs", "Rigor in data interpretation"], vec: "FIN" },
            { nombre: "International Trade", descripcion: "Trains specialists in shipping logistics, customs procedures, and import/export strategies in global markets.", aptitudes: ["Global business vision", "Logistics organization", "Handling of regulations and procedures", "Adaptability to different markets"], vec: "FIN" },
            { nombre: "Financial Engineering", descripcion: "Designs advanced mathematical models to manage investment portfolios, risk, and capital strategies in financial markets.", aptitudes: ["Strong quantitative ability", "Tolerance for calculated risk", "Analytical thinking under uncertainty", "Discipline in tracking markets"], vec: "FIN" },
        ]
    },
    {
        nombre: "Financial Auditing / Management Control",
        materiasExamen: "Mathematics (30 pts), Physics (20 pts), History and Geography (40 pts), Language and Literature (10 pts)",
        carreras: [
            { nombre: "Public Accounting", descripcion: "Trains professionals responsible for accounting oversight, preparing financial statements, and ensuring companies meet their tax obligations.", aptitudes: ["Numerical precision and order", "Professional ethics", "Sustained attention to detail", "Ability to work with tax regulations"], vec: "CON" },
            { nombre: "Public Accounting (Online)", descripcion: "Offers the same general accounting training in distance format, designed for those who need flexible scheduling and self-directed study.", aptitudes: ["Self-discipline for distance study", "Numerical precision and order", "Use of digital tools", "Personal consistency and organization"], vec: "CON" },
            { nombre: "IT and Management Control", descripcion: "Combines internal corporate auditing with the use of digital systems, verifying that an organization's processes comply with controls and regulations.", aptitudes: ["Analytical and digital thinking", "Rigor in process verification", "Interest in information systems", "Objectivity and independent judgment"], vec: "CON" },
        ]
    },
    {
        nombre: "Habitat, Design and Art Sciences",
        materiasExamen: "Mathematics (20 pts), Physics (20 pts), History and Geography (30 pts), Language and Literature (30 pts)",
        carreras: [
            { nombre: "Architecture", descripcion: "Trains designers of livable spaces, capable of planning buildings that are functional, aesthetic, and technically viable under construction codes.", aptitudes: ["Creativity and aesthetic sense", "Three-dimensional spatial vision", "Technical drawing skill", "Balance between art and functionality"], vec: "ART" },
            { nombre: "Art", descripcion: "Develops artistic and sculptural production and visual research, training creators capable of expressing ideas through different artistic languages.", aptitudes: ["Aesthetic sensitivity", "Originality and personal expression", "Persistence in creative practice", "Cultural openness"], vec: "ART" },
            { nombre: "Integral Design", descripcion: "Trains designers of modern products, brands, and packaging, combining visual creativity with functional and market criteria.", aptitudes: ["Applied creativity", "Aesthetic and compositional sense", "Use of digital design tools", "User-centered thinking"], vec: "ART" },
            { nombre: "Territorial Planning", descripcion: "Focuses on managing urban and demographic growth sustainably, balancing development, environment, and quality of life.", aptitudes: ["Systemic view of territory", "Long-term thinking", "Negotiation skills with public stakeholders", "Social and environmental sensitivity"], vec: "ART" },
        ]
    },
    {
        nombre: "Humanities",
        materiasExamen: "Biology (20 pts), Psychology (40 pts), History and Geography (20 pts), Language and Literature (20 pts)",
        carreras: [
            { nombre: "Education Sciences", descripcion: "Trains teachers and curriculum designers capable of planning effective teaching-learning processes adapted to different school contexts.", aptitudes: ["Pedagogical vocation", "Patience and listening skills", "Didactic creativity", "Positive leadership in front of groups"], vec: "ART" },
            { nombre: "Communication Sciences", descripcion: "Trains journalists and communicators capable of researching, writing, and analyzing public opinion across different media.", aptitudes: ["Curiosity and investigative drive", "Good writing and speaking skills", "Critical thinking", "Journalistic ethics"], vec: "ART" },
            { nombre: "Sociology", descripcion: "Studies collective dynamics, social structures, and political phenomena that explain the behavior of human groups.", aptitudes: ["Critical and analytical thinking", "Genuine interest in social issues", "Qualitative research ability", "Objectivity on sensitive topics"], vec: "ART" },
            { nombre: "Psychology", descripcion: "Trains professionals capable of assessing and intervening in mental and behavioral processes, supporting people's emotional wellbeing.", aptitudes: ["Empathy and active listening", "Personal emotional stability", "Analytical thinking about human behavior", "Ethics and confidentiality"], vec: "MED" },
            { nombre: "Tourism Management", descripcion: "Trains in planning tour circuits, hospitality, and destination development, promoting tourism as a regional economic driver.", aptitudes: ["Social and service skills", "Event and logistics organization", "Cultural and geographic interest", "Languages and cross-cultural communication"], vec: "ART" },
            { nombre: "Modern Languages (English)", descripcion: "Trains translators and teachers specialized in linguistic analysis and English-language teaching.", aptitudes: ["Facility for languages", "Good linguistic memory", "Pedagogical patience", "Cultural interest"], vec: "ART" },
            { nombre: "Modern Languages (French)", descripcion: "Trains translators and teachers specialized in linguistic analysis and French-language teaching.", aptitudes: ["Facility for languages", "Good linguistic memory", "Pedagogical patience", "Cultural interest"], vec: "ART" },
            { nombre: "Modern Languages (Spanish)", descripcion: "Focuses on Hispanic philology, teaching, and linguistic proofreading of the Spanish language in different contexts.", aptitudes: ["Excellent command of one's own language", "Enjoyment of reading and grammar", "Precision in text editing", "Pedagogical patience"], vec: "ART" },
            { nombre: "Physical Activity", descripcion: "Trains specialists in planning sports training and human physical performance, combining sports science and pedagogy.", aptitudes: ["Interest in sports and the human body", "Motivational ability", "Basic knowledge of physiology", "Discipline and consistency"], vec: "MED" },
        ]
    },
    {
        nombre: "Legal, Political, Social Sciences and International Relations",
        materiasExamen: "Psychology (20 pts), Philosophy (30 pts), History and Geography (30 pts), Language and Literature (20 pts)",
        carreras: [
            { nombre: "International Relations", descripcion: "Trains specialists in diplomacy, geopolitics, and negotiation between states and international organizations.", aptitudes: ["Broad geopolitical vision", "Negotiation skills", "Command of languages", "Strategic thinking"], vec: "ART" },
            { nombre: "Political Science and Public Administration", descripcion: "Trains in the design and management of public policy and in the functioning of state government structures.", aptitudes: ["Interest in how the State works", "Critical thinking about public affairs", "Management and negotiation skills", "Ethical commitment to the collective good"], vec: "ART" },
            { nombre: "Law", descripcion: "Trains lawyers capable of defending, litigating, and providing legal counsel before the courts, applying the current legal framework to real cases.", aptitudes: ["Argumentative and oratory skill", "Excellent reading comprehension", "Sense of justice and ethics", "Memory for extensive regulations"], vec: "ART" },
            { nombre: "Law (Online)", descripcion: "Offers the same general legal training in distance format, aimed at those already working or needing flexible study.", aptitudes: ["Self-discipline for distance study", "Argumentative ability", "Solid reading comprehension", "Personal organization"], vec: "ART" },
            { nombre: "Social Work", descripcion: "Trains professionals who intervene directly in vulnerable communities, supporting processes of inclusion and social wellbeing.", aptitudes: ["Empathy and social commitment", "Conflict-mediation ability", "Emotional resilience", "Community fieldwork"], vec: "ART" },
        ]
    },
    {
        nombre: "Computer Science and Telecommunications",
        materiasExamen: "Mathematics (30 pts), Physics (30 pts), Computer Science (20 pts), English (20 pts)",
        carreras: [
            { nombre: "Computer Engineering", descripcion: "Trains developers capable of designing software, algorithms, and complex system architectures to solve real-world problems.", aptitudes: ["Logical and algorithmic thinking", "Patience for debugging errors", "Constant self-taught learning", "Creativity for problem-solving"], vec: "ING" },
            { nombre: "Computer Engineering (Online)", descripcion: "Offers the same software and systems development training in distance format, with flexible scheduling.", aptitudes: ["Self-discipline for distance study", "Logical and algorithmic thinking", "Autonomous time management", "Self-taught learning"], vec: "ING" },
            { nombre: "Systems Engineering", descripcion: "Specializes in managing the technological infrastructure and corporate databases that support an organization's operations.", aptitudes: ["Structured thinking", "Incident-resolution ability", "Systems organization and planning", "Interest in technological infrastructure"], vec: "ING" },
            { nombre: "Network and Telecommunications Engineering", descripcion: "Designs and maintains the data networks and communication systems that enable connectivity between people and devices.", aptitudes: ["Technical network thinking", "Precision in system configuration", "Connection fault-diagnosis ability", "Constant technological updating"], vec: "ING" },
        ]
    },
    {
        nombre: "Agricultural Sciences",
        materiasExamen: "Mathematics (20 pts), Chemistry (30 pts), Natural Resources (30 pts), Language and Literature (20 pts)",
        carreras: [
            { nombre: "Biology", descripcion: "Trains scientific researchers of living organisms and ecosystems, providing foundational knowledge for health, agriculture, and the environment.", aptitudes: ["Scientific curiosity", "Rigorous research methodology", "Patience for field and laboratory work", "Detailed observation skills"], vec: "MED" },
            { nombre: "Agronomic Engineering", descripcion: "Focuses on sustainable agricultural production and the technical management of crops, seeking to maximize yield while respecting the soil.", aptitudes: ["Interest in biological and soil sciences", "Enjoyment of fieldwork", "Sustainability-oriented thinking", "Ability to plan production cycles"], vec: "ING" },
            { nombre: "Forestry Engineering", descripcion: "Manages and conserves forest resources technically, balancing economic use with environmental protection.", aptitudes: ["Environmental awareness", "Enjoyment of working in natural terrain", "Long-term planning ability", "Knowledge of ecosystems"], vec: "ING" },
            { nombre: "Agricultural Environmental Engineering", descripcion: "Specializes in soil management, irrigation systems, and controlling the environmental impact of agricultural activities.", aptitudes: ["Interest in the water-soil-crop relationship", "Technical and environmental rigor", "Constant fieldwork", "Sustainability-oriented thinking"], vec: "ING" },
        ]
    },
    {
        nombre: "Security and Defense Fields",
        materiasExamen: "Physical fitness, discipline, psychometric evaluation, and personal interview",
        carreras: [
            { nombre: "Military Career", descripcion: "Trains officers prepared for the strategic planning of national defense, combat tactics, and the logistics of armed operations, within a hierarchical and disciplined structure.", aptitudes: ["Discipline and capacity for hierarchical obedience", "Physical and mental strength", "Leadership under extreme pressure", "Commitment to service and the defense of the country"], vec: "MIL" },
            { nombre: "Police Career", descripcion: "Prepares officers for preventive urban patrol, forensic scene preservation, and the maintenance of public order and citizen safety.", aptitudes: ["Sense of duty and justice", "Composure in risky situations", "Fast reaction ability", "Vocation of service to the community"], vec: "POL" },
        ]
    },
];
facultadesPorIdioma.es = [
    {
        nombre: "Ciencias y Tecnología Exactas",
        materiasExamen: "Matemáticas (30 pts), Física (30 pts), Química (25 pts), Lenguaje y Literatura (15 pts)",
        carreras: [
            { nombre: "Ingeniería de Control de Procesos", descripcion: "Diseña y automatiza los sistemas que controlan plantas industriales completas, desde los sensores hasta el software de supervisión. Ideal para quien disfruta entender cómo funciona una fábrica por dentro y hacerla más eficiente y segura.", aptitudes: ["Pensamiento lógico-matemático", "Curiosidad por los sistemas automatizados", "Precisión y atención al detalle", "Capacidad de resolver problemas técnicos bajo presión"], vec: "ING" },
            { nombre: "Ingeniería ambiental", descripcion: "Se enfoca en medir, prevenir y reducir el impacto humano sobre el aire, el agua y el suelo, diseñando soluciones técnicas para un desarrollo más sostenible. Combina ciencia, normativa ambiental y trabajo de campo.", aptitudes: ["Conciencia ecológica", "Rigor científico", "Habilidad de análisis de datos ambientales", "Trabajo de campo y de laboratorio"], vec: "ING" },
            { nombre: "Ingeniería civil", descripcion: "Forma profesionales capaces de calcular estructuras, diseñar cimientos y dirigir la construcción de puentes, edificios y carreteras, asegurando que resistan las cargas para las que fueron diseñados.", aptitudes: ["Fuerte capacidad de cálculo matemático", "Visión espacial", "Responsabilidad por la seguridad de terceros", "Liderazgo en obra"], vec: "ING" },
            { nombre: "Ingeniería de Alimentos", descripcion: "Supervisa los procesos industriales que convierten materias primas en alimentos seguros y de calidad, aplicando química, biología y control de calidad a gran escala.", aptitudes: ["Interés en química y microbiología", "Meticulosidad en el control de calidad", "Pensamiento orientado a procesos", "Disciplina técnica e higiene"], vec: "ING" },
            { nombre: "Ingeniería electromecánica", descripcion: "Integra el diseño de sistemas mecánicos, eléctricos y térmicos para crear y mantener maquinaria industrial compleja, desde motores hasta líneas de producción automatizadas.", aptitudes: ["Capacidad de combinar varias disciplinas técnicas", "Habilidad práctica con maquinaria", "Capacidad de diagnóstico de fallas", "Pensamiento sistémico"], vec: "ING" },
            { nombre: "Electrotecnia", descripcion: "Diseña y mantiene las redes que generan, transmiten y distribuyen energía eléctrica a gran escala, incluyendo subestaciones y líneas de alta tensión.", aptitudes: ["Dominio de conceptos físico-matemáticos", "Cuidado extremo con la seguridad", "Capacidad de planificación a largo plazo", "Trabajo bajo normativa técnica estricta"], vec: "ING" },
            { nombre: "Ingeniería electrónica", descripcion: "Desarrolla microcircuitos, hardware embebido y sistemas de robótica industrial, trabajando en la frontera entre la electrónica y la programación.", aptitudes: ["Pensamiento analítico detallado", "Disfrute de construir y probar prototipos", "Paciencia para depurar errores técnicos", "Interés en la innovación tecnológica"], vec: "ING" },
            { nombre: "Ingeniería Mecánica", descripcion: "Diseña, calcula y optimiza maquinaria pesada y sistemas de transferencia de calor, aplicando física y matemática a problemas de fuerza, movimiento y energía.", aptitudes: ["Base sólida en física y cálculo", "Visión tridimensional de mecanismos", "Habilidad práctica con herramientas", "Rigor en diseño y seguridad"], vec: "ING" },
            { nombre: "Ingeniería Industrial", descripcion: "Optimiza matemáticamente la logística, los tiempos y los recursos de una organización para que produzca más y mejor con menos desperdicio.", aptitudes: ["Pensamiento analítico y estadístico", "Capacidad de organización y planificación", "Habilidades de liderazgo de procesos", "Orientación a la mejora continua"], vec: "ING" },
            { nombre: "Ingeniería Química", descripcion: "Transforma materias primas en productos de consumo masivo a escala industrial, aplicando balances de masa y energía en plantas químicas.", aptitudes: ["Fortaleza en química y matemática", "Pensamiento por etapas de proceso", "Precisión y responsabilidad en seguridad industrial", "Habilidad analítica de laboratorio"], vec: "ING" },
            { nombre: "Ingeniería petrolera", descripcion: "Modela yacimientos subterráneos y diseña métodos de extracción de hidrocarburos, combinando geología, física de fluidos e ingeniería de procesos.", aptitudes: ["Interés en geociencias", "Capacidad de modelado matemático", "Tolerancia al trabajo de campo remoto", "Pensamiento técnico bajo incertidumbre"], vec: "ING" },
        ]
    },
    {
        nombre: "Politécnico",
        materiasExamen: "Matemáticas (30 pts), Física (30 pts), Química (25 pts), Lenguaje y Literatura (15 pts)",
        carreras: [
            { nombre: "Construcción civil", descripcion: "Forma técnicos que supervisan directamente la ejecución de obras civiles en terreno, interpretando planos y monitoreando el avance de la construcción.", aptitudes: ["Habilidad práctica en terreno", "Lectura precisa de planos", "Capacidad de supervisión de personal", "Resistencia física para trabajo de campo"], vec: "ING" },
            { nombre: "Electricidad industrial", descripcion: "Forma en el montaje, diagnóstico y reparación de tableros de fuerza y sistemas eléctricos en plantas industriales y edificios.", aptitudes: ["Destreza manual y técnica", "Conocimiento práctico de circuitos", "Cuidado riguroso con la seguridad eléctrica", "Rapidez para resolver fallas"], vec: "ING" },
            { nombre: "Electrónica", descripcion: "Forma técnicos especializados en programar y mantener controladores lógicos programables (PLC) y sistemas automatizados usados en la industria.", aptitudes: ["Lógica básica de programación", "Habilidad con instrumentos de medición", "Paciencia para pruebas y ajustes", "Interés en la automatización"], vec: "ING" },
            { nombre: "Mecánica industrial", descripcion: "Prepara profesionales en el torneado, fresado y rectificado de precisión de piezas y repuestos mecánicos para mantenimiento industrial.", aptitudes: ["Precisión manual", "Buen manejo de máquinas-herramienta", "Capacidad de leer tolerancias técnicas", "Paciencia y perseverancia"], vec: "ING" },
            { nombre: "Mecánica de producción", descripcion: "Forma operarios técnicos capaces de manejar líneas de mecanizado y estampado en procesos metalmecánicos de producción en serie.", aptitudes: ["Atención sostenida en procesos repetitivos", "Coordinación motriz fina", "Disciplina con los estándares de calidad", "Trabajo en equipo de planta"], vec: "ING" },
            { nombre: "Mecánica automotriz", descripcion: "Se especializa en el diagnóstico predictivo y el mantenimiento de motores modernos con inyección electrónica y sistemas computarizados del vehículo.", aptitudes: ["Habilidad práctica y de diagnóstico", "Gusto por la mecánica y la tecnología vehicular", "Paciencia para detectar fallas", "Actualización constante en nuevas tecnologías"], vec: "ING" },
            { nombre: "Sistemas de oficina", descripcion: "Forma profesionales en la gestión avanzada de bases de datos, planillas de cálculo y flujos de documentos digitales para entornos de oficina.", aptitudes: ["Orden y organización digital", "Manejo fluido de software de oficina", "Atención al detalle administrativo", "Comunicación escrita clara"], vec: "CON" },
            { nombre: "Ingeniería topográfica", descripcion: "Forma en el levantamiento topográfico digital de terrenos y el modelado geográfico usado en obras civiles y catastro.", aptitudes: ["Precisión de medición", "Manejo de equipos de topografía y software GIS", "Trabajo de campo constante", "Pensamiento geométrico"], vec: "ING" },
            { nombre: "Ingeniería metalúrgica", descripcion: "Estudia los procesos de fundición, refinación y aleación de metales para la industria, controlando sus propiedades físicas y químicas.", aptitudes: ["Interés en la química de materiales", "Rigor en el control de procesos térmicos", "Habilidad analítica de laboratorio", "Tolerancia a entornos industriales"], vec: "ING" },
            { nombre: "Ingeniería de materiales", descripcion: "Investiga y desarrolla polímeros avanzados y materiales compuestos para aplicaciones industriales y tecnológicas.", aptitudes: ["Curiosidad científica", "Precisión experimental", "Pensamiento innovador", "Perseverancia en la investigación aplicada"], vec: "ING" },
        ]
    },
    {
        nombre: "Ciencias Veterinarias",
        materiasExamen: "Matemáticas (20 pts), Química (30 pts), Biología (40 pts), Lenguaje y Literatura (10 pts)",
        carreras: [
            { nombre: "Medicina Veterinaria y Ciencias Animales", descripcion: "Forma profesionales que diagnostican, tratan quirúrgicamente y previenen enfermedades en animales, además de gestionar responsablemente la producción pecuaria.", aptitudes: ["Amor y respeto por los animales", "Estabilidad emocional en situaciones difíciles", "Destreza manual para procedimientos clínicos", "Base biológica sólida"], vec: "MED" },
        ]
    },
    {
        nombre: "Ciencias de la Salud Humana",
        materiasExamen: "Física (35 pts), Química (35 pts), Biología (30 pts) — examen anual",
        carreras: [
            { nombre: "Medicina", descripcion: "Forma médicos capaces de diagnosticar, tratar y prevenir enfermedades, combinando conocimiento científico profundo con atención humana directa en clínicas, hospitales y quirófanos.", aptitudes: ["Vocación de servicio y empatía", "Excelente memoria y capacidad de estudio sostenido", "Estabilidad emocional bajo presión", "Ética y responsabilidad por la vida humana"], vec: "MED" },
            { nombre: "Enfermería", descripcion: "Forma para el monitoreo continuo del paciente, la administración de tratamientos y el apoyo humano cercano dentro del equipo de salud.", aptitudes: ["Empatía y paciencia", "Capacidad de trabajo en equipo bajo presión", "Atención meticulosa a los signos vitales", "Resistencia física y emocional"], vec: "MED" },
            { nombre: "Odontología", descripcion: "Forma especialistas en salud oral y maxilofacial, rehabilitación y estética, combinando destreza manual quirúrgica con conocimiento biomédico.", aptitudes: ["Motricidad fina y precisión manual", "Ojo clínico para el diagnóstico visual", "Vínculo cercano con el paciente", "Paciencia para procedimientos detallados"], vec: "MED" },
        ]
    },
    {
        nombre: "Ciencias Bioquímicas y Farmacéuticas",
        materiasExamen: "Matemáticas (25 pts), Física (25 pts), Química (25 pts), Biología (25 pts)",
        carreras: [
            { nombre: "Bioquímica", descripcion: "Forma especialistas en el análisis de laboratorio clínico de muestras corporales, un pilar fundamental para el diagnóstico médico preciso.", aptitudes: ["Rigor y precisión de laboratorio", "Pensamiento analítico", "Paciencia para procedimientos meticulosos", "Interés en la química de los procesos vitales"], vec: "MED" },
            { nombre: "Farmacia", descripcion: "Forma en el diseño químico, el control de calidad y la dispensación responsable de medicamentos, actuando como puente entre la química y la salud pública.", aptitudes: ["Base sólida en química", "Responsabilidad ética en el manejo de fármacos", "Atención al detalle en la dosificación", "Vocación de orientación al paciente"], vec: "MED" },
        ]
    },
    {
        nombre: "Ciencias Económicas, Administrativas y Financieras",
        materiasExamen: "Matemáticas (40 pts), Física (20 pts), Historia y Geografía (20 pts), Lenguaje y Literatura (20 pts)",
        carreras: [
            { nombre: "Administración de Empresas", descripcion: "Forma líderes capaces de planificar estratégicamente los recursos humanos, financieros y operativos de una organización para alcanzar sus objetivos.", aptitudes: ["Liderazgo y toma de decisiones", "Visión estratégica", "Habilidades de comunicación", "Capacidad de organización"], vec: "FIN" },
            { nombre: "Ingeniería comercial", descripcion: "Se especializa en comprender el comportamiento del consumidor, diseñar estrategias de marketing y posicionar marcas en mercados competitivos.", aptitudes: ["Creatividad comercial", "Pensamiento analítico de mercado", "Habilidades de persuasión", "Orientación a resultados"], vec: "FIN" },
            { nombre: "Ciencias económicas", descripcion: "Analiza el comportamiento de los mercados, la producción y la política macroeconómica para explicar y proyectar la actividad económica de un país.", aptitudes: ["Pensamiento matemático y estadístico", "Capacidad de análisis crítico", "Interés en asuntos económicos y sociales", "Rigor en la interpretación de datos"], vec: "FIN" },
            { nombre: "Comercio internacional", descripcion: "Forma especialistas en logística de embarque, trámites aduaneros y estrategias de importación/exportación en mercados globales.", aptitudes: ["Visión global de negocios", "Organización logística", "Manejo de normativas y trámites", "Adaptabilidad a distintos mercados"], vec: "FIN" },
            { nombre: "Ingeniería financiera", descripcion: "Diseña modelos matemáticos avanzados para gestionar carteras de inversión, riesgo y estrategias de capital en los mercados financieros.", aptitudes: ["Fuerte capacidad cuantitativa", "Tolerancia al riesgo calculado", "Pensamiento analítico bajo incertidumbre", "Disciplina en el seguimiento de mercados"], vec: "FIN" },
        ]
    },
    {
        nombre: "Auditoría Financiera / Control de Gestión",
        materiasExamen: "Matemáticas (30 pts), Física (20 pts), Historia y Geografía (40 pts), Lenguaje y Literatura (10 pts)",
        carreras: [
            { nombre: "Contabilidad pública", descripcion: "Forma profesionales responsables de la fiscalización contable, la preparación de estados financieros y el cumplimiento de las obligaciones tributarias de las empresas.", aptitudes: ["Precisión y orden numérico", "Ética profesional", "Atención sostenida al detalle", "Capacidad de trabajar con normativa tributaria"], vec: "CON" },
            { nombre: "Contabilidad pública (en línea)", descripcion: "Ofrece la misma formación contable general en modalidad a distancia, pensada para quienes necesitan horarios flexibles y estudio autodirigido.", aptitudes: ["Autodisciplina para el estudio a distancia", "Precisión y orden numérico", "Uso de herramientas digitales", "Constancia y organización personal"], vec: "CON" },
            { nombre: "Control de TI y gestión", descripcion: "Combina la auditoría interna corporativa con el uso de sistemas digitales, verificando que los procesos de una organización cumplan controles y normativas.", aptitudes: ["Pensamiento analítico y digital", "Rigor en la verificación de procesos", "Interés en sistemas de información", "Objetividad y criterio independiente"], vec: "CON" },
        ]
    },
    {
        nombre: "Hábitat, Diseño y Ciencias del Arte",
        materiasExamen: "Matemáticas (20 pts), Física (20 pts), Historia y Geografía (30 pts), Lenguaje y Literatura (30 pts)",
        carreras: [
            { nombre: "Arquitectura", descripcion: "Forma diseñadores de espacios habitables, capaces de planificar edificaciones funcionales, estéticas y técnicamente viables bajo normativa de construcción.", aptitudes: ["Creatividad y sentido estético", "Visión espacial tridimensional", "Habilidad de dibujo técnico", "Equilibrio entre arte y funcionalidad"], vec: "ART" },
            { nombre: "Arte", descripcion: "Desarrolla producción artística y escultórica e investigación visual, formando creadores capaces de expresar ideas a través de distintos lenguajes artísticos.", aptitudes: ["Sensibilidad estética", "Originalidad y expresión personal", "Perseverancia en la práctica creativa", "Apertura cultural"], vec: "ART" },
            { nombre: "Diseño integral", descripcion: "Forma diseñadores de productos, marcas y empaques modernos, combinando creatividad visual con criterios funcionales y de mercado.", aptitudes: ["Creatividad aplicada", "Sentido estético y compositivo", "Uso de herramientas digitales de diseño", "Pensamiento centrado en el usuario"], vec: "ART" },
            { nombre: "Planificación territorial", descripcion: "Se enfoca en gestionar el crecimiento urbano y demográfico de forma sostenible, equilibrando desarrollo, medio ambiente y calidad de vida.", aptitudes: ["Visión sistémica del territorio", "Pensamiento a largo plazo", "Habilidades de negociación con actores públicos", "Sensibilidad social y ambiental"], vec: "ART" },
        ]
    },
    {
        nombre: "Humanidades",
        materiasExamen: "Biología (20 pts), Psicología (40 pts), Historia y Geografía (20 pts), Lenguaje y Literatura (20 pts)",
        carreras: [
            { nombre: "Ciencias de la Educación", descripcion: "Forma docentes y diseñadores curriculares capaces de planificar procesos de enseñanza-aprendizaje efectivos, adaptados a distintos contextos escolares.", aptitudes: ["Vocación pedagógica", "Paciencia y capacidad de escucha", "Creatividad didáctica", "Liderazgo positivo frente a grupos"], vec: "ART" },
            { nombre: "Ciencias de la Comunicación", descripcion: "Forma periodistas y comunicadores capaces de investigar, redactar y analizar la opinión pública en distintos medios.", aptitudes: ["Curiosidad e impulso investigativo", "Buena redacción y expresión oral", "Pensamiento crítico", "Ética periodística"], vec: "ART" },
            { nombre: "Sociología", descripcion: "Estudia las dinámicas colectivas, las estructuras sociales y los fenómenos políticos que explican el comportamiento de los grupos humanos.", aptitudes: ["Pensamiento crítico y analítico", "Interés genuino en temas sociales", "Capacidad de investigación cualitativa", "Objetividad frente a temas sensibles"], vec: "ART" },
            { nombre: "Psicología", descripcion: "Forma profesionales capaces de evaluar e intervenir en procesos mentales y de conducta, apoyando el bienestar emocional de las personas.", aptitudes: ["Empatía y escucha activa", "Estabilidad emocional personal", "Pensamiento analítico sobre la conducta humana", "Ética y confidencialidad"], vec: "MED" },
            { nombre: "Gestión turística", descripcion: "Forma en la planificación de circuitos turísticos, hotelería y desarrollo de destinos, impulsando el turismo como motor económico regional.", aptitudes: ["Habilidades sociales y de servicio", "Organización de eventos y logística", "Interés cultural y geográfico", "Idiomas y comunicación intercultural"], vec: "ART" },
            { nombre: "Lenguas modernas (inglés)", descripcion: "Forma traductores y docentes especializados en el análisis lingüístico y la enseñanza del idioma inglés.", aptitudes: ["Facilidad para los idiomas", "Buena memoria lingüística", "Paciencia pedagógica", "Interés cultural"], vec: "ART" },
            { nombre: "Lenguas modernas (francés)", descripcion: "Forma traductores y docentes especializados en el análisis lingüístico y la enseñanza del idioma francés.", aptitudes: ["Facilidad para los idiomas", "Buena memoria lingüística", "Paciencia pedagógica", "Interés cultural"], vec: "ART" },
            { nombre: "Lenguas modernas (español)", descripcion: "Se enfoca en la filología hispánica, la docencia y la corrección lingüística del idioma español en distintos contextos.", aptitudes: ["Excelente dominio del propio idioma", "Gusto por la lectura y la gramática", "Precisión en la edición de textos", "Paciencia pedagógica"], vec: "ART" },
            { nombre: "Actividad física", descripcion: "Forma especialistas en la planificación del entrenamiento deportivo y el rendimiento físico humano, combinando ciencias del deporte y pedagogía.", aptitudes: ["Interés en el deporte y el cuerpo humano", "Capacidad motivacional", "Conocimiento básico de fisiología", "Disciplina y constancia"], vec: "MED" },
        ]
    },
    {
        nombre: "Ciencias Jurídicas, Políticas, Sociales y RRII",
        materiasExamen: "Psicología (20 pts), Filosofía (30 pts), Historia y Geografía (30 pts), Lenguaje y Literatura (20 pts)",
        carreras: [
            { nombre: "Relaciones Internacionales", descripcion: "Forma especialistas en diplomacia, geopolítica y negociación entre estados y organismos internacionales.", aptitudes: ["Visión geopolítica amplia", "Habilidades de negociación", "Dominio de idiomas", "Pensamiento estratégico"], vec: "ART" },
            { nombre: "Ciencia Política y Administración Pública", descripcion: "Forma en el diseño y la gestión de políticas públicas y en el funcionamiento de las estructuras del gobierno estatal.", aptitudes: ["Interés en el funcionamiento del Estado", "Pensamiento crítico sobre asuntos públicos", "Habilidades de gestión y negociación", "Compromiso ético con el bien colectivo"], vec: "ART" },
            { nombre: "Ley", descripcion: "Forma abogados capaces de defender, litigar y asesorar jurídicamente ante los tribunales, aplicando el marco legal vigente a casos reales.", aptitudes: ["Habilidad argumentativa y oratoria", "Excelente comprensión lectora", "Sentido de la justicia y ética", "Memoria para normativa extensa"], vec: "ART" },
            { nombre: "Derecho (en línea)", descripcion: "Ofrece la misma formación jurídica general en modalidad a distancia, dirigida a quienes ya trabajan o necesitan flexibilidad de estudio.", aptitudes: ["Autodisciplina para el estudio a distancia", "Capacidad argumentativa", "Comprensión lectora sólida", "Organización personal"], vec: "ART" },
            { nombre: "Trabajo social", descripcion: "Forma profesionales que intervienen directamente en comunidades vulnerables, apoyando procesos de inclusión y bienestar social.", aptitudes: ["Empatía y compromiso social", "Capacidad de mediación de conflictos", "Resiliencia emocional", "Trabajo de campo comunitario"], vec: "ART" },
        ]
    },
    {
        nombre: "Informática y Telecomunicaciones",
        materiasExamen: "Matemáticas (30 pts), Física (30 pts), Informática (20 pts), Inglés (20 pts)",
        carreras: [
            { nombre: "Ingeniería Informática", descripcion: "Forma desarrolladores capaces de diseñar software, algoritmos y arquitecturas de sistemas complejas para resolver problemas reales.", aptitudes: ["Pensamiento lógico y algorítmico", "Paciencia para depurar errores", "Aprendizaje autodidacta constante", "Creatividad para resolver problemas"], vec: "ING" },
            { nombre: "Ingeniería Informática (en línea)", descripcion: "Ofrece la misma formación en desarrollo de software y sistemas en modalidad a distancia, con horarios flexibles.", aptitudes: ["Autodisciplina para el estudio a distancia", "Pensamiento lógico y algorítmico", "Gestión autónoma del tiempo", "Aprendizaje autodidacta"], vec: "ING" },
            { nombre: "Ingeniería de sistemas", descripcion: "Se especializa en administrar la infraestructura tecnológica y las bases de datos corporativas que sostienen las operaciones de una organización.", aptitudes: ["Pensamiento estructurado", "Capacidad de resolución de incidentes", "Organización y planificación de sistemas", "Interés en la infraestructura tecnológica"], vec: "ING" },
            { nombre: "Ingeniería de redes y telecomunicaciones", descripcion: "Diseña y mantiene las redes de datos y los sistemas de comunicación que permiten la conectividad entre personas y dispositivos.", aptitudes: ["Pensamiento técnico de redes", "Precisión en la configuración de sistemas", "Capacidad de diagnóstico de fallas de conexión", "Actualización tecnológica constante"], vec: "ING" },
        ]
    },
    {
        nombre: "Ciencias Agrícolas",
        materiasExamen: "Matemáticas (20 pts), Química (30 pts), Recursos Naturales (30 pts), Lenguaje y Literatura (20 pts)",
        carreras: [
            { nombre: "Biología", descripcion: "Forma investigadores científicos de organismos vivos y ecosistemas, aportando conocimiento base para la salud, la agricultura y el medio ambiente.", aptitudes: ["Curiosidad científica", "Metodología de investigación rigurosa", "Paciencia para el trabajo de campo y laboratorio", "Capacidad de observación detallada"], vec: "MED" },
            { nombre: "Ingeniería agronómica", descripcion: "Se enfoca en la producción agrícola sostenible y el manejo técnico de cultivos, buscando maximizar el rendimiento respetando el suelo.", aptitudes: ["Interés en las ciencias biológicas y del suelo", "Gusto por el trabajo de campo", "Pensamiento orientado a la sostenibilidad", "Capacidad de planificar ciclos productivos"], vec: "ING" },
            { nombre: "Ingeniería Forestal", descripcion: "Gestiona y conserva técnicamente los recursos forestales, equilibrando el uso económico con la protección ambiental.", aptitudes: ["Conciencia ambiental", "Gusto por trabajar en terreno natural", "Capacidad de planificación a largo plazo", "Conocimiento de ecosistemas"], vec: "ING" },
            { nombre: "Ingeniería ambiental agrícola", descripcion: "Se especializa en el manejo del suelo, los sistemas de riego y el control del impacto ambiental de la actividad agrícola.", aptitudes: ["Interés en la relación agua-suelo-cultivo", "Rigor técnico y ambiental", "Trabajo de campo constante", "Pensamiento orientado a la sostenibilidad"], vec: "ING" },
        ]
    },
    {
        nombre: "Ámbitos de Seguridad y Defensa",
        materiasExamen: "Aptitud física, disciplina, evaluación psicométrica y entrevista personal",
        carreras: [
            { nombre: "Carrera militar", descripcion: "Forma oficiales preparados para la planificación estratégica de la defensa nacional, la táctica de combate y la logística de operaciones militares, dentro de una estructura jerárquica y disciplinada.", aptitudes: ["Disciplina y capacidad de obediencia jerárquica", "Fortaleza física y mental", "Liderazgo bajo presión extrema", "Compromiso de servicio y defensa del país"], vec: "MIL" },
            { nombre: "Carrera policial", descripcion: "Prepara oficiales para el patrullaje urbano preventivo, la preservación de la escena forense y el mantenimiento del orden público y la seguridad ciudadana.", aptitudes: ["Sentido del deber y de la justicia", "Serenidad en situaciones de riesgo", "Capacidad de reacción rápida", "Vocación de servicio a la comunidad"], vec: "POL" },
        ]
    },
];

const mbtiPorIdioma = {};
mbtiPorIdioma.en = { perfiles: [
    { cod: "INTJ", cat: "cat-analistas", titulo: "The Architect", desc: "A strategic mind with a long-term vision. Combines imagination with firm determination to design complex systems and put them into practice with precision." },
    { cod: "INTP", cat: "cat-analistas", titulo: "The Logician", desc: "An innovative thinker with an insatiable thirst for knowledge. Enjoys exploring theories and abstract ideas until finding the most elegant explanation possible." },
    { cod: "ENTJ", cat: "cat-analistas", titulo: "The Natural Commander", desc: "A born leader with an exceptional ability to organize people and resources. Combines strategic vision with executive skill. Drives change and demands results." },
    { cod: "ENTP", cat: "cat-analistas", titulo: "The Innovator", desc: "A curious, resourceful thinker who enjoys intellectual challenges. Questions the status quo and finds solutions where others only see obstacles." },
    { cod: "INFJ", cat: "cat-diplomaticos", titulo: "The Advocate", desc: "A calm, perceptive idealist with strong principles and a great ability to inspire others toward causes they believe are just." },
    { cod: "INFP", cat: "cat-diplomaticos", titulo: "The Mediator", desc: "A thoughtful, kind person guided by inner values. Always ready to help when they sense a noble cause behind it." },
    { cod: "ENFJ", cat: "cat-diplomaticos", titulo: "The Protagonist", desc: "A charismatic, inspiring leader capable of captivating and motivating a group. Genuinely connects with the needs of the people they lead." },
    { cod: "ENFP", cat: "cat-diplomaticos", titulo: "The Activist", desc: "An enthusiastic, creative spirit who finds energy in connecting ideas and people. Motivates others with an optimistic view of the future." },
    { cod: "ISTJ", cat: "cat-centinelas", titulo: "The Inspector", desc: "A practical, responsible person with a strong sense of duty. Follows through on commitments and maintains order even under pressure." },
    { cod: "ISFJ", cat: "cat-centinelas", titulo: "The Protector", desc: "A dedicated, warm defender, always attentive to the wellbeing of those around them. Prefers steady action over recognition." },
    { cod: "ESTJ", cat: "cat-centinelas", titulo: "The Executive", desc: "An excellent administrator, with a natural talent for organizing people, processes, and resources efficiently and in an orderly way." },
    { cod: "ESFJ", cat: "cat-centinelas", titulo: "The Consul", desc: "A warm, sociable person, very attentive to the group's needs. Builds community and makes sure everyone feels included." },
    { cod: "ISTP", cat: "cat-exploradores", titulo: "The Virtuoso", desc: "A practical, observant experimenter with a talent for understanding how things work and solving technical problems hands-on." },
    { cod: "ISFP", cat: "cat-exploradores", titulo: "The Adventurer", desc: "A sensitive, flexible person guided by their own aesthetic judgment. Prefers to express ideas through action rather than words." },
    { cod: "ESTP", cat: "cat-exploradores", titulo: "The Entrepreneur", desc: "An energetic, highly perceptive person who acts quickly in the face of challenges and enjoys living in constant motion." },
    { cod: "ESFP", cat: "cat-exploradores", titulo: "The Entertainer", desc: "Spontaneous, warm, and enthusiastic. Spreads positive energy to the group and enjoys living fully in the here and now." }
], rasgos: {
    INTJ: ["Analytical", "Strategic", "Independent", "Perfectionist", "Visionary"],
    INTP: ["Curious", "Innovative", "Analytical", "Objective", "Reflective"],
    ENTJ: ["Leader", "Efficient", "Strategic", "Charismatic", "Decisive"],
    ENTP: ["Resourceful", "Debater", "Curious", "Adaptable", "Bold"],
    INFJ: ["Idealistic", "Intuitive", "Committed", "Reserved", "Inspiring"],
    INFP: ["Empathetic", "Creative", "Idealistic", "Authentic", "Sensitive"],
    ENFJ: ["Charismatic", "Inspiring", "Empathetic", "Persuasive", "Altruistic"],
    ENFP: ["Enthusiastic", "Creative", "Sociable", "Spontaneous", "Optimistic"],
    ISTJ: ["Responsible", "Organized", "Meticulous", "Loyal", "Practical"],
    ISFJ: ["Loyal", "Warm", "Helpful", "Detail-oriented", "Protective"],
    ESTJ: ["Organized", "Direct", "Efficient", "Disciplined", "Practical"],
    ESFJ: ["Sociable", "Helpful", "Warm", "Organized", "Loyal"],
    ISTP: ["Practical", "Observant", "Independent", "Bold", "Resourceful"],
    ISFP: ["Sensitive", "Creative", "Flexible", "Curious", "Spontaneous"],
    ESTP: ["Energetic", "Bold", "Practical", "Persuasive", "Spontaneous"],
    ESFP: ["Spontaneous", "Sociable", "Enthusiastic", "Warm", "Fun-loving"]
}, grupos: {
    "cat-analistas": "Analysts",
    "cat-diplomaticos": "Diplomats",
    "cat-centinelas": "Sentinels",
    "cat-exploradores": "Explorers"
} };
mbtiPorIdioma.es = { perfiles: [
    { cod: "INTJ", cat: "cat-analistas", titulo: "El Arquitecto", desc: "Una mente estratégica con visión de largo plazo. Combina imaginación con determinación firme para diseñar sistemas complejos y llevarlos a la práctica con precisión." },
    { cod: "INTP", cat: "cat-analistas", titulo: "El Lógico", desc: "Un pensador innovador con una sed insaciable de conocimiento. Disfruta explorando teorías e ideas abstractas hasta encontrar la explicación más elegante posible." },
    { cod: "ENTJ", cat: "cat-analistas", titulo: "El Comandante", desc: "Un líder nato con una capacidad excepcional para organizar personas y recursos. Combina visión estratégica con habilidad ejecutiva. Impulsa el cambio y exige resultados." },
    { cod: "ENTP", cat: "cat-analistas", titulo: "El Innovador", desc: "Un pensador curioso e ingenioso que disfruta los desafíos intelectuales. Cuestiona lo establecido y encuentra soluciones donde otros solo ven obstáculos." },
    { cod: "INFJ", cat: "cat-diplomaticos", titulo: "El Defensor", desc: "Un idealista calmado y perceptivo, con principios firmes y una gran capacidad de inspirar a otros hacia causas que considera justas." },
    { cod: "INFP", cat: "cat-diplomaticos", titulo: "El Mediador", desc: "Una persona reflexiva y bondadosa, guiada por valores internos. Siempre dispuesta a ayudar cuando percibe una causa noble detrás." },
    { cod: "ENFJ", cat: "cat-diplomaticos", titulo: "El Protagonista", desc: "Un líder carismático e inspirador, capaz de cautivar y motivar a un grupo. Conecta genuinamente con las necesidades de las personas que lidera." },
    { cod: "ENFP", cat: "cat-diplomaticos", titulo: "El Activista", desc: "Un espíritu entusiasta y creativo que encuentra energía al conectar ideas y personas. Motiva a otros con una visión optimista del futuro." },
    { cod: "ISTJ", cat: "cat-centinelas", titulo: "El Inspector", desc: "Una persona práctica y responsable, con un fuerte sentido del deber. Cumple lo que promete y mantiene el orden incluso bajo presión." },
    { cod: "ISFJ", cat: "cat-centinelas", titulo: "El Protector", desc: "Una persona dedicada y cálida, siempre atenta al bienestar de quienes la rodean. Prefiere la acción constante antes que el reconocimiento." },
    { cod: "ESTJ", cat: "cat-centinelas", titulo: "El Ejecutivo", desc: "Un excelente administrador, con talento natural para organizar personas, procesos y recursos de forma eficiente y ordenada." },
    { cod: "ESFJ", cat: "cat-centinelas", titulo: "El Cónsul", desc: "Una persona cálida y sociable, muy atenta a las necesidades del grupo. Construye comunidad y se asegura de que todos se sientan incluidos." },
    { cod: "ISTP", cat: "cat-exploradores", titulo: "El Virtuoso", desc: "Un experimentador práctico y observador, con talento para entender cómo funcionan las cosas y resolver problemas técnicos de forma directa." },
    { cod: "ISFP", cat: "cat-exploradores", titulo: "El Aventurero", desc: "Una persona sensible y flexible, guiada por su propio juicio estético. Prefiere expresar ideas a través de la acción antes que con palabras." },
    { cod: "ESTP", cat: "cat-exploradores", titulo: "El Emprendedor", desc: "Una persona enérgica y muy perceptiva, que actúa rápido frente a los desafíos y disfruta vivir en constante movimiento." },
    { cod: "ESFP", cat: "cat-exploradores", titulo: "El Animador", desc: "Espontáneo, cálido y entusiasta. Contagia energía positiva al grupo y disfruta vivir plenamente el presente." }
], rasgos: {
    INTJ: ["Analítico", "Estratégico", "Independiente", "Perfeccionista", "Visionario"],
    INTP: ["Curioso", "Innovador", "Analítico", "Objetivo", "Reflexivo"],
    ENTJ: ["Líder", "Eficiente", "Estratégico", "Carismático", "Decidido"],
    ENTP: ["Ingenioso", "Debatiente", "Curioso", "Adaptable", "Audaz"],
    INFJ: ["Idealista", "Intuitivo", "Comprometido", "Reservado", "Inspirador"],
    INFP: ["Empático", "Creativo", "Idealista", "Auténtico", "Sensible"],
    ENFJ: ["Carismático", "Inspirador", "Empático", "Persuasivo", "Altruista"],
    ENFP: ["Entusiasta", "Creativo", "Sociable", "Espontáneo", "Optimista"],
    ISTJ: ["Responsable", "Organizado", "Meticuloso", "Leal", "Práctico"],
    ISFJ: ["Leal", "Cálido", "Servicial", "Detallista", "Protector"],
    ESTJ: ["Organizado", "Directo", "Eficiente", "Disciplinado", "Práctico"],
    ESFJ: ["Sociable", "Servicial", "Cálido", "Organizado", "Leal"],
    ISTP: ["Práctico", "Observador", "Independiente", "Audaz", "Ingenioso"],
    ISFP: ["Sensible", "Creativo", "Flexible", "Curioso", "Espontáneo"],
    ESTP: ["Enérgico", "Audaz", "Práctico", "Persuasivo", "Espontáneo"],
    ESFP: ["Espontáneo", "Sociable", "Entusiasta", "Cálido", "Divertido"]
}, grupos: {
    "cat-analistas": "Analistas",
    "cat-diplomaticos": "Diplomáticos",
    "cat-centinelas": "Centinelas",
    "cat-exploradores": "Exploradores"
} };

const bigFivePorIdioma = {};
bigFivePorIdioma.en = {
    OPE: { nombre: "Openness", resumen: "Curiosity, imagination, and appetite for new ideas and experiences.", queMide: "How curious you are, how much you enjoy new ideas, and how comfortable you feel with novelty and imagination versus proven, familiar ways of doing things.", alto: "You are drawn to new ideas, creative thinking, and unfamiliar experiences. You tend to question routines and enjoy exploring possibilities, though rigid, repetitive settings can feel dull.", medio: "You balance curiosity with practicality: you enjoy something new when it has a purpose, and you value proven methods when they work.", bajo: "You prefer concrete, practical, and proven approaches. You value consistency and clear procedures, and you tend to trust what has already been shown to work." },
    CON: { nombre: "Conscientiousness", resumen: "Organization, self-discipline, and follow-through on what you start.", queMide: "How organized, disciplined, and reliable you are when working toward goals, and how much you plan ahead versus improvise.", alto: "You plan ahead, care about details, and finish what you start, even when nobody is watching. Others tend to see you as dependable, though you may be hard on yourself when things are not perfect.", medio: "You are organized when it matters and flexible when it doesn't, adjusting your level of planning to the situation.", bajo: "You are flexible and spontaneous, and you adapt easily to changes. Strict schedules and long routine tasks can feel restrictive, so you work best with variety." },
    EXT: { nombre: "Extraversion", resumen: "How much you draw energy from people, activity, and stimulation.", queMide: "Where you get your energy: from social interaction, movement, and stimulation (higher scores) or from quiet time, small groups, and reflection (lower scores).", alto: "You feel energized around people, start conversations easily, and are comfortable taking the lead or the spotlight. Long stretches of solitude may drain you.", medio: "You enjoy company and also value your own time; you can be social or reserved depending on the moment.", bajo: "You recharge alone or in small groups, think before you speak, and prefer deep one-on-one conversations to large gatherings. This is a style, not shyness: it often comes with strong focus." },
    AGR: { nombre: "Agreeableness", resumen: "Cooperation, empathy, and trust toward other people.", queMide: "How much you prioritize cooperation, harmony, and other people's feelings compared with being direct, competitive, or skeptical.", alto: "You are warm, considerate, and quick to cooperate. You look for harmony and put yourself in other people's shoes, although you may find it hard to say no or to deliver harsh news.", medio: "You are cooperative but can hold your ground; you care about others while still defending your own position when needed.", bajo: "You are direct, objective, and comfortable with disagreement. You tend to question before trusting, which is valuable when tough, impartial decisions are needed." },
    EST: { nombre: "Emotional Stability", resumen: "How calm and resilient you stay under stress and setbacks.", queMide: "How steady you stay under pressure and how quickly you recover from setbacks. It is the reverse of Neuroticism: the questionnaire measures Neuroticism, and this score is 100 minus it, so that a higher number always reads as a steadier temperament.", alto: "You stay calm under pressure, recover quickly from disappointments, and rarely feel overwhelmed. Others may lean on you in tense moments.", medio: "You handle most pressure well, though very demanding situations can affect you for a while before you regain your balance.", bajo: "You feel stress and emotions intensely and tend to anticipate what could go wrong. This makes you attentive to risk and to other people's feelings, and it improves a lot with routines and support." },
};
bigFivePorIdioma.es = {
    OPE: { nombre: "Apertura", resumen: "Curiosidad, imaginación y apetito por ideas y experiencias nuevas.", queMide: "Qué tan curioso sos, cuánto disfrutás las ideas nuevas y qué tan cómodo te sentís con la novedad y la imaginación frente a formas de hacer las cosas probadas y familiares.", alto: "Te atraen las ideas nuevas, el pensamiento creativo y las experiencias poco familiares. Tendés a cuestionar las rutinas y disfrutás explorar posibilidades, aunque los entornos rígidos y repetitivos pueden resultarte aburridos.", medio: "Equilibrás la curiosidad con lo práctico: disfrutás algo nuevo cuando tiene un propósito, y valorás los métodos probados cuando funcionan.", bajo: "Preferís los enfoques concretos, prácticos y probados. Valorás la consistencia y los procedimientos claros, y tendés a confiar en lo que ya demostró funcionar." },
    CON: { nombre: "Responsabilidad", resumen: "Organización, disciplina personal y constancia en lo que emprendés.", queMide: "Qué tan organizado, disciplinado y confiable sos a la hora de trabajar hacia tus metas, y cuánto planificás en vez de improvisar.", alto: "Planificás con anticipación, cuidás los detalles y terminás lo que empezás, incluso cuando nadie está mirando. Los demás suelen verte como una persona confiable, aunque podés ser exigente con vos mismo cuando algo no sale perfecto.", medio: "Sos organizado cuando importa y flexible cuando no, ajustando tu nivel de planificación según la situación.", bajo: "Sos flexible y espontáneo, y te adaptás con facilidad a los cambios. Los horarios estrictos y las tareas rutinarias largas pueden resultarte restrictivos, así que trabajás mejor con variedad." },
    EXT: { nombre: "Extraversión", resumen: "Cuánta energía sacás de la gente, la actividad y el estímulo externo.", queMide: "De dónde sacás energía: de la interacción social, el movimiento y el estímulo (puntajes más altos) o del tiempo tranquilo, los grupos pequeños y la reflexión (puntajes más bajos).", alto: "Te energizás rodeado de gente, entablás conversaciones con facilidad y te sentís cómodo tomando la iniciativa o siendo el centro de atención. Los períodos largos de soledad pueden drenarte.", medio: "Disfrutás la compañía y también valorás tu propio tiempo; podés ser social o reservado según el momento.", bajo: "Recargás energía solo o en grupos pequeños, pensás antes de hablar y preferís las conversaciones profundas uno a uno antes que las reuniones grandes. Esto es un estilo, no timidez: suele venir acompañado de una gran capacidad de concentración." },
    AGR: { nombre: "Amabilidad", resumen: "Cooperación, empatía y confianza hacia las demás personas.", queMide: "Cuánto priorizás la cooperación, la armonía y los sentimientos de los demás frente a ser directo, competitivo o escéptico.", alto: "Sos cálido, considerado y rápido para cooperar. Buscás la armonía y te ponés en el lugar del otro, aunque puede costarte decir que no o dar malas noticias.", medio: "Sos cooperativo pero podés sostener tu posición; te importan los demás sin dejar de defender tu punto de vista cuando hace falta.", bajo: "Sos directo, objetivo y cómodo con el desacuerdo. Tendés a cuestionar antes de confiar, algo valioso cuando hacen falta decisiones duras e imparciales." },
    EST: { nombre: "Estabilidad Emocional", resumen: "Qué tan calmado y resiliente te mantenés bajo estrés y contratiempos.", queMide: "Qué tan firme te mantenés bajo presión y qué tan rápido te recuperás de los contratiempos. Es el reverso del Neuroticismo: el cuestionario mide Neuroticismo, y este puntaje es 100 menos ese valor, para que un número más alto siempre se lea como un temperamento más estable.", alto: "Te mantenés calmado bajo presión, te recuperás rápido de las decepciones y rara vez te sentís abrumado. Los demás pueden apoyarse en vos en momentos tensos.", medio: "Manejás bien la mayoría de las presiones, aunque las situaciones muy exigentes pueden afectarte por un tiempo antes de recuperar el equilibrio.", bajo: "Sentís el estrés y las emociones con intensidad y tendés a anticipar lo que podría salir mal. Esto te hace atento al riesgo y a los sentimientos de los demás, y mejora mucho con rutinas y apoyo." },
};

const hollandPorIdioma = {};
hollandPorIdioma.en = {
    R: { nombre: "Realistic", arquetipo: "The Doer", descripcion: "People with a Realistic profile like concrete, hands-on work: tools, machines, materials, the outdoors, and visible results. They prefer doing to talking.", actividades: "Building, repairing, operating equipment, assembling prototypes, working outdoors, practical problem-solving, physical or technical tasks." },
    I: { nombre: "Investigative", arquetipo: "The Thinker", descripcion: "People with an Investigative profile like to understand how things work. They enjoy analysis, research, and solving complex problems with evidence and logic.", actividades: "Researching, analyzing data, experimenting, reading technical material, diagnosing problems, building theories, working in laboratories." },
    A: { nombre: "Artistic", arquetipo: "The Creator", descripcion: "People with an Artistic profile value originality and self-expression. They like open-ended tasks where they can imagine, design, and communicate in their own way.", actividades: "Designing, drawing, writing, performing, composing, decorating, inventing new formats, and communicating ideas in creative ways." },
    S: { nombre: "Social", arquetipo: "The Helper", descripcion: "People with a Social profile are energized by helping, teaching, and caring for others. They read people well and build trust and cooperation.", actividades: "Teaching, counseling, caring for people, coordinating volunteers, mediating conflicts, listening, and supporting community work." },
    E: { nombre: "Enterprising", arquetipo: "The Persuader", descripcion: "People with an Enterprising profile like to lead, persuade, and make things happen. They are comfortable with risk, negotiation, and setting goals for a team.", actividades: "Leading teams, selling ideas, negotiating, starting ventures, managing budgets and resources, competing, and taking initiative." },
    C: { nombre: "Conventional", arquetipo: "The Organizer", descripcion: "People with a Conventional profile like order, clear rules, and precision. They are reliable with details, records, procedures, and structured systems.", actividades: "Organizing information, keeping records, following procedures, planning schedules, controlling budgets, checking accuracy, and administrative work." },
};
hollandPorIdioma.es = {
    R: { nombre: "Realista", arquetipo: "El Hacedor", descripcion: "Las personas con perfil Realista disfrutan el trabajo concreto y manual: herramientas, máquinas, materiales, el aire libre y resultados visibles. Prefieren hacer antes que hablar.", actividades: "Construir, reparar, operar equipos, armar prototipos, trabajar al aire libre, resolver problemas prácticos, tareas físicas o técnicas." },
    I: { nombre: "Investigador", arquetipo: "El Pensador", descripcion: "Las personas con perfil Investigador disfrutan entender cómo funcionan las cosas. Les gusta el análisis, la investigación y resolver problemas complejos con evidencia y lógica.", actividades: "Investigar, analizar datos, experimentar, leer material técnico, diagnosticar problemas, construir teorías, trabajar en laboratorios." },
    A: { nombre: "Artístico", arquetipo: "El Creador", descripcion: "Las personas con perfil Artístico valoran la originalidad y la expresión propia. Les gustan las tareas abiertas donde pueden imaginar, diseñar y comunicar a su manera.", actividades: "Diseñar, dibujar, escribir, actuar, componer, decorar, inventar formatos nuevos y comunicar ideas de forma creativa." },
    S: { nombre: "Social", arquetipo: "El Ayudante", descripcion: "Las personas con perfil Social se energizan ayudando, enseñando y cuidando a otros. Leen bien a las personas y construyen confianza y cooperación.", actividades: "Enseñar, aconsejar, cuidar personas, coordinar voluntarios, mediar conflictos, escuchar y apoyar el trabajo comunitario." },
    E: { nombre: "Emprendedor", arquetipo: "El Persuasor", descripcion: "Las personas con perfil Emprendedor disfrutan liderar, persuadir y hacer que las cosas sucedan. Se sienten cómodas con el riesgo, la negociación y fijar metas para un equipo.", actividades: "Liderar equipos, vender ideas, negociar, iniciar emprendimientos, administrar presupuestos y recursos, competir y tomar la iniciativa." },
    C: { nombre: "Convencional", arquetipo: "El Organizador", descripcion: "Las personas con perfil Convencional disfrutan el orden, las reglas claras y la precisión. Son confiables con los detalles, los registros, los procedimientos y los sistemas estructurados.", actividades: "Organizar información, llevar registros, seguir procedimientos, planificar cronogramas, controlar presupuestos, verificar exactitud y trabajo administrativo." },
};

const vectorNombresPorIdioma = {};
vectorNombresPorIdioma.en = { nombres: {
    ING: "Engineering and Technology", MED: "Medicine and Health", MIL: "Military Tactics and Defense",
    FIN: "Finance and Administration", ART: "Arts, Humanities and Social Sciences",
    POL: "Police Protection and Civil Security", CON: "Accounting and Auditing"
}, aptitudes: {
    ING: "logical-mathematical thinking, a knack for solving technical problems, and attention to detail",
    MED: "a vocation for service, empathy, and emotional stability for caring for others",
    MIL: "discipline, leadership under pressure, and commitment to service and defense",
    FIN: "strategic vision, quantitative thinking, and negotiation skills",
    ART: "creativity, social sensitivity, and ease of expression and communication",
    POL: "a sense of duty, composure under risk, and a vocation for community service",
    CON: "numerical precision, order, and rigor with regulations"
} };
vectorNombresPorIdioma.es = { nombres: {"ING": "Ingeniería y Tecnología", "MED": "Medicina y Salud", "MIL": "Tácticas Militares y Defensa", "FIN": "Finanzas y Administración", "ART": "Artes, Humanidades y Ciencias Sociales", "POL": "Protección Policial y Seguridad Civil", "CON": "Contabilidad y Auditoría"}, aptitudes: {"ING": "razonamiento técnico y resolución práctica de problemas", "MED": "cuidado de las personas y responsabilidad clínica", "MIL": "disciplina, liderazgo y servicio bajo presión", "FIN": "visión estratégica de negocio y manejo de recursos", "ART": "creatividad, comunicación y pensamiento crítico", "POL": "servicio comunitario y reacción ante el riesgo", "CON": "precisión numérica y cumplimiento normativo"} };

// Question bank per language. Structural fields (id, tipo, metodo, dim,
// polo, invierte) are identical across languages; only `texto` (and, for
// Holland, each option's `texto`) changes.
const preguntasPorIdioma = {};
preguntasPorIdioma.en = [
    { id: 1, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: true, texto: "You feel uncomfortable when your usual way of doing things changes unexpectedly." },
    { id: 2, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "You can criticize an idea objectively without it becoming personal." },
    { id: 3, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "When plans suddenly change, you adapt without difficulty." },
    { id: 4, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "You find it easy to forgive someone who hurt you, if they apologize." },
    { id: 5, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "You get bored quickly if an activity doesn't let you improvise or do something different each time." },
    { id: 6, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "You prefer to be told the truth straight, even when it's harsh." },
    { id: 7, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "You find it easy to make new friends in a place where you don't know anyone." },
    { id: 8, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "You're willing to give way in an argument in order to keep the peace." },
    { id: 9, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "You often find yourself imagining different possibilities for your future." },
    { id: 10, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "If you're offered two weekend plans, you almost always pick the one with more people." },
    { id: 11, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "You keep up a steady study or work routine, not just when there's pressure." },
    { id: 12, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "You often wonder whether things could be done in a completely different way." },
    { id: 13, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: true, texto: "You avoid big parties because they tire you out more than they please you." },
    { id: 14, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: false, texto: "You often worry about things that could go wrong." },
    { id: 15, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "Improvising a solution feels more natural to you than following a step-by-step manual." },
    { id: 16, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "After a day full of social activity, you end up with more energy than when you started." },
    { id: 17, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: true, texto: "After a failure or a disappointment, you bounce back quickly." },
    { id: 18, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "You take care of the details so your work turns out well." },
    { id: 19, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "At a gathering of friends, you're usually the one who livens up the conversation." },
    { id: 20, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "You prefer to keep your options open and decide as you go." },
    { id: 21, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "You feel uncomfortable leaving a decision pending for a long time." },
    { id: 22, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "Before giving an opinion on something, you usually put yourself in the other person's shoes." },
    { id: 23, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "You keep your commitments even when nobody is checking whether you do." },
    { id: 24, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "After a long meeting with lots of people, you need some quiet time to recover." },
    { id: 25, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "You're usually the person who suggests plans when you're with friends." },
    { id: 26, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "You'd rather spend time with two or three close friends than with a large group." },
    { id: 27, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: false, texto: "Before an important exam or presentation, you feel a lot of tension." },
    { id: 28, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: true, texto: "You prefer familiar routines over trying something completely new." },
    { id: 29, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "Keeping the group's harmony matters so much to you that you sometimes give in even when you're right." },
    { id: 30, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "You like meeting new people at events or social activities." },
    { id: 31, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "You like trying foods, places, or experiences you've never tried before." },
    { id: 32, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "When you buy a new piece of technology, you read the manual first before experimenting on your own." },
    { id: 33, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "You usually finish your tasks well before the deadline." },
    { id: 34, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "You make an effort to understand the point of view of someone you disagree with." },
    { id: 35, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: true, texto: "You find it hard to stay disciplined when a task becomes boring." },
    { id: 36, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "When analyzing a situation, the first things you notice are the concrete details." },
    { id: 37, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "You prefer to write down your ideas before sharing them with the group, rather than thinking them through out loud." },
    { id: 38, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "You avoid unnecessary conflict and look for ways to get along with everyone." },
    { id: 39, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "When you have to decide something, you trust proven facts more than your hunches." },
    { id: 40, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: false, texto: "The mistakes you make keep going around in your head for a long time." },
    { id: 41, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "A project without clear rules excites you more than one with detailed step-by-step instructions." },
    { id: 42, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: true, texto: "You feel more energized when there is a lot of movement and stimulation around you." },
    { id: 43, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: true, texto: "You have no trouble being blunt or curt if you think someone is wrong." },
    { id: 44, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "You think better when you talk your ideas through out loud with other people." },
    { id: 45, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: true, texto: "You rarely feel overwhelmed by your responsibilities." },
    { id: 46, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "New ideas attract you even if nobody has tried them yet." },
    { id: 47, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "You enjoy conversations about abstract or philosophical ideas." },
    { id: 48, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "You finish what you start, even if it takes longer than expected." },
    { id: 49, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "You perform better when you work under last-minute pressure." },
    { id: 50, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "You enjoy being the center of attention at a gathering." },
    { id: 51, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "In a conflict, you look for the fairest solution based on the facts, even if someone doesn't like it." },
    { id: 52, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "You genuinely care about the wellbeing of the people around you." },
    { id: 53, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "If a friend makes a mistake in a group project, you tell them directly even if it makes them feel bad." },
    { id: 54, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "You like to question how things are done and propose different ways." },
    { id: 55, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "Fixed routines bore you; you'd rather have every day be different." },
    { id: 56, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "When facing an important decision, you prioritize logic even if it affects someone's feelings." },
    { id: 57, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: true, texto: "You often leave tasks half-done when you lose interest." },
    { id: 58, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "When you arrive at an event where you don't know anyone, it's easy for you to walk up and talk to someone." },
    { id: 59, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "You like finding connections between ideas that don't seem related at first glance." },
    { id: 60, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: true, texto: "In high-pressure situations, you manage to stay calm." },
    { id: 61, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "You feel better when you have a clear plan for your day or your week." },
    { id: 62, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "Before speaking up in a group, you prefer to think carefully about what you're going to say." },
    { id: 63, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "You feel energized by being surrounded by lots of social activity and movement." },
    { id: 64, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: true, texto: "When things don't go the way you expected, you keep your composure." },
    { id: 65, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "Before giving a harsh opinion, you first think about how the other person will feel." },
    { id: 66, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "You plan your tasks ahead of time instead of leaving them for the last minute." },
    { id: 67, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "It bothers you not to know what you'll be doing on the weekend until the last minute." },
    { id: 68, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "You enjoy traveling to places with cultures very different from yours." },
    { id: 69, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "A last-minute change to your plans bothers you." },
    { id: 70, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: true, texto: "You tend to distrust the intentions of people you've just met." },
    { id: 71, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "Other people's emotions weigh heavily when you have to make a decision." },
    { id: 72, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "If someone explains how to do something, you prefer to follow the steps as given rather than improvise." },
    { id: 73, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "You consider yourself a very imaginative person." },
    { id: 74, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "When you need to concentrate, you prefer a quiet place without interruptions." },
    { id: 75, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "You keep your work or study space organized." },
    { id: 76, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "You prefer the practical and realistic over the theoretical and abstract." },
    { id: 77, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: false, texto: "Your mood changes quite a bit from one day to the next." },
    { id: 78, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "You find it hard to make a decision that you know will make someone else feel bad." },
    { id: 79, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "You feel comfortable speaking in public in front of many people." },
    { id: 80, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "You trust that most people have good intentions." },
    { id: 81, tipo: "escenario", metodo: "HOLLAND", texto: "You're assigned to lead a new project with no prior instructions. What would you do first?",
      opciones: [
        { letra: "R", texto: "I'd start by physically testing the materials or tools available before settling on a plan." },
        { letra: "I", texto: "I'd design, step by step, the technical process needed to build it from scratch." },
        { letra: "A", texto: "I'd explore an original, creative idea before deciding on the final form." },
        { letra: "S", texto: "I'd make sure nobody on the team is overloaded before moving forward." },
        { letra: "E", texto: "I'd look for a way to make it profitable and pitch the idea to win support." },
        { letra: "C", texto: "I'd begin by organizing a detailed schedule and an orderly task list." }
      ] },
    { id: 82, tipo: "escenario", metodo: "HOLLAND", texto: "An emergency happens in your community and a group of neighbors organizes to help. What role would you take?",
      opciones: [
        { letra: "R", texto: "I'd repair or improvise whatever equipment is needed on the spot." },
        { letra: "I", texto: "I'd check the symptoms of the affected people to decide who to attend to first." },
        { letra: "A", texto: "I'd document everything with photos or video to make what's happening visible." },
        { letra: "S", texto: "I'd give emotional support to those who are most affected." },
        { letra: "E", texto: "I'd look for a way to quickly secure donations or support for the community." },
        { letra: "C", texto: "I'd put together a list of the volunteers' names, hours, and shifts." }
      ] },
    { id: 83, tipo: "escenario", metodo: "HOLLAND", texto: "You have a completely free weekend with no plans. What are you most likely to do?",
      opciones: [
        { letra: "R", texto: "I'd use the time to repair or improve something at home with my own hands." },
        { letra: "I", texto: "I'd research a topic that intrigues me until I understand how it works in depth." },
        { letra: "A", texto: "I'd spend the time drawing, writing, playing an instrument, or creating something." },
        { letra: "S", texto: "I'd visit a relative or friend who needs company." },
        { letra: "E", texto: "I'd use the time to move forward on a personal project that could earn me income." },
        { letra: "C", texto: "I'd organize and tidy up my to-do list or my personal spaces." }
      ] },
    { id: 84, tipo: "escenario", metodo: "HOLLAND", texto: "In a group assignment, you're given a topic to research and present. Which role do you prefer to take?",
      opciones: [
        { letra: "R", texto: "I'd offer to build the hands-on part or the prototype of the assignment." },
        { letra: "I", texto: "I'd take charge of researching and analyzing the most technical information on the topic." },
        { letra: "A", texto: "I'd propose the most original way to present the work to the rest of the class." },
        { letra: "S", texto: "I'd make sure everyone in the group participates and feels heard." },
        { letra: "E", texto: "I'd take the role of coordinating the group and assigning the tasks." },
        { letra: "C", texto: "I'd draw up the delivery schedule and check that everything meets the required format." }
      ] },
    { id: 85, tipo: "escenario", metodo: "HOLLAND", texto: "An important household appliance breaks down at home. What would you do first?",
      opciones: [
        { letra: "R", texto: "I'd try to take it apart and repair it myself before calling a technician." },
        { letra: "I", texto: "I'd look up technical information to understand exactly what failed." },
        { letra: "A", texto: "I'd look for a creative workaround while I manage to fix or replace it." },
        { letra: "S", texto: "I'd ask a trusted person who knows about the subject for advice." },
        { letra: "E", texto: "I'd look for where to get the best price to repair it or buy a new one." },
        { letra: "C", texto: "I'd check the manual and follow the official instructions step by step." }
      ] },
    { id: 86, tipo: "escenario", metodo: "HOLLAND", texto: "You're asked to help organize a fundraising event for a social cause. What would you take care of?",
      opciones: [
        { letra: "R", texto: "The physical setup of the event venue." },
        { letra: "I", texto: "Researching what kind of event tends to work best for raising funds." },
        { letra: "A", texto: "Designing the decoration, the posters, or the visual identity of the event." },
        { letra: "S", texto: "Motivating and coordinating the volunteers who will take part." },
        { letra: "E", texto: "Finding sponsors or ways to bring in more money for the cause." },
        { letra: "C", texto: "Keeping detailed control of the expenses, income, and schedules of the event." }
      ] },
    { id: 87, tipo: "escenario", metodo: "HOLLAND", texto: "A close friend is going through a hard personal problem. How would you help?",
      opciones: [
        { letra: "R", texto: "I'd help with something concrete and practical that could ease the situation." },
        { letra: "I", texto: "I'd help them analyze the problem step by step to find the best solution." },
        { letra: "A", texto: "I'd suggest a creative activity to take their mind off it and let it out." },
        { letra: "S", texto: "I'd sit and listen calmly, without rushing to offer solutions." },
        { letra: "E", texto: "I'd encourage them to take action and find an active way out of the situation." },
        { letra: "C", texto: "I'd help them organize their to-do list so the problem feels more manageable." }
      ] },
    { id: 88, tipo: "escenario", metodo: "HOLLAND", texto: "You have some free time during a trip to a new city. What would you do with it?",
      opciones: [
        { letra: "R", texto: "I'd look for a physical or adventure activity to do outdoors." },
        { letra: "I", texto: "I'd visit a museum or a historical site to learn something new." },
        { letra: "A", texto: "I'd look for art galleries, live music, or craft markets." },
        { letra: "S", texto: "I'd look to chat with local people to learn about their way of life." },
        { letra: "E", texto: "I'd look for business opportunities or ideas I could replicate in my city." },
        { letra: "C", texto: "I'd plan every stop on the route ahead of time so as not to waste time." }
      ] },
    { id: 89, tipo: "escenario", metodo: "HOLLAND", texto: "At work or in class, you're asked for ideas to create a new product. What kind of proposal would you make?",
      opciones: [
        { letra: "R", texto: "I'd propose a simple, functional product that's easy to manufacture." },
        { letra: "I", texto: "I'd propose researching what the market actually needs before deciding." },
        { letra: "A", texto: "I'd propose something visually striking and different from what already exists." },
        { letra: "S", texto: "I'd propose something that solves an important problem for people." },
        { letra: "E", texto: "I'd propose the idea with the most sales potential and profit." },
        { letra: "C", texto: "I'd propose a detailed plan of how it would be produced step by step." }
      ] },
    { id: 90, tipo: "escenario", metodo: "HOLLAND", texto: "A teammate makes a major mistake in a group project. How do you react first?",
      opciones: [
        { letra: "R", texto: "I'd get straight to fixing the mistake in a practical way." },
        { letra: "I", texto: "I'd calmly analyze what caused the mistake before fixing it." },
        { letra: "A", texto: "I'd look for a different, creative way to resolve what went wrong." },
        { letra: "S", texto: "I'd talk to my teammate with empathy so they don't feel bad." },
        { letra: "E", texto: "I'd take the initiative to quickly reorganize the team so we don't lose time." },
        { letra: "C", texto: "I'd review the rest of the work to make sure there are no similar mistakes." }
      ] },
    { id: 91, tipo: "escenario", metodo: "HOLLAND", texto: "At an event with a lot of people, you notice a situation that could put the attendees' safety at risk. What would you do first?",
      opciones: [
        { letra: "R", texto: "I'd act immediately with concrete physical actions to bring the situation under control." },
        { letra: "I", texto: "I'd quickly assess the risks before deciding how to act." },
        { letra: "A", texto: "I'd look for the most creative way to calm people down without causing panic." },
        { letra: "S", texto: "I'd focus on protecting and reassuring the most vulnerable people." },
        { letra: "E", texto: "I'd take command of the situation and give clear orders to those present." },
        { letra: "C", texto: "I'd follow the established safety protocol, step by step, without deviating from it." }
      ] },
    { id: 92, tipo: "escenario", metodo: "HOLLAND", texto: "You're asked to help organize the inventory of a small family business. Which part would draw your attention most?",
      opciones: [
        { letra: "R", texto: "Taking care of physically moving and arranging the merchandise." },
        { letra: "I", texto: "Analyzing the sales data to understand what moves the most and what doesn't." },
        { letra: "A", texto: "Proposing a more attractive way to display the products." },
        { letra: "S", texto: "Making sure the team is comfortable with the new organization." },
        { letra: "E", texto: "Thinking about how that organization could help sell more." },
        { letra: "C", texto: "Building a detailed system of categories, labels, and records." }
      ] },
    { id: 93, tipo: "escenario", metodo: "HOLLAND", texto: "You get the chance to start a small business of your own. What would you focus on first?",
      opciones: [
        { letra: "R", texto: "Producing or making what I'm going to sell myself." },
        { letra: "I", texto: "Researching the market thoroughly before deciding whether it's worth starting." },
        { letra: "A", texto: "Giving the business an attractive, original visual identity." },
        { letra: "S", texto: "Thinking about how that business can benefit other people." },
        { letra: "E", texto: "Jumping in quickly to offer it and find the first customers." },
        { letra: "C", texto: "Putting together a budget and a detailed plan before taking any step." }
      ] },
    { id: 94, tipo: "escenario", metodo: "HOLLAND", texto: "A close relative falls ill and needs care for a few days. What role would you take?",
      opciones: [
        { letra: "R", texto: "Handling the practical tasks: taking them to the doctor, getting their things ready." },
        { letra: "I", texto: "Researching their condition to understand how to help better." },
        { letra: "A", texto: "Finding ways to cheer them up with creative activities while they recover." },
        { letra: "S", texto: "Staying by their side and giving them emotional support." },
        { letra: "E", texto: "Coordinating with other relatives who takes care of what." },
        { letra: "C", texto: "Organizing a clear schedule for medications, appointments, and care." }
      ] },
    { id: 95, tipo: "escenario", metodo: "HOLLAND", texto: "You take part in an important contest or competition. How do you prepare?",
      opciones: [
        { letra: "R", texto: "By practicing the most technical or physical part of the competition." },
        { letra: "I", texto: "By thoroughly studying the rules and strategies before taking part." },
        { letra: "A", texto: "By looking for an original way to stand out from the other participants." },
        { letra: "S", texto: "By focusing more on the experience of sharing with the group than on winning." },
        { letra: "E", texto: "By being motivated above all by the idea of competing and winning." },
        { letra: "C", texto: "By following an orderly, disciplined preparation plan." }
      ] },
    { id: 96, tipo: "escenario", metodo: "HOLLAND", texto: "A minor accident happens near you and you have to react quickly. What would you do?",
      opciones: [
        { letra: "R", texto: "I'd act immediately, doing whatever is needed with my hands to help." },
        { letra: "I", texto: "I'd quickly assess the situation to decide on the best course of action." },
        { letra: "A", texto: "I'd try to calm the atmosphere with a relaxed and original attitude." },
        { letra: "S", texto: "I'd focus on calming and comforting the people affected." },
        { letra: "E", texto: "I'd take control of the situation and give instructions to the others." },
        { letra: "C", texto: "I'd follow the safety protocol step by step, without skipping any." }
      ] },
    { id: 97, tipo: "escenario", metodo: "HOLLAND", texto: "You're asked to design something (a logo, a decoration, a presentation). What would you prioritize?",
      opciones: [
        { letra: "R", texto: "That the design is functional and easy to build." },
        { letra: "I", texto: "Researching references and trends before proposing a design." },
        { letra: "A", texto: "Letting my creativity take over to propose something original." },
        { letra: "S", texto: "First asking what the person who'll use it needs and likes." },
        { letra: "E", texto: "Thinking about which design would attract the most attention and make the biggest impact." },
        { letra: "C", texto: "Following an established template or format so I don't stray from what's expected." }
      ] },
    { id: 98, tipo: "escenario", metodo: "HOLLAND", texto: "A conflict arises between two teammates on your work team. What would you do first?",
      opciones: [
        { letra: "R", texto: "I'd look for a practical, immediate solution so the work doesn't stop." },
        { letra: "I", texto: "I'd calmly analyze what caused the conflict before stepping in." },
        { letra: "A", texto: "I'd propose a different kind of activity so both can see the problem from another angle." },
        { letra: "S", texto: "I'd talk to each of them separately to understand how they feel." },
        { letra: "E", texto: "I'd make the final decision to resolve the conflict quickly and keep moving." },
        { letra: "C", texto: "I'd propose clear rules so that this kind of conflict doesn't happen again." }
      ] },
    { id: 99, tipo: "escenario", metodo: "HOLLAND", texto: "You have to learn something completely new in a short time. How do you approach it?",
      opciones: [
        { letra: "R", texto: "I'd learn by practicing directly, through trial and error." },
        { letra: "I", texto: "I'd gather as much information as possible before starting to practice." },
        { letra: "A", texto: "I'd look for a creative and entertaining way to learn it." },
        { letra: "S", texto: "I'd find someone who already knows it to teach me." },
        { letra: "E", texto: "I'd focus on learning the bare minimum needed to move forward fast." },
        { letra: "C", texto: "I'd follow a structured course or guide, step by step." }
      ] },
    { id: 100, tipo: "escenario", metodo: "HOLLAND", texto: "A community project is looking for volunteers to look after the environment. What would you like to do?",
      opciones: [
        { letra: "R", texto: "Take part directly in the physical tasks of cleaning up or planting." },
        { letra: "I", texto: "Investigate which environmental problem is the most urgent in the area." },
        { letra: "A", texto: "Create visual material to raise awareness in the community." },
        { letra: "S", texto: "Motivate and invite more people to take part." },
        { letra: "E", texto: "Look for funding or partnerships so the project can grow." },
        { letra: "C", texto: "Organize the schedule of activities and tasks for the project." }
      ] }
];
preguntasPorIdioma.es = [
    { id: 1, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: true, texto: "Te incomodan los cambios inesperados en tu forma habitual de hacer las cosas." },
    { id: 2, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "Puedes criticar una idea con objetividad sin que se convierta en algo personal." },
    { id: 3, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "Cuando los planes cambian de repente, te adaptas sin dificultad." },
    { id: 4, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "Te resulta fácil perdonar a alguien que te lastimó, si se disculpa." },
    { id: 5, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "Te aburres rápido si una actividad no te permite improvisar o hacer algo distinto cada vez." },
    { id: 6, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "Prefieres que te digan la verdad de frente, aunque sea dura." },
    { id: 7, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "Te resulta fácil hacer nuevos amigos en un lugar donde no conoces a nadie." },
    { id: 8, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "Estás dispuesto a ceder en una discusión con tal de mantener la armonía." },
    { id: 9, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "Con frecuencia te encuentras imaginando distintas posibilidades sobre tu futuro." },
    { id: 10, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "Si te ofrecen dos planes para el fin de semana, casi siempre eliges el que incluye más gente." },
    { id: 11, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "Sigues una rutina de estudio o trabajo constante, no solo cuando hay presión." },
    { id: 12, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "Sueles preguntarte si las cosas podrían hacerse de una manera completamente distinta." },
    { id: 13, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: true, texto: "Evitas las fiestas grandes porque te generan más cansancio que disfrute." },
    { id: 14, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: false, texto: "Con frecuencia te preocupas por cosas que podrían salir mal." },
    { id: 15, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "Te resulta más natural improvisar una solución que seguir un manual paso a paso." },
    { id: 16, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "Tras un día de mucha actividad social, terminas con más energía que cuando empezaste." },
    { id: 17, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: true, texto: "Después de un fracaso o una decepción, te recuperas con rapidez." },
    { id: 18, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "Cuidas los detalles para que tu trabajo quede bien hecho." },
    { id: 19, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "En una reunión de amigos, sueles ser quien anima la conversación." },
    { id: 20, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "Prefieres dejar las opciones abiertas y decidir sobre la marcha." },
    { id: 21, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "Te sientes incómodo dejando una decisión pendiente por mucho tiempo." },
    { id: 22, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "Antes de opinar sobre algo, sueles ponerte en el lugar de la otra persona." },
    { id: 23, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "Cumples tus compromisos incluso cuando nadie está revisando si lo haces." },
    { id: 24, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "Después de una reunión larga con mucha gente, necesitas un rato de silencio para recuperarte." },
    { id: 25, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "Sueles ser la persona que propone planes cuando estás con amigos." },
    { id: 26, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "Prefieres pasar el tiempo con dos o tres amigos cercanos que con un grupo numeroso." },
    { id: 27, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: false, texto: "Antes de un examen o una presentación importante, sientes mucha tensión." },
    { id: 28, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: true, texto: "Prefieres rutinas conocidas antes que probar algo completamente nuevo." },
    { id: 29, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "Mantener la armonía del grupo te importa tanto que a veces cedes aunque tengas razón." },
    { id: 30, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "Te gusta conocer gente nueva en eventos o actividades sociales." },
    { id: 31, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "Te gusta probar comidas, lugares o experiencias que nunca has probado antes." },
    { id: 32, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "Cuando compras algo tecnológico nuevo, primero revisas el manual antes de experimentar por tu cuenta." },
    { id: 33, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "Sueles terminar tus tareas mucho antes de la fecha límite." },
    { id: 34, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "Te esfuerzas por entender el punto de vista de alguien con quien no estás de acuerdo." },
    { id: 35, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: true, texto: "Te cuesta mantener la disciplina cuando una tarea se vuelve aburrida." },
    { id: 36, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "Al analizar una situación, lo primero que notas son los detalles concretos." },
    { id: 37, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "Prefieres escribir tus ideas antes de compartirlas con el grupo, en vez de pensarlas en voz alta." },
    { id: 38, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "Evitas conflictos innecesarios y buscas la manera de llevarte bien con todos." },
    { id: 39, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "Cuando debes decidir algo, confías más en los hechos comprobados que en tus corazonadas." },
    { id: 40, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: false, texto: "Los errores que cometes te siguen dando vueltas en la cabeza durante mucho tiempo." },
    { id: 41, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "Te entusiasma más un proyecto sin reglas claras que uno con instrucciones detalladas paso a paso." },
    { id: 42, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: true, texto: "Te sientes con más energía cuando hay mucho movimiento y estímulos a tu alrededor." },
    { id: 43, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: true, texto: "No te cuesta ser directo o cortante si consideras que alguien se equivoca." },
    { id: 44, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "Piensas mejor cuando comentas tus ideas en voz alta con otras personas." },
    { id: 45, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: true, texto: "Rara vez sientes que tus responsabilidades te sobrepasan." },
    { id: 46, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "Las ideas nuevas te atraen aunque nadie las haya probado todavía." },
    { id: 47, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "Disfrutas conversaciones sobre ideas abstractas o filosóficas." },
    { id: 48, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "Terminas lo que empiezas, aunque te tome más tiempo del esperado." },
    { id: 49, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "Rindes mejor cuando trabajas con la presión del último momento." },
    { id: 50, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "Disfrutas ser el centro de atención en una reunión." },
    { id: 51, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "En un conflicto, buscas la solución más justa según los hechos, aunque a alguien no le agrade." },
    { id: 52, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "Te importa genuinamente el bienestar de las personas que te rodean." },
    { id: 53, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "Si un amigo comete un error en un trabajo grupal, se lo dices de forma directa aunque se sienta mal." },
    { id: 54, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "Te gusta cuestionar cómo se hacen las cosas y proponer formas distintas." },
    { id: 55, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "P", invierte: true, texto: "Las rutinas fijas te aburren; prefieres que cada día sea distinto." },
    { id: 56, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "T", invierte: true, texto: "Ante una decisión importante, priorizas la lógica aunque eso afecte los sentimientos de alguien." },
    { id: 57, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: true, texto: "Sueles dejar tareas a medias cuando pierdes el interés." },
    { id: 58, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "E", invierte: false, texto: "Al llegar a un evento donde no conoces a nadie, te resulta fácil acercarte a hablar con alguien." },
    { id: 59, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "N", invierte: false, texto: "Te gusta encontrar conexiones entre ideas que a simple vista no parecen relacionadas." },
    { id: 60, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: true, texto: "En situaciones de presión, logras mantener la calma." },
    { id: 61, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "Te sientes mejor cuando tienes un plan claro para tu día o tu semana." },
    { id: 62, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "Antes de opinar en un grupo, prefieres pensar bien lo que vas a decir." },
    { id: 63, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "Te energiza estar rodeado de mucha actividad y movimiento social." },
    { id: 64, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: true, texto: "Cuando las cosas no salen como esperabas, conservas la tranquilidad." },
    { id: 65, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "Antes de dar una opinión dura, piensas primero en cómo se sentirá la otra persona." },
    { id: 66, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "Planificas tus tareas con anticipación en vez de dejarlas para el último momento." },
    { id: 67, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "Te resulta incómodo no saber qué vas a hacer el fin de semana hasta último momento." },
    { id: 68, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "Disfrutas viajar a lugares con culturas muy diferentes a la tuya." },
    { id: 69, tipo: "likert", metodo: "MBTI", dim: "JP", polo: "J", invierte: false, texto: "Un cambio de último momento en tus planes te incomoda." },
    { id: 70, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: true, texto: "Sueles desconfiar de las intenciones de personas que acabas de conocer." },
    { id: 71, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "Las emociones de los demás pesan mucho cuando tienes que decidir." },
    { id: 72, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "Si te explican cómo hacer algo, prefieres seguir los pasos tal como son antes que improvisar." },
    { id: 73, tipo: "likert", metodo: "BIGFIVE", dim: "OPE", invierte: false, texto: "Te consideras una persona con mucha imaginación." },
    { id: 74, tipo: "likert", metodo: "MBTI", dim: "EI", polo: "I", invierte: true, texto: "Cuando necesitas concentrarte, prefieres un lugar silencioso y sin interrupciones." },
    { id: 75, tipo: "likert", metodo: "BIGFIVE", dim: "CON", invierte: false, texto: "Mantienes tu espacio de trabajo o estudio organizado." },
    { id: 76, tipo: "likert", metodo: "MBTI", dim: "SN", polo: "S", invierte: true, texto: "Prefieres lo práctico y realista a lo teórico y abstracto." },
    { id: 77, tipo: "likert", metodo: "BIGFIVE", dim: "NEU", invierte: false, texto: "Tu estado de ánimo cambia bastante de un día a otro." },
    { id: 78, tipo: "likert", metodo: "MBTI", dim: "TF", polo: "F", invierte: false, texto: "Te cuesta tomar una decisión que sabes que hará sentir mal a otra persona." },
    { id: 79, tipo: "likert", metodo: "BIGFIVE", dim: "EXT", invierte: false, texto: "Te sientes cómodo hablando en público frente a muchas personas." },
    { id: 80, tipo: "likert", metodo: "BIGFIVE", dim: "AGR", invierte: false, texto: "Confías en que la mayoría de las personas tienen buenas intenciones." },
    { id: 81, tipo: "escenario", metodo: "HOLLAND", texto: "Te asignan liderar un nuevo proyecto sin instrucciones previas. ¿Qué harías primero?",
      opciones: [
        { letra: "R", texto: "Empezaría por probar físicamente los materiales o herramientas disponibles antes de decidir un plan." },
        { letra: "I", texto: "Diseñaría, paso a paso, el proceso técnico necesario para construirlo desde cero." },
        { letra: "A", texto: "Exploraría una idea original y creativa antes de decidirme por la forma final." },
        { letra: "S", texto: "Me aseguraría de que nadie en el equipo esté sobrecargado antes de seguir adelante." },
        { letra: "E", texto: "Buscaría la manera de hacerlo rentable y presentaría la idea para obtener apoyo." },
        { letra: "C", texto: "Comenzaría por organizar un cronograma detallado y una lista de tareas ordenada." }
      ] },
    { id: 82, tipo: "escenario", metodo: "HOLLAND", texto: "En tu comunidad ocurre una emergencia y un grupo de vecinos se organiza para ayudar. ¿Qué rol tomarías?",
      opciones: [
        { letra: "R", texto: "Repararía o improvisaría el equipo que se necesite en el momento." },
        { letra: "I", texto: "Revisaría los síntomas de las personas afectadas para decidir a quién atender primero." },
        { letra: "A", texto: "Documentaría todo con fotos o video para visibilizar lo que está pasando." },
        { letra: "S", texto: "Acompañaría emocionalmente a quienes están más afectados." },
        { letra: "E", texto: "Buscaría la forma de conseguir donaciones o apoyo rápido para la comunidad." },
        { letra: "C", texto: "Organizaría una lista con los nombres, horarios y turnos de los voluntarios." }
      ] },
    { id: 83, tipo: "escenario", metodo: "HOLLAND", texto: "Tienes un fin de semana completamente libre, sin planes. ¿Qué es lo más probable que hagas?",
      opciones: [
        { letra: "R", texto: "Aprovecharía para reparar o mejorar algo en mi casa con mis propias manos." },
        { letra: "I", texto: "Investigaría un tema que me intriga hasta entender cómo funciona a fondo." },
        { letra: "A", texto: "Dedicaría el tiempo a dibujar, escribir, tocar un instrumento o crear algo." },
        { letra: "S", texto: "Visitaría a un familiar o amigo que necesita compañía." },
        { letra: "E", texto: "Aprovecharía para avanzar en un proyecto personal que podría generarme ingresos." },
        { letra: "C", texto: "Organizaría y ordenaría mis pendientes o mis espacios personales." }
      ] },
    { id: 84, tipo: "escenario", metodo: "HOLLAND", texto: "En un trabajo grupal te asignan un tema para investigar y presentar. ¿Qué rol prefieres tomar?",
      opciones: [
        { letra: "R", texto: "Me ofrecería a armar la parte práctica o el prototipo del trabajo." },
        { letra: "I", texto: "Me encargaría de investigar y analizar la información más técnica del tema." },
        { letra: "A", texto: "Propondría la forma más original de presentar el trabajo al resto de la clase." },
        { letra: "S", texto: "Me aseguraría de que todos en el grupo participen y se sientan escuchados." },
        { letra: "E", texto: "Tomaría el rol de coordinar al grupo y repartir las tareas." },
        { letra: "C", texto: "Armaría el cronograma de entregas y revisaría que todo cumpla el formato pedido." }
      ] },
    { id: 85, tipo: "escenario", metodo: "HOLLAND", texto: "Un electrodoméstico importante se daña en tu casa. ¿Qué harías primero?",
      opciones: [
        { letra: "R", texto: "Intentaría desarmarlo y repararlo yo mismo antes de llamar a un técnico." },
        { letra: "I", texto: "Buscaría información técnica para entender exactamente qué falló." },
        { letra: "A", texto: "Buscaría una solución creativa mientras consigo arreglarlo o reemplazarlo." },
        { letra: "S", texto: "Le pediría consejo a alguien de confianza que sepa del tema." },
        { letra: "E", texto: "Buscaría dónde conseguir el mejor precio para repararlo o comprar uno nuevo." },
        { letra: "C", texto: "Revisaría el manual y seguiría paso a paso las instrucciones oficiales." }
      ] },
    { id: 86, tipo: "escenario", metodo: "HOLLAND", texto: "Te piden ayudar a organizar un evento para recaudar fondos con una causa social. ¿De qué te encargarías?",
      opciones: [
        { letra: "R", texto: "Del montaje físico del lugar del evento." },
        { letra: "I", texto: "De investigar qué tipo de evento suele funcionar mejor para recaudar fondos." },
        { letra: "A", texto: "De diseñar la decoración, los afiches o la identidad visual del evento." },
        { letra: "S", texto: "De motivar y coordinar a los voluntarios que participarán." },
        { letra: "E", texto: "De buscar patrocinadores o formas de conseguir más dinero para la causa." },
        { letra: "C", texto: "De llevar el control detallado de gastos, ingresos y horarios del evento." }
      ] },
    { id: 87, tipo: "escenario", metodo: "HOLLAND", texto: "Un amigo cercano está pasando por un problema personal difícil. ¿Cómo lo ayudarías?",
      opciones: [
        { letra: "R", texto: "Le ayudaría con algo concreto y práctico que pueda aliviar la situación." },
        { letra: "I", texto: "Le ayudaría a analizar el problema paso a paso para encontrar la mejor solución." },
        { letra: "A", texto: "Le sugeriría una actividad creativa para distraerse y desahogarse." },
        { letra: "S", texto: "Me sentaría a escucharlo con calma, sin apurarme a dar soluciones." },
        { letra: "E", texto: "Lo animaría a tomar acción y encontrar una salida activa a la situación." },
        { letra: "C", texto: "Le ayudaría a organizar sus pendientes para que el problema se sienta más manejable." }
      ] },
    { id: 88, tipo: "escenario", metodo: "HOLLAND", texto: "Tienes un rato libre durante un viaje a una ciudad nueva. ¿Qué harías con ese tiempo?",
      opciones: [
        { letra: "R", texto: "Buscaría una actividad física o de aventura para hacer al aire libre." },
        { letra: "I", texto: "Visitaría un museo o un lugar histórico para aprender algo nuevo." },
        { letra: "A", texto: "Buscaría galerías de arte, música en vivo o mercados de artesanías." },
        { letra: "S", texto: "Buscaría conversar con la gente local para conocer su forma de vida." },
        { letra: "E", texto: "Buscaría oportunidades de negocio o ideas que podría replicar en mi ciudad." },
        { letra: "C", texto: "Planificaría con anticipación cada parada del recorrido para no perder tiempo." }
      ] },
    { id: 89, tipo: "escenario", metodo: "HOLLAND", texto: "En tu trabajo o clase piden ideas para crear un nuevo producto. ¿Qué tipo de propuesta harías?",
      opciones: [
        { letra: "R", texto: "Propondría un producto simple, funcional y fácil de fabricar." },
        { letra: "I", texto: "Propondría investigar primero qué necesita realmente el mercado antes de decidir." },
        { letra: "A", texto: "Propondría algo visualmente llamativo y distinto a lo que ya existe." },
        { letra: "S", texto: "Propondría algo que resuelva un problema importante para la gente." },
        { letra: "E", texto: "Propondría la idea con más potencial de venta y de generar ganancias." },
        { letra: "C", texto: "Propondría un plan detallado de cómo se produciría paso a paso." }
      ] },
    { id: 90, tipo: "escenario", metodo: "HOLLAND", texto: "Un compañero comete un error importante en un proyecto grupal. ¿Cómo reaccionas primero?",
      opciones: [
        { letra: "R", texto: "Me pondría directamente a corregir el error de forma práctica." },
        { letra: "I", texto: "Analizaría con calma qué causó el error antes de corregirlo." },
        { letra: "A", texto: "Buscaría una forma distinta y creativa de resolver lo que salió mal." },
        { letra: "S", texto: "Hablaría con mi compañero con empatía para que no se sienta mal." },
        { letra: "E", texto: "Tomaría la iniciativa de reorganizar rápido al equipo para no perder tiempo." },
        { letra: "C", texto: "Revisaría el resto del trabajo para asegurarme de que no haya más errores similares." }
      ] },
    { id: 91, tipo: "escenario", metodo: "HOLLAND", texto: "En un evento con mucha gente, notas una situación que podría poner en riesgo la seguridad de los asistentes. ¿Qué harías primero?",
      opciones: [
        { letra: "R", texto: "Actuaría de inmediato con acciones físicas concretas para controlar la situación." },
        { letra: "I", texto: "Evaluaría rápidamente los riesgos antes de decidir cómo actuar." },
        { letra: "A", texto: "Buscaría la forma más creativa de calmar a la gente sin generar pánico." },
        { letra: "S", texto: "Me enfocaría en proteger y tranquilizar a las personas más vulnerables." },
        { letra: "E", texto: "Tomaría el mando de la situación y daría órdenes claras a los presentes." },
        { letra: "C", texto: "Seguiría el protocolo de seguridad establecido, paso a paso, sin salirme de él." }
      ] },
    { id: 92, tipo: "escenario", metodo: "HOLLAND", texto: "Te piden ayudar a organizar el inventario de un pequeño negocio familiar. ¿Qué parte te llamaría más la atención?",
      opciones: [
        { letra: "R", texto: "Encargarme de mover y acomodar físicamente la mercadería." },
        { letra: "I", texto: "Analizar los datos de ventas para entender qué se mueve más y qué no." },
        { letra: "A", texto: "Proponer una forma más atractiva de exhibir los productos." },
        { letra: "S", texto: "Asegurarme de que el equipo de trabajo esté cómodo con la nueva organización." },
        { letra: "E", texto: "Pensar cómo esa organización podría ayudar a vender más." },
        { letra: "C", texto: "Armar un sistema detallado de categorías, etiquetas y registros." }
      ] },
    { id: 93, tipo: "escenario", metodo: "HOLLAND", texto: "Se te presenta la oportunidad de empezar un pequeño negocio propio. ¿En qué te enfocarías primero?",
      opciones: [
        { letra: "R", texto: "En producir o fabricar yo mismo lo que voy a vender." },
        { letra: "I", texto: "En investigar bien el mercado antes de decidir si vale la pena empezar." },
        { letra: "A", texto: "En darle una identidad visual atractiva y original al negocio." },
        { letra: "S", texto: "En pensar cómo ese negocio puede beneficiar a otras personas." },
        { letra: "E", texto: "En lanzarme rápido a ofrecerlo y buscar los primeros clientes." },
        { letra: "C", texto: "En armar un presupuesto y un plan detallado antes de dar cualquier paso." }
      ] },
    { id: 94, tipo: "escenario", metodo: "HOLLAND", texto: "Un familiar cercano se enferma y necesita cuidado por unos días. ¿Qué papel tomarías?",
      opciones: [
        { letra: "R", texto: "Encargarme de las tareas prácticas: llevarlo al médico, preparar sus cosas." },
        { letra: "I", texto: "Investigar sobre su condición para entender cómo ayudar mejor." },
        { letra: "A", texto: "Buscar formas de animarlo con actividades creativas mientras se recupera." },
        { letra: "S", texto: "Quedarme acompañándolo y dándole apoyo emocional." },
        { letra: "E", texto: "Coordinar con otros familiares quién se encarga de qué." },
        { letra: "C", texto: "Organizar un horario claro de medicamentos, citas y cuidados." }
      ] },
    { id: 95, tipo: "escenario", metodo: "HOLLAND", texto: "Participas en un concurso o competencia importante. ¿Cómo te preparas?",
      opciones: [
        { letra: "R", texto: "Practicando la parte más técnica o física de la competencia." },
        { letra: "I", texto: "Estudiando a fondo las reglas y estrategias antes de participar." },
        { letra: "A", texto: "Buscando una forma original de destacar frente a los demás participantes." },
        { letra: "S", texto: "Enfocándome más en la experiencia de compartir con el grupo que en ganar." },
        { letra: "E", texto: "Motivándome sobre todo por la idea de competir y ganar." },
        { letra: "C", texto: "Siguiendo un plan de preparación ordenado y disciplinado." }
      ] },
    { id: 96, tipo: "escenario", metodo: "HOLLAND", texto: "Ocurre un accidente menor cerca de ti y hay que reaccionar rápido. ¿Qué harías?",
      opciones: [
        { letra: "R", texto: "Actuaría de inmediato haciendo lo necesario con mis manos para ayudar." },
        { letra: "I", texto: "Evaluaría rápidamente la situación para decidir cuál es el mejor curso de acción." },
        { letra: "A", texto: "Buscaría calmar el ambiente con una actitud tranquila y original." },
        { letra: "S", texto: "Me enfocaría en calmar y contener a las personas afectadas." },
        { letra: "E", texto: "Tomaría el control de la situación y daría instrucciones a los demás." },
        { letra: "C", texto: "Seguiría el protocolo de seguridad paso a paso, sin saltarme ninguno." }
      ] },
    { id: 97, tipo: "escenario", metodo: "HOLLAND", texto: "Te piden diseñar algo (un logo, una decoración, una presentación). ¿Qué priorizarías?",
      opciones: [
        { letra: "R", texto: "Que el diseño sea funcional y fácil de construir." },
        { letra: "I", texto: "Investigar referencias y tendencias antes de proponer un diseño." },
        { letra: "A", texto: "Dejarme llevar por mi creatividad para proponer algo original." },
        { letra: "S", texto: "Preguntar primero qué necesita y qué le gusta a quien lo va a usar." },
        { letra: "E", texto: "Pensar qué diseño llamaría más la atención y generaría más impacto." },
        { letra: "C", texto: "Seguir una plantilla o formato ya establecido para no salirme de lo esperado." }
      ] },
    { id: 98, tipo: "escenario", metodo: "HOLLAND", texto: "Surge un conflicto entre dos compañeros de tu equipo de trabajo. ¿Qué harías primero?",
      opciones: [
        { letra: "R", texto: "Buscaría una solución práctica e inmediata para que el trabajo no se detenga." },
        { letra: "I", texto: "Analizaría con calma qué originó el conflicto antes de intervenir." },
        { letra: "A", texto: "Propondría una dinámica distinta para que ambos vean el problema de otra forma." },
        { letra: "S", texto: "Hablaría con cada uno por separado para entender cómo se sienten." },
        { letra: "E", texto: "Tomaría la decisión final para resolver el conflicto rápido y seguir avanzando." },
        { letra: "C", texto: "Propondría reglas claras para que ese tipo de conflicto no vuelva a pasar." }
      ] },
    { id: 99, tipo: "escenario", metodo: "HOLLAND", texto: "Tienes que aprender algo completamente nuevo en poco tiempo. ¿Cómo lo abordas?",
      opciones: [
        { letra: "R", texto: "Aprendería practicando directamente, por ensayo y error." },
        { letra: "I", texto: "Buscaría toda la información posible antes de empezar a practicar." },
        { letra: "A", texto: "Buscaría una forma creativa y entretenida de aprenderlo." },
        { letra: "S", texto: "Buscaría a alguien que ya lo sepa para que me enseñe." },
        { letra: "E", texto: "Me enfocaría en aprender lo mínimo necesario para avanzar rápido." },
        { letra: "C", texto: "Seguiría un curso o guía estructurada paso a paso." }
      ] },
    { id: 100, tipo: "escenario", metodo: "HOLLAND", texto: "Un proyecto de tu comunidad busca voluntarios para cuidar el medio ambiente. ¿Qué te gustaría hacer?",
      opciones: [
        { letra: "R", texto: "Participar directamente en las tareas físicas de limpieza o plantación." },
        { letra: "I", texto: "Investigar cuál es el problema ambiental más urgente en la zona." },
        { letra: "A", texto: "Crear material visual para sensibilizar a la comunidad." },
        { letra: "S", texto: "Motivar e invitar a más personas a participar." },
        { letra: "E", texto: "Buscar financiamiento o alianzas para que el proyecto crezca." },
        { letra: "C", texto: "Organizar el cronograma de actividades y tareas del proyecto." }
      ] }
];


/* ==========================================================================
   APPLICATION STATE
   ========================================================================== */
function idiomaPorDefecto() {
    try {
        const guardado = localStorage.getItem(CONFIG.CLAVE_STORAGE + "_lang");
        if (guardado === "en" || guardado === "es") return guardado;
    } catch (e) { /* ignore */ }
    return (navigator.language || "en").toLowerCase().indexOf("es") === 0 ? "es" : "en";
}

const estado = {
    idioma: idiomaPorDefecto(),
    respuestas: {},
    selecciones: {},
    paginaActual: 0,
    resultado: null
};

let bancoPreguntas = preguntasPorIdioma[estado.idioma];
let baseDatosFacultades = facultadesPorIdioma[estado.idioma];
let infoBigFive = bigFivePorIdioma[estado.idioma];
let infoHolland = hollandPorIdioma[estado.idioma];
let perfilesMBTI = mbtiPorIdioma[estado.idioma].perfiles;
let rasgosPorTipo = mbtiPorIdioma[estado.idioma].rasgos;
let nombreGrupoPorCategoria = mbtiPorIdioma[estado.idioma].grupos;
let nombresVector = vectorNombresPorIdioma[estado.idioma].nombres;
let aptitudesGeneralesPorVector = vectorNombresPorIdioma[estado.idioma].aptitudes;

const TOTAL_PAGINAS = Math.ceil(CONFIG.TOTAL_PREGUNTAS / CONFIG.PREGUNTAS_POR_PAGINA);
let carrerasPlanas = [];
let ultimoFocoAntesDeModal = null;

function t(clave) {
    const dic = UI[estado.idioma] || UI.en;
    return (clave in dic) ? dic[clave] : ((clave in UI.en) ? UI.en[clave] : clave);
}


/* ==========================================================================
   PERSISTENCE
   ========================================================================== */
function guardarProgreso() {
    try {
        localStorage.setItem(CONFIG.CLAVE_STORAGE, JSON.stringify({
            version: 3, respuestas: estado.respuestas, selecciones: estado.selecciones,
            paginaActual: estado.paginaActual
        }));
        localStorage.setItem(CONFIG.CLAVE_STORAGE + "_lang", estado.idioma);
    } catch (e) { /* private mode / storage blocked: the test still works, it just isn't saved */ }
}

function cargarProgreso() {
    try {
        const crudo = localStorage.getItem(CONFIG.CLAVE_STORAGE);
        if (!crudo) return;
        const datos = JSON.parse(crudo);
        if (!datos || datos.version !== 3) return;
        Object.keys(datos.respuestas || {}).forEach(id => {
            const p = bancoPreguntas.find(q => q.id === Number(id));
            const v = Number(datos.respuestas[id]);
            if (p && p.tipo === "likert" && v >= 1 && v <= 7) estado.respuestas[p.id] = v;
        });
        Object.keys(datos.selecciones || {}).forEach(id => {
            const p = bancoPreguntas.find(q => q.id === Number(id));
            if (!p || p.tipo !== "escenario" || !Array.isArray(datos.selecciones[id])) return;
            const validas = datos.selecciones[id].filter(l => ORDEN_RIASEC.includes(l));
            if (validas.length >= 1 && validas.length <= CONFIG.MAX_OPCIONES_HOLLAND) estado.selecciones[p.id] = validas;
        });
        const pagina = Number(datos.paginaActual);
        if (Number.isInteger(pagina) && pagina >= 0 && pagina < TOTAL_PAGINAS) estado.paginaActual = pagina;
    } catch (e) { /* corrupted storage: start fresh */ }
}

function borrarProgreso() {
    try { localStorage.removeItem(CONFIG.CLAVE_STORAGE); } catch (e) { /* ignore */ }
}


/* ==========================================================================
   SMALL UTILITIES
   ========================================================================== */
function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function mezclarDeterminista(lista, semilla) {
    const copia = lista.slice();
    let s = (semilla * 2654435761) >>> 0;
    const azar = () => {
        s = (s + 0x6D2B79F5) >>> 0;
        let x = s;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(azar() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function nombreBase(nombre) {
    return nombre.replace(/\s*\(.*\)\s*$/, "").trim();
}

function totalContestadas() {
    return Object.keys(estado.respuestas).length +
        Object.keys(estado.selecciones).filter(id => estado.selecciones[id].length >= CONFIG.MIN_OPCIONES_HOLLAND).length;
}

function preguntaEstaContestada(pregunta) {
    if (pregunta.tipo === "likert") return estado.respuestas[pregunta.id] !== undefined;
    const sel = estado.selecciones[pregunta.id] || [];
    return sel.length >= CONFIG.MIN_OPCIONES_HOLLAND && sel.length <= CONFIG.MAX_OPCIONES_HOLLAND;
}

function preguntasDePagina(indicePagina) {
    const inicio = indicePagina * CONFIG.PREGUNTAS_POR_PAGINA;
    return bancoPreguntas.slice(inicio, inicio + CONFIG.PREGUNTAS_POR_PAGINA);
}

function construirCarrerasPlanas() {
    const lista = [];
    baseDatosFacultades.forEach((facultad, indiceFacultad) => {
        facultad.carreras.forEach((carrera, indiceCarrera) => {
            lista.push({
                nombre: carrera.nombre, facultad: facultad.nombre,
                indiceFacultad: indiceFacultad, indiceCarrera: indiceCarrera,
                vec: carrera.vec, perfil: null
            });
        });
    });
    if (lista.length !== perfilesIdeales.length) {
        console.error("[Vocational Test] Career catalog (" + lista.length + ") and ideal-profile table (" +
            perfilesIdeales.length + ") have different sizes.");
        return lista;
    }
    lista.forEach((c, i) => {
        c.perfil = {};
        COLUMNAS_PERFIL.forEach((col, k) => { c.perfil[col] = perfilesIdeales[i][k]; });
        c.claveGrupo = c.indiceFacultad + "|" + nombreBase(c.nombre) + "|" +
            COLUMNAS_PERFIL.map(col => c.perfil[col]).join(",");
    });
    return lista;
}

function carrerasDestacadasPor(clave, limite) {
    const vistos = new Set();
    return carrerasPlanas.filter(c => c.perfil).slice()
        .sort((a, b) => b.perfil[clave] - a.perfil[clave])
        .filter(c => { if (vistos.has(c.claveGrupo)) return false; vistos.add(c.claveGrupo); return true; })
        .slice(0, limite).map(c => c.nombre);
}

function nivelCompatibilidad(pct) {
    if (pct >= CONFIG.NIVEL_MUY_ALTA) return { clave: "veryhigh", texto: t("rt.levelVeryHigh") };
    if (pct >= CONFIG.NIVEL_ALTA) return { clave: "high", texto: t("rt.levelHigh") };
    return { clave: "medium", texto: t("rt.levelMedium") };
}


/* ==========================================================================
   LANGUAGE SWITCHING
   ========================================================================== */
function aplicarDiccionarioEstatico() {
    document.documentElement.setAttribute("lang", estado.idioma);
    document.title = "St. James Institute | " + (estado.idioma === "es" ? "Test Vocacional" : "Vocational Test");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", estado.idioma === "es"
        ? "Test Vocacional del Instituto St. James: tres modelos reconocidos de psicología (Myers-Briggs, Big Five y Holland RIASEC) para ayudarte a encontrar la carrera que se ajusta a vos."
        : "St. James Institute Vocational Test: three recognized psychology models (Myers-Briggs, Big Five and Holland RIASEC) to help you find the career that fits you.");

    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });

    document.querySelectorAll(".lang-btn").forEach(btn => {
        const activo = btn.getAttribute("data-lang") === estado.idioma;
        btn.classList.toggle("is-active", activo);
        btn.setAttribute("aria-pressed", activo ? "true" : "false");
    });
}

function cambiarIdioma(idioma) {
    if (idioma !== "en" && idioma !== "es") return;
    if (idioma === estado.idioma) return;
    estado.idioma = idioma;

    bancoPreguntas = preguntasPorIdioma[idioma];
    baseDatosFacultades = facultadesPorIdioma[idioma];
    infoBigFive = bigFivePorIdioma[idioma];
    infoHolland = hollandPorIdioma[idioma];
    perfilesMBTI = mbtiPorIdioma[idioma].perfiles;
    rasgosPorTipo = mbtiPorIdioma[idioma].rasgos;
    nombreGrupoPorCategoria = mbtiPorIdioma[idioma].grupos;
    nombresVector = vectorNombresPorIdioma[idioma].nombres;
    aptitudesGeneralesPorVector = vectorNombresPorIdioma[idioma].aptitudes;
    carrerasPlanas = construirCarrerasPlanas();

    aplicarDiccionarioEstatico();
    cerrarTodosLosModales();

    renderizarCatalogo();
    renderizarMBTI();
    renderizarBigFive();
    renderizarHolland();

    const seccionActiva = document.querySelector(".seccion-vista:not(.hidden)");
    if (seccionActiva && seccionActiva.id === "test") renderizarPaginaActual();
    if (estado.resultado) {
        estado.resultado = calcularResultados(); // recompute so narrative text matches the new language
        renderizarResultados();
    }
    actualizarVistaResultados();
    guardarProgreso();
}


/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function navegarASeccion(idSeccion) {
    const destino = document.getElementById(idSeccion);
    if (!destino) return;
    document.querySelectorAll(".seccion-vista").forEach(sec => sec.classList.add("hidden"));
    destino.classList.remove("hidden");
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    const idTab = idSeccion.indexOf("metodo-") === 0 ? "tab-metodos" : "tab-" + idSeccion;
    const tab = document.getElementById(idTab);
    if (tab) tab.classList.add("active");
    cerrarDropdownMetodos();
    cerrarMenuMovil();
    if (idSeccion === "test") renderizarPaginaActual();
    if (idSeccion === "resultados") actualizarVistaResultados();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function alternarDropdownMetodos(evento) {
    if (evento) evento.stopPropagation();
    const contenedor = document.getElementById("nav-dropdown-metodos");
    const abierto = contenedor.classList.toggle("is-open");
    document.getElementById("tab-metodos").setAttribute("aria-expanded", abierto ? "true" : "false");
}

function cerrarDropdownMetodos() {
    const contenedor = document.getElementById("nav-dropdown-metodos");
    if (!contenedor) return;
    contenedor.classList.remove("is-open");
    const boton = document.getElementById("tab-metodos");
    if (boton) boton.setAttribute("aria-expanded", "false");
}

function alternarMenuMovil() {
    const menu = document.getElementById("nav-tabs");
    const burger = document.getElementById("nav-burger");
    const abierto = menu.classList.toggle("is-open");
    burger.classList.toggle("is-active", abierto);
    burger.setAttribute("aria-expanded", abierto ? "true" : "false");
}

function cerrarMenuMovil() {
    const menu = document.getElementById("nav-tabs");
    const burger = document.getElementById("nav-burger");
    if (!menu || !burger) return;
    menu.classList.remove("is-open");
    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
}


/* ==========================================================================
   MODALS
   ========================================================================== */
function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (!modal) return;
    ultimoFocoAntesDeModal = document.activeElement;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const cerrar = modal.querySelector(".cerrar-modal");
    if (cerrar) cerrar.focus();
}

function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (!modal) return;
    modal.classList.remove("is-open");
    if (!document.querySelector(".modal.is-open")) document.body.style.overflow = "";
    if (ultimoFocoAntesDeModal && typeof ultimoFocoAntesDeModal.focus === "function") ultimoFocoAntesDeModal.focus();
    ultimoFocoAntesDeModal = null;
}

function cerrarTodosLosModales() {
    document.querySelectorAll(".modal.is-open").forEach(m => cerrarModal(m.id));
}


/* ==========================================================================
   CAREER CATALOG + CAREER MODAL
   ========================================================================== */
function renderizarCatalogo() {
    const input = document.getElementById("buscador-carreras");
    filtrarCarreras(input ? input.value : "");
}

function resaltarCoincidencia(texto, termino) {
    const seguro = escaparHTML(texto);
    if (!termino) return seguro;
    const indice = texto.toLowerCase().indexOf(termino);
    if (indice === -1) return seguro;
    return escaparHTML(texto.slice(0, indice)) + "<mark>" + escaparHTML(texto.slice(indice, indice + termino.length)) +
        "</mark>" + escaparHTML(texto.slice(indice + termino.length));
}

function filtrarCarreras(textoBusqueda) {
    const contenedor = document.getElementById("contenedor-facultades");
    const contador = document.getElementById("buscador-contador");
    const termino = (textoBusqueda || "").trim().toLowerCase();
    const totalCatalogo = baseDatosFacultades.reduce((acc, f) => acc + f.carreras.length, 0);
    let totalEncontradas = 0, html = "";

    baseDatosFacultades.forEach((facultad, indiceFacultad) => {
        const coincidentes = facultad.carreras
            .map((carrera, indiceCarrera) => ({ carrera, indiceCarrera }))
            .filter(({ carrera }) => {
                if (!termino) return true;
                const pajar = (carrera.nombre + " " + carrera.descripcion + " " + facultad.nombre + " " +
                    (carrera.aptitudes || []).join(" ") + " " + (nombresVector[carrera.vec] || "")).toLowerCase();
                return pajar.includes(termino);
            });
        if (!coincidentes.length) return;
        totalEncontradas += coincidentes.length;
        const color = coloresFacultad[indiceFacultad] || "var(--navy-900)";
        html += '<div class="facultad-bloque"><h3 class="facultad-titulo" style="border-bottom-color:' + color +
            '; color:' + color + ';">' + escaparHTML(facultad.nombre) + '</h3>' +
            '<p class="facultad-materias">' + t("rt.examSubjects") + ' ' + escaparHTML(facultad.materiasExamen) + '</p><div class="carreras-grid">';
        coincidentes.forEach(({ carrera, indiceCarrera }) => {
            html += '<button type="button" class="carrera-card" style="border-left:4px solid ' + color + ';" ' +
                'onclick="abrirModalCarrera(' + indiceFacultad + ', ' + indiceCarrera + ')">' +
                '<div class="carrera-card-titulo">' + resaltarCoincidencia(carrera.nombre, termino) + '</div>' +
                '<div class="carrera-card-desc">' + escaparHTML(carrera.descripcion) + '</div>' +
                '<span class="carrera-card-vector">' + escaparHTML(nombresVector[carrera.vec] || "") + '</span></button>';
        });
        html += '</div></div>';
    });

    if (termino && totalEncontradas === 0) {
        contenedor.innerHTML = '<div class="sin-resultados">' + t("rt.searchNone1") + escaparHTML(textoBusqueda) + t("rt.searchNone2") + '</div>';
    } else {
        contenedor.innerHTML = html;
    }
    if (contador) {
        contador.textContent = termino
            ? totalEncontradas + " " + (totalEncontradas === 1 ? t("rt.searchFoundOne") : t("rt.searchFoundMany")) + ' "' + textoBusqueda + '"'
            : totalCatalogo + " " + t("rt.searchTotal");
    }
}

function abrirModalCarrera(indiceFacultad, indiceCarrera) {
    const facultad = baseDatosFacultades[indiceFacultad];
    if (!facultad) return;
    const carrera = facultad.carreras[indiceCarrera];
    if (!carrera) return;
    document.getElementById("modal-carrera-facultad").textContent = facultad.nombre;
    document.getElementById("modal-carrera-titulo").textContent = carrera.nombre;
    document.getElementById("modal-carrera-descripcion").textContent = carrera.descripcion;
    document.getElementById("modal-carrera-aptitudes").innerHTML = (carrera.aptitudes || []).map(a => "<li>" + escaparHTML(a) + "</li>").join("");
    document.getElementById("modal-carrera-materias").textContent = facultad.materiasExamen;
    document.getElementById("modal-carrera-vector").textContent =
        nombresVector[carrera.vec] + " — " + t("rt.vectorLinkedTo") + " " + aptitudesGeneralesPorVector[carrera.vec] + ".";
    abrirModal("modal-carrera");
}
function cerrarModalCarrera() { cerrarModal("modal-carrera"); }


/* ==========================================================================
   TEST METHODS SECTIONS + MODALS
   ========================================================================== */
function renderizarMBTI() {
    renderizarDicotomiasMBTI();
    const contenedor = document.getElementById("contenedor-mbti");
    contenedor.innerHTML = perfilesMBTI.map(perfil => {
        const clase = perfil.cat.replace("cat-", "grupo-");
        return '<button type="button" class="tipo-card ' + clase + '" role="listitem" onclick="abrirModalFlotante(\'' + perfil.cod + '\')" ' +
            'aria-label="' + perfil.cod + ', ' + escaparHTML(perfil.titulo) + '">' +
            '<span class="tipo-card-codigo">' + perfil.cod + '</span>' +
            '<span class="tipo-card-nombre">' + escaparHTML(perfil.titulo) + '</span></button>';
    }).join("");
}

// The 4 dichotomy cards shown above the 16-type grid in Methods > Myers-Briggs.
// Content comes from the UI dictionary (keys "dic.<clave>.pos/neg/texto"),
// so it switches language the same way every other static string does.
function renderizarDicotomiasMBTI() {
    const contenedor = document.getElementById("contenedor-dicotomias");
    if (!contenedor) return;
    contenedor.innerHTML = dicotomiasMBTI.map(d => {
        const nombrePos = t("dic." + d.clave + ".pos");
        const nombreNeg = t("dic." + d.clave + ".neg");
        const texto = t("dic." + d.clave + ".texto");
        return '<div class="dicotomia-card" role="listitem">' +
            '<div class="dicotomia-polos">' +
            '<span>' + d.pos + ' · ' + escaparHTML(nombrePos) + '</span>' +
            '<span class="dicotomia-polos-separador" aria-hidden="true">&#8660;</span>' +
            '<span>' + d.neg + ' · ' + escaparHTML(nombreNeg) + '</span>' +
            '</div>' +
            '<p class="dicotomia-texto">' + escaparHTML(texto) + '</p>' +
            '</div>';
    }).join("");
}

function abrirModalFlotante(codigo) {
    const perfil = perfilesMBTI.find(p => p.cod === codigo);
    if (!perfil) return;
    const vecSugerido = vectorSugeridoPorTipo[codigo];
    const carrerasAfines = baseDatosFacultades.reduce((acc, f) => acc.concat(f.carreras), [])
        .filter(c => c.vec === vecSugerido).map(c => c.nombre)
        .filter((n, i, arr) => arr.indexOf(n) === i).slice(0, 6).join(", ");
    document.getElementById("modal-titulo").textContent = perfil.cod + " — " + perfil.titulo;
    document.getElementById("modal-descripcion").textContent = perfil.desc;
    document.getElementById("modal-badges").innerHTML = (rasgosPorTipo[codigo] || []).map(r => '<span class="badge-pill">' + escaparHTML(r) + "</span>").join("");
    document.getElementById("modal-carreras").textContent = carrerasAfines || t("rt.seeAllCareers");
    abrirModal("modal-personalidad");
}
function cerrarModalFlotante() { cerrarModal("modal-personalidad"); }

function renderizarBigFive() {
    const contenedor = document.getElementById("contenedor-bigfive");
    contenedor.innerHTML = ORDEN_BIGFIVE.map(clave => {
        const info = infoBigFive[clave];
        return '<button type="button" class="bigfive-dim-card" role="listitem" onclick="abrirModalBigFive(\'' + clave + '\')">' +
            '<span class="bigfive-dim-nombre">' + escaparHTML(info.nombre) + '</span>' +
            '<span class="bigfive-dim-resumen">' + escaparHTML(info.resumen) + '</span></button>';
    }).join("");
}

function abrirModalBigFive(clave) {
    const info = infoBigFive[clave];
    if (!info) return;
    document.getElementById("modal-bigfive-eyebrow").textContent = "Big Five · " + (ORDEN_BIGFIVE.indexOf(clave) + 1) + "/5";
    document.getElementById("modal-bigfive-titulo").textContent = info.nombre;
    document.getElementById("modal-bigfive-que-mide").textContent = info.queMide;
    document.getElementById("modal-bigfive-alto").textContent = info.alto;
    document.getElementById("modal-bigfive-bajo").textContent = info.bajo;
    document.getElementById("modal-bigfive-carreras").textContent = carrerasDestacadasPor(clave, 6).join(", ") || t("rt.seeAllCareers");
    abrirModal("modal-bigfive");
}
function cerrarModalBigFive() { cerrarModal("modal-bigfive"); }

function renderizarHolland() {
    const contenedor = document.getElementById("contenedor-holland");
    contenedor.innerHTML = ORDEN_RIASEC.map(letra => {
        const info = infoHolland[letra];
        return '<button type="button" class="holland-letra-card" role="listitem" onclick="abrirModalHolland(\'' + letra + '\')">' +
            '<span class="holland-letra-grande">' + letra + '</span>' +
            '<span class="holland-letra-nombre">' + escaparHTML(info.nombre) + ' — ' + escaparHTML(info.arquetipo) + '</span></button>';
    }).join("");
}

function abrirModalHolland(letra) {
    const info = infoHolland[letra];
    if (!info) return;
    document.getElementById("modal-holland-eyebrow").textContent = "Holland (RIASEC) · " + letra;
    document.getElementById("modal-holland-titulo").textContent = info.nombre + " — " + info.arquetipo;
    document.getElementById("modal-holland-descripcion").textContent = info.descripcion;
    document.getElementById("modal-holland-actividades").textContent = info.actividades;
    document.getElementById("modal-holland-carreras").textContent = carrerasDestacadasPor(letra, 6).join(", ") || t("rt.seeAllCareers");
    abrirModal("modal-holland");
}
function cerrarModalHolland() { cerrarModal("modal-holland"); }


/* ==========================================================================
   TEST INTERFACE
   ========================================================================== */
function construirPreguntaLikert(pregunta) {
    let circulos = "";
    for (let v = 7; v >= 1; v--) {
        const marcada = estado.respuestas[pregunta.id] === v;
        circulos += '<button type="button" class="likert-circulo' + (marcada ? " is-selected" : "") + '" data-valor="' + v +
            '" role="radio" aria-checked="' + (marcada ? "true" : "false") + '" aria-label="' + t("rt.likert" + v) +
            '" title="' + t("rt.likert" + v) + '" style="padding:0;" onclick="registrarRespuestaLikert(' + pregunta.id + ', ' + v + ')"></button>';
    }
    return '<div class="pregunta-card" id="pregunta-' + pregunta.id + '">' +
        '<p class="pregunta-texto">' + pregunta.id + '. ' + escaparHTML(pregunta.texto) + '</p>' +
        '<div class="likert-escala" role="radiogroup" aria-label="Q' + pregunta.id + '">' +
        '<div class="likert-etiquetas"><span class="likert-etiqueta-agree">' + t("rt.likertAgree") + '</span></div>' +
        '<div class="likert-circulos">' + circulos + '</div>' +
        '<div class="likert-etiquetas"><span class="likert-etiqueta-disagree">' + t("rt.likertDisagree") + '</span></div>' +
        '</div></div>';
}

function construirPreguntaEscenario(pregunta) {
    const seleccion = estado.selecciones[pregunta.id] || [];
    const opciones = mezclarDeterminista(pregunta.opciones, pregunta.id);
    const numeroEscenario = pregunta.id - 80;
    const html = opciones.map(op => {
        const marcada = seleccion.includes(op.letra);
        const bloqueada = !marcada && seleccion.length >= CONFIG.MAX_OPCIONES_HOLLAND;
        return '<button type="button" class="holland-opcion' + (marcada ? " is-selected" : "") + (bloqueada ? " is-disabled" : "") +
            '" data-letra="' + op.letra + '" aria-pressed="' + (marcada ? "true" : "false") + '" ' +
            'onclick="alternarOpcionEscenario(' + pregunta.id + ', \'' + op.letra + '\')">' +
            '<span class="holland-opcion-check" aria-hidden="true">' + (marcada ? "&#10003;" : "") + '</span>' +
            '<span class="holland-opcion-texto">' + escaparHTML(op.texto) + '</span></button>';
    }).join("");
    return '<div class="pregunta-card" id="pregunta-' + pregunta.id + '">' +
        '<p class="pregunta-texto">' + t("rt.scenarioLabel") + ' ' + numeroEscenario + ' ' + t("rt.scenarioOf") + ' ' + escaparHTML(pregunta.texto) +
        ' <span style="display:block; font-size:0.82rem; font-weight:500; color:var(--ink-500); margin-top:4px;">' + t("rt.scenarioHint") + '</span></p>' +
        '<div class="holland-opciones">' + html + '</div></div>';
}

function renderizarPaginaActual() {
    const preguntas = preguntasDePagina(estado.paginaActual);
    const esHolland = preguntas.length > 0 && preguntas[0].tipo === "escenario";
    const contenedor = document.getElementById("contenedor-preguntas");
    const instruccion = esHolland ? t("rt.scenarioInstructions") : t("rt.likertInstructions");
    contenedor.innerHTML = '<p class="section-desc" style="margin-bottom:8px;">' + instruccion + "</p>" +
        preguntas.map(p => p.tipo === "likert" ? construirPreguntaLikert(p) : construirPreguntaEscenario(p)).join("");
    actualizarProgreso();
    actualizarBotonesNavegacion();
    actualizarContadorEscenarios();
}

function actualizarProgreso() {
    const bloque = Math.floor(estado.paginaActual / (TOTAL_PAGINAS / CONFIG.TOTAL_BLOQUES)) + 1;
    const nombreBloque = bloque <= 4 ? t("rt.blockPersonality") : t("rt.blockHolland");
    const contestadas = totalContestadas();
    const pct = Math.round((contestadas / CONFIG.TOTAL_PREGUNTAS) * 100);
    document.getElementById("progreso-texto").textContent =
        t("rt.blockOf") + " " + bloque + " " + t("rt.of") + " " + CONFIG.TOTAL_BLOQUES + " — " + nombreBloque + " · " + pct + "% " + t("rt.completed");
    document.getElementById("barra-progreso").style.width = pct + "%";
    const barra = document.querySelector("#test .progress-bar");
    if (barra) barra.setAttribute("aria-valuenow", String(pct));
}

function actualizarBotonesNavegacion() {
    const ultima = estado.paginaActual === TOTAL_PAGINAS - 1;
    document.getElementById("btn-anterior").disabled = estado.paginaActual === 0;
    document.getElementById("btn-siguiente").style.display = ultima ? "none" : "";
    document.getElementById("btn-finalizar").style.display = ultima ? "" : "none";
}

function actualizarContadorEscenarios() {
    const insignia = document.getElementById("contador-b5");
    const preguntas = preguntasDePagina(estado.paginaActual);
    if (!preguntas.length || preguntas[0].tipo !== "escenario") { insignia.classList.add("hidden"); return; }
    let opciones = 0, completos = 0;
    preguntas.forEach(p => {
        const n = (estado.selecciones[p.id] || []).length;
        opciones += n;
        if (n >= CONFIG.MIN_OPCIONES_HOLLAND) completos++;
    });
    insignia.textContent = t("rt.optionsSelected") + " " + opciones + " · " + t("rt.scenariosComplete") + " " + completos + " " + t("rt.of") + " " + preguntas.length;
    insignia.classList.remove("hidden");
}

function limpiarAvisos() {
    const aviso = document.getElementById("aviso-test");
    if (aviso) aviso.remove();
    document.querySelectorAll(".pregunta-card").forEach(tarj => { tarj.style.outline = ""; tarj.style.background = ""; });
}

function registrarRespuestaLikert(idPregunta, valor) {
    estado.respuestas[idPregunta] = valor;
    const tarjeta = document.getElementById("pregunta-" + idPregunta);
    if (tarjeta) {
        tarjeta.querySelectorAll(".likert-circulo").forEach(c => {
            const activo = Number(c.getAttribute("data-valor")) === valor;
            c.classList.toggle("is-selected", activo);
            c.setAttribute("aria-checked", activo ? "true" : "false");
        });
        tarjeta.style.outline = ""; tarjeta.style.background = "";
    }
    limpiarAvisoSiPaginaCompleta();
    actualizarProgreso();
    guardarProgreso();
}

function alternarOpcionEscenario(idPregunta, letra) {
    const actual = (estado.selecciones[idPregunta] || []).slice();
    const posicion = actual.indexOf(letra);
    if (posicion >= 0) actual.splice(posicion, 1);
    else { if (actual.length >= CONFIG.MAX_OPCIONES_HOLLAND) return; actual.push(letra); }
    if (actual.length === 0) delete estado.selecciones[idPregunta];
    else estado.selecciones[idPregunta] = actual;

    const tarjeta = document.getElementById("pregunta-" + idPregunta);
    if (tarjeta) {
        tarjeta.querySelectorAll(".holland-opcion").forEach(boton => {
            const l = boton.getAttribute("data-letra");
            const marcada = actual.includes(l);
            boton.classList.toggle("is-selected", marcada);
            boton.classList.toggle("is-disabled", !marcada && actual.length >= CONFIG.MAX_OPCIONES_HOLLAND);
            boton.setAttribute("aria-pressed", marcada ? "true" : "false");
            boton.querySelector(".holland-opcion-check").innerHTML = marcada ? "&#10003;" : "";
        });
        if (actual.length >= CONFIG.MIN_OPCIONES_HOLLAND) { tarjeta.style.outline = ""; tarjeta.style.background = ""; }
    }
    limpiarAvisoSiPaginaCompleta();
    actualizarContadorEscenarios();
    actualizarProgreso();
    guardarProgreso();
}

function limpiarAvisoSiPaginaCompleta() { if (paginaEsValida(estado.paginaActual)) limpiarAvisos(); }
function paginaEsValida(indicePagina) { return preguntasDePagina(indicePagina).every(preguntaEstaContestada); }

function mostrarAvisoPagina() {
    limpiarAvisos();
    const pendientes = preguntasDePagina(estado.paginaActual).filter(p => !preguntaEstaContestada(p));
    if (!pendientes.length) return;
    pendientes.forEach(p => {
        const tarjeta = document.getElementById("pregunta-" + p.id);
        if (tarjeta) { tarjeta.style.outline = "2px solid #b4342b"; tarjeta.style.background = "#fdf1f0"; }
    });
    const esEscenario = pendientes[0].tipo === "escenario";
    const aviso = document.createElement("div");
    aviso.id = "aviso-test";
    aviso.setAttribute("role", "alert");
    aviso.className = "aviso-test";
    aviso.textContent = esEscenario ? t("rt.alertScenarios") : (pendientes.length > 1 ? t("rt.alertQuestions") : t("rt.alertQuestion"));
    document.querySelector("#formulario-test .test-navegacion").insertAdjacentElement("beforebegin", aviso);
    const primera = document.getElementById("pregunta-" + pendientes[0].id);
    if (primera) primera.scrollIntoView({ behavior: "smooth", block: "center" });
}

function cambiarPaginaBloque(direccion) {
    if (direccion > 0 && !paginaEsValida(estado.paginaActual)) { mostrarAvisoPagina(); return; }
    const nueva = estado.paginaActual + direccion;
    if (nueva < 0 || nueva >= TOTAL_PAGINAS) return;
    estado.paginaActual = nueva;
    guardarProgreso();
    renderizarPaginaActual();
    document.getElementById("test").scrollIntoView({ behavior: "smooth", block: "start" });
}


/* ==========================================================================
   SCORING ENGINE (language-independent: works on ids, not text)
   ========================================================================== */
function valorPuntuado(pregunta) {
    const respuesta = estado.respuestas[pregunta.id];
    return pregunta.invierte ? 8 - respuesta : respuesta;
}

function calcularMBTI() {
    const dicotomias = dicotomiasMBTI.map(d => {
        const items = bancoPreguntas.filter(p => p.metodo === "MBTI" && p.dim === d.clave);
        const suma = items.reduce((acc, p) => acc + valorPuntuado(p), 0);
        const pctPos = ((suma - items.length) / (items.length * 6)) * 100;
        const letra = pctPos > 50 ? d.pos : d.neg;
        return { clave: d.clave, pos: d.pos, neg: d.neg, bigfive: d.bigfive, pctPos: pctPos, pctNeg: 100 - pctPos, letra: letra, pctLetra: pctPos > 50 ? pctPos : 100 - pctPos };
    });
    const orden = { EI: 0, SN: 1, TF: 2, JP: 3 };
    const codigo = dicotomias.slice().sort((a, b) => orden[a.clave] - orden[b.clave]).map(d => d.letra).join("");
    const claridad = dicotomias.reduce((acc, d) => acc + Math.abs(d.pctPos - 50) * 2, 0) / dicotomias.length;
    return { codigo: codigo, dicotomias: dicotomias, claridad: claridad };
}

function calcularBigFive() {
    const resultado = {};
    ["OPE", "CON", "EXT", "AGR", "NEU"].forEach(dim => {
        const items = bancoPreguntas.filter(p => p.metodo === "BIGFIVE" && p.dim === dim);
        const suma = items.reduce((acc, p) => acc + valorPuntuado(p), 0);
        resultado[dim] = ((suma - items.length) / (items.length * 6)) * 100;
    });
    resultado.EST = 100 - resultado.NEU;
    return resultado;
}

function calcularHolland() {
    const puntos = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    let escenarios = 0;
    bancoPreguntas.filter(p => p.tipo === "escenario").forEach(p => {
        const sel = estado.selecciones[p.id] || [];
        if (!sel.length) return;
        escenarios++;
        sel.forEach(letra => { puntos[letra] += 1 / sel.length; });
    });
    const porcentajes = {};
    ORDEN_RIASEC.forEach(l => { porcentajes[l] = escenarios ? (puntos[l] / escenarios) * 100 : 0; });
    const orden = ORDEN_RIASEC.slice().sort((a, b) => porcentajes[b] - porcentajes[a] || ORDEN_RIASEC.indexOf(a) - ORDEN_RIASEC.indexOf(b));
    const conPuntaje = orden.filter(l => porcentajes[l] > 0);
    return { porcentajes: porcentajes, top3: conPuntaje.slice(0, 3), orden: orden };
}

function aComposicion(valores) {
    const total = valores.reduce((a, b) => a + b, 0);
    if (total <= 0) return valores.map(() => 1 / valores.length);
    return valores.map(v => v / total);
}

function coeficienteSolapamiento(a, b) {
    let suma = 0;
    for (let i = 0; i < a.length; i++) suma += Math.min(a[i], b[i]);
    return suma;
}

function calcularRankingCarreras(bigfive, holland) {
    const estudianteBF = aComposicion(ORDEN_BIGFIVE.map(k => bigfive[k]));
    const estudianteHO = aComposicion(ORDEN_RIASEC.map(k => holland.porcentajes[k]));
    const puntuadas = carrerasPlanas.filter(c => c.perfil).map(c => {
        const simBF = coeficienteSolapamiento(estudianteBF, ORDEN_BIGFIVE.map(k => c.perfil[k]));
        const simHO = coeficienteSolapamiento(estudianteHO, ORDEN_RIASEC.map(k => c.perfil[k]));
        return { carrera: c, simPersonalidad: simBF * 100, simHolland: simHO * 100, puntaje: (CONFIG.PESO_PERSONALIDAD * simBF + CONFIG.PESO_HOLLAND * simHO) * 100 };
    });
    puntuadas.sort((a, b) => b.puntaje - a.puntaje || b.simPersonalidad - a.simPersonalidad ||
        (a.carrera.indiceFacultad - b.carrera.indiceFacultad) || (a.carrera.indiceCarrera - b.carrera.indiceCarrera));

    const grupos = [], porClave = {};
    puntuadas.forEach(item => {
        const clave = item.carrera.claveGrupo;
        if (porClave[clave]) porClave[clave].variantes.push(item.carrera.nombre);
        else { item.variantes = []; porClave[clave] = item; grupos.push(item); }
    });
    return { todas: puntuadas, agrupadas: grupos };
}

function generarNotaValidacionCruzada(mbti, bigfive, top5) {
    const notas = [];
    top5.forEach(item => {
        const brecha = Math.abs(item.simPersonalidad - item.simHolland);
        if (brecha > CONFIG.UMBRAL_CONTRADICCION) {
            const masAlto = item.simPersonalidad > item.simHolland ? t("rt.tPersonality") : t("rt.tInterests");
            const masBajo = item.simPersonalidad > item.simHolland ? t("rt.tInterests") : t("rt.tPersonality");
            notas.push("<strong>" + escaparHTML(item.carrera.nombre) + ":</strong> " + t("rt.crossGapPrefix") + " " + masAlto + " " +
                t("rt.crossGapMid") + " " + masBajo + " " + t("rt.crossGapSuffix") + " (" +
                Math.round(item.simPersonalidad) + "% / " + Math.round(item.simHolland) + "%). " + t("rt.crossGapNote"));
        }
    });
    const diferencias = [];
    mbti.dicotomias.forEach(d => {
        const valorBF = bigfive[d.bigfive];
        const inclinaPos = d.pctPos >= 50 + CONFIG.UMBRAL_MBTI_BIGFIVE;
        const inclinaNeg = d.pctPos <= 50 - CONFIG.UMBRAL_MBTI_BIGFIVE;
        const bfAlto = valorBF >= 50 + CONFIG.UMBRAL_MBTI_BIGFIVE;
        const bfBajo = valorBF <= 50 - CONFIG.UMBRAL_MBTI_BIGFIVE;
        if ((inclinaPos && bfBajo) || (inclinaNeg && bfAlto)) {
            diferencias.push(d.letra + " (" + Math.round(d.pctLetra) + "%) vs. " + infoBigFive[d.bigfive].nombre + " (" + Math.round(valorBF) + "%)");
        }
    });
    if (diferencias.length) notas.push("<strong>" + t("rt.consistencyTitle") + "</strong> " + t("rt.consistencyText") + " " + diferencias.join("; ") + ". " + t("rt.consistencyEnd"));
    return notas;
}

function calcularResultados() {
    const mbti = calcularMBTI();
    const bigfive = calcularBigFive();
    const holland = calcularHolland();
    const ranking = calcularRankingCarreras(bigfive, holland);
    const top5 = ranking.agrupadas.slice(0, 5);
    return { mbti: mbti, bigfive: bigfive, holland: holland, ranking: ranking, top5: top5, notas: generarNotaValidacionCruzada(mbti, bigfive, top5) };
}

function calcularEvaluacionCruzada() {
    if (!paginaEsValida(estado.paginaActual)) { mostrarAvisoPagina(); return; }
    const primeraPendiente = bancoPreguntas.find(p => !preguntaEstaContestada(p));
    if (primeraPendiente) {
        estado.paginaActual = Math.floor((primeraPendiente.id - 1) / CONFIG.PREGUNTAS_POR_PAGINA);
        renderizarPaginaActual();
        mostrarAvisoPagina();
        return;
    }
    estado.resultado = calcularResultados();
    guardarProgreso();
    renderizarResultados();
    navegarASeccion("resultados");
}


/* ==========================================================================
   RESULTS RENDERING
   ========================================================================== */
function nivelBigFive(valor) {
    if (valor >= CONFIG.NIVEL_ALTO) return "alto";
    if (valor <= CONFIG.NIVEL_BAJO) return "bajo";
    return "medio";
}

function construirFilaBarra(etiquetaIzq, etiquetaDer, porcentajeRelleno, extraHTML) {
    const ancho = Math.max(0, Math.min(100, porcentajeRelleno));
    return '<div class="trait-row">' +
        '<div class="trait-row-labels"><span>' + etiquetaIzq + '</span><span>' + etiquetaDer + '</span></div>' +
        '<div class="trait-track"><div class="trait-fill" style="width:' + ancho.toFixed(1) + '%;"></div></div>' +
        (extraHTML || "") + '</div>';
}

function renderizarTarjetaMBTI(mbti) {
    const perfil = perfilesMBTI.find(p => p.cod === mbti.codigo);
    document.getElementById("res-mbti-categoria").textContent = perfil ? nombreGrupoPorCategoria[perfil.cat] : mbti.codigo;
    document.getElementById("res-mbti-tag").textContent = mbti.codigo;
    document.getElementById("res-mbti-titulo").textContent = perfil ? perfil.titulo : "";
    document.getElementById("res-mbti-desc").textContent = perfil ? perfil.desc : "";

    const barras = mbti.dicotomias.slice().sort((a, b) => ORDEN_DICOTOMIAS.indexOf(a.clave) - ORDEN_DICOTOMIAS.indexOf(b.clave))
        .map(d => construirFilaBarra(
            (d.letra === d.pos ? '<span class="trait-row-value">' : "") + d.pos + " " + Math.round(d.pctPos) + "%" + (d.letra === d.pos ? "</span>" : ""),
            (d.letra === d.neg ? '<span class="trait-row-value">' : "") + Math.round(d.pctNeg) + "% " + d.neg + (d.letra === d.neg ? "</span>" : ""),
            d.pctPos)).join("");
    const rasgos = (rasgosPorTipo[mbti.codigo] || []).map(r => '<span class="badge-pill">' + escaparHTML(r) + "</span>").join("");
    document.getElementById("res-mbti-traits").innerHTML = barras + (rasgos ? '<div class="badges-container" style="margin-top:6px;">' + rasgos + "</div>" : "");
}

function renderizarTarjetaBigFive(bigfive) {
    const html = ORDEN_BIGFIVE.map(clave => {
        const info = infoBigFive[clave];
        const valor = bigfive[clave];
        const nivel = nivelBigFive(valor);
        const lectura = '<span class="trait-reading">' + escaparHTML(info[nivel]) + "</span>";
        return construirFilaBarra(escaparHTML(info.nombre), '<span class="trait-row-value">' + Math.round(valor) + "%</span>", valor, lectura);
    }).join("");
    document.getElementById("res-bigfive-traits").innerHTML = html;
}

function renderizarTarjetaHolland(holland) {
    const primera = holland.top3[0];
    const siguientes = holland.top3.slice(1).map(l => infoHolland[l].nombre);
    const info = infoHolland[primera];
    document.getElementById("res-riasec-tag").textContent = holland.top3.join("");
    document.getElementById("res-riasec-titulo").textContent = info.nombre + " — " + info.arquetipo;
    document.getElementById("res-riasec-desc").textContent = info.descripcion +
        (siguientes.length ? " " + (siguientes.length > 1 ? t("rt.yourNextInterests") : t("rt.yourNextInterest")) + " " + siguientes.join(" / ") + "." : "");
    document.getElementById("res-riasec-traits").innerHTML = ORDEN_RIASEC.map(letra =>
        construirFilaBarra(letra + " — " + infoHolland[letra].nombre, '<span class="trait-row-value">' + Math.round(holland.porcentajes[letra]) + "%</span>", holland.porcentajes[letra])
    ).join("");
}

function renderizarTop5(resultado) {
    const top5 = resultado.top5;
    document.getElementById("top5-badge").innerHTML = "&#127942; " + resultado.ranking.todas.length + " " + t("rt.careersAnalyzed");
    document.getElementById("top5-lista").innerHTML = top5.map((item, i) => {
        const c = item.carrera;
        const nivel = nivelCompatibilidad(item.puntaje);
        const tambien = item.variantes.length ? '<div class="top5-info-facultad">' + t("rt.alsoOfferedAs") + ' ' + item.variantes.map(escaparHTML).join(", ") + "</div>" : "";
        return '<div class="top5-item" role="listitem" tabindex="0" style="cursor:pointer;" onclick="abrirModalCarrera(' + c.indiceFacultad + ', ' + c.indiceCarrera + ')" ' +
            'onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();abrirModalCarrera(' + c.indiceFacultad + ', ' + c.indiceCarrera + ');}">' +
            '<div class="top5-rank">' + (i + 1) + '</div>' +
            '<div><div class="top5-info-nombre">' + escaparHTML(c.nombre) + '</div>' +
            '<div class="top5-info-facultad">' + escaparHTML(c.facultad) + '</div>' +
            '<div class="top5-info-facultad">' + t("rt.personalityFit") + ' ' + Math.round(item.simPersonalidad) + '% · ' + t("rt.interestsFit") + ' ' + Math.round(item.simHolland) + '%</div>' +
            tambien + '</div>' +
            '<div class="top5-resultado"><div class="top5-porcentaje">' + item.puntaje.toFixed(1) + '%</div>' +
            '<span class="nivel-badge nivel-' + nivel.clave + '">' + nivel.texto + '</span></div></div>';
    }).join("");
}

function renderizarAlertaCruce(notas) {
    const caja = document.getElementById("alerta-cruce");
    caja.classList.remove("hidden");
    caja.classList.toggle("alerta-cruce-ok", notas.length === 0);
    if (notas.length === 0) {
        caja.innerHTML = "<strong>" + t("rt.crossOk") + "</strong> " + t("rt.crossOkText");
    } else {
        caja.innerHTML = "<strong>" + t("rt.crossTitle") + "</strong><ul style=\"margin-top:8px; padding-left:18px; list-style:disc;\">" +
            notas.map(n => "<li style=\"margin-bottom:6px;\">" + n + "</li>").join("") + "</ul>";
    }
}

function renderizarResultados() {
    const r = estado.resultado;
    if (!r) return;
    renderizarTarjetaMBTI(r.mbti);
    renderizarTarjetaBigFive(r.bigfive);
    renderizarTarjetaHolland(r.holland);
    renderizarTop5(r);
    renderizarAlertaCruce(r.notas);
}

function actualizarVistaResultados() {
    const hay = !!estado.resultado;
    document.getElementById("resultados-vacio").classList.toggle("hidden", hay);
    document.getElementById("resultados-contenido").classList.toggle("hidden", !hay);
}


/* ==========================================================================
   RESET, PRINT TITLE, INITIALIZATION
   ========================================================================== */
function reiniciarCuestionarioCompleto() {
    if (!window.confirm(t("rt.resetConfirm"))) return;
    estado.respuestas = {}; estado.selecciones = {}; estado.paginaActual = 0; estado.resultado = null;
    borrarProgreso();
    actualizarVistaResultados();
    navegarASeccion("test");
}

let tituloOriginal = document.title;
window.addEventListener("beforeprint", function () {
    tituloOriginal = document.title;
    const codigo = estado.resultado ? estado.resultado.mbti.codigo + " " : "";
    document.title = t("rt.printTitle") + " " + codigo + "- " + t("rt.printFrom");
});
window.addEventListener("afterprint", function () { document.title = tituloOriginal; });

window.addEventListener("click", function (evento) {
    if (evento.target.classList && evento.target.classList.contains("modal")) cerrarModal(evento.target.id);
    const dropdown = document.getElementById("nav-dropdown-metodos");
    if (dropdown && !dropdown.contains(evento.target)) cerrarDropdownMetodos();
});

window.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") { cerrarTodosLosModales(); cerrarDropdownMetodos(); cerrarMenuMovil(); }
});

function verificarIntegridadDeDatos() {
    const problemas = [];
    ["en", "es"].forEach(idioma => {
        if (preguntasPorIdioma[idioma].length !== CONFIG.TOTAL_PREGUNTAS)
            problemas.push("[" + idioma + "] question bank has " + preguntasPorIdioma[idioma].length + " items, expected " + CONFIG.TOTAL_PREGUNTAS + ".");
        const total = facultadesPorIdioma[idioma].reduce((acc, f) => acc + f.carreras.length, 0);
        if (total !== perfilesIdeales.length) problemas.push("[" + idioma + "] catalog has " + total + " careers, profile table has " + perfilesIdeales.length + ".");
    });
    problemas.forEach(m => console.error("[Vocational Test] " + m));
    return problemas.length === 0;
}

function inicializarAplicacion() {
    verificarIntegridadDeDatos();
    carrerasPlanas = construirCarrerasPlanas();
    cargarProgreso();
    aplicarDiccionarioEstatico();

    renderizarCatalogo();
    renderizarMBTI();
    renderizarBigFive();
    renderizarHolland();
    renderizarPaginaActual();

    if (bancoPreguntas.every(preguntaEstaContestada)) {
        estado.resultado = calcularResultados();
        renderizarResultados();
    }
    actualizarVistaResultados();
}

document.addEventListener("DOMContentLoaded", inicializarAplicacion);
