import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  GraduationCap,
  MessageSquare,
  Eye,
  FileText,
  Zap,
  ShieldCheck,
  RefreshCw,
  Award,
  ChevronRight,
  Info,
  Edit3,
  Layers,
  Calculator,
  Dna,
  FlaskConical,
  Globe,
  BookOpen,
  TrendingUp,
  Languages,
  Code2,
} from 'lucide-react';

// Base de données des matières avec leurs spécificités d'évaluation en France et règles Unicode
const SUBJECTS_CONFIG = {
  mathematiques: {
    id: 'mathematiques',
    name: 'Mathématiques',
    icon: Calculator,
    category: 'Sciences & Logique',
    explanationStyle: "avec une image concrète ou géométrique et un exemple chiffré immédiat",
    microChallengeStyle: "une seule petite question de calcul ou d'application très simple",
    progressionStyle: "un calcul un peu plus complet (inversion d'inconnue, paramètre ou justification géométrique)",
    frenchEvalRule: "la formulation exacte attendue par le correcteur français (citation de la propriété ou du théorème clé, condition d'application et conclusion claire, sans baratin)",
    unicodeSymbols: "u⃗, v⃗, AB⃗, ×, ÷, ≠, ≤, ≥, ≈, ⟹, ⟺, ∈, ℝ, ℕ, √, ², ³, π, ∞",
    forbiddenLatex: "$, $$, \\(, \\), \\[, \\], \\vec, \\implies, \\iff, \\frac, \\sqrt",
    sampleSimulation: {
      studentQuestion: "Je ne comprends rien aux suites géométriques, comment on passe d'un terme à l'autre ?",
      tutorStep1: "Imagine un placement ou une population qui est multipliée toujours par le même nombre à chaque étape. Ce multiplicateur fixe s'appelle la raison (notée q).\n• Si tu pars de u₀ = 3 et que tu multiplies toujours par q = 2 : tu obtiens u₁ = 6, puis u₂ = 12, etc.\n\nPour vérifier que tu as le coup de main : si une suite géométrique commence à u₀ = 5 et a pour raison q = 3, combien vaut u₁ ?",
      studentReply: "Ça fait 15 (5 fois 3).",
      tutorStep2: "C'est exact, u₁ = 15 !\n💡 **Pour avoir tous les points sur ta copie :** écris simplement « La suite (uₙ) étant géométrique de raison q = 3, on a pour tout entier naturel n : uₙ₊₁ = q × uₙ, d'où u₁ = 3 × 5 = 15. »\n\nMaintenant, toujours avec u₀ = 5 et q = 3, comment calculerais-tu directement u₂ puis u₃ ?"
    }
  },
  svt: {
    id: 'svt',
    name: 'SVT (Sciences de la Vie et de la Terre)',
    icon: Dna,
    category: 'Sciences & Logique',
    explanationStyle: "sous forme de chaîne logique simple (Cause ➔ Mécanisme biologique/géologique ➔ Conséquence) avec une analogie concrète du quotidien ou de laboratoire",
    microChallengeStyle: "une seule petite mise en situation très simple (comparer deux résultats d'expérience, deux témoins ou deux valeurs chiffrées)",
    progressionStyle: "une étape un peu plus complète (interpréter le rôle d'un tube témoin, relier l'échelle cellulaire à l'échelle de l'organisme, ou croiser deux informations)",
    frenchEvalRule: "la structure méthodologique exigée en SVT : « Je vois que [donnée chiffrée / observation précise]... Or je sais que [connaissance du cours]... Donc j'en déduis que [conclusion répondant au problème] » en mettant les mots-clés scientifiques en gras",
    unicodeSymbols: "CO₂, O₂, H₂O, C₆H₁₂O₆, ATP, ADN, ARN, ➔, ⇌, ×, %, °C, μm, nm",
    forbiddenLatex: "$, $$, \\(, \\), \\rightarrow, \\leftrightarrow, _2, ^+",
    sampleSimulation: {
      studentQuestion: "Je confonds toujours respiration cellulaire et fermentation.",
      tutorStep1: "Imagine deux moteurs dans une cellule pour fabriquer son énergie (l'ATP) à partir du sucre (glucose) :\n• **La respiration** utilise du dioxygène (O₂) : elle dégrade complètement le glucose et produit beaucoup d'énergie.\n• **La fermentation** fonctionne sans O₂ : elle dégrade partiellement le glucose (en rejetant par exemple de l'éthanol ou de l'acide lactique) et produit très peu d'énergie.\n\nDans un milieu totalement privé d'O₂, on observe que des levures continuent de consommer du glucose mais grandissent très lentement. Quel mécanisme utilisent-elles ?",
      studentReply: "Elles font de la fermentation puisqu'il n'y a pas d'oxygène.",
      tutorStep2: "Exactement, l'absence de dioxygène les oblige à fermenter !\n💡 **Pour avoir tous les points sur ta copie :** écris « Je vois que dans un milieu sans **O₂**, les levures consomment du **glucose** avec une faible croissance. Or je sais que la **fermentation** est un **métabolisme** anaérobie à faible rendement énergétique. Donc j'en déduis que ces levures réalisent la fermentation. »\n\nÀ ton avis, que va-t-on mesurer si on ouvre le flacon pour faire entrer de l'O₂ ?"
    }
  },
  physique_chimie: {
    id: 'physique_chimie',
    name: 'Physique-Chimie',
    icon: FlaskConical,
    category: 'Sciences & Logique',
    explanationStyle: "en reliant le phénomène physique concret à sa grandeur mesurable et à sa formule expliquée avec des mots simples",
    microChallengeStyle: "une seule petite question directe (identifier la bonne unité, prévoir le sens d'évolution ou faire un calcul simple)",
    progressionStyle: "une étape un peu plus complète (isoler une grandeur dans la formule littérale, convertir une unité en puissances de 10 ou équilibrer une équation)",
    frenchEvalRule: "la rigueur exigée en Physique-Chimie : 1) Formule littérale isolée, 2) Conversion des unités dans le Système International, 3) Application numérique avec la bonne unité finale et les chiffres significatifs",
    unicodeSymbols: "×, ÷, ➔, ⇌, Δt, λ, μ, Ω, °C, H₃O⁺, HO⁻, e⁻, CO₂, H₂O, 10⁻³, 10⁶, m·s⁻¹",
    forbiddenLatex: "$, $$, \\(, \\), \\frac, \\Delta, \\lambda, \\rightarrow",
    sampleSimulation: {
      studentQuestion: "Je n'arrive jamais à utiliser la formule de la concentration en masse.",
      tutorStep1: "La concentration en masse (notée Cₘ), c'est simplement la quantité de poudre (la masse m en grammes) dissoute pour 1 litre de liquide (le volume V en litres) :\n• Formule : **Cₘ = m ÷ V**\n• Exemple : 10 g de sucre dans 2 L d'eau donnent Cₘ = 10 ÷ 2 = 5 g·L⁻¹.\n\nSi tu dissous 12 g de sel dans 3 L d'eau, quelle est la concentration en masse Cₘ ?",
      studentReply: "12 divisé par 3, ça fait 4 g/L.",
      tutorStep2: "Parfait, ça fait bien 4 g·L⁻¹ !\n💡 **Pour avoir tous les points sur ta copie :** écris toujours la formule avant les chiffres et précise l'unité : « On sait que Cₘ = m ÷ V. Avec m = 12 g et V = 3,0 L, on a Cₘ = 12 ÷ 3,0 = 4,0 g·L⁻¹. »\n\nMaintenant, attention au petit piège classique des contrôles : combien vaut Cₘ si tu dissous 6 g de sel dans 500 mL d'eau ?"
    }
  },
  histoire_geo: {
    id: 'histoire_geo',
    name: 'Histoire-Géographie & HGGSP',
    icon: Globe,
    category: 'Humanités & Sciences Sociales',
    explanationStyle: "en posant le décor en 3 points repères : Acteur/Lieu ➔ Événement ou Dynamique spatiale ➔ Conséquence majeure",
    microChallengeStyle: "une seule question ciblée (relier une date ou un lieu à son enjeu, ou identifier l'idée principale d'une situation historique/géographique)",
    progressionStyle: "une mise en relation un peu plus riche (changer d'échelle géographique, montrer une limite ou nuancer avec un second facteur)",
    frenchEvalRule: "le réflexe attendu par les correcteurs d'Histoire-Géo : associer systématiquement 1) Une notion clé du programme en gras, 2) Un repère précis (date, chiffre, lieu ou acteur nommé), et 3) Un connecteur logique explicatif",
    unicodeSymbols: "➔, ↔, %, км², hab/km², XIXᵉ, XXᵉ, XXIᵉ, « »",
    forbiddenLatex: "$, $$, \\(, \\), \\rightarrow",
    sampleSimulation: {
      studentQuestion: "C'est quoi exactement la métropolisation en géographie ?",
      tutorStep1: "La **métropolisation**, c'est le fait que les grandes villes concentrent de plus en plus les habitants, les richesses et surtout les fonctions de commandement (sièges d'entreprises, universités, banques, culture) :\n• Exemple : Paris concentre les sièges sociaux et les ministères, attirant les cadres du monde entier.\n\nSi une grande ville attire les centres de recherche et les sièges de banques mais que les loyers du centre explosent, où vont devoir habiter les familles modestes selon toi ?",
      studentReply: "Elles vont habiter plus loin en banlieue ou à la campagne.",
      tutorStep2: "Exactement, elles s'éloignent du centre-ville !\n💡 **Pour avoir tous les points sur ta copie :** remplace « aller loin en banlieue » par les termes officiels : « La hausse du prix du foncier dans le centre entraîne une **gentrification** des centres-villes et une **périurbanisation** des ménages modestes vers les couronnes périphériques, accentuant la **ségrégation socio-spatiale**. »\n\nÀ ton avis, quelle conséquence concrète cet éloignement a-t-il sur les transports tous les matins ?"
    }
  },
  francais_philo: {
    id: 'francais_philo',
    name: 'Français & Philosophie',
    icon: BookOpen,
    category: 'Humanités & Sciences Sociales',
    explanationStyle: "en expliquant l'idée ou le procédé littéraire avec des mots simples du quotidien, suivi d'un court exemple parlant",
    microChallengeStyle: "une seule question courte sur un court extrait ou une affirmation pour vérifier que l'élève repère l'effet produit ou le paradoxe",
    progressionStyle: "une étape d'approfondissement (nommer précisément le procédé stylistique ou définir les deux sens d'un concept pour dégager un enjeu)",
    frenchEvalRule: "la méthode d'analyse exigée aux épreuves écrites et orales : ne jamais faire de paraphrase, mais associer 1) La citation entre guillemets, 2) Le nom de l'outil grammatical/stylistique ou la distinction conceptuelle, et 3) L'effet produit sur le lecteur ou la thèse défendue",
    unicodeSymbols: "« », ➔, ≠, —, …",
    forbiddenLatex: "$, $$, \\(, \\)",
    sampleSimulation: {
      studentQuestion: "Je ne sais jamais comment analyser une métaphore sans redire juste ce que dit le texte.",
      tutorStep1: "Pour ne pas paraphraser, décompose toujours la métaphore en 3 morceaux : **Ce dont on parle** + **L'image utilisée** ➔ **L'impression que ça crée**.\n• Si Victor Hugo écrit « Cette faucille d'or dans le champ des étoiles » pour parler de la lune, il transforme le ciel en champ de blé paisible.\n\nPrenons cette phrase de Baudelaire : « Quand le ciel bas et lourd pèse comme un couvercle ». À quel objet le ciel est-il associé, et quelle sensation physique cela donne-t-il ?",
      studentReply: "Il est comparé à un couvercle de marmite, ça donne une impression d'étouffement et d'être enfermé.",
      tutorStep2: "C'est très bien vu : l'enfermement et l'étouffement !\n💡 **Pour avoir tous les points sur ta copie :** rédige ton analyse en 3 temps : « À travers la **comparaison** « comme un couvercle » associée aux adjectifs « bas et lourd », le poète matérialise l'**angoisse existentielle** : le ciel perd son infinité pour devenir une prison suffocante qui écrase l'esprit. »\n\nMaintenant, quel mot dans cette même phrase renforce l'idée d'un poids physique ?"
    }
  },
  ses_eco: {
    id: 'ses_eco',
    name: 'SES / Économie-Gestion',
    icon: TrendingUp,
    category: 'Humanités & Sciences Sociales',
    explanationStyle: "sous forme de chaîne de causalité économique ou sociologique claire (Mécanisme A ➔ Effet B ➔ Résultat C) illustrée par un cas concret",
    microChallengeStyle: "une seule question simple de vérification (lire un chiffre correctement ou identifier le sens de variation d'une grandeur économique)",
    progressionStyle: "une étape combinant lecture de donnée statistique et explication du mécanisme théorique sous-jacent",
    frenchEvalRule: "la double exigence des correcteurs de SES : 1) Lire une donnée statistique avec une phrase exacte (sans confondre pourcentage de répartition et taux de variation, en citant source/date/unité), et 2) Expliciter chaque maillon du mécanisme causal avec les notions officielles du programme",
    unicodeSymbols: "➔, ↗, ↘, %, points de %, €, Mds €",
    forbiddenLatex: "$, $$, \\(, \\), \\rightarrow",
    sampleSimulation: {
      studentQuestion: "Je ne comprends pas comment la hausse de la productivité peut favoriser la croissance économique.",
      tutorStep1: "Produire plus vite ou mieux avec les mêmes moyens (hausse de la **productivité**) déclenche 3 effets positifs :\n• L'entreprise dépense moins par produit fabriqué ➔ elle peut **baisser ses prix** (les clients achètent plus), **augmenter les salaires** (les salariés consomment plus) ou **augmenter ses profits** (elle investit plus).\n\nSi une usine de vélos divise ses coûts de fabrication par deux et décide de baisser le prix de vente de ses vélos de 20 %, que va-t-il se passer du côté des acheteurs ?",
      studentReply: "Les gens vont pouvoir acheter plus de vélos.",
      tutorStep2: "Exactement, leurs achats augmentent !\n💡 **Pour avoir tous les points sur ta copie :** utilise les termes économiques précis : « Les **gains de productivité** permettent une baisse des coûts unitaires de production. En répercutant cette baisse sur les prix de vente, l'entreprise augmente le **pouvoir d'achat** des ménages, ce qui stimule la **demande globale** et donc la **croissance économique** (hausse du PIB). »\n\nEt si l'entreprise choisissait plutôt d'utiliser ces gains pour augmenter ses profits, comment cela aiderait-il aussi la croissance ?"
    }
  },
  langues: {
    id: 'langues',
    name: 'Langues Vivantes (Anglais, Espagnol, Allemand)',
    icon: Languages,
    category: 'Langues & Communication',
    explanationStyle: "en expliquant la règle grammaticale ou lexicale en français de façon ultra-visuelle, avec 2 exemples courts mis en parallèle",
    microChallengeStyle: "une seule phrase courte à compléter, traduire ou reformuler immédiatement pour ancrer le réflexe",
    progressionStyle: "une phrase un peu plus riche intégrant un connecteur logique ou une nuance de temps/modale adaptée au niveau CECRL attendu",
    frenchEvalRule: "le conseil « 💡 Pour gagner un maximum de points à l'écrit et à l'oral : » qui montre comment remplacer un mot basique par une tournure idiomatique authentique, un connecteur logique riche ou une structure grammaticale valorisée par la grille officielle du Baccalauréat",
    unicodeSymbols: "➔, ≠, ✓, « »",
    forbiddenLatex: "$, $$, \\(, \\)",
    sampleSimulation: {
      studentQuestion: "En anglais, je ne sais jamais quand utiliser le Present Perfect (have + participe passé) ou le Prétérit.",
      tutorStep1: "Pose-toi une seule question : **le pont avec le présent est-il coupé ou encore ouvert ?**\n• **Prétérit** = Pont coupé (action datée et terminée dans le passé) : *I lost my keys yesterday* (c'était hier).\n• **Present Perfect** = Pont ouvert (bilan ou conséquence visible maintenant) : *I have lost my keys* (résultat : je suis coincé devant ma porte maintenant).\n\nComment traduirais-tu : « J'ai visité Londres en 2022 » (indice : regarde si c'est daté dans le passé) ?",
      studentReply: "I visited London in 2022.",
      tutorStep2: "Bravo, **I visited London in 2022** ! Comme « in 2022 » coupe le lien avec aujourd'hui, le Prétérit s'impose.\n💡 **Pour avoir tous les points sur ta copie :** retiens que dès que tu écris un marqueur de temps révolu (*yesterday, in 2022, two years ago, when I was young*), le correcteur attend obligatoirement le **Prétérit**.\n\nMaintenant, comment dirais-tu : « J'ai déjà visité Londres trois fois dans ma vie » (bilan jusqu'à aujourd'hui, sans date passée) ?"
    }
  },
  nsi_info: {
    id: 'nsi_info',
    name: 'NSI / SNT / Algorithmique',
    icon: Code2,
    category: 'Sciences & Logique',
    explanationStyle: "en déroulant ce qui se passe concrètement en mémoire étape par étape sur un tout petit exemple (3 valeurs maximum)",
    microChallengeStyle: "une seule question courte demandant de prédire la valeur d'une variable après un tour de boucle ou de compléter une seule ligne de code",
    progressionStyle: "un cas limite (liste vide, indice de fin, complexité ou invariant) ou l'écriture propre de la fonction complète",
    frenchEvalRule: "les critères de notation du Bac en NSI/Algorithmique : code lisible et indenté, respect des spécifications (types, docstring ou cas d'arrêt pour la récursivité), absence d'effet de bord involontaire et justification de la terminaison ou de la complexité",
    unicodeSymbols: "➔, ≠, ≤, ≥, ←, [ ], O(n), O(1), O(log n)",
    forbiddenLatex: "$, $$, \\(, \\), \\mathcal{O}",
    sampleSimulation: {
      studentQuestion: "Je ne comprends pas comment marche le parcours d'une liste par indice en Python avec range(len(L)).",
      tutorStep1: "Imagine une rangée de 3 casiers numérotés 0, 1 et 2 contenant `L = [10, 20, 30]`.\n• `L[i]` regarde le contenu du casier numéro `i`.\n• `for i in range(len(L)):` fait varier le numéro `i` de `0` jusqu'à `2`.\n\nAvec `L = [10, 20, 30]`, que vaut `L[1]` et que vaut `len(L)` ?",
      studentReply: "L[1] vaut 20 et len(L) vaut 3.",
      tutorStep2: "Exactement ! Le casier d'indice 1 contient 20 (car on commence à numéroter à 0) et la longueur vaut 3.\n💡 **Pour avoir tous les points sur ta copie :** si tu dois modifier les éléments de la liste sur place (par exemple doubler chaque valeur), utilise toujours le parcours par indice `for i in range(len(L)): L[i] = 2 * L[i]` plutôt que `for x in L:` qui ne modifie pas la liste.\n\nÀ ton avis, que vaut la liste `L` après l'exécution de cette boucle si on part de `L = [4, 7, 1]` ?"
    }
  }
};

const CURSUS_OPTIONS = [
  {
    id: 'cycle_2',
    label: 'Cycle 2 — Apprentissages fondamentaux (CP, CE1, CE2)',
    examName: 'des évaluations nationales et des cahiers du jour de Cycle 2',
    isSchoolCycle: true
  },
  {
    id: 'cycle_3',
    label: 'Cycle 3 — Consolidation (CM1, CM2, Sixième - 6e)',
    examName: 'des bilans de fin de Cycle 3 et de l’entrée au collège',
    isSchoolCycle: true
  },
  {
    id: 'cycle_4',
    label: 'Cycle 4 — Approfondissements / Collège (5e, 4e, 3e)',
    examName: 'du Diplôme National du Brevet (DNB) et du Socle Commun',
    isSchoolCycle: true
  },
  {
    id: 'lycee_general',
    label: 'Lycée — Voie Générale (2de, 1re, Terminale)',
    examName: 'du Baccalauréat Général et des évaluations de spécialité',
    isSchoolCycle: false
  },
  {
    id: 'lycee_techno',
    label: 'Lycée — Voie Technologique (STI2D, STL, STMG, ST2S...)',
    examName: 'du Baccalauréat Technologique',
    isSchoolCycle: false
  },
  {
    id: 'lycee_pro',
    label: 'Lycée — Voie Professionnelle (Bac Pro / CAP)',
    examName: 'du Baccalauréat Professionnel et des CCF',
    isSchoolCycle: false
  }
];

const NIVEAUX_BY_CURSUS = {
  cycle_2: [
    'CP (Cours Préparatoire — 6/7 ans)',
    'CE1 (Cours Élémentaire 1re année — 7/8 ans)',
    'CE2 (Cours Élémentaire 2e année — 8/9 ans)'
  ],
  cycle_3: [
    'CM1 (Cours Moyen 1re année — 9/10 ans)',
    'CM2 (Cours Moyen 2e année — 10/11 ans)',
    'Sixième - 6e (Fin de Cycle 3 / Entrée au Collège — 11/12 ans)'
  ],
  cycle_4: [
    'Cinquième (5e — Début de Cycle 4)',
    'Quatrième (4e — Milieu de Cycle 4)',
    'Troisième (3e — Fin de Cycle 4 / Objectif Brevet DNB)'
  ],
  lycee_general: [
    'Seconde Générale et Technologique',
    'Première Générale (Spécialité / Tronc commun)',
    'Terminale Générale (Spécialité / Tronc commun)'
  ],
  lycee_techno: [
    'Seconde Générale et Technologique',
    'Première Technologique',
    'Terminale Technologique'
  ],
  lycee_pro: [
    'Seconde Professionnelle',
    'Première Professionnelle',
    'Terminale Professionnelle',
    'CAP'
  ],
  post_bac: [
    '1re année (BTS / BUT / L1 / Prépa)',
    '2e année (BTS / BUT / L2 / Prépa)',
    '3e année (BUT / Licence 3)'
  ]
};

// Matrices de personnalisation fine pour les Cycles 2, 3 et 4 (Éducation Nationale)
const CYCLE_SPECIFIC_CONFIG = {
  cycle_2: {
    badge: 'Cycle 2',
    title: 'Personnalisation Cycle 2',
    cognitiveBase: "CALIBRATION COGNITIVE CYCLE 2 (6-9 ANS) : Utilise un vocabulaire très simple, concret et adapté à un jeune enfant d'école élémentaire. Tes phrases doivent être très courtes (10 à 15 mots maximum par phrase). Pars toujours d'une manipulation concrète d'objets du quotidien (billes, paquets de 10, jetons, pièces de monnaie, parts de gâteau) avant d'écrire les symboles.",
    subjectNameOverrides: {
      svt: 'Questionner le monde (Le vivant, la matière et les objets)',
      physique_chimie: 'Questionner le monde (La matière et les objets techniques)',
      histoire_geo: 'Questionner l’espace et le temps',
      francais_philo: 'Français (Lecture, Écriture, Grammaire et Orthographe)',
      nsi_info: 'Initiation au repérage et au codage de déplacements'
    },
    scaffoldingModes: [
      {
        id: 'c2_manip',
        label: 'Manipulation concrète (Paquets de 10, jetons, billes)',
        desc: 'Fait visualiser les quantités ou les mots comme des objets que l’on groupe ou déplace',
        promptRule: "Appuie chaque explication sur une image de manipulation concrète (grouper par paquets de 10 dizaines, avancer sur une bande numérique ou découper avec des étiquettes)."
      },
      {
        id: 'c2_phrase_reponse',
        label: 'Construction de la phrase-réponse (Majuscule + Point)',
        desc: 'Apprend à l’enfant à reprendre les mots de la question pour répondre sur son cahier',
        promptRule: "Aide systématiquement l'enfant à construire une phrase-réponse complète qui reprend les mots de la question, commence par une majuscule et finit par un point."
      },
      {
        id: 'c2_lecture_fluide',
        label: 'Décodage & Lecture aidée (Zéro mot complexe)',
        desc: 'Idéal CP/CE1 : consignes ultra-épurées pour ne jamais bloquer la lecture',
        promptRule: "Écris avec des mots transparents et très faciles à décoder seul par un élève de CP/CE1. Évite toute tournure inversée ou abstraite."
      }
    ],
    evalFocusOptions: [
      {
        id: 'c2_eval_cahier',
        label: 'Présentation du cahier du jour (Opération + Phrase + Unité)',
        rule: "la présentation attendue par le maître ou la maîtresse dans le cahier du jour : 1) Le calcul bien posé en ligne, et 2) Une phrase-réponse courte avec une majuscule, l'unité (billes, euros, cm...) et un point"
      },
      {
        id: 'c2_eval_accords',
        label: 'Vigilance Accords & Orthographe (Chaîne d’accord simple)',
        rule: "l'astuce de relecture attendue en classe : repérer le déterminant (le/les, un/des) ou le sujet pour vérifier les lunettes de l'accord (-s au pluriel, -nt au verbe)"
      },
      {
        id: 'c2_eval_mental',
        label: 'Automatisme de Calcul Mental (Doubles, compléments à 10)',
        rule: "l'astuce de calcul mental rapide valorisée à l'école (passer par 10, utiliser les doubles ou décomposer en dizaines et unités)"
      }
    ],
    simulationsBySubject: {
      default: {
        studentQuestion: "J'ai un problème : Léo a 18 billes. Il en gagne 7 à la récréation. Combien a-t-il de billes maintenant ? Je ne sais pas comment calculer vite.",
        tutorStep1: "Imagine les 18 billes de Léo dans un sac. Pour aller jusqu'à 20 billes (2 paquets de 10), il manque seulement **2 billes** !\n• On prend 2 billes sur les 7 gagnées pour faire **20**.\n\nSur les 7 billes gagnées, si tu en as déjà utilisé 2 pour arriver à 20, combien te reste-t-il de billes à ajouter ?",
        studentReply: "Il en reste 5 !",
        tutorStep2: "Bravo, il en reste 5 ! Et 20 + 5, cela fait **25 billes**.\n💡 **Pour avoir tous les points sur ton cahier :** écris d'abord le calcul **18 + 7 = 25**, puis la phrase-réponse avec une majuscule et un point : **« Léo a maintenant 25 billes. »**\n\nÀ toi pour une nouvelle étape : si Léo a 25 billes et qu'il en donne 5 à son ami, combien lui en reste-t-il ?"
      },
      francais_philo: {
        studentQuestion: "Je ne sais jamais quand il faut mettre un S à la fin des mots dans une phrase.",
        tutorStep1: "Regarde juste le petit mot (le déterminant) placé devant le nom :\n• S'il y en a **un seul** (le, la, un, une) ➔ pas de **s** : *un chat*.\n• S'il y en a **plusieurs** (les, des, mes, trois) ➔ on ajoute un **s** muet : *des chat**s***.\n\nDans « Les petits chiens courent », est-ce qu'il y a un seul chien ou plusieurs chiens ?",
        studentReply: "Il y en a plusieurs parce qu'il y a écrit Les.",
        tutorStep2: "Exactement, le mot « Les » commande le pluriel !\n💡 **Pour avoir tous les points sur ton cahier :** trace dans ta tête la chaîne d'accord à partir de « Les » : on met un **s** à *petit**s*** et un **s** à *chien**s***.\n\nMaintenant, comment écrirais-tu le mot « ballon » dans : « Léo range ses trois ... » ?"
      }
    }
  },
  cycle_3: {
    badge: 'Cycle 3',
    title: 'Personnalisation Cycle 3',
    cognitiveBase: "CALIBRATION COGNITIVE CYCLE 3 (9-12 ANS) : Fais le pont entre la manipulation concrète et le raisonnement structuré. Utilise des représentations visuelles claires (schéma en barres pour les problèmes, partage de bandes pour les fractions et nombres décimaux, tableaux de proportionnalité) avant d'introduire les règles formelles.",
    subjectNameOverrides: {
      svt: 'Sciences et Technologie (Le vivant, la matière, la Terre)',
      physique_chimie: 'Sciences et Technologie (Matière, mouvement, énergie, signal)',
      francais_philo: 'Français (Étude de la langue, Lecture et Rédaction)',
      nsi_info: 'Initiation à l’algorithmique et au codage (Scratch / Logique)'
    },
    scaffoldingModes: [
      {
        id: 'c3_barres',
        label: 'Schématisation en barres (Résolution de problèmes & Fractions)',
        desc: 'Traduit chaque énoncé en parts visuelles ou en bandes avant de choisir l’opération',
        promptRule: "Aide l'élève à visualiser l'énoncé sous forme de schéma en barres (Tout / Parties, ou comparaison de bandes) ou de partage de bande unité avant de poser le calcul."
      },
      {
        id: 'c3_demarche',
        label: 'Structuration en 3 temps (Je cherche / Je calcule / Je réponds)',
        desc: 'Installe la rigueur méthodologique attendue en CM1-CM2 et à l’entrée en 6e',
        promptRule: "Guide l'élève pour qu'il distingue clairement ce qu'il cherche, l'opération choisie et la phrase de conclusion avec la bonne unité."
      },
      {
        id: 'c3_grammaire',
        label: 'Manipulations syntaxiques (Remplacer, déplacer, supprimer)',
        desc: 'Idéal en Français/Langues pour identifier la nature et la fonction des mots sans deviner',
        promptRule: "Fais trouver la nature ou la fonction d'un mot grâce à une manipulation concrète (remplacer par un pronom, encadrer par « C'est... qui », déplacer ou supprimer)."
      }
    ],
    evalFocusOptions: [
      {
        id: 'c3_eval_6e',
        label: 'Rigueur de la copie de fin de Cycle 3 / 6e (Justification + Unité)',
        rule: "la présentation complète attendue en CM1-CM2-6e : écrire l'égalité en ligne avec les étapes, préciser systématiquement l'unité de mesure et rédiger une phrase-réponse complète qui répond exactement à la question"
      },
      {
        id: 'c3_eval_orthographe',
        label: 'Justification grammaticale (Accords Sujet/Verbe, Attribut, Groupe Nominal)',
        rule: "la justification grammaticale attendue en contrôle : nommer la règle utilisée (ex : « J'accorde le verbe avec son sujet [X] qu'on peut remplacer par [il/ils] » ou « Je peux remplacer a par avait »)"
      },
      {
        id: 'c3_eval_sciences',
        label: 'Observation & Conclusion en Sciences (« J’observe que… donc… »)',
        rule: "la méthode scientifique de Cycle 3 : citer d'abord l'indice précis observé dans l'expérience ou le document (« J'observe que... ») avant de conclure (« Donc j'en déduis que... »)"
      }
    ],
    simulationsBySubject: {
      default: {
        studentQuestion: "Je ne comprends pas comment calculer les 3/4 de 20 euros dans mon problème.",
        tutorStep1: "Imagine une barre de chocolat qui vaut **20 €** au total et qu'on coupe en **4 parts égales** (ce sont les quarts) :\n• Pour trouver la valeur d'**une seule part** (1/4), on partage 20 € en 4.\n\nSi tu partages 20 € en 4 parts égales, combien vaut **une seule part** ?",
        studentReply: "20 divisé par 4, ça fait 5 euros la part.",
        tutorStep2: "Parfait, une part (1/4) vaut **5 €** !\n💡 **Pour avoir tous les points sur ta copie :** écris d'abord le partage d'une part puis la multiplication : « 1/4 de 20 € = 20 ÷ 4 = 5 €. Donc 3/4 de 20 € = 3 × 5 € = 15 €. »\n\nMaintenant, avec la même méthode en deux étapes, combien valent les **2/5 de 30 mètres** ?"
      },
      francais_philo: {
        studentQuestion: "Je confonds toujours le COD (complément d'objet direct) et l'attribut du sujet.",
        tutorStep1: "Utilise l'astuce de l'étiquette : demande-toi si les deux morceaux désignent **la même personne/chose** ou **deux choses différentes**.\n• *Léo mange une pomme* : Léo ≠ la pomme ➔ **COD**.\n• *Léo semble fatigué* : c'est bien Léo qui est fatigué (verbe d'état) ➔ **Attribut du sujet**.\n\nDans la phrase « Cette chienne devient très calme », est-ce que « très calme » désigne une autre chose ou qualifie la chienne elle-même ?",
        studentReply: "Ça qualifie la chienne elle-même, avec le verbe devient.",
        tutorStep2: "Exactement, c'est donc un **attribut du sujet** !\n💡 **Pour avoir tous les points sur ta copie :** justifie en écrivant : « Le groupe adjectival *très calme* est **attribut du sujet** *Cette chienne* car il est relié au sujet par le **verbe d'état** *devient* et ne peut pas être supprimé. »\n\nÀ toi : quelle est la fonction de « un roman policier » dans « Ma sœur lit un roman policier » ?"
      }
    }
  },
  cycle_4: {
    badge: 'Cycle 4',
    title: 'Personnalisation Cycle 4',
    cognitiveBase: "CALIBRATION COGNITIVE CYCLE 4 (5e, 4e, 3e) : Accompagne le passage du numérique au littéral et de l'observation à la démonstration structurée. L'élève doit comprendre le sens concret d'une règle avant d'appliquer le formalisme exigé au collège et au Diplôme National du Brevet (DNB).",
    subjectNameOverrides: {
      francais_philo: 'Français (Analyse de texte, Grammaire, Dictée & Rédaction Brevet)',
      histoire_geo: 'Histoire-Géographie & EMC (Développement construit et Analyse de documents)',
      nsi_info: 'Algorithmique & Programmation (Scratch / Python Collège)'
    },
    scaffoldingModes: [
      {
        id: 'c4_demonstration',
        label: 'Raisonnement déductif (« On sait que / Or / Donc »)',
        desc: 'Entraîne aux démonstrations géométriques (Pythagore, Thalès...) et scientifiques',
        promptRule: "Fais d'abord trouver le résultat par le calcul ou l'observation rapide, puis entraîne systématiquement l'élève à structurer sa preuve en 3 blocs : Données (« On sait que... ») ➔ Propriété (« Or d'après... ») ➔ Conclusion (« Donc... »)."
      },
      {
        id: 'c4_automatismes',
        label: 'Entraînement « Automatismes » (Calcul littéral, fractions, relatifs)',
        desc: 'Cible la rapidité et la sûreté technique (épreuves sans calculatrice / Brevet)',
        promptRule: "Décompose les calculs (nombres relatifs, fractions, puissances, développement/factorisation) en réflexes visuels étape par étape pour éliminer les erreurs de signe et de priorité."
      },
      {
        id: 'c4_brevet_redaction',
        label: 'Justification & Réponse développée (Objectif Brevet DNB)',
        desc: 'Apprend à citer les documents et à justifier chaque affirmation pour avoir le barème complet',
        promptRule: "Apprends à l'élève à ne jamais donner une réponse sèche : fais-lui toujours associer un indice précis du document ou de l'énoncé à une notion du cours de Cycle 4."
      }
    ],
    evalFocusOptions: [
      {
        id: 'c4_eval_dnb',
        label: 'Barème officiel du Brevet (Démonstration complète + Unités)',
        rule: "la rédaction exacte exigée au Diplôme National du Brevet (DNB) : citer les hypothèses de l'énoncé (ex : triangle rectangle en A, droites parallèles), nommer le théorème ou la règle utilisée, détailler le calcul et conclure avec l'unité"
      },
      {
        id: 'c4_eval_doc',
        label: 'Exploitation de documents (« Je vois que [chiffre]… Or je sais que… Donc… »)',
        rule: "la méthode de justification attendue en SVT, Physique-Chimie et Histoire-Géo au collège : « D'après le document, je relève que [citation/chiffre avec unité]... Or je sais que [connaissance du cours]... Donc j'en déduis que... »"
      },
      {
        id: 'c4_eval_litteral',
        label: 'Sécurisation du Calcul Littéral & Équations (Zéro erreur de signe)',
        rule: "la présentation rigoureuse des étapes d'un calcul littéral ou d'une équation sur la copie de collège (alignement des signes =, distribution explicite des signes moins et vérification de la solution)"
      }
    ],
    simulationsBySubject: {
      default: {
        studentQuestion: "Dans un triangle ABC rectangle en A, j'ai AB = 3 cm et AC = 4 cm. Comment je trouve BC avec Pythagore ?",
        tutorStep1: "Dans un triangle rectangle, le plus grand côté (en face de l'angle droit A, donc **BC**) vérifie une règle simple avec les carrés :\n• **BC² = AB² + AC²**\n• Ici, on additionne le carré de 3 et le carré de 4.\n\nCombien valent **3²** (3 × 3) et **4²** (4 × 4), et quelle est leur somme ?",
        studentReply: "3 au carré fait 9, 4 au carré fait 16, et 9 + 16 = 25.",
        tutorStep2: "Exactement, **BC² = 25** ! Et comme 5 × 5 = 25, la longueur BC vaut **√25 = 5 cm**.\n💡 **Pour avoir tous les points sur ta copie au Brevet :** rédige toujours les 3 lignes attendues par le correcteur : « Le triangle ABC est rectangle en A. D'après le **théorème de Pythagore**, on a BC² = AB² + AC² = 3² + 4² = 9 + 16 = 25. Comme BC > 0, BC = √25 = **5 cm**. »\n\nÉtape suivante : et si cette fois on connaissait l'hypoténuse BC = 10 cm et un côté AB = 6 cm, comment calculerais-tu AC² ?"
      },
      svt: {
        studentQuestion: "En SVT (4e/3e), je ne sais jamais comment rédiger quand on me demande d'expliquer l'action des anticorps à partir d'un graphique.",
        tutorStep1: "Procède toujours comme un détective en 3 étapes :\n1. **Ce que montre le graphique** (avec les chiffres).\n2. **Ce que dit ton cours** sur le rôle des anticorps.\n3. **La conclusion**.\n\nSur un graphique, tu vois qu'après l'injection d'anticorps spécifiques à 2 jours, la quantité de bactéries passe de 10 000 à 0 en 4 jours. Que peux-tu dire de l'évolution des bactéries avec les chiffres ?",
        studentReply: "La quantité de bactéries baisse de 10 000 à 0 en 4 jours après l'injection des anticorps.",
        tutorStep2: "Parfait, tu as cité les valeurs exactes et les unités !\n💡 **Pour avoir tous les points sur ta copie :** assemble maintenant les 3 briques : « **Je vois que** le nombre de bactéries diminue de 10 000 à 0 en 4 jours après l'injection d'**anticorps**. **Or je sais que** les anticorps sont des molécules produites par les **lymphocytes B** capables de neutraliser spécifiquement un **antigène**. **Donc j'en déduis que** ces anticorps ont neutralisé les bactéries et permis leur élimination. »\n\nÀ ton avis, que se passerait-il sur le graphique si on injectait des anticorps dirigés contre un autre microbe (par exemple le virus de la grippe) ?"
      }
    }
  },
  lycee_general: {
    badge: 'Lycée Général',
    title: 'Personnalisation Lycée Général',
    cognitiveBase: "CALIBRATION COGNITIVE LYCÉE GÉNÉRAL (2de, 1re, Terminale) : Combine l'acquisition rapide d'automatismes techniques (calculatoires, méthodologiques ou analytiques) avec la rigueur conceptuelle et rédactionnelle exigée aux épreuves du Baccalauréat Général.",
    subjectNameOverrides: {},
    scaffoldingModes: [
      {
        id: 'lycee_auto_demo',
        label: 'Automatismes rapides + Démonstration rigoureuse',
        desc: 'Débloque le mécanisme par un exemple simple avant de passer à la justification formelle type Bac',
        promptRule: "Débloque d'abord l'élève par un réflexe visuel ou un exemple chiffré immédiat, puis guide-le pas à pas vers la généralisation et la justification rigoureuse attendue au lycée."
      },
      {
        id: 'lycee_methodo_bac',
        label: 'Méthodologie d’épreuve (Exercice type Bac, Analyse de doc, Dissertation)',
        desc: 'Apprend à décoder la consigne et à mobiliser les notions clés du programme officiel',
        promptRule: "Aide l'élève à décoder immédiatement le verbe de consigne (démontrer, déterminer, exploiter, caractériser) pour mobiliser la bonne méthode sans hors-sujet."
      },
      {
        id: 'lycee_grand_oral',
        label: 'Clarté conceptuelle & Argumentation (Spécialités / Grand Oral)',
        desc: 'Travaille la précision du vocabulaire et l’enchaînement logique des idées',
        promptRule: "Exige une compréhension claire du sens des concepts afin que l'élève sache expliquer le « comment » et le « pourquoi » avec un vocabulaire académique précis."
      }
    ],
    evalFocusOptions: [
      {
        id: 'lycee_eval_matiere',
        label: 'Attendus officiels de la discipline au Baccalauréat (Règle spécifique matière)',
        useSubjectDefault: true,
        rule: ''
      },
      {
        id: 'lycee_eval_redaction',
        label: 'Rédaction exhaustive de copie de Spécialité (Hypothèses ➔ Théorème/Loi ➔ Conclusion)',
        useSubjectDefault: false,
        rule: "la rédaction complète exigée en contrôle de spécialité et au Baccalauréat : 1) Préciser le cadre ou les hypothèses vérifiées, 2) Citer explicitement la propriété, la loi ou la notion officielle du programme, et 3) Conclure proprement en répondant à la question posée"
      },
      {
        id: 'lycee_eval_synthese',
        label: 'Exploitation critique & Synthèse argumentée (Connecteurs + Notions en gras)',
        useSubjectDefault: false,
        rule: "la méthode de synthèse attendue au lycée : relier les données précises (chiffres, citations, observations) aux concepts théoriques du programme en utilisant des connecteurs logiques explicites"
      }
    ],
    simulationsBySubject: null
  },
  lycee_techno: {
    badge: 'Lycée Techno',
    title: 'Personnalisation Lycée Technologique',
    cognitiveBase: "CALIBRATION COGNITIVE LYCÉE TECHNOLOGIQUE (STI2D, STL, STMG, ST2S) : Privilégie une démarche inductive et concrète. Pars systématiquement d'une étude de cas réel, d'un système technique, d'une manipulation de laboratoire ou d'un contexte d'organisation/santé avant de formaliser le concept théorique exigé au Baccalauréat Technologique.",
    subjectNameOverrides: {
      physique_chimie: 'Physique-Chimie & Mathématiques / SPCL / Ingénierie (STI2D, STL)',
      svt: 'Biologie & Physiopathologie (ST2S) / Biotechnologies (STL)',
      ses: 'Sciences de Gestion, Management, Droit & Économie (STMG)',
      nsi_info: 'Systèmes d’Information et Numérique (SIN / SIG)'
    },
    scaffoldingModes: [
      {
        id: 'techno_inductif',
        label: 'Approche inductive par Étude de cas ou Système réel',
        desc: 'Part d’une situation concrète (organisation, système technique, labo, cas patient) pour remonter à la règle',
        promptRule: "Pars toujours d'un cas concret ou d'un fonctionnement observable (entreprise, système technique, expérience de laboratoire ou dossier sanitaire) avant d'énoncer la loi, la formule ou la règle de droit/gestion."
      },
      {
        id: 'techno_docs',
        label: 'Exploitation de Dossier Documentaire & Données techniques',
        desc: 'Entraîne à extraire les indicateurs clés d’un dossier (tableaux, schémas, annexes) sans paraphraser',
        promptRule: "Guide l'élève pour croiser les informations d'un dossier technique ou documentaire (indicateurs chiffrés, schémas fonctionnels, textes réglementaires) et les transformer en arguments structurés."
      },
      {
        id: 'techno_projet',
        label: 'Préparation Projet Technologique & Grand Oral',
        desc: 'Structure la démarche de projet (besoin, contraintes, indicateurs, justification des solutions)',
        promptRule: "Structure le raisonnement selon une démarche de projet ou d'étude : identification du besoin/problème ➔ analyse des contraintes et indicateurs ➔ proposition et justification de la solution retenue."
      }
    ],
    evalFocusOptions: [
      {
        id: 'techno_eval_dossier',
        label: 'Barème d’Étude de cas & Analyse technologique (Contexte ➔ Règle/Formule ➔ Application)',
        useSubjectDefault: false,
        rule: "la méthodologie attendue aux épreuves de spécialité du Bac Technologique : 1) Qualifier précisément le contexte ou les données pertinentes du dossier, 2) Mobiliser la notion, la formule ou la règle appropriée, et 3) Appliquer au cas étudié avec les unités ou la qualification exacte"
      },
      {
        id: 'techno_eval_matiere',
        label: 'Attendus officiels de la discipline au Baccalauréat (Règle spécifique matière)',
        useSubjectDefault: true,
        rule: ''
      },
      {
        id: 'techno_eval_argumentation',
        label: 'Question argumentée & Prise de décision justifiée (STMG / ST2S / STI2D / STL)',
        useSubjectDefault: false,
        rule: "la structure d'une réponse argumentée en série technologique : formuler un diagnostic ou une prise de position claire, l'appuyer sur des indicateurs chiffrés ou scientifiques précis du dossier, et conclure sur la pertinence ou la limite de la solution"
      }
    ],
    simulationsBySubject: {
      default: {
        studentQuestion: "En étude de cas, on me demande de calculer le taux d'évolution du chiffre d'affaires entre 2024 (200 000 €) et 2025 (230 000 €) et de l'interpréter.",
        tutorStep1: "Pars du réflexe concret : on regarde **combien l'entreprise a gagné en plus** par rapport à sa valeur de départ.\n• Formule : **(Valeur d'arrivée − Valeur de départ) ÷ Valeur de départ × 100**\n• Ici : départ = 200 000 € et arrivée = 230 000 €.\n\nCombien vaut l'augmentation en euros (230 000 − 200 000), et que donne ce montant divisé par 200 000 ?",
        studentReply: "Ça fait 30 000 € d'augmentation, et 30 000 divisé par 200 000 fait 0,15 soit 15 %.",
        tutorStep2: "Exactement, **+15 %** !\n💡 **Pour avoir tous les points sur ta copie en Bac Techno :** écris toujours le calcul suivi d'une phrase d'interprétation contextualisée : « Taux d'évolution = (230 000 − 200 000) ÷ 200 000 × 100 = **+15 %**. Le **chiffre d'affaires** de l'organisation a donc progressé de 15 % entre 2024 et 2025, ce qui traduit une dynamique commerciale favorable. »\n\nMaintenant, si les charges ont augmenté de 22 % sur la même période, quel diagnostic peux-tu poser sur la rentabilité ?"
      }
    }
  },
  lycee_pro: {
    badge: 'Lycée Pro',
    title: 'Personnalisation Lycée Professionnel',
    cognitiveBase: "CALIBRATION COGNITIVE LYCÉE PROFESSIONNEL (Bac Pro / CAP) : Ancre chaque explication dans une situation professionnelle concrète (atelier, chantier, laboratoire, entreprise, relation client ou terrain). Va droit à l'essentiel avec un vocabulaire clair et opérationnel. Valorise le savoir-faire pratique pour donner du sens immédiat aux matières générales et professionnelles.",
    subjectNameOverrides: {
      mathematiques: 'Mathématiques (Groupements A, B, C — Bac Pro & CAP)',
      physique_chimie: 'Physique-Chimie appliquée au domaine professionnel',
      francais_philo: 'Français — Compétences de lecture, d’analyse et d’écriture (Bac Pro / CAP)',
      histoire_geo: 'Histoire-Géographie & EMC (Voie Professionnelle)',
      ses: 'Économie-Gestion / Économie-Droit & Prévention Santé Environnement (PSE)',
      svt: 'Prévention Santé Environnement (PSE) & Biologie appliquée'
    },
    scaffoldingModes: [
      {
        id: 'pro_concret_metier',
        label: 'Ancrage Métier & Situation Professionnelle concrète',
        desc: 'Traduit chaque notion abstraite en cas pratique (devis, dosage, mesure sur plan, sécurité, client)',
        promptRule: "Relie systématiquement la notion du cours à une situation concrète de terrain ou d'entreprise (calcul de devis, dosage, lecture de plan, diagnostic technique, relation client) pour donner du sens immédiat."
      },
      {
        id: 'pro_ccf_pas_a_pas',
        label: 'Méthode pas-à-pas spéciale CCF & Épreuves ponctuelles',
        desc: 'Sécurise la résolution par étapes courtes (Données utiles ➔ Outil/Formule ➔ Résultat vérifié)',
        promptRule: "Découpe chaque problème en 3 étapes courtes et rassurantes : 1) Repérer les valeurs utiles dans l'énoncé professionnel, 2) Choisir la bonne formule ou règle, 3) Calculer et vérifier la cohérence du résultat."
      },
      {
        id: 'pro_chef_oeuvre',
        label: 'Accompagnement Chef-d’œuvre, Projet & Rapport de stage (PFMP)',
        desc: 'Aide à expliquer sa pratique professionnelle avec le vocabulaire technique attendu à l’oral et à l’écrit',
        promptRule: "Aide l'élève à transformer son expérience de terrain (stage PFMP, atelier, chef-d'œuvre) en explications claires, structurées et valorisantes avec le vocabulaire professionnel exact."
      }
    ],
    evalFocusOptions: [
      {
        id: 'pro_eval_ccf',
        label: 'Grille officielle CCF & Bac Pro (Choix de la méthode + Exécution + Cohérence métier)',
        useSubjectDefault: false,
        rule: "les critères d'évaluation en Contrôle en Cours de Formation (CCF) et à l'examen : 1) S'approprier la problématique professionnelle, 2) Choisir et appliquer la bonne relation ou démarche, et 3) Formuler une réponse cohérente avec l'unité et le contexte métier"
      },
      {
        id: 'pro_eval_pse_eco',
        label: 'Démarche d’analyse de situation (Problème ➔ Causes/Risques ➔ Mesures/Solutions)',
        useSubjectDefault: false,
        rule: "la structure attendue en PSE, Économie-Gestion et matières professionnelles : identifier clairement le problème ou le risque dans la situation, en lister les causes ou facteurs, et proposer des mesures de prévention ou solutions adaptées"
      },
      {
        id: 'pro_eval_francais_hg',
        label: 'Réponse rédigée & Compétences d’écriture (Idée directe + Exemple précis du corpus)',
        useSubjectDefault: false,
        rule: "l'exigence des épreuves de Français et Histoire-Géo en Bac Pro : rédiger des phrases complètes et correctes, répondre directement à la question en citant un élément précis du document, et illustrer son propos par un exemple pertinent"
      }
    ],
    simulationsBySubject: {
      default: {
        studentQuestion: "Sur un devis client, j'ai un montant Hors Taxes (HT) de 450 € avec une TVA à 20 %. Comment je calcule le montant TTC sans me tromper ?",
        tutorStep1: "En situation professionnelle, tu peux le faire en 2 étapes ultra-simples :\n• **Étape 1 (Montant de la TVA)** : 20 % de 450 €, c'est `450 × 20 ÷ 100`.\n• **Étape 2 (Prix TTC)** : `Prix HT + Montant de la TVA`.\n\nCombien vaut la TVA (`450 × 20 ÷ 100`) ?",
        studentReply: "450 fois 20 divisé par 100, ça fait 90 €.",
        tutorStep2: "Bravo, **90 €** de TVA ! Il ne reste plus qu'à l'ajouter au HT : `450 + 90 = 540 € TTC`.\n💡 **Pour avoir tous les points en CCF et sur ta copie :** présente toujours le détail et la phrase de conclusion : « Montant TVA = 450 × 0,20 = 90 €. Montant TTC = 450 + 90 = **540,00 € TTC** (ou directement `450 × 1,20 = 540 €`). Le montant total à facturer au client est de 540 € TTC. »\n\nÀ toi : si tu accordes une remise commerciale de 10 % sur un matériel à 300 € HT, quel est le montant de la remise ?"
      }
    }
  }
};

const STUDENT_PROFILES = [
  {
    id: 'standard',
    label: 'Élève bloqué / En perte de confiance',
    desc: 'Peur de se tromper, découragé par les cours trop abstraits',
    directive: "Rassure l'élève par la simplicité immédiate. Dédramatise chaque erreur en montrant exactement où le raisonnement a bifurqué sans jamais le juger."
  },
  {
    id: 'dys_tdah',
    label: 'Besoin de concision extrême (Attention fragile / DYS)',
    desc: 'Surcharge rapide face aux longs paragraphes',
    directive: "Fais des phrases ultra-courtes (une seule idée par ligne, listes à puces aérées, mots-clés en gras). Ne dépasse jamais 4 lignes avant de poser ta question."
  },
  {
    id: 'perfectionnement',
    label: 'Élève visant l’excellence (Manque de rigueur écrite)',
    desc: 'Comprend vite mais perd des points sur la rédaction des copies',
    directive: "Sois exigeant sur la précision du vocabulaire et la rigueur de la justification écrite dès que le mécanisme de base est validé."
  }
];

const NEURO_BEHAVIOR_OPTIONS = [
  {
    id: 'aucun',
    label: 'Aucun trouble spécifique signalé (Standard)',
    shortDesc: '',
    promptRule: ''
  },
  {
    id: 'tsa',
    label: 'Trouble du Spectre de l’Autisme (TSA / Asperger) — Besoin de littéralité & prévisibilité',
    shortDesc: 'Langage 100 % explicite, zéro second degré ni métaphore floue, structure invariable et prévisible.',
    promptRule: "ADAPTATION TSA (TROUBLE DU SPECTRE DE L'AUTISME) : Utilise un langage 100 % explicite et littéral. Bannis totalement le second degré, l'ironie, les métaphores abstraites et les sous-entendus. Garde une structure de réponse strictement identique et prévisible à chaque échange, et formule des consignes fermées sans aucune ambiguïté."
  },
  {
    id: 'tdah',
    label: 'TDAH & Impulsivité cognitive (Déficit d’attention / Hyperactivité)',
    shortDesc: 'Micro-étapes immédiates, mise en gras de l’indice unique et frein à l’impulsivité avant de répondre.',
    promptRule: "ADAPTATION TDAH & IMPULSIVITÉ : Découpe chaque raisonnement en micro-étapes immédiates d'une seule action. Surligne en gras le seul mot-clé ou chiffre à observer. Avant que l'élève ne réponde trop vite, invite-le en 1 ligne à vérifier un indice précis de l'énoncé (frein à l'impulsivité) et valorise immédiatement chaque micro-étape réussie."
  },
  {
    id: 'top',
    label: 'Trouble Oppositionnel (TOP) / Refus de l’autorité et contrariété face à l’erreur',
    shortDesc: 'Posture horizontale sans impératif (« On regarde ensemble »), choix entre 2 pistes et valorisation de l’essai.',
    promptRule: "ADAPTATION TROUBLE OPPOSITIONNEL (TOP) & REJET DE L'AUTORITÉ : Adopte une posture de partenaire (« On regarde ensemble ») et jamais de donneur d'ordres. N'utilise jamais d'impératif sec ni de formules directives (« Il faut », « Tu dois »). Propose systématiquement un choix entre 2 pistes ou 2 approches pour laisser à l'élève le contrôle de son apprentissage. Ne dis jamais brutalement « C'est faux », mais valorise la logique de son essai avant d'ajuster."
  },
  {
    id: 'anxiete',
    label: 'Anxiété de performance / Phobie scolaire / Blocage (« Page blanche »)',
    shortDesc: 'Sécurité psychologique absolue, questions présentées sans enjeu et amorce (« Coup de pouce ») fournie.',
    promptRule: "ADAPTATION ANXIÉTÉ SCOLAIRE & PEUR DE L'ÉCHEC : Supprime toute pression d'évaluation. Présente chaque question comme un simple essai sans enjeu où l'erreur est normale et utile. Fournis systématiquement le début du raisonnement ou un indice rassurant (« Coup de pouce ») pour éviter la sidération devant la page blanche."
  },
  {
    id: 'dys',
    label: 'Troubles DYS & Surcharge de la mémoire de travail (Dyslexie, Dyspraxie, Dyscalculie)',
    shortDesc: 'Rappel permanent des formules/règles sous les yeux (zéro double tâche) et étapes visuellement isolées.',
    promptRule: "ADAPTATION TROUBLES DYS & MÉMOIRE DE TRAVAIL : Soulage au maximum la mémoire de travail et la lecture. Rappelle toujours la formule ou la règle sous les yeux de l'élève au moment où il en a besoin (zéro effort de mémorisation parasite). Espace visuellement chaque ligne et isole clairement chaque opération."
  },
  {
    id: 'hpi',
    label: 'Haut Potentiel (HPI) avec intolérance à la répétition / Ennui rapide',
    shortDesc: 'Zéro rabâchage, validation immédiate de l’intuition, explication du « pourquoi » profond et défi d’efficacité.',
    promptRule: "ADAPTATION PROFIL HPI (INTOLÉRANCE À LA RÉPÉTITION) : Évite tout rabâchage infantile qui génère de l'ennui ou de l'irritation. Valide immédiatement son intuition rapide, explique le « pourquoi » logique profond de la règle, et transforme la rédaction des étapes en un défi de précision rapide pour sécuriser tous les points."
  }
];

export default function App() {
  const [selectedSubjectId, setSelectedSubjectId] = useState('mathematiques');
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [selectedCursus, setSelectedCursus] = useState('cycle_4');
  const [selectedNiveau, setSelectedNiveau] = useState('Troisième (3e — Fin de Cycle 4 / Objectif Brevet DNB)');
  const [selectedProfile, setSelectedProfile] = useState('standard');
  const [selectedCycleScaffold, setSelectedCycleScaffold] = useState('c4_demonstration');
  const [selectedCycleEval, setSelectedCycleEval] = useState('c4_eval_dnb');
  const [selectedNeuroBehavior, setSelectedNeuroBehavior] = useState('aucun');
  const [tutoiement, setTutoiement] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('prompt'); // 'prompt' | 'simulation' | 'guide'
  const [manualOverride, setManualOverride] = useState(null);

  // Changement de cursus -> mise à jour automatique du niveau et des options de cycle
  const handleCursusChange = (newCursusId) => {
    setSelectedCursus(newCursusId);
    const defaultLevels = NIVEAUX_BY_CURSUS[newCursusId];
    if (defaultLevels && defaultLevels.length > 0) {
      setSelectedNiveau(defaultLevels[defaultLevels.length - 1]);
    }
    const cycleCfg = CYCLE_SPECIFIC_CONFIG[newCursusId];
    if (cycleCfg) {
      setSelectedCycleScaffold(cycleCfg.scaffoldingModes[0].id);
      setSelectedCycleEval(cycleCfg.evalFocusOptions[0].id);
    }
    setManualOverride(null);
  };

  const currentSubject = SUBJECTS_CONFIG[selectedSubjectId];
  const CurrentSubjectIcon = currentSubject.icon;
  const currentCursusObj = CURSUS_OPTIONS.find((c) => c.id === selectedCursus) || CURSUS_OPTIONS[0];
  const currentProfileObj = STUDENT_PROFILES.find((p) => p.id === selectedProfile) || STUDENT_PROFILES[0];
  const currentNeuroBehaviorObj =
    NEURO_BEHAVIOR_OPTIONS.find((n) => n.id === selectedNeuroBehavior) || NEURO_BEHAVIOR_OPTIONS[0];
  const currentCycleConfig = CYCLE_SPECIFIC_CONFIG[selectedCursus] || null;

  // Adaptation automatique de l'intitulé de matière pour les Cycles 2, 3 et 4
  const defaultAdaptedSubjectName =
    currentCycleConfig && currentCycleConfig.subjectNameOverrides[selectedSubjectId]
      ? currentCycleConfig.subjectNameOverrides[selectedSubjectId]
      : currentSubject.name;

  const effectiveSubjectName =
    customSubjectName.trim() !== '' ? customSubjectName.trim() : defaultAdaptedSubjectName;

  // Sélection des règles spécifiques au Cycle 2, 3 ou 4 si actif
  const activeScaffoldObj = currentCycleConfig
    ? currentCycleConfig.scaffoldingModes.find((s) => s.id === selectedCycleScaffold) ||
      currentCycleConfig.scaffoldingModes[0]
    : null;

  const activeCycleEvalObj = currentCycleConfig
    ? currentCycleConfig.evalFocusOptions.find((e) => e.id === selectedCycleEval) ||
      currentCycleConfig.evalFocusOptions[0]
    : null;

  // Génération dynamique et chirurgicale du prompt système "Zéro Friction"
  const generatedPrompt = useMemo(() => {
    const pronounRule = tutoiement
      ? "Adresse-toi à l'élève en le tutoyant avec un ton encourageant, direct et chaleureux."
      : "Adresse-toi à l'élève en le vouvoyant avec un ton bienveillant, valorisant et accessible.";

    const sourceRule =
      "Appuie-toi strictement sur le périmètre et les attendus de fin de cycle du programme officiel présent dans les sources du carnet pour ne jamais introduire de notion hors-programme, tout en utilisant librement tes capacités pédagogiques pour créer des exemples chiffrés ou concrets progressifs.";

    const cycleCognitiveBlock = currentCycleConfig
      ? `\n${currentCycleConfig.cognitiveBase}\nÉTAYAGE PRIORITAIRE : ${activeScaffoldObj ? activeScaffoldObj.promptRule : ''}`
      : '';

    const neuroBehaviorClause =
      currentNeuroBehaviorObj && currentNeuroBehaviorObj.promptRule
        ? `\n${currentNeuroBehaviorObj.promptRule}`
        : '';

    const copyLabel =
      selectedCursus === 'cycle_2'
        ? '💡 Pour avoir tous les points sur ton cahier :'
        : '💡 Pour avoir tous les points sur ta copie :';

    const effectiveEvalRule =
      currentCycleConfig && activeCycleEvalObj && !activeCycleEvalObj.useSubjectDefault
        ? `${activeCycleEvalObj.rule} (adapté aux exigences de ${effectiveSubjectName} en ${selectedNiveau})`
        : currentSubject.frenchEvalRule;

    const maxLinesRule =
      selectedCursus === 'cycle_2'
        ? '2 ou 3 lignes très courtes maximum'
        : '3 ou 4 lignes maximum';

    return `Tu es un professeur particulier de ${effectiveSubjectName} bienveillant, direct et très clair pour un élève de ${selectedNiveau} (${currentCursusObj.label}) en France. Ton unique objectif est de faire comprendre le cours rapidement et de faire réussir l'élève lors ${currentCursusObj.examName}.

${pronounRule}
${sourceRule}
${currentProfileObj.directive}${neuroBehaviorClause}${cycleCognitiveBlock}

RÈGLES DE DIALOGUE (CENTRÉES À 100 % SUR L'ÉLÈVE) :
1. Zéro commentaire sur ta façon d'enseigner : N'affiche jamais de titres d'étapes, de noms de méthodes pédagogiques ou de catégories d'exercices (n'écris jamais de termes techniques d'enseignement, de numéros de phases ou d'étiquettes méthodologiques). Parle directement à l'élève de ${effectiveSubjectName}, sans préambule.
2. Explication courte et visuelle : Quand l'élève bloque sur une notion du programme, explique-la en ${maxLinesRule} ${currentSubject.explanationStyle}.
3. Une seule question à la fois : Ne donne jamais une liste d'exercices ou de questions d'un coup. Pose ${currentSubject.microChallengeStyle} à la toute fin de ton message pour vérifier qu'il a compris le mécanisme de base, et attends sa réponse.
4. Progression naturelle pas à pas : Dès que l'élève trouve la bonne réponse, valide-la brièvement et propose-lui ${currentSubject.progressionStyle}, en augmentant doucement la difficulté jusqu'aux attendus de ${selectedNiveau}.
5. Le conseil pour les points : À chaque fois que tu valides la réponse de l'élève, ajoute une seule phrase introduite par "${copyLabel}" qui lui donne ${effectiveEvalRule}.

AFFICHAGE PROPRE ET LISIBLE :
- N'utilise jamais de code LaTeX ni de balises informatiques brutes (aucun ${currentSubject.forbiddenLatex}).
- Écris toutes les formules, opérations ou schémas avec du texte en gras et des caractères standards directement lisibles par l'élève : ${currentSubject.unicodeSymbols}.`;
  }, [
    effectiveSubjectName,
    selectedNiveau,
    selectedCursus,
    currentCursusObj,
    currentProfileObj,
    currentNeuroBehaviorObj,
    currentCycleConfig,
    activeScaffoldObj,
    activeCycleEvalObj,
    currentSubject,
    tutoiement
  ]);

  // Simulation dynamique adaptée au Cycle (Cycle 2, Cycle 3, Cycle 4 ou Lycée)
  const activeSimulation = useMemo(() => {
    if (currentCycleConfig && currentCycleConfig.simulationsBySubject) {
      return (
        currentCycleConfig.simulationsBySubject[selectedSubjectId] ||
        currentCycleConfig.simulationsBySubject.default
      );
    }
    return currentSubject.sampleSimulation;
  }, [currentCycleConfig, selectedSubjectId, currentSubject]);

  const displayedPrompt = manualOverride !== null ? manualOverride : generatedPrompt;
  const charCount = displayedPrompt.length;

  // Fonction de copie compatible iFrame
  const handleCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = displayedPrompt;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Erreur lors de la copie', err);
    }
    document.body.removeChild(textArea);
  };

  // Presets rapides incluant désormais Cycle 2, Cycle 3, Cycle 4 et Lycée
  const applyPreset = (preset) => {
    setManualOverride(null);
    setCustomSubjectName('');
    setSelectedNeuroBehavior('aucun');
    if (preset === 'cycle2_ce1') {
      setSelectedSubjectId('mathematiques');
      setSelectedCursus('cycle_2');
      setSelectedNiveau('CE1 (Cours Élémentaire 1re année — 7/8 ans)');
      setSelectedCycleScaffold('c2_manip');
      setSelectedCycleEval('c2_eval_cahier');
      setSelectedProfile('standard');
    } else if (preset === 'cycle3_cm2_6e') {
      setSelectedSubjectId('mathematiques');
      setSelectedCursus('cycle_3');
      setSelectedNiveau('Sixième - 6e (Fin de Cycle 3 / Entrée au Collège — 11/12 ans)');
      setSelectedCycleScaffold('c3_barres');
      setSelectedCycleEval('c3_eval_6e');
      setSelectedProfile('standard');
    } else if (preset === 'cycle4_3e_brevet') {
      setSelectedSubjectId('mathematiques');
      setSelectedCursus('cycle_4');
      setSelectedNiveau('Troisième (3e — Fin de Cycle 4 / Objectif Brevet DNB)');
      setSelectedCycleScaffold('c4_demonstration');
      setSelectedCycleEval('c4_eval_dnb');
      setSelectedProfile('standard');
    } else if (preset === 'seconde_svt') {
      setSelectedSubjectId('svt');
      setSelectedCursus('lycee_general');
      setSelectedNiveau('Seconde Générale et Technologique');
      setSelectedCycleScaffold('lycee_auto_demo');
      setSelectedCycleEval('lycee_eval_matiere');
      setSelectedProfile('standard');
    } else if (preset === 'term_maths') {
      setSelectedSubjectId('mathematiques');
      setSelectedCursus('lycee_general');
      setSelectedNiveau('Terminale Générale (Spécialité / Tronc commun)');
      setSelectedCycleScaffold('lycee_auto_demo');
      setSelectedCycleEval('lycee_eval_matiere');
      setSelectedProfile('standard');
    }
  };

  return (
    <div className="min-h-screen text-[#0F172A] selection:bg-[#0F172A] selection:text-[#38BDF8] pb-20">
      {/* Liseré supérieur signature */}
      <div className="h-2 bg-[#4F46E5]" />

      {/* En-tête flottant néobrutaliste tout en rondeur */}
      <header className="sticky top-3 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] text-white border-[2.5px] border-[#0F172A] rounded-3xl shadow-[5px_5px_0px_0px_#0F172A] px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#059669] text-white border-2 border-white rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_#4F46E5] shrink-0">
              <GraduationCap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-code text-xl font-bold uppercase tracking-widest px-2.5 py-0.5 bg-[#059669] text-white rounded-full border border-white">
                  Cortex Studio
                </span>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Assistant pédagogique NotebookLM
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Carte d'introduction éditoriale arrondie */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <div className="bg-white border-[2.5px] border-[#0F172A] rounded-3xl shadow-[6px_6px_0px_0px_#0F172A] p-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="font-mono-code text-[11px] font-bold uppercase tracking-widest text-[#0F172A] bg-white border-2 border-[#0F172A] px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#0F172A]">
                ASSISTANT PÉDAGOGIQUE SUR-MESURE • DU CP À LA TERMINALE
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-[#0F172A]">
              Configurez votre tuteur IA{' '}
              <span className="bg-[#4F46E5] text-white px-3 py-1 rounded-2xl border-2 border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] inline-block transform -rotate-1">
                personnalisé
              </span>{' '}
            </h2>
          </div>
        </div>
      </div>

      {/* Contenu principal en 2 colonnes */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* COLONNE GAUCHE : Paramétrage (5 colonnes sur 12) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Bloc 1 : Cursus, Cycle & Niveau scolaire */}
            <section className="bg-white border-[2.5px] border-[#0F172A] rounded-3xl shadow-[6px_6px_0px_0px_#0F172A] p-6 space-y-5">
              <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                  <span className="bg-[#0F172A] text-[#38BDF8] font-mono-code text-xs px-2 py-0.5 rounded-lg">
                    01
                  </span>
                  Cycle & Niveau Scolaire
                </h2>
                {currentCycleConfig && (
                  <span className="px-3 py-0.5 text-[11px] font-bold bg-[#059669] text-white border-2 border-[#0F172A] rounded-full shadow-[2px_2px_0px_0px_#0F172A]">
                    {currentCycleConfig.badge}
                  </span>
                )}
              </div>

              {/* Sélection rapide des cycles et voies du lycée */}
              <div>
                <span className="block text-xs font-bold text-[#0F172A] mb-2">
                  Sélection rapide du cursus :
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'cycle_2', title: 'Cycle 2', sub: 'CP • CE1 • CE2' },
                    { id: 'cycle_3', title: 'Cycle 3', sub: 'CM1 • CM2 • 6e' },
                    { id: 'cycle_4', title: 'Cycle 4', sub: '5e • 4e • 3e' },
                    { id: 'lycee_general', title: 'Lycée Général', sub: '2de • 1re • Term' },
                    { id: 'lycee_techno', title: 'Lycée techno', sub: 'STI2D • STL • STMG • ST2S' },
                    { id: 'lycee_pro', title: 'Lycée professionnel', sub: 'Bac Pro • CAP' }
                  ].map((cBtn) => {
                    const isAct = selectedCursus === cBtn.id;
                    return (
                      <button
                        key={cBtn.id}
                        onClick={() => handleCursusChange(cBtn.id)}
                        className={`p-3 border-2 border-[#0F172A] rounded-2xl text-center transition-all ${
                          isAct
                            ? 'bg-[#0F172A] text-[#38BDF8] shadow-[3px_3px_0px_0px_#4F46E5] -translate-x-[1px] -translate-y-[1px]'
                            : 'bg-white text-[#0F172A] hover:bg-[#E0E7FF] shadow-[2px_2px_0px_0px_#0F172A]'
                        }`}
                      >
                        <div className="text-xs font-bold">{cBtn.title}</div>
                        <div
                          className={`text-[10px] mt-0.5 font-mono-code ${
                            isAct ? 'text-white' : 'text-slate-600'
                          }`}
                        >
                          {cBtn.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-2">
                  Classe exacte de l'apprenant :
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(NIVEAUX_BY_CURSUS[selectedCursus] || []).map((niv) => {
                    const active = selectedNiveau === niv;
                    return (
                      <button
                        key={niv}
                        onClick={() => {
                          setSelectedNiveau(niv);
                          setManualOverride(null);
                        }}
                        className={`px-4 py-2.5 text-xs font-bold border-2 border-[#0F172A] rounded-2xl text-left flex items-center justify-between transition-all ${
                          active
                            ? 'bg-[#10B981] text-white shadow-[3px_3px_0px_0px_#0F172A] -translate-x-[1px] -translate-y-[1px]'
                            : 'bg-white text-[#0F172A] hover:bg-[#E0E7FF] shadow-[2px_2px_0px_0px_#0F172A]'
                        }`}
                      >
                        <span>{niv}</span>
                        {active && (
                          <span className="bg-[#0F172A] text-white p-1 rounded-lg">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Bloc 2 : Choix de la Matière */}
            <section className="bg-white border-[2.5px] border-[#0F172A] rounded-3xl shadow-[6px_6px_0px_0px_#0F172A] p-6">
              <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-3 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                  <span className="bg-[#0F172A] text-[#38BDF8] font-mono-code text-xs px-2 py-0.5 rounded-lg">
                    02
                  </span>
                  Domaine / Matière
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(SUBJECTS_CONFIG).map((subj) => {
                  const isSelected = selectedSubjectId === subj.id;
                  const adaptedTitle =
                    currentCycleConfig && currentCycleConfig.subjectNameOverrides[subj.id]
                      ? currentCycleConfig.subjectNameOverrides[subj.id]
                      : subj.name;
                  const SubjectIcon = subj.icon;
                  return (
                    <button
                      key={subj.id}
                      onClick={() => {
                        setSelectedSubjectId(subj.id);
                        setManualOverride(null);
                      }}
                      className={`flex items-center gap-2.5 p-3 border-2 border-[#0F172A] rounded-2xl text-left transition-all ${
                        isSelected
                          ? 'bg-[#0F172A] text-white shadow-[4px_4px_0px_0px_#F2C230] -translate-x-[1px] -translate-y-[1px]'
                          : 'bg-white text-[#0F172A] hover:bg-[#E0E7FF] shadow-[2px_2px_0px_0px_#0F172A]'
                      }`}
                    >
                      <span className="text-xl shrink-0 bg-white border border-[#0F172A] w-10 h-10 rounded-xl flex items-center justify-center">
                        <SubjectIcon className="w-5 h-5 text-[#0F172A]" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate" title={adaptedTitle}>
                          {adaptedTitle}
                        </div>
                        <div
                          className={`text-[10px] truncate font-mono-code ${
                            isSelected ? 'text-[#38BDF8]' : 'text-neutral-500'
                          }`}
                        >
                          {subj.category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Intitulé personnalisé optionnel */}
              <div className="mt-4 pt-3 border-t-2 border-dashed border-[#0F172A]">
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                  Personnaliser l'intitulé exact de la matière ou du sous-domaine (optionnel) :
                </label>
                <input
                  type="text"
                  value={customSubjectName}
                  onChange={(e) => {
                    setCustomSubjectName(e.target.value);
                    setManualOverride(null);
                  }}
                  placeholder={`Par défaut : ${defaultAdaptedSubjectName}`}
                  className="w-full px-3.5 py-2 text-xs font-medium bg-white border-2 border-[#0F172A] rounded-xl shadow-[2px_2px_0px_0px_#0F172A] text-[#0F172A] placeholder-neutral-400 focus:outline-none focus:bg-[#E0E7FF]"
                />
              </div>
            </section>

            {/* Bloc 3 : Calibration cognitive de l'apprenant */}
            <section className="bg-white border-[2.5px] border-[#0F172A] rounded-3xl shadow-[6px_6px_0px_0px_#0F172A] p-6 space-y-5">
              <div className="border-b-2 border-[#0F172A] pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                  <span className="bg-[#0F172A] text-[#38BDF8] font-mono-code text-xs px-2 py-0.5 rounded-lg">
                    03
                  </span>
                  Profil de l'Enfant & Options
                </h2>
              </div>

              <div className="space-y-2.5">
                {STUDENT_PROFILES.map((prof) => {
                  const isSelected = selectedProfile === prof.id;
                  return (
                    <button
                      key={prof.id}
                      onClick={() => {
                        setSelectedProfile(prof.id);
                        setManualOverride(null);
                      }}
                      className={`w-full p-3.5 border-2 border-[#0F172A] rounded-2xl text-left transition-all ${
                        isSelected
                          ? 'bg-[#4F46E5] text-white shadow-[4px_4px_0px_0px_#0F172A] -translate-x-[1px] -translate-y-[1px]'
                          : 'bg-white text-[#0F172A] hover:bg-[#E0E7FF] shadow-[2px_2px_0px_0px_#0F172A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{prof.label}</span>
                        {isSelected && (
                          <span className="bg-[#0F172A] text-white px-2 py-0.5 rounded-full font-mono-code text-[10px] font-bold uppercase">
                            Actif
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] mt-1 font-medium ${
                          isSelected ? 'text-white' : 'text-slate-700'
                        }`}
                      >
                        {prof.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Menu déroulant des troubles neuro-développementaux ou du comportement */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                  Adaptation aux troubles autistiques, neuro-développementaux ou du comportement (optionnel) :
                </label>
                <select
                  value={selectedNeuroBehavior}
                  onChange={(e) => {
                    setSelectedNeuroBehavior(e.target.value);
                    setManualOverride(null);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-white border-2 border-[#0F172A] rounded-2xl shadow-[3px_3px_0px_0px_#0F172A] text-[#0F172A] focus:outline-none focus:bg-[#E0E7FF] cursor-pointer"
                >
                  {NEURO_BEHAVIOR_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {currentNeuroBehaviorObj && currentNeuroBehaviorObj.shortDesc && (
                  <div className="mt-2.5 p-3 bg-[#EEF2FF] border-2 border-[#0F172A] rounded-xl text-[11px] font-medium text-[#0F172A] flex items-start gap-2">
                    <span className="bg-[#4F46E5] text-white font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      ACTIF
                    </span>
                    <span>{currentNeuroBehaviorObj.shortDesc}</span>
                  </div>
                )}
              </div>

              {/* Interrupteurs de réglage */}
              <div className="pt-3 border-t-2 border-dashed border-[#0F172A]">
                <label className="flex items-center justify-between cursor-pointer p-2.5 bg-white border-2 border-[#0F172A] rounded-2xl">
                  <span className="text-xs font-bold text-[#0F172A]">
                    Tutoyer l'élève (recommandé pour la fluidité)
                  </span>
                  <input
                    type="checkbox"
                    checked={tutoiement}
                    onChange={(e) => {
                      setTutoiement(e.target.checked);
                      setManualOverride(null);
                    }}
                    className="accent-[#0F172A] h-4 w-4 border-2 border-[#0F172A] rounded"
                  />
                </label>
              </div>
            </section>
          </div>

          {/* COLONNE DROITE : Fenêtre Principale (7 colonnes sur 12) */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 self-start">
            
            {/* Navigation par onglets façon dossiers brutalistes arrondis */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setActiveTab('prompt')}
                className={`py-3 px-3 border-[2.5px] border-[#0F172A] rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'prompt'
                    ? 'bg-[#0F172A] text-[#38BDF8] shadow-[4px_4px_0px_0px_#059669] -translate-y-0.5'
                    : 'bg-white text-[#0F172A] hover:bg-[#E0E7FF] shadow-[4px_4px_0px_0px_#0F172A]'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="truncate">1. Prompt Système</span>
              </button>
              <button
                onClick={() => setActiveTab('simulation')}
                className={`py-3 px-3 border-[2.5px] border-[#0F172A] rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'simulation'
                    ? 'bg-[#0F172A] text-[#10B981] shadow-[4px_4px_0px_0px_#10B981] -translate-y-0.5'
                    : 'bg-white text-[#0F172A] hover:bg-[#E0E7FF] shadow-[4px_4px_0px_0px_#0F172A]'
                }`}
              >
                <Eye className="w-4 h-4 shrink-0" />
                <span className="truncate">2. Aperçu Dialogue</span>
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`py-3 px-3 border-[2.5px] border-[#0F172A] rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'guide'
                    ? 'bg-[#0F172A] text-white shadow-[4px_4px_0px_0px_#7C3AED] -translate-y-0.5'
                    : 'bg-white text-[#0F172A] hover:bg-[#E0E7FF] shadow-[4px_4px_0px_0px_#0F172A]'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span className="truncate">3. Mode d'Emploi</span>
              </button>
            </div>

            {/* ONGLET 1 : LE PROMPT SYSTÈME PRÊT À COPIER (Style fenêtre OS Brutaliste arrondie) */}
            {activeTab === 'prompt' && (
              <div className="bg-white border-[3px] border-[#0F172A] rounded-3xl shadow-[8px_8px_0px_0px_#0F172A] overflow-hidden">
                {/* Barre supérieure de fenêtre */}
                <div className="bg-[#0F172A] text-white px-5 py-3 border-b-[2.5px] border-[#0F172A] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-black inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-black inline-block" />
                    <span className="font-mono-code text-[11px] text-neutral-300 ml-2 truncate">
                      PROMPT_MAITRE_NOTEBOOKLM.TXT
                    </span>
                  </div>
                  <span className="bg-[#10B981] text-white font-mono-code text-[10px] font-bold uppercase px-2.5 py-0.5 border border-[#0F172A] rounded-full">
                    PRÊT À COPIER
                  </span>
                </div>

                {/* Bandeau d'identification et bouton d'action rouge corail */}
                <div className="px-6 py-5 bg-[#F8FAFC] border-b-[2.5px] border-[#0F172A] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl bg-white border-2 border-[#0F172A] w-10 h-10 rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_#0F172A]">
                        <CurrentSubjectIcon className="w-5 h-5 text-[#0F172A]" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                          {effectiveSubjectName}
                        </h3>
                        <p className="text-xs font-bold text-slate-700">{selectedNiveau}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono-code">
                      <span className="inline-flex items-center gap-1 bg-white border border-[#0F172A] px-2.5 py-0.5 rounded-full font-bold text-[#0F172A]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                        {currentCycleConfig ? currentCycleConfig.badge : 'Lycée / Sup'}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-[#0F172A] text-[#38BDF8] px-2.5 py-0.5 rounded-full font-bold">
                        {charCount} / 10 000 car. ({Math.round((charCount / 10000) * 100)} %)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {manualOverride !== null && (
                      <button
                        onClick={() => setManualOverride(null)}
                        title="Réinitialiser les modifications manuelles"
                        className="px-3.5 py-2.5 text-xs font-bold bg-white hover:bg-neutral-100 text-[#0F172A] border-2 border-[#0F172A] rounded-2xl shadow-[3px_3px_0px_0px_#0F172A] flex items-center gap-1.5 transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Réinitialiser
                      </button>
                    )}
                    <button
                      onClick={handleCopy}
                      className={`px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-[#0F172A] rounded-2xl flex items-center gap-2 transition-all ${
                        copied
                          ? 'bg-[#10B981] text-white shadow-[2px_2px_0px_0px_#0F172A] translate-x-[2px] translate-y-[2px]'
                          : 'bg-[#059669] hover:bg-[#047857] text-white shadow-[4px_4px_0px_0px_#0F172A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#0F172A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" /> Copié !
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 stroke-[2.5]" /> Copier le Prompt Système
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Zone de texte éditable du prompt */}
                <div className="p-6 bg-white">
                  <div className="relative">
                    <textarea
                      value={displayedPrompt}
                      onChange={(e) => setManualOverride(e.target.value)}
                      rows={19}
                      className="w-full p-4 bg-white border-[2.5px] border-[#0F172A] rounded-2xl shadow-[inset_3px_3px_0px_0px_rgba(0,0,0,0.06)] text-[#0F172A] font-mono-code text-xs sm:text-[13px] leading-relaxed focus:outline-none focus:bg-[#F8FAFC] resize-y"
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#0F172A] px-2.5 py-0.5 rounded-full">
                        <Edit3 className="w-3 h-3" /> Texte 100 % modifiable avant copie
                      </span>
                      <span className="font-mono-code uppercase bg-[#0F172A] text-white px-2.5 py-0.5 rounded-full">
                        Compatible NotebookLM & Gemini
                      </span>
                    </div>
                  </div>

                  {/* Résumé des 3 garanties pédagogiques injectées (Style cartes brutalistes arrondies) */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5 border-t-[2.5px] border-[#0F172A]">
                    <div className="p-4 bg-white border-2 border-[#0F172A] rounded-2xl shadow-[3px_3px_0px_0px_#0F172A]">
                      <span className="inline-block font-mono-code text-[10px] font-bold uppercase bg-[#059669] text-white border border-[#0F172A] px-2 py-0.5 rounded-full mb-2">
                        MÉTHODE CPA
                      </span>
                      <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 mb-1">
                        <Zap className="w-3.5 h-3.5 fill-[#0F172A]" /> Étayage adapté à l'âge
                      </div>
                      <p className="text-[11px] text-slate-700 leading-normal font-medium">
                        {currentCycleConfig
                          ? activeScaffoldObj?.label
                          : '1 seule question progressive à la fois sans jamais noyer l’élève.'}
                      </p>
                    </div>

                    <div className="p-4 bg-white border-2 border-[#0F172A] rounded-2xl shadow-[3px_3px_0px_0px_#0F172A]">
                      <span className="inline-block font-mono-code text-[10px] font-bold uppercase bg-[#10B981] text-white border border-[#0F172A] px-2 py-0.5 rounded-full mb-2">
                        BARÈME OFFICIEL
                      </span>
                      <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 mb-1">
                        <Award className="w-3.5 h-3.5" /> Norme Éducation Nationale
                      </div>
                      <p className="text-[11px] text-slate-700 leading-normal font-medium">
                        {currentCycleConfig
                          ? activeCycleEvalObj?.label
                          : `Formulation exacte exigée aux épreuves (${effectiveSubjectName}).`}
                      </p>
                    </div>

                    <div className="p-4 bg-white border-2 border-[#0F172A] rounded-2xl shadow-[3px_3px_0px_0px_#0F172A]">
                      <span className="inline-block font-mono-code text-[10px] font-bold uppercase bg-[#4F46E5] text-white border border-[#0F172A] px-2 py-0.5 rounded-full mb-2">
                        UNICODE PUR
                      </span>
                      <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 mb-1">
                        <FileText className="w-3.5 h-3.5" /> Zéro LaTeX brut
                      </div>
                      <p className="text-[11px] text-slate-700 leading-normal font-medium">
                        Caractères lisibles ({currentSubject.unicodeSymbols.split(',').slice(0, 4).join(', ')}...) sans balises cassées.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ONGLET 2 : SIMULATEUR D'APERÇU ÉLÈVE */}
            {activeTab === 'simulation' && (
              <div className="bg-white border-[3px] border-[#0F172A] rounded-3xl shadow-[8px_8px_0px_0px_#0F172A] overflow-hidden">
                {/* Barre supérieure de fenêtre */}
                <div className="bg-[#0F172A] text-white px-5 py-3 border-b-[2.5px] border-[#0F172A] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-black inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-black inline-block" />
                    <span className="font-mono-code text-[11px] text-neutral-300 ml-2">
                      SIMULATION_DIALOGUE_ELEVE.APP
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 font-mono-code text-[10px] font-bold uppercase bg-[#059669] text-white border border-[#0F172A] rounded-full">
                    {currentCycleConfig ? currentCycleConfig.badge : 'Expérience Apprenant'}
                  </span>
                </div>

                <div className="p-6 sm:p-7 space-y-5">
                  <div className="border-b-2 border-[#0F172A] pb-4">
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 stroke-[2.5]" />
                      Simulation de ce que vivra l'élève ({selectedNiveau})
                    </h3>
                    <p className="text-xs font-medium text-slate-700 mt-1">
                      Aperçu du dialogue pas-à-pas calibré pour {currentCursusObj.label} :
                    </p>
                  </div>

                  {/* Fil de discussion simulé */}
                  <div className="space-y-4">
                    {/* Message 1 : Élève */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-[#0F172A] text-white px-4 py-3 border-2 border-[#0F172A] rounded-2xl rounded-tr-sm shadow-[4px_4px_0px_0px_#F2C230] text-xs sm:text-sm">
                        <div className="font-mono-code text-[10px] uppercase tracking-wider text-[#38BDF8] font-bold mb-1">
                          👦 Élève ({selectedNiveau})
                        </div>
                        {activeSimulation.studentQuestion}
                      </div>
                    </div>

                    {/* Message 2 : Réponse du Notebook (Explication courte + 1 seule question) */}
                    <div className="flex justify-start">
                      <div className="max-w-[92%] bg-white border-2 border-[#0F172A] rounded-2xl rounded-tl-sm shadow-[4px_4px_0px_0px_#0F172A] text-[#0F172A] px-4 py-3.5 text-xs sm:text-sm space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono-code text-[10px] uppercase tracking-wider border-b border-[#0F172A] pb-1.5">
                          <span className="font-bold bg-[#F2C230] px-2 py-0.5 border border-[#0F172A] rounded-full">
                            🎓 Tuteur NotebookLM ({effectiveSubjectName})
                          </span>
                          <span className="font-bold text-slate-600">
                            Étayage visuel + 1 seule question
                          </span>
                        </div>
                        <div className="whitespace-pre-line leading-relaxed font-medium">
                          {activeSimulation.tutorStep1}
                        </div>
                      </div>
                    </div>

                    {/* Message 3 : Réponse rapide de l'élève */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-[#0F172A] text-white px-4 py-3 border-2 border-[#0F172A] rounded-2xl rounded-tr-sm shadow-[4px_4px_0px_0px_#F2C230] text-xs sm:text-sm">
                        <div className="font-mono-code text-[10px] uppercase tracking-wider text-[#38BDF8] font-bold mb-1">
                          👦 Élève
                        </div>
                        {activeSimulation.studentReply}
                      </div>
                    </div>

                    {/* Message 4 : Validation + Point Copie + Question niveau 2 */}
                    <div className="flex justify-start">
                      <div className="max-w-[92%] bg-[#E6F9F1] border-2 border-[#0F172A] rounded-2xl rounded-tl-sm shadow-[5px_5px_0px_0px_#0F172A] text-[#0F172A] px-4 py-3.5 text-xs sm:text-sm space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono-code text-[10px] uppercase tracking-wider border-b border-[#0F172A] pb-1.5">
                          <span className="font-bold bg-[#10B981] text-white px-2 py-0.5 border border-[#0F172A] rounded-full">
                            ✓ Validation + Barème Examen
                          </span>
                          <span className="font-bold text-slate-700">
                            Trace écrite + Question étape 2
                          </span>
                        </div>
                        <div className="whitespace-pre-line leading-relaxed font-medium">
                          {activeSimulation.tutorStep2}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FFE4E6] border-2 border-[#0F172A] rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] flex items-start gap-3 text-xs text-[#0F172A]">
                    <Info className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5 stroke-[2.5]" />
                    <div className="leading-relaxed font-medium">
                      <strong>Continuité Cycle 2 ➔ Cycle 3 ➔ Cycle 4 :</strong> En Cycle 2, l'IA privilégie les objets manipulables et la phrase-réponse simple. En Cycle 3, elle introduit le schéma en barres (Singapour) et les justifications grammaticales. En Cycle 4, elle installe la démonstration complète (« On sait que / Or / Donc ») exigée au Brevet.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ONGLET 3 : GUIDE D'INTÉGRATION EN 3 ÉTAPES DANS NOTEBOOKLM */}
            {activeTab === 'guide' && (
              <div className="bg-white border-[3px] border-[#0F172A] rounded-3xl shadow-[8px_8px_0px_0px_#0F172A] overflow-hidden">
                <div className="bg-[#0F172A] text-white px-5 py-3 border-b-[2.5px] border-[#0F172A] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-black inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-black inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-black inline-block" />
                    <span className="font-mono-code text-[11px] text-neutral-300 ml-2">
                      PROTOCOLE_INSTALLATION_3_ETAPES.MD
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-5">
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2 border-b-2 border-[#0F172A] pb-3">
                    <Layers className="w-5 h-5 stroke-[2.5]" />
                    Procédure de déploiement d'un Notebook Scolaire (Cycles 2, 3, 4 & Lycée)
                  </h3>

                  <div className="space-y-4">
                    <div className="p-5 bg-white border-2 border-[#0F172A] rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] flex gap-4">
                      <div className="w-10 h-10 bg-[#F2C230] border-2 border-[#0F172A] rounded-xl text-[#0F172A] font-mono-code font-bold text-base flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#0F172A]">
                        01
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          Importer le Bulletin Officiel (BO) du Cycle comme source de référence
                        </h4>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                          Télécharge le PDF du programme officiel de <strong>{currentCursusObj.label}</strong> (ou les attendus de fin d'année de <strong>{selectedNiveau}</strong> sur Éduscol) et glisse-le dans les sources du carnet. Le BO garantit que l'IA n'utilisera jamais une méthode hors-programme (par exemple : pas d'équation en CM2, mais une résolution par schéma en barres).
                        </p>
                      </div>
                    </div>

                    <div className="p-5 bg-white border-2 border-[#0F172A] rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] flex gap-4">
                      <div className="w-10 h-10 bg-[#FF66C4] border-2 border-[#0F172A] rounded-xl text-[#0F172A] font-mono-code font-bold text-base flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#0F172A]">
                        02
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          Coller le Prompt Système dans « Configurer le chat »
                        </h4>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                          En haut à droite de la fenêtre de discussion de NotebookLM, clique sur l'icône de réglages <strong>Configurer le notebook</strong>, choisis le style <strong>Personnalisé (Custom)</strong>, colle le prompt généré par cette application et clique sur <strong>Enregistrer</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 bg-white border-2 border-[#0F172A] rounded-2xl shadow-[4px_4px_0px_0px_#0F172A] flex gap-4">
                      <div className="w-10 h-10 bg-[#10B981] border-2 border-[#0F172A] rounded-xl text-[#0F172A] font-mono-code font-bold text-base flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#0F172A]">
                        03
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          Ajouter les leçons du cahier ou fiches d'exercices de l'enseignant (Optionnel)
                        </h4>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                          Tu peux photographier ou importer la leçon du cahier de l'enfant. Le Notebook utilisera exactement les mots de son enseignant tout en appliquant la progression pas-à-pas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
