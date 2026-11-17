/* LabVirtyèl Ayiti — catalogue des ressources et des parcours.
   Chaque texte visible existe en français (fr) et en kreyòl (ht).
   Pour ajouter une ressource : copiez un bloc, changez l'id, et ajoutez-la à un parcours si besoin. */

var LV_DATA = {
  domains: {
    physique:     { fr: 'Physique',     ht: 'Fizik',        color: 'var(--d-physique)' },
    chimie:       { fr: 'Chimie',       ht: 'Chimi',        color: 'var(--d-chimie)' },
    svt:          { fr: 'SVT',          ht: 'Syans lavi',   color: 'var(--d-svt)' },
    electronique: { fr: 'Électronique', ht: 'Elektwonik',   color: 'var(--d-electronique)' },
    informatique: { fr: 'Informatique', ht: 'Enfòmatik',    color: 'var(--d-informatique)' },
    sante:        { fr: 'Santé',        ht: 'Sante',        color: 'var(--d-sante)' }
  },
  types: {
    simulation: { fr: 'Simulation', ht: 'Simulasyon' },
    article:    { fr: 'Article',    ht: 'Atik' },
    quiz:       { fr: 'Quiz',       ht: 'Quiz' }
  },
  levels: {
    initiation:    { fr: 'Initiation',    ht: 'Inisyasyon' },
    intermediaire: { fr: 'Intermédiaire', ht: 'Mwayen' }
  },
  audiences: {
    universite: { fr: 'Université',                 ht: 'Inivèsite' },
    pro:        { fr: 'Formation professionnelle',  ht: 'Fòmasyon pwofesyonèl' },
    public:     { fr: 'Grand public',               ht: 'Tout moun' }
  },

  resources: [
    /* ---------------- PHYSIQUE ---------------- */
    { id: 'art-pendule', type: 'article', domain: 'physique', level: 'initiation', audiences: ['universite', 'public'], minutes: 5,
      title: { fr: 'Le pendule et la mesure du temps', ht: 'Pandil la ak fason pou mezire tan' },
      summary: { fr: 'Pourquoi un pendule bat-il toujours au même rythme ?', ht: 'Poukisa yon pandil toujou bat menm ritm ?' },
      body: {
        fr: '<p>Un pendule simple est une masse suspendue à un fil. Si on l\'écarte de sa position d\'équilibre puis qu\'on la lâche, elle oscille autour de la verticale.</p><p>La <b>période</b> T est la durée d\'un aller-retour complet. Pour de petits angles, elle ne dépend ni de la masse ni de l\'angle de départ. Elle dépend seulement de la longueur L du fil et de la gravité g :</p><p><span class="formula">T₀ = 2π √(L / g)</span></p><p>C\'est cette régularité qui a permis de construire les premières horloges précises. Sur la Lune, où g est six fois plus faible, le même pendule oscille environ 2,5 fois plus lentement.</p>',
        ht: '<p>Yon pandil senp se yon mas ki pandye nan yon fil. Lè ou deplase l epi ou lage l, li balanse de bò lòt bò vètikal la.</p><p><b>Peryòd</b> T a se tan yon ale-retou konplè pran. Pou ti ang, li pa depann ni de mas la ni de ang depa a. Li depann sèlman de longè fil la L ak gravite g :</p><p><span class="formula">T₀ = 2π √(L / g)</span></p><p>Se regilarite sa a ki te pèmèt yo fè premye revèy egzak yo. Sou Lalin, kote g sis fwa pi fèb, menm pandil la balanse anviwon 2,5 fwa pi dousman.</p>'
      },
      objectives: [{ fr: 'Définir la période d\'un pendule', ht: 'Defini peryòd yon pandil' }, { fr: 'Connaître la formule T₀ = 2π√(L/g)', ht: 'Konnen fòmil T₀ = 2π√(L/g)' }] },
    { id: 'sim-pendule', type: 'simulation', domain: 'physique', level: 'initiation', audiences: ['universite', 'public'], minutes: 15, src: 'sims/pendule.html',
      title: { fr: 'Pendule simple', ht: 'Pandil senp' },
      summary: { fr: 'Mesurez la période sur Terre, sur la Lune et sur Mars.', ht: 'Mezire peryòd la sou Latè, sou Lalin ak sou Mas.' },
      objectives: [{ fr: 'Mesurer une période', ht: 'Mezire yon peryòd' }, { fr: 'Comparer la mesure à la théorie', ht: 'Konpare mezi a ak teyori a' }, { fr: 'Étudier l\'effet de L et de g', ht: 'Etidye efè L ak g' }] },
    { id: 'quiz-pendule', type: 'quiz', domain: 'physique', level: 'initiation', audiences: ['universite', 'public'], minutes: 5,
      title: { fr: 'Quiz : le pendule', ht: 'Quiz : pandil la' },
      summary: { fr: '3 questions pour vérifier vos acquis.', ht: '3 kesyon pou verifye sa w aprann.' },
      questions: [
        { q: { fr: 'Si on multiplie la longueur du fil par 4, la période est :', ht: 'Si nou miltipliye longè fil la pa 4, peryòd la :' },
          options: [{ fr: 'multipliée par 2', ht: 'miltipliye pa 2' }, { fr: 'multipliée par 4', ht: 'miltipliye pa 4' }, { fr: 'divisée par 2', ht: 'divize pa 2' }, { fr: 'inchangée', ht: 'pa chanje' }],
          answer: 0, explain: { fr: 'T est proportionnelle à √L, et √4 = 2.', ht: 'T pwopòsyonèl ak √L, e √4 = 2.' } },
        { q: { fr: 'La période dépend-elle de la masse ?', ht: 'Èske peryòd la depann de mas la ?' },
          options: [{ fr: 'Oui : plus lourd, plus rapide', ht: 'Wi : pi lou, pi vit' }, { fr: 'Non', ht: 'Non' }, { fr: 'Oui : plus lourd, plus lent', ht: 'Wi : pi lou, pi dousman' }],
          answer: 1, explain: { fr: 'La masse n\'apparaît pas dans la formule.', ht: 'Mas la pa parèt nan fòmil la.' } },
        { q: { fr: 'Sur la Lune, le même pendule oscille :', ht: 'Sou Lalin, menm pandil la balanse :' },
          options: [{ fr: 'plus vite', ht: 'pi vit' }, { fr: 'plus lentement', ht: 'pi dousman' }, { fr: 'à la même vitesse', ht: 'menm vitès' }],
          answer: 1, explain: { fr: 'g est plus faible, donc T est plus grande.', ht: 'g pi fèb, kidonk T pi gran.' } }
      ] },

    /* ---------------- CHIMIE ---------------- */
    { id: 'art-titrage', type: 'article', domain: 'chimie', level: 'intermediaire', audiences: ['universite', 'pro'], minutes: 5,
      title: { fr: 'Doser un acide : le titrage', ht: 'Mezire yon asid : titraj' },
      summary: { fr: 'Comment trouver une concentration inconnue avec une burette.', ht: 'Kijan pou jwenn yon konsantrasyon ou pa konnen ak yon birèt.' },
      body: {
        fr: '<p>Un <b>titrage</b> permet de trouver la concentration inconnue d\'une solution. On lui ajoute petit à petit une solution de concentration connue, avec laquelle elle réagit.</p><p>Pour un acide fort comme HCl dosé par la soude NaOH, la réaction est H₃O⁺ + OH⁻ → 2 H₂O. À l\'<b>équivalence</b>, les quantités d\'acide et de base sont égales :</p><p><span class="formula">C<sub>a</sub> · V<sub>a</sub> = C<sub>b</sub> · V<sub>éq</sub></span></p><p>On repère l\'équivalence par le saut brutal du pH (pH = 7 pour un acide fort et une base forte) ou par le changement de couleur d\'un indicateur. Les laboratoires de contrôle de qualité utilisent cette technique pour l\'eau, les aliments et les médicaments.</p>',
        ht: '<p>Yon <b>titraj</b> pèmèt nou jwenn konsantrasyon yon solisyon nou pa konnen. Nou ajoute ladan l, ti kras pa ti kras, yon solisyon nou konnen konsantrasyon l, ki reyaji avè l.</p><p>Pou yon asid fò tankou HCl nou mezire ak soud NaOH, reyaksyon an se H₃O⁺ + OH⁻ → 2 H₂O. Nan <b>ekivalans</b>, kantite asid ak kantite baz egal :</p><p><span class="formula">C<sub>a</sub> · V<sub>a</sub> = C<sub>b</sub> · V<sub>éq</sub></span></p><p>Nou wè ekivalans lan lè pH a sote toudenkou (pH = 7 pou yon asid fò ak yon baz fò), oswa lè yon endikatè chanje koulè. Laboratwa kontwòl kalite sèvi ak teknik sa a pou dlo, manje ak medikaman.</p>'
      },
      objectives: [{ fr: 'Définir l\'équivalence', ht: 'Defini ekivalans' }, { fr: 'Écrire la relation Ca·Va = Cb·Véq', ht: 'Ekri relasyon Ca·Va = Cb·Véq' }] },
    { id: 'sim-titrage', type: 'simulation', domain: 'chimie', level: 'intermediaire', audiences: ['universite', 'pro'], minutes: 20, src: 'sims/titrage.html',
      title: { fr: 'Titrage acide-base', ht: 'Titraj asid-baz' },
      summary: { fr: 'Versez la soude, tracez la courbe de pH, trouvez l\'équivalence.', ht: 'Vide soud la, trase koub pH a, jwenn ekivalans lan.' },
      objectives: [{ fr: 'Tracer une courbe de titrage', ht: 'Trase yon koub titraj' }, { fr: 'Repérer l\'équivalence', ht: 'Jwenn ekivalans lan' }, { fr: 'Choisir un indicateur coloré', ht: 'Chwazi yon endikatè koulè' }] },
    { id: 'quiz-titrage', type: 'quiz', domain: 'chimie', level: 'intermediaire', audiences: ['universite', 'pro'], minutes: 5,
      title: { fr: 'Quiz : le titrage', ht: 'Quiz : titraj' },
      summary: { fr: '3 questions dont un calcul de concentration.', ht: '3 kesyon, ladan yo gen yon kalkil konsantrasyon.' },
      questions: [
        { q: { fr: 'Pour un acide fort titré par une base forte, le pH à l\'équivalence vaut :', ht: 'Pou yon asid fò ak yon baz fò, pH nan ekivalans lan se :' },
          options: [{ fr: '1', ht: '1' }, { fr: '7', ht: '7' }, { fr: '10', ht: '10' }, { fr: '14', ht: '14' }],
          answer: 1, explain: { fr: 'La solution ne contient plus que de l\'eau salée (NaCl), qui est neutre.', ht: 'Solisyon an gen sèlman dlo sale (NaCl) ladan l, ki net.' } },
        { q: { fr: 'Va = 20 mL de HCl, Cb = 0,10 mol/L, Véq = 15 mL. Que vaut Ca ?', ht: 'Va = 20 mL HCl, Cb = 0,10 mol/L, Véq = 15 mL. Konbyen Ca ye ?' },
          options: [{ fr: '0,075 mol/L', ht: '0,075 mol/L' }, { fr: '0,15 mol/L', ht: '0,15 mol/L' }, { fr: '0,10 mol/L', ht: '0,10 mol/L' }, { fr: '0,05 mol/L', ht: '0,05 mol/L' }],
          answer: 0, explain: { fr: 'Ca = Cb × Véq / Va = 0,10 × 15 / 20 = 0,075 mol/L.', ht: 'Ca = Cb × Véq / Va = 0,10 × 15 / 20 = 0,075 mol/L.' } },
        { q: { fr: 'Quel indicateur convient le mieux à ce titrage ?', ht: 'Ki endikatè ki pi bon pou titraj sa a ?' },
          options: [{ fr: 'Bleu de bromothymol (virage entre 6 et 7,6)', ht: 'Ble bwomotimòl (chanje ant 6 ak 7,6)' }, { fr: 'Phénolphtaléine (virage entre 8,2 et 10)', ht: 'Fenolftaleyin (chanje ant 8,2 ak 10)' }],
          answer: 0, explain: { fr: 'Sa zone de virage contient le pH d\'équivalence, 7.', ht: 'Zòn kote li chanje koulè a gen pH ekivalans lan, 7.' } }
      ] },

    /* ---------------- SVT ---------------- */
    { id: 'art-mendel', type: 'article', domain: 'svt', level: 'initiation', audiences: ['universite', 'public'], minutes: 5,
      title: { fr: 'Mendel et les lois de l\'hérédité', ht: 'Mendel ak lwa eredite yo' },
      summary: { fr: 'Comment les caractères passent des parents aux enfants.', ht: 'Kijan karaktè yo pase soti nan paran rive nan pitit.' },
      body: {
        fr: '<p>Au XIXᵉ siècle, Gregor Mendel a croisé des milliers de plants de pois. Il a montré que chaque caractère, comme la couleur des fleurs, est porté par un <b>gène</b> présent en deux exemplaires, appelés <b>allèles</b>.</p><p>Chaque parent transmet un seul de ses deux allèles, au hasard. Un allèle <b>dominant</b> (A) s\'exprime dès qu\'il est présent. Un allèle <b>récessif</b> (a) ne s\'exprime que s\'il est en double (aa).</p><p>En croisant deux parents Aa, on obtient en moyenne ¼ AA, ½ Aa et ¼ aa, soit 3 plantes violettes pour 1 blanche. L\'<b>échiquier de Punnett</b> permet de prévoir ces proportions. Les sélectionneurs de semences et les médecins généticiens s\'en servent encore aujourd\'hui.</p>',
        ht: '<p>Nan 19yèm syèk la, Gregor Mendel te kwaze plizyè milye plant pwa. Li te montre chak karaktè, tankou koulè flè yo, depann de yon <b>jèn</b> ki la an de egzanplè, yo rele yo <b>alèl</b>.</p><p>Chak paran bay yon sèl nan de alèl li yo, o aza. Yon alèl <b>dominan</b> (A) parèt depi li la. Yon alèl <b>resesif</b> (a) parèt sèlman si li an doub (aa).</p><p>Lè nou kwaze de paran Aa, an mwayèn nou jwenn ¼ AA, ½ Aa ak ¼ aa, sa vle di 3 plant vyolèt pou 1 blan. <b>Tablo Punnett</b> la pèmèt nou prevwa pwopòsyon sa yo. Moun k ap seleksyone semans ak doktè jenetik toujou sèvi avè l jodi a.</p>'
      },
      objectives: [{ fr: 'Distinguer gène et allèle', ht: 'Fè diferans ant jèn ak alèl' }, { fr: 'Comprendre dominance et récessivité', ht: 'Konprann dominan ak resesif' }] },
    { id: 'sim-mendel', type: 'simulation', domain: 'svt', level: 'initiation', audiences: ['universite', 'public'], minutes: 15, src: 'sims/mendel.html',
      title: { fr: 'Croisements de Mendel', ht: 'Kwazman Mendel' },
      summary: { fr: 'Remplissez l\'échiquier de Punnett et comparez théorie et descendance.', ht: 'Ranpli tablo Punnett la epi konpare teyori ak pitit yo.' },
      objectives: [{ fr: 'Construire un échiquier de Punnett', ht: 'Fè yon tablo Punnett' }, { fr: 'Comparer probabilité et observation', ht: 'Konpare pwobabilite ak obsèvasyon' }] },
    { id: 'quiz-mendel', type: 'quiz', domain: 'svt', level: 'initiation', audiences: ['universite', 'public'], minutes: 5,
      title: { fr: 'Quiz : hérédité', ht: 'Quiz : eredite' },
      summary: { fr: '3 questions sur les croisements.', ht: '3 kesyon sou kwazman.' },
      questions: [
        { q: { fr: 'Aa × Aa : quelle proportion de fleurs blanches (aa) ?', ht: 'Aa × Aa : ki pwopòsyon flè blan (aa) ?' },
          options: [{ fr: '0 %', ht: '0 %' }, { fr: '25 %', ht: '25 %' }, { fr: '50 %', ht: '50 %' }, { fr: '75 %', ht: '75 %' }],
          answer: 1, explain: { fr: 'Une case sur quatre de l\'échiquier est aa.', ht: 'Youn sou kat kaz nan tablo a se aa.' } },
        { q: { fr: 'AA × aa : les descendants sont :', ht: 'AA × aa : pitit yo :' },
          options: [{ fr: '100 % violets', ht: '100 % vyolèt' }, { fr: '50 % violets', ht: '50 % vyolèt' }, { fr: '100 % blancs', ht: '100 % blan' }],
          answer: 0, explain: { fr: 'Tous sont Aa, donc violets.', ht: 'Yo tout se Aa, kidonk vyolèt.' } },
        { q: { fr: 'Pour savoir si une plante violette est AA ou Aa, on la croise avec :', ht: 'Pou konnen si yon plant vyolèt se AA oswa Aa, nou kwaze l ak :' },
          options: [{ fr: 'une plante AA', ht: 'yon plant AA' }, { fr: 'une plante aa', ht: 'yon plant aa' }, { fr: 'une plante Aa', ht: 'yon plant Aa' }],
          answer: 1, explain: { fr: 'C\'est le croisement-test : s\'il apparaît des blancs, la plante était Aa.', ht: 'Se kwazman-tès la : si gen blan ki parèt, plant lan te Aa.' } }
      ] },

    /* ---------------- ÉLECTRONIQUE ---------------- */
    { id: 'art-ohm', type: 'article', domain: 'electronique', level: 'initiation', audiences: ['pro', 'public'], minutes: 5,
      title: { fr: 'Loi d\'Ohm et protection d\'une LED', ht: 'Lwa Ohm ak pwoteksyon yon LED' },
      summary: { fr: 'Pourquoi chaque LED a besoin de sa résistance.', ht: 'Poukisa chak LED bezwen rezistans pa l.' },
      body: {
        fr: '<p>La <b>loi d\'Ohm</b> relie la tension U (en volts), le courant I (en ampères) et la résistance R (en ohms) : <span class="formula">U = R · I</span></p><p>Une LED est différente d\'une résistance : elle garde à ses bornes une tension presque fixe, son <b>seuil</b> (environ 2 V pour une LED rouge, 3,2 V pour une bleue). Si on la branche directement sur une pile, le courant devient trop fort et elle grille.</p><p>On place donc une résistance en série, qui « absorbe » le reste de la tension : <span class="formula">R = (U − U<sub>LED</sub>) / I</span></p><p>C\'est le calcul de base de tout électricien qui installe un éclairage LED sur un panneau solaire ou une batterie de 12 V.</p>',
        ht: '<p><b>Lwa Ohm</b> mete ansanm vòltaj U (an vòlt), kouran I (an anpè) ak rezistans R (an òm) : <span class="formula">U = R · I</span></p><p>Yon LED pa tankou yon rezistans : li kenbe yon vòltaj prèske fiks, <b>papòt</b> li (anviwon 2 V pou yon LED wouj, 3,2 V pou yon LED ble). Si ou konekte l dirèkteman sou yon pil, kouran an vin twò fò epi li boule.</p><p>Se poutèt sa nou mete yon rezistans an seri, ki « pran » rès vòltaj la : <span class="formula">R = (U − U<sub>LED</sub>) / I</span></p><p>Se kalkil debaz tout elektrisyen k ap enstale limyè LED sou yon panno solè oswa yon batri 12 V.</p>'
      },
      objectives: [{ fr: 'Appliquer U = R·I', ht: 'Aplike U = R·I' }, { fr: 'Calculer une résistance de protection', ht: 'Kalkile yon rezistans pwoteksyon' }] },
    { id: 'sim-ohm', type: 'simulation', domain: 'electronique', level: 'initiation', audiences: ['pro', 'public'], minutes: 15, src: 'sims/ohm.html',
      title: { fr: 'Loi d\'Ohm et LED', ht: 'Lwa Ohm ak LED' },
      summary: { fr: 'Allumez une LED sans la griller.', ht: 'Limen yon LED san w pa boule l.' },
      objectives: [{ fr: 'Mesurer un courant', ht: 'Mezire yon kouran' }, { fr: 'Choisir une résistance adaptée', ht: 'Chwazi bon rezistans lan' }] },
    { id: 'quiz-ohm', type: 'quiz', domain: 'electronique', level: 'initiation', audiences: ['pro', 'public'], minutes: 5,
      title: { fr: 'Quiz : loi d\'Ohm', ht: 'Quiz : lwa Ohm' },
      summary: { fr: '3 questions de calcul.', ht: '3 kesyon kalkil.' },
      questions: [
        { q: { fr: 'Pile de 9 V, LED rouge (2 V), courant voulu 20 mA. Quelle résistance ?', ht: 'Pil 9 V, LED wouj (2 V), kouran nou vle 20 mA. Ki rezistans ?' },
          options: [{ fr: '350 Ω', ht: '350 Ω' }, { fr: '450 Ω', ht: '450 Ω' }, { fr: '100 Ω', ht: '100 Ω' }, { fr: '45 Ω', ht: '45 Ω' }],
          answer: 0, explain: { fr: 'R = (9 − 2) / 0,020 = 350 Ω.', ht: 'R = (9 − 2) / 0,020 = 350 Ω.' } },
        { q: { fr: 'Une LED bleue (seuil 3,2 V) branchée sur 3 V :', ht: 'Yon LED ble (papòt 3,2 V) konekte sou 3 V :' },
          options: [{ fr: 's\'allume fort', ht: 'limen fò' }, { fr: 'ne s\'allume pas', ht: 'pa limen' }, { fr: 'grille', ht: 'boule' }],
          answer: 1, explain: { fr: 'La tension est inférieure à son seuil.', ht: 'Vòltaj la pi piti pase papòt li.' } },
        { q: { fr: 'U = 10 V, R = 1 000 Ω. Que vaut I ?', ht: 'U = 10 V, R = 1 000 Ω. Konbyen I ye ?' },
          options: [{ fr: '1 mA', ht: '1 mA' }, { fr: '10 mA', ht: '10 mA' }, { fr: '100 mA', ht: '100 mA' }],
          answer: 1, explain: { fr: 'I = U / R = 10 / 1 000 = 0,010 A = 10 mA.', ht: 'I = U / R = 10 / 1 000 = 0,010 A = 10 mA.' } }
      ] },

    /* ---------------- INFORMATIQUE ---------------- */
    { id: 'art-logique', type: 'article', domain: 'informatique', level: 'initiation', audiences: ['universite', 'pro', 'public'], minutes: 5,
      title: { fr: 'Les 0 et les 1 : logique booléenne', ht: '0 ak 1 yo : lojik booleyen' },
      summary: { fr: 'Comment un ordinateur décide avec des portes logiques.', ht: 'Kijan yon òdinatè pran desizyon ak pòt lojik.' },
      body: {
        fr: '<p>Un ordinateur ne manipule que deux valeurs : <b>0</b> (pas de courant) et <b>1</b> (courant). Les <b>portes logiques</b> sont de petits circuits qui combinent ces valeurs.</p><ul><li><b>ET</b> : 1 seulement si toutes les entrées valent 1.</li><li><b>OU</b> : 1 si au moins une entrée vaut 1.</li><li><b>NON</b> : inverse l\'entrée.</li><li><b>OU exclusif</b> : 1 si les entrées sont différentes.</li></ul><p>En assemblant des millions de portes, on obtient un processeur capable d\'additionner, de comparer et de mémoriser. La porte NON-ET suffit à elle seule à fabriquer toutes les autres.</p>',
        ht: '<p>Yon òdinatè konnen sèlman de valè : <b>0</b> (pa gen kouran) ak <b>1</b> (gen kouran). <b>Pòt lojik</b> yo se ti sikui ki konbine valè sa yo.</p><ul><li><b>AK</b> : 1 sèlman si tout antre yo vo 1.</li><li><b>OUBYEN</b> : 1 si omwen yon antre vo 1.</li><li><b>NON</b> : bay kontrè antre a.</li><li><b>OUBYEN eksklizif</b> : 1 si antre yo diferan.</li></ul><p>Lè nou mete plizyè milyon pòt ansanm, nou jwenn yon pwosesè ki ka fè adisyon, konpare ak sere enfòmasyon. Pòt NON-AK la sifi pou kont li pou fè tout lòt pòt yo.</p>'
      },
      objectives: [{ fr: 'Connaître les portes de base', ht: 'Konnen pòt debaz yo' }, { fr: 'Lire une table de vérité', ht: 'Li yon tab verite' }] },
    { id: 'sim-logique', type: 'simulation', domain: 'informatique', level: 'initiation', audiences: ['universite', 'pro', 'public'], minutes: 10, src: 'sims/logique.html',
      title: { fr: 'Portes logiques', ht: 'Pòt lojik' },
      summary: { fr: 'Testez ET, OU, NON, NON-ET, NON-OU et OU exclusif.', ht: 'Teste AK, OUBYEN, NON, NON-AK, NON-OUBYEN ak OUBYEN eksklizif.' },
      objectives: [{ fr: 'Construire une table de vérité', ht: 'Fè yon tab verite' }] },
    { id: 'quiz-logique', type: 'quiz', domain: 'informatique', level: 'initiation', audiences: ['universite', 'pro', 'public'], minutes: 5,
      title: { fr: 'Quiz : portes logiques', ht: 'Quiz : pòt lojik' },
      summary: { fr: '3 questions rapides.', ht: '3 kesyon rapid.' },
      questions: [
        { q: { fr: 'ET avec A = 1 et B = 0 donne :', ht: 'AK ak A = 1 e B = 0 bay :' },
          options: [{ fr: '0', ht: '0' }, { fr: '1', ht: '1' }], answer: 0,
          explain: { fr: 'Il faut que les deux entrées valent 1.', ht: 'Fòk tou de antre yo vo 1.' } },
        { q: { fr: 'OU exclusif avec A = 1 et B = 1 donne :', ht: 'OUBYEN eksklizif ak A = 1 e B = 1 bay :' },
          options: [{ fr: '0', ht: '0' }, { fr: '1', ht: '1' }], answer: 0,
          explain: { fr: 'Les entrées sont identiques, donc 0.', ht: 'Antre yo menm, kidonk 0.' } },
        { q: { fr: 'Quelle porte allume une alarme seulement si la porte ET la fenêtre sont ouvertes ?', ht: 'Ki pòt ki limen yon alam sèlman si pòt la AK fenèt la louvri ?' },
          options: [{ fr: 'OU', ht: 'OUBYEN' }, { fr: 'ET', ht: 'AK' }, { fr: 'NON', ht: 'NON' }], answer: 1,
          explain: { fr: 'Les deux conditions doivent être vraies.', ht: 'Tou de kondisyon yo dwe vre.' } }
      ] },

    /* ---------------- SANTÉ ---------------- */
    { id: 'art-sir', type: 'article', domain: 'sante', level: 'intermediaire', audiences: ['universite', 'pro', 'public'], minutes: 6,
      title: { fr: 'Comprendre une épidémie : le modèle SIR', ht: 'Konprann yon epidemi : modèl SIR' },
      summary: { fr: 'R₀, pic épidémique et immunité collective.', ht: 'R₀, pi gwo pwen epidemi an ak iminite kolektif.' },
      body: {
        fr: '<p>Le modèle <b>SIR</b> divise la population en trois groupes : les <b>S</b>ains (qui peuvent tomber malades), les <b>I</b>nfectés et les <b>R</b>établis (guéris ou immunisés).</p><p>Le nombre clé est <b>R₀</b> : combien de personnes un malade contamine en moyenne dans une population sans défense. Si R₀ &gt; 1, l\'épidémie grandit. Si R₀ &lt; 1, elle s\'éteint.</p><p>La vaccination d\'une part v de la population fait baisser le R effectif : <span class="formula">R<sub>eff</sub> = R₀ × (1 − v)</span>. L\'épidémie s\'arrête quand v dépasse 1 − 1/R₀ : c\'est l\'<b>immunité collective</b>.</p><p>L\'eau potable, le lavage des mains et l\'isolement des malades font aussi baisser R₀. En Haïti, c\'est ce qui a permis de faire reculer le choléra.</p><p><i>Modèle simplifié à but pédagogique. Il ne remplace pas un avis médical.</i></p>',
        ht: '<p>Modèl <b>SIR</b> la separe popilasyon an an twa gwoup : moun ki an <b>S</b>ante (ki ka tonbe malad), moun ki <b>I</b>nfekte (enfekte) ak moun ki <b>R</b>etabli (geri oswa pwoteje).</p><p>Chif kle a se <b>R₀</b> : konbyen moun yon malad bay maladi a an mwayèn nan yon popilasyon ki pa pwoteje. Si R₀ &gt; 1, epidemi an grandi. Si R₀ &lt; 1, li mouri.</p><p>Lè yon pati v nan popilasyon an pran vaksen, R efektif la bese : <span class="formula">R<sub>eff</sub> = R₀ × (1 − v)</span>. Epidemi an kanpe lè v depase 1 − 1/R₀ : se <b>iminite kolektif</b>.</p><p>Dlo potab, lave men ak izole malad yo fè R₀ bese tou. Ann Ayiti, se sa ki te pèmèt kolera a rekile.</p><p><i>Modèl senplifye pou aprantisaj. Li pa ranplase konsèy doktè.</i></p>'
      },
      objectives: [{ fr: 'Définir R₀', ht: 'Defini R₀' }, { fr: 'Calculer le seuil d\'immunité collective', ht: 'Kalkile papòt iminite kolektif' }] },
    { id: 'sim-sir', type: 'simulation', domain: 'sante', level: 'intermediaire', audiences: ['universite', 'pro', 'public'], minutes: 15, src: 'sims/sir.html',
      title: { fr: 'Propagation d\'une épidémie', ht: 'Kijan yon epidemi gaye' },
      summary: { fr: 'Changez R₀ et la vaccination, observez le pic.', ht: 'Chanje R₀ ak vaksinasyon, gade pi gwo pwen an.' },
      objectives: [{ fr: 'Lire des courbes S, I, R', ht: 'Li koub S, I, R' }, { fr: 'Mesurer l\'effet de la vaccination', ht: 'Mezire efè vaksinasyon' }] },
    { id: 'quiz-sir', type: 'quiz', domain: 'sante', level: 'intermediaire', audiences: ['universite', 'pro', 'public'], minutes: 5,
      title: { fr: 'Quiz : épidémies', ht: 'Quiz : epidemi' },
      summary: { fr: '3 questions sur R₀ et la vaccination.', ht: '3 kesyon sou R₀ ak vaksinasyon.' },
      questions: [
        { q: { fr: 'Avec R₀ = 4, quel pourcentage de vaccination arrête l\'épidémie ?', ht: 'Avèk R₀ = 4, ki pousantaj vaksinasyon ki kanpe epidemi an ?' },
          options: [{ fr: '25 %', ht: '25 %' }, { fr: '50 %', ht: '50 %' }, { fr: '75 %', ht: '75 %' }, { fr: '100 %', ht: '100 %' }],
          answer: 2, explain: { fr: '1 − 1/4 = 0,75, soit 75 %.', ht: '1 − 1/4 = 0,75, sa vle di 75 %.' } },
        { q: { fr: 'Si le R effectif est inférieur à 1 :', ht: 'Si R efektif la pi piti pase 1 :' },
          options: [{ fr: 'l\'épidémie s\'éteint', ht: 'epidemi an mouri' }, { fr: 'l\'épidémie explose', ht: 'epidemi an eksploze' }, { fr: 'rien ne change', ht: 'anyen pa chanje' }],
          answer: 0, explain: { fr: 'Chaque malade contamine moins d\'une personne.', ht: 'Chak malad bay mwens pase yon moun maladi a.' } },
        { q: { fr: 'Le lavage des mains agit sur :', ht: 'Lave men aji sou :' },
          options: [{ fr: 'la durée de la maladie', ht: 'konbyen tan maladi a dire' }, { fr: 'R₀ (la transmission)', ht: 'R₀ (transmisyon an)' }, { fr: 'la taille de la population', ht: 'gwosè popilasyon an' }],
          answer: 1, explain: { fr: 'Il réduit les contaminations, donc R₀.', ht: 'Li diminye kontaminasyon, kidonk R₀.' } }
      ] }
  ],

  pathways: [
    { id: 'p-physique', domain: 'physique', level: 'initiation', audiences: ['universite', 'public'],
      title: { fr: 'Le temps et les oscillations', ht: 'Tan ak osilasyon' },
      summary: { fr: 'Du pendule à l\'horloge : comprendre et mesurer une période.', ht: 'Soti nan pandil rive nan revèy : konprann epi mezire yon peryòd.' },
      steps: ['art-pendule', 'sim-pendule', 'quiz-pendule'] },
    { id: 'p-chimie', domain: 'chimie', level: 'intermediaire', audiences: ['universite', 'pro'],
      title: { fr: 'Contrôle qualité : doser un acide', ht: 'Kontwòl kalite : mezire yon asid' },
      summary: { fr: 'La technique du titrage, de la théorie au calcul de concentration.', ht: 'Teknik titraj la, soti nan teyori rive nan kalkil konsantrasyon.' },
      steps: ['art-titrage', 'sim-titrage', 'quiz-titrage'] },
    { id: 'p-svt', domain: 'svt', level: 'initiation', audiences: ['universite', 'public'],
      title: { fr: 'Hérédité : sur les traces de Mendel', ht: 'Eredite : sou tras Mendel' },
      summary: { fr: 'Gènes, allèles et probabilités dans les croisements.', ht: 'Jèn, alèl ak pwobabilite nan kwazman.' },
      steps: ['art-mendel', 'sim-mendel', 'quiz-mendel'] },
    { id: 'p-electronique', domain: 'electronique', level: 'initiation', audiences: ['pro', 'public'],
      title: { fr: 'Électricité solaire : bien câbler une LED', ht: 'Elektrisite solè : byen konekte yon LED' },
      summary: { fr: 'La loi d\'Ohm appliquée à l\'éclairage solaire.', ht: 'Lwa Ohm aplike sou limyè solè.' },
      steps: ['art-ohm', 'sim-ohm', 'quiz-ohm'] },
    { id: 'p-informatique', domain: 'informatique', level: 'initiation', audiences: ['universite', 'pro', 'public'],
      title: { fr: 'Dans le cerveau d\'un ordinateur', ht: 'Anndan sèvo yon òdinatè' },
      summary: { fr: 'Les portes logiques, briques de base du numérique.', ht: 'Pòt lojik yo, brik debaz nimerik la.' },
      steps: ['art-logique', 'sim-logique', 'quiz-logique'] },
    { id: 'p-sante', domain: 'sante', level: 'intermediaire', audiences: ['universite', 'pro', 'public'],
      title: { fr: 'Santé publique : arrêter une épidémie', ht: 'Sante piblik : kanpe yon epidemi' },
      summary: { fr: 'R₀, vaccination et immunité collective avec le modèle SIR.', ht: 'R₀, vaksinasyon ak iminite kolektif ak modèl SIR.' },
      steps: ['art-sir', 'sim-sir', 'quiz-sir'] }
  ]
};
