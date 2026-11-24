import fs from 'node:fs';

const section = (label, title, paragraphs) => ({ label, title, paragraphs });
const item = (title, description) => ({ title, description });
const activity = (title, subtitle, description, details, points) => ({ title, subtitle, description, details, points });
const cta = (label, title, description, button) => ({ label, title, description, button });

const mg = {
  about: {
    label: "Momba anay",
    title: "Manohana ireo tena sahirana",
    presentation: section("", "", [
      "Ny asa ataon'ny Tsinjo Aina dia miompana voalohany indrindra amin'ireo olona marefo sy voahilikilika: ireo tsy manana tany sy fitaovam-pamokarana, ireo zokiolona ary ireo manana fahasembanana ara-batana na ara-tsaina. Ireo sokajin'olona ireo, izay matetika tsy tafiditra ao anatin'ny rafitra mahazatra amin'ny fampandrosoana, dia miatrika fahasahiranana lehibe amin'ny fahazoana ireo harena voajanahary tena ilaina amin'ny fivelomany.",
      "Mba hialana amin'izany fanilikilihana izany dia ampidirin'ny fikambanana ao anatin'ny Vondrona Fifanampiana (GS) izy ireo, izay mifototra amin'ny fitsipika hentitra momba ny fampandraisana anjara ny rehetra: « Manaraka ny marefo indrindra ». Amin'ny fampiharana izany, ny fandrosoana iombonana dia ampifanarahana amin'ny hafainganam-pandroson'ireo mpikambana marefo indrindra, mba hiantohana fa tsy misy olona avela ho tavela eny an-dalana.",
      "Amin'ny alalan'izany fomba fiasa izany, ny Tsinjo Aina dia manampy ireo mpisitraka ho tonga olom-pirenena mandray andraikitra, afaka mitantana ny ezaka ataony sy manorina ny fahaleovantenany. Mazava ny tanjona: miala amin'ny fihodinan'ny trosa amin'ireo mpampindram-bola mampihatra zanabola mihoa-pampana, mahazo fahaleovantena ara-tsakafo amin'ny alalan'ny fambolena ara-tontolo iainana ary mahazo fankatoavana feno amin'ny maha-olom-pirenena eo anivon'ireo rafitra mpanapa-kevitra eo an-toerana."
    ]),
    democracy: {
      ...section("Fomba fiasa", "Demokrasia Mivantana", [
        "Ao anatin'ny Vondrona Fifanampiana (GS), ny demokrasia mivantana dia miseho amin'ny alalan'ny fandaminana tsy misy ambaratongam-pahefana. Ny vondrona tsirairay dia lasa sehatra fianarana ny maha-olom-pirenena, izay ananan'ny mpikambana rehetra zo mitovy hiteny sy handray anjara amin'ny fanapahan-kevitra iombonana. Tsy tahaka ireo rafitra mahazatra mifototra amin'ny latsa-baton'ny maro an'isa, ny fanapahan-kevitra dia vokatry ny fifanakalozan-kevitra lalina sy hentitra, izay mikendry hatrany ny hahazoana marimaritra iraisana. Noho izany, ny fanapahan-kevitra tsirairay dia tohanan'ny mpandray anjara rehetra.",
        "Birao maharitra ahitana filoha, mpitam-bola ary mpitan-tsoratra, voafidy amin'ny fomba malalaka sy mangarahara, no mandrindra io rafitra io. Tsy manana fahefana ambony noho ny hafa ireo tompon'andraikitra ireo, fa ny fanompoana ho tombontsoan'ny vondrona ihany no andraikiny.",
        "Farany, mikendry ny fampandraisana anjara feno ny rehetra izany demokrasia izany amin'ny alalan'ny fitsipika hoe « Manaraka ny marefo indrindra ». Ny hafainganam-pandrosoana sy ny fitsipiky ny vondrona dia ampifanarahana amin'ny fahamatorany, mba hiarovana sy hampandraisana anjara feno ireo mpikambana tena sahirana na voahilikilika."
      ]),
      committee: item("Birao Maharitra", "Voafidy an-kalalahana: Filoha, Mpitam-bola, Mpitan-tsoratra."),
      inclusion: item("Fandraisan'ny Rehetra Anjara", "« Manaraka ny marefo indrindra »")
    },
    history: section("Dingana nodiavina", "Ny Tantaranay", [
      "Ny Projet Fianarantsoa dia nanomboka tamin'ny taona 1998, tany amin'ny faritra atsimo, tao Ambalavao, tamin'ny endrika hetsika nataon'olona iray. Vetivety dia niitatra nianavaratra izany tamin'ny taona 2001 ary avy eo tamin'ny taona 2003, ka nanomboka ny fivoarana mitohy. Tamin'ny taona 2009, mba hanohanana sy handaminana izany fomba fiasa izany, dia natsangana ny Association Tsinjo Aina Betsileo. Taona vitsivitsy tatỳ aoriana, tamin'ny volana desambra 2016, dia nivoatra ho ONG TSINJO AINA Fianarantsoa izany.",
      "Ankehitriny, ny fikambanana dia manohana mivantana mpisitraka manodidina ny 25 000, ka vehivavy ny 11 800 amin'ireo, ary mahatratra olona fanampiny mihoatra ny 58 400 ny fiantraikany ankolaka. Ny iraka tanterahiny dia ny fanatsarana ny fari-piainana sy ny fanamafisana ny fahaleovantenan'ny vondrom-piarahamonina eo an-toerana, indrindra ny vehivavy, amin'ny alalan'ny tetikasa ara-tsosialy, ara-toekarena ary ara-tontolo iainana.",
      "Ny fomba fiasa ampiharina dia mifototra amin'ny fanetsehana ny ezaka iombonan'ny fiarahamonina: famporisihana ireo vondrona hamolavola sy hitantana ny hetsika fampandrosoana maharitra ataony manokana. Miasa ihany koa ny ONG mba hamelomana indray ny firaisankina eo amin'ny fiarahamonina, izay soatoavina miorim-paka lalina ao amin'ny tantaran'ny Malagasy, saingy nihena tsikelikely. Manome lanja ny fanamafisana ny fahaiza-manao, ny fahazoana fahaiza-manao vaovao ary ny fanentanana izy, mba hampiroboroboana fampandrosoana sady maharitra no mahaleo tena."
    ]),
    foundations: "Ny Fototra Iorenanay",
    vision: item("Vina :", "Hahatonga ny mpisitraka tsirairay ho olom-pirenena mandray andraikitra, mitantana ny fampandrosoany manokana ary miaina amim-pirindrana ao anatin'ny fiarahamonina ara-drariny."),
    mission: item("Iraka :", "Miasa ho amin'ny fampandrosoana maharitra ny maha-olona, ny fampandrosoan'ny vondrom-piarahamonina ny tenany ary ny fiarovana ny tontolo iainana."),
    values: item("Ny soatoavinay :", "Ny asa ataonay dia tarihin'ny fampandrosoana amin'ny alalan'ny ezaka avy amin'ny tena, ny finiavana tsy hamela na iza na iza ho tavela ary ny fomba fiasa hentitra tsy misy fanavakavahana."),
    cta: cta("Fanoloran-tena", "« Ezaka avy amin'ny Tena sy Firaisankina »", "Miaraha aminay ho amin'ny fampandrosoana maharitra ny maha-olona.", "Hijery ny asa ataonay")
  },
  activities: {
    label: "Sehatra iasanay",
    title: "Ny Asa Ataonay",
    description: "Manova ny fahasahiranana ho fahaleovantena amin'ny alalan'ny ezaka avy amin'ny tena sy ny firaisankina eo amin'ny fiarahamonina.",
    solidarity: activity(
      "Vondrona Fifanampiana (GS)",
      "Ny olona no ivon'ny rafitra",
      "Ny fototry ny asa ataon'ny Tsinjo Aina dia ny fananganana vondrona tsy ara-panjakana izay miray noho ny fifampitokisana.",
      "Mba hahafahana miasa amim-pahombiazana, ny Vondrona Fifanampiana (GS) tsirairay dia mandamina ny rafiny amin'ny alalan'ny fanendrena tompon'andraikitra telo: filoha, mpitam-bola ary mpitan-tsoratra, izay voafidy amin'ny fomba malalaka sy mangarahara. Tena ilaina izany fandaminana fototra izany mba hanatanterahana ireo asa manokana ao amin'ny vondrona, na dia tsy manana tombontsoa manokana aza ireo tompon'andraikitra, fa mandray andraikitra fanampiny ho tombontsoan'ny rehetra fotsiny. Ny GS dia lasa sehatra fototra ianarana ny demokrasia mivantana, izay ahafahan'ny mpikambana tsirairay maneho hevitra mandritra ny fifanakalozan-kevitra iombonana mikendry ny hahazoana marimaritra iraisana tsara amin'ny fandraisana fanapahan-kevitra. Izany fomba fiasa izany dia fehezin'ny Fitsipika Anatiny (RI), napetraka hatramin'ny nananganana ny vondrona, izay mamaritra ny safidin'ny vondrona ary mivoatra tsikelikely arakaraka ny fahamatorana sy ny fandrosoan'ny mpikambana.",
      ["Firaisankina sy fifampitokisana", "Fanapahan-kevitra amin'ny marimaritra iraisana", "Fifandanjan'ny lahy sy ny vavy", "Fitsipika mivoatra"]
    ),
    savings: activity(
      "Tahiry sy Fampindramam-bola Anatiny",
      "Fiarovan-tena ara-toekarena",
      "Ny tahiry iombonana no fitaovana lehibe indrindra ahafahan'ny mpikambana miala amin'ireo mpampindram-bola mampihatra zanabola mihoa-pampana.",
      "Ny tahiry iombonana no fitaovana lehibe indrindra ho an'ny fahafahana sy ny fiarovan-tenan'ny mpikambana, izay mety ho vola na vokatra ara-pambolena toy ny vary, izay miakatra ny sandany mandritra ny fotoam-pahavaratra na vanim-potoanan'ny tsy fahampian-tsakafo. Mba hiantohana ny fandraisan'ny rehetra anjara, ny vondrona dia mampihatra ny fitsipika fototra hoe « Manaraka ny marefo indrindra », ka ampifanarahana ny tahan'ny latsakemboka mba hahafahan'ireo mpikambana tena sahirana mandray anjara mavitrika. Io tahiry io dia ahafahana manome fampindramam-bola anatiny natokana hentitra ho an'ny filàna fototra toy ny sakafo, ny fahasalamana, ny saram-pianarana ary ny fividianana masomboly, ka manolotra vahaolana mivaingana hisorohana ny fiankinana amin'ireo mpampindram-bola mampihatra zanabola mihoa-pampana. Mba hiarovana ireo marefo indrindra, ny fitantanana dia fehezin'ny fetra ambony indrindra amin'ny vola azo indramina izay miantoka ny rariny, ny fe-potoana famerenam-bola mifanaraka amin'ny zava-misy ary ny tahan'ny zanabola tsy misy na tena ambany.",
      ["Tahiry amin'ny vary na vola", "Ady amin'ny zanabola mihoa-pampana", "Fandraisan'ny marefo anjara", "Fitantanana hentitra"]
    ),
    agroecology: activity(
      "Fambolena Ara-tontolo Iainana sy Fahaleovantena",
      "Mamokatra mba hahazoana sakafo ara-pahasalamana",
      "Manofana ny mpikambana momba ny fototry ny fambolena ara-tontolo iainana izahay mba hampitomboana ny famokaran'ny fianakaviana.",
      "Ny fambolena ara-tontolo iainana ao amin'ny ONG Tsinjo Aina dia mikendry ny hanova ny fahasahiranana ho fahaleovantena ara-tsakafo amin'ny alalan'ny fandraisana andraikitra mivantana amin'ny fandaniana amin'ny famokarana sy ny kalitaon'ny sakafon'ny fianakaviana. Ao anatin'izany fomba fiasa izany, ny mpikambana dia mianatra manamboatra zezika komposta sy mametraka fefy velona mba hampahavokatra sy hiarovana ny taniny amin'ny fandaniana ambany kokoa. Miompana ihany koa ny asa amin'ny fananganana tahirin-tsomboly iombonan'ny fiarahamonina sy ny fampitomboana ny fahasamihafan'ireo karazana masomboly eo an-toerana, izay ahafahan'ny tantsaha miala amin'ny fiankinana amin'ireo akora fampiasa amin'ny fambolena lafo vidy ary miantoka sakafo ara-pahasalamana sy maharitra ho an'ny ankohonany. Hamafisina izany fahaleovantena izany amin'ny alalan'ny fanofanana manokana momba ny fiovaovan'ny toetrandro sy ny fitantanana ny fianakaviana, mba hahafahan'ny mpisitraka mifehy ny famokarany mandritra ny fotoana maharitra.",
      ["Komposta sy fefy velona", "Fampitomboana sy fitahirizana", "Fanabeazana ara-tsakafo", "Fiatrehana ny fiovaovan'ny toetrandro"]
    ),
    networks: activity(
      "Tambajotra sy Fisoloana Vava",
      "Feo ho an'ireo voahilikilika",
      "Ny Tambajotra Tsinjo Aina dia mampivondrona ireo GS mba hitondra ny fisoloana vava eo anivon'ny kaominina.",
      "Ny fananganana tambajotra ao anatin'ny asa ataon'ny Tsinjo Aina dia tanterahina amin'ny alalan'ireo sehatra tsy ara-panjakana eo anivon'ny Fokontany, izay ahafahan'ireo vondrona mifanakaiky mifampidinika tsy tapaka mba hanamafisana ny fahaleovantenany sy hialana amin'ny trosa. Ireo fihaonana ireo, izay mampiroborobo ny fifanakalozana sy ny fifanoroana hevitra, dia fototry ny fisoloana vava voarindra, izay idiran'ny mpikambana ao amin'ny Rafitra Ifampidinihana eo An-toerana (SLC) mba hitondrana ny fitakiany any amin'ny manampahefana. Izany hetsika iombonana izany dia ahafahana mamaritra ireo laharam-pahamehana amin'ny asa iombonana, toy ny fiarovana ny zon'ny olom-pirenena, ny fiantohana ny zon'ny fananan-tany, ny fahazoana rano fisotro madio ary ny fambolena mifanaraka amin'ny zava-misy, ka mahatonga ny tambajotra ho fitaovana tena mahomby amin'ny fanamorana ny fahazoana ireo tolotra fototra sy ny fampandrosoana eo an-toerana.",
      ["Fifanoroana hevitra eo amin'ny vondrona", "Fisoloana vava ataon'ny olom-pirenena", "Fiantohana ny zon'ny fananan-tany", "Fandinihana iarahan'ny rehetra"]
    ),
    programs: {
      label: "Fandaharanasa",
      title: "Sehatra Fanofanana",
      items: ["Fitantanana Tsotra", "Fambolena Ara-tontolo Iainana", "Fitovian-jo eo amin'ny Lahy sy ny Vavy", "Sakafo", "Fisoloana Vava", "Toetrandro"]
    },
    cta: cta("Fanoloran-tena", "Andao hanangana fahaleovantena.", "Ireo olona tena sahirana no kendrenay mba hanovana ny fanilikilihana ho hery iombonana.", "Hiara-hiasa aminay")
  }
};

const en = {
  about: {
    label: "Who we are",
    title: "Supporting the most disadvantaged",
    presentation: section("", "", [
      "Tsinjo Aina's work primarily focuses on the most vulnerable and marginalised people: those deprived of land and means of production, older people, and those living with physical or mental disabilities. These groups, often excluded from conventional development channels, face significant difficulties in accessing the natural resources essential to their survival.",
      "To break this cycle of exclusion, the organisation integrates them into Solidarity Groups (GS), founded on a radical principle of inclusion: « following the weakest ». In practice, collective progress adapts to the pace of the most vulnerable members, ensuring that no one is left behind along the way.",
      "Through this approach, Tsinjo Aina transforms these beneficiaries into responsible citizens capable of managing their own efforts and building their autonomy. The objectives are clear: to escape the cycle of indebtedness to usurious lenders, achieve food sovereignty through agroecology, and obtain full civic recognition within local decision-making bodies."
    ]),
    democracy: {
      ...section("Methodology", "Direct Democracy", [
        "Within Solidarity Groups (GS), direct democracy is expressed through a horizontal organisational structure. Each group becomes a unit for civic learning, where all members have an equal right to speak and influence collective decisions. Unlike conventional systems based on majority voting, resolutions emerge from a demanding process of in-depth discussion that always seeks consensus. Each decision is therefore supported by all participants.",
        "This structure is coordinated by a permanent committee consisting of a president, a treasurer and a secretary, elected openly and transparently. These representatives exercise no hierarchical authority: their role is exclusively one of service for the benefit of the collective.",
        "Finally, this democracy is firmly committed to inclusion through the principle of « following the weakest ». The group's pace of progress and rules are adjusted according to its maturity, in order to protect and fully include its most disadvantaged or marginalised members."
      ]),
      committee: item("Permanent Committee", "Openly elected: President, Treasurer, Secretary."),
      inclusion: item("Full Inclusion", "« We follow the weakest »")
    },
    history: section("Our journey", "Our History", [
      "The Fianarantsoa Project began in 1998 in the southern part of the region, in Ambalavao, as an individual initiative. It rapidly expanded northwards in 2001 and then in 2003, initiating a process of continuous growth. In 2009, the Tsinjo Aina Betsileo Association was founded to support and structure this approach. A few years later, in December 2016, it evolved into ONG TSINJO AINA Fianarantsoa.",
      "Today, the organisation directly supports nearly 25,000 beneficiaries, including 11,800 women, and indirectly reaches more than 58,400 additional people. Its mission is to improve living conditions and strengthen the autonomy of local communities, particularly women, through social, economic and environmental projects.",
      "The adopted approach is based on mobilising community efforts: encouraging groups to design and manage their own sustainable development initiatives. The NGO also works to revive community solidarity, a value deeply rooted in Malagasy history but which has gradually eroded. It focuses on capacity building, skills acquisition and awareness-raising to promote development that is both sustainable and sovereign."
    ]),
    foundations: "Our Foundations",
    vision: item("Vision:", "To make every beneficiary a responsible citizen who takes charge of their own development and lives in harmony within an equitable society."),
    mission: item("Mission:", "To work towards sustainable human development, community self-development and environmental protection."),
    values: item("Our values:", "Our work is guided by development through self-reliance, the commitment to leaving no one behind, and a strict approach without any discrimination."),
    cta: cta("Commitment", "« Self-reliance & Solidarity »", "Join us in promoting sustainable human development.", "View our activities")
  },
  activities: {
    label: "Our areas of action",
    title: "Our Activities",
    description: "Transforming vulnerability into sovereignty through self-reliance and community solidarity.",
    solidarity: activity(
      "Solidarity Groups (GS)",
      "People at the heart of the system",
      "The foundation of Tsinjo Aina's work lies in the formation of informal groups united by trust.",
      "To operate effectively, each Solidarity Group (GS) structures itself by appointing three representatives: a President, a Treasurer and a Secretary, elected openly and transparently. This basic organisation is essential for carrying out the group's specific tasks, although the representatives have no special privileges and simply assume additional responsibilities in the interests of everyone. The GS thus serves as a basic unit for learning direct democracy, where every member can express their views during collective discussions aimed at reaching a sound consensus for decision-making. This operation is governed by Internal Regulations (RI) established when the group is created, which define the group's choices and evolve progressively according to the maturity and progress of its members.",
      ["Solidarity and trust", "Consensus-based decisions", "Gender balance", "Evolving internal regulations"]
    ),
    savings: activity(
      "Savings and Internal Credit",
      "Economic self-protection",
      "Collective savings are the main instrument for freeing members from usurious lenders.",
      "Collective savings constitute the main instrument of liberation and self-protection for members. They may take the form of money or agricultural products such as rice, whose value increases strategically during the lean season. To ensure full inclusion, the group applies the fundamental principle of « We follow the weakest », adjusting contribution rates so that the most disadvantaged members can participate actively. These savings enable internal loans to be granted strictly for essential needs such as food, healthcare, school fees and the purchase of seeds, thereby providing a practical alternative to relying on usurious lenders. To protect the most vulnerable, management is governed by a borrowing limit that ensures fairness, realistic repayment periods and a zero or very modest interest rate.",
      ["Rice or monetary savings", "Combating usury", "Inclusion of vulnerable people", "Rigorous management"]
    ),
    agroecology: activity(
      "Agroecology and Sovereignty",
      "Producing healthy food",
      "We train members in the fundamentals of agroecology to increase household production.",
      "Agroecology within the NGO Tsinjo Aina aims to transform vulnerability into food sovereignty by acting directly on operating costs and the quality of family nutrition. At the heart of this approach, members learn to produce compost and establish living hedges to fertilise and protect their land at a lower cost. The work also focuses on creating community seed banks and increasing the diversity of available local varieties, enabling farmers to free themselves from costly agricultural inputs and ensure healthy and sustainable food for their households. This sovereignty is strengthened through specific training on climate change and household management, enabling beneficiaries to control their production over the long term.",
      ["Composting & Living hedges", "Multiplication & Conservation", "Nutritional education", "Climate adaptation"]
    ),
    networks: activity(
      "Networking and Advocacy",
      "A voice for the excluded",
      "The Tsinjo Aina Network brings together Solidarity Groups to conduct advocacy at municipal level.",
      "Networking within Tsinjo Aina's work is organised through informal platforms at Fokontany level, allowing neighbouring groups to consult regularly in order to strengthen their autonomy and become free from debt. These meetings, which encourage exchange and mutual advice, form the basis of structured advocacy in which members join Local Consultation Structures (SLC) to present their demands to the authorities. This collective dynamic makes it possible to define priorities for joint action, such as defending civic rights, securing land tenure, accessing drinking water and developing adapted agriculture, thereby transforming the network into a genuine instrument of influence for access to basic services and local development.",
      ["Advice between groups", "Citizen advocacy", "Land tenure security", "Participatory assessment"]
    ),
    programs: {
      label: "Programmes",
      title: "Training Areas",
      items: ["Simplified Management", "Agroecology", "Gender", "Nutrition", "Advocacy", "Climate"]
    },
    cta: cta("Commitment", "Let us build autonomy.", "We target the most disadvantaged people to transform exclusion into collective strength.", "Work with us")
  }
};

const it = {
  about: {
    label: "Chi siamo",
    title: "Sostenere i più svantaggiati",
    presentation: section("", "", [
      "L'azione di Tsinjo Aina si rivolge prioritariamente alle persone più vulnerabili ed emarginate: coloro che sono privi di terra e di mezzi di produzione, gli anziani e le persone che vivono con disabilità fisiche o mentali. Questi gruppi, spesso esclusi dai circuiti tradizionali dello sviluppo, incontrano profonde difficoltà nell'accesso alle risorse naturali indispensabili alla loro sopravvivenza.",
      "Per interrompere questo ciclo di esclusione, l'organizzazione li integra nei Gruppi di Solidarietà (GS), fondati su una regola radicale di inclusione: « seguire il più debole ». Concretamente, il progresso collettivo si adatta al ritmo dei membri più fragili, garantendo che nessuno venga abbandonato lungo il percorso.",
      "Attraverso questo approccio, Tsinjo Aina trasforma questi beneficiari in cittadini responsabili, capaci di gestire il proprio impegno e costruire la propria autonomia. Gli obiettivi sono chiari: uscire dal ciclo dell'indebitamento nei confronti degli usurai, raggiungere la sovranità alimentare attraverso l'agroecologia e ottenere un pieno riconoscimento civico all'interno degli organismi decisionali locali."
    ]),
    democracy: {
      ...section("Metodologia", "Democrazia Diretta", [
        "All'interno dei Gruppi di Solidarietà (GS), la democrazia diretta si esprime attraverso un'organizzazione orizzontale. Ogni gruppo diventa un'unità di apprendimento civico, in cui tutti i membri dispongono dello stesso diritto di parola e di influenza sulle decisioni collettive. A differenza dei sistemi tradizionali fondati sul voto a maggioranza, le decisioni emergono da un processo impegnativo di discussione approfondita, volto sempre al raggiungimento del consenso. Ogni decisione è quindi sostenuta dall'insieme dei partecipanti.",
        "Questa struttura è coordinata da un comitato permanente, composto da presidente, tesoriere e segretario, eletto in modo aperto e trasparente. Questi responsabili non esercitano alcun potere gerarchico: il loro ruolo consiste esclusivamente nel servizio a beneficio della collettività.",
        "Infine, questa democrazia è decisamente orientata all'inclusione grazie al principio del « seguire il più debole ». Il ritmo di progresso e le regole del gruppo si adattano al suo livello di maturità, al fine di proteggere e integrare pienamente i membri più svantaggiati o emarginati."
      ]),
      committee: item("Comitato Permanente", "Eletti liberamente: Presidente, Tesoriere, Segretario."),
      inclusion: item("Inclusione Totale", "« Seguiamo il più debole »")
    },
    history: section("Il nostro percorso", "La Nostra Storia", [
      "Il Progetto Fianarantsoa è nato nel 1998, nella parte meridionale della regione, ad Ambalavao, sotto forma di iniziativa individuale. Si è rapidamente esteso verso nord nel 2001 e successivamente nel 2003, avviando una dinamica di crescita continua. Nel 2009, per sostenere e strutturare questo approccio, è stata fondata l'Associazione Tsinjo Aina Betsileo. Alcuni anni dopo, nel dicembre 2016, si è evoluta diventando ONG TSINJO AINA Fianarantsoa.",
      "Oggi l'organizzazione accompagna direttamente quasi 25.000 beneficiari, tra cui 11.800 donne, e raggiunge indirettamente oltre 58.400 persone aggiuntive. La sua missione consiste nel migliorare le condizioni di vita e rafforzare l'autonomia delle comunità locali, in particolare delle donne, attraverso progetti sociali, economici e ambientali.",
      "L'approccio adottato si basa sulla mobilitazione degli sforzi comunitari: incoraggiare i gruppi a progettare e gestire le proprie iniziative di sviluppo sostenibile. L'ONG opera inoltre per ravvivare la solidarietà comunitaria, un valore profondamente radicato nella storia malgascia ma che si è progressivamente indebolito. Pone l'accento sul rafforzamento delle capacità, sull'acquisizione di competenze e sulla sensibilizzazione, al fine di promuovere uno sviluppo al tempo stesso sostenibile e sovrano."
    ]),
    foundations: "I Nostri Fondamenti",
    vision: item("Visione:", "Rendere ogni beneficiario un cittadino responsabile, capace di prendere in mano il proprio sviluppo e vivere in armonia all'interno di una società equa."),
    mission: item("Missione:", "Operare per lo sviluppo umano sostenibile, l'autopromozione delle comunità e la protezione dell'ambiente."),
    values: item("I nostri valori:", "La nostra azione è guidata dallo sviluppo attraverso l'impegno personale, dalla volontà di non lasciare indietro nessuno e da un approccio rigoroso privo di qualsiasi discriminazione."),
    cta: cta("Impegno", "« Impegno Personale e Solidarietà »", "Unisciti a noi per uno sviluppo umano sostenibile.", "Scopri le nostre attività")
  },
  activities: {
    label: "I nostri ambiti di intervento",
    title: "Le Nostre Attività",
    description: "Trasformare la precarietà in sovranità attraverso l'impegno personale e la solidarietà comunitaria.",
    solidarity: activity(
      "Gruppi di Solidarietà (GS)",
      "La persona al centro del sistema",
      "La base dell'azione di Tsinjo Aina si fonda sulla costituzione di gruppi informali uniti dalla fiducia.",
      "Per funzionare efficacemente, ogni Gruppo di Solidarietà (GS) si struttura designando tre responsabili: un Presidente, un Tesoriere e un Segretario, eletti in modo aperto e trasparente. Questa organizzazione minima è indispensabile per svolgere i compiti specifici del gruppo, sebbene i responsabili non dispongano di alcuna prerogativa particolare e assumano semplicemente responsabilità aggiuntive nell'interesse di tutti. Il GS funge così da unità di base per l'apprendimento della democrazia diretta, in cui ogni membro può esprimersi durante discussioni collettive volte a raggiungere un valido consenso per il processo decisionale. Questo funzionamento è disciplinato da un Regolamento Interno (RI), stabilito fin dalla creazione del gruppo, che definisce le scelte del gruppo ed evolve progressivamente secondo la maturazione e i progressi dei membri.",
      ["Solidarietà e fiducia", "Decisioni per consenso", "Equilibrio tra uomini e donne", "Regolamento evolutivo"]
    ),
    savings: activity(
      "Risparmio e Credito Interno",
      "Autodifesa economica",
      "Il risparmio comune è lo strumento principale per liberare i membri dagli usurai.",
      "Il risparmio comune costituisce il principale strumento di liberazione e autodifesa dei membri e può assumere la forma di denaro o di prodotti agricoli come il riso, il cui valore aumenta strategicamente durante il periodo di scarsità alimentare. Per garantire un'inclusione totale, il gruppo applica il principio fondamentale « Seguiamo il più debole », adeguando il tasso di contribuzione per consentire ai membri più bisognosi di partecipare attivamente. Questo risparmio permette di concedere prestiti interni strettamente riservati ai bisogni vitali, come l'alimentazione, la salute, le spese scolastiche e l'acquisto di sementi, offrendo così un'alternativa concreta al ricorso agli usurai. Per proteggere i più vulnerabili, la gestione è disciplinata da un limite massimo di prestito che garantisce l'equità, da scadenze di rimborso realistiche e da un tasso di interesse nullo o molto modesto.",
      ["Risparmio in riso o denaro", "Lotta contro l'usura", "Inclusione dei vulnerabili", "Gestione rigorosa"]
    ),
    agroecology: activity(
      "Agroecologia e Sovranità",
      "Produrre per nutrirsi in modo sano",
      "Formiamo i membri sui principi fondamentali dell'agroecologia per aumentare la produzione familiare.",
      "L'agroecologia all'interno dell'ONG Tsinjo Aina mira a trasformare la precarietà in sovranità alimentare intervenendo direttamente sui costi di gestione agricola e sulla qualità della nutrizione delle famiglie. Al centro di questo approccio, i membri imparano a produrre compost e a installare siepi vive per fertilizzare e proteggere i propri terreni a costi inferiori. L'azione si concentra inoltre sulla creazione di banche comunitarie di sementi e sull'aumento della diversità delle varietà locali disponibili, consentendo agli agricoltori di liberarsi dalla dipendenza da costosi fattori produttivi e di garantire un'alimentazione sana e sostenibile alle proprie famiglie. Questa sovranità viene rafforzata attraverso formazioni specifiche sui cambiamenti climatici e sulla gestione familiare, permettendo ai beneficiari di controllare la propria produzione nel lungo periodo.",
      ["Compostaggio e siepi vive", "Moltiplicazione e conservazione", "Educazione alimentare", "Adattamento climatico"]
    ),
    networks: activity(
      "Reti e Advocacy",
      "Una voce per gli esclusi",
      "La Rete Tsinjo Aina riunisce i GS per svolgere attività di advocacy a livello comunale.",
      "La creazione di reti nell'ambito dell'azione di Tsinjo Aina si organizza attraverso piattaforme informali a livello dei Fokontany, consentendo ai gruppi vicini di consultarsi regolarmente per rafforzare la propria autonomia e raggiungere la liberazione dai debiti. Questi incontri, che favoriscono lo scambio e la consulenza reciproca, costituiscono la base di un'attività di advocacy strutturata, nella quale i membri entrano a far parte delle Strutture Locali di Concertazione (SLC) per presentare le proprie rivendicazioni alle autorità. Questa dinamica collettiva permette di definire priorità di azione comune, come la difesa dei diritti civici, la sicurezza fondiaria, l'accesso all'acqua potabile e un'agricoltura adeguata, trasformando così la rete in un autentico strumento di influenza per l'accesso ai servizi di base e lo sviluppo locale.",
      ["Consulenza tra gruppi", "Advocacy civica", "Sicurezza fondiaria", "Valutazione partecipativa"]
    ),
    programs: {
      label: "Programmi",
      title: "Ambiti di Formazione",
      items: ["Gestione Semplificata", "Agroecologia", "Genere", "Nutrizione", "Advocacy", "Clima"]
    },
    cta: cta("Impegno", "Costruiamo l'autonomia.", "Ci rivolgiamo alle persone più svantaggiate per trasformare l'esclusione in forza collettiva.", "Lavora con noi")
  }
};

// Traduction de la clé supplémentaire présente dans fr.json
const loading = {
  mg: "Eo am-pampidirana ny mombamomba ny ekipa...",
  en: "Loading team members...",
  it: "Caricamento dei membri della squadra..."
};

// Vérification de la structure des traductions
const structure = (obj, prefix = '') => {
  if (Array.isArray(obj)) return obj.flatMap((value, index) => structure(value, `${prefix}[${index}]`));
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().flatMap(key => structure(obj[key], prefix ? `${prefix}.${key}` : key));
  }
  return [`${prefix}:${typeof obj}`];
};

const reference = JSON.parse(fs.readFileSync('src/locales/fr.json', 'utf8'));
const expected = JSON.stringify(structure(reference));
const translations = { mg, en, it };

const updates = Object.entries(translations).map(([lang, content]) => {
  const path = `src/locales/${lang}.json`;
  const original = fs.readFileSync(path, 'utf8');
  const data = JSON.parse(original);

  data.about = content.about;
  data.activities = content.activities;
  data.team = { ...data.team, loading: loading[lang] };

  if (JSON.stringify(structure(data)) !== expected) {
    throw new Error(`${lang.toUpperCase()} : structure différente de fr.json`);
  }

  return { lang, path, original, data };
});

// Sauvegarde puis écriture après validation des trois langues
for (const { lang, path, original, data } of updates) {
  fs.writeFileSync(`${path}.${Date.now()}.backup`, original);
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  console.log(`${lang.toUpperCase()} : traductions complètes ajoutées.`);
}

console.log('Toutes les langues possèdent la même structure.');
console.log('Le fichier fr.json reste inchangé.');
