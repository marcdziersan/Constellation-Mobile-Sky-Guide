/*
 * CONSTELLATION catalog
 * Bright-star positions are approximate J2000 right ascension (hours),
 * declination (degrees) and visual magnitude. The figures are intentionally
 * simplified for a readable interactive planisphere.
 */

const CONSTELLATIONS = [
  // ───────────────────────────── ZODIAC ─────────────────────────────
  {
    name: 'Aries', common: 'The Ram', iau: 'Ari', family: 'zodiac', symbol: '♈',
    season: 'Autumn', hemisphere: 'Northern / Equatorial',
    description: 'The first traditional sign of the zodiac. Its compact figure is led by Hamal and Sheratan.',
    stars: [
      { n:'Hamal', ra:2.119, dec:23.46, m:2.00 },
      { n:'Sheratan', ra:1.911, dec:20.81, m:2.64 },
      { n:'Mesarthim', ra:1.892, dec:19.29, m:3.86 },
      { n:'Botein', ra:3.194, dec:19.73, m:4.35 }
    ],
    lines:[[2,1],[1,0],[0,3]]
  },
  {
    name: 'Taurus', common: 'The Bull', iau: 'Tau', family: 'zodiac', symbol: '♉',
    season: 'Winter', hemisphere: 'Northern / Equatorial',
    description: 'A rich winter constellation containing Aldebaran, the Hyades and the Pleiades region.',
    stars: [
      { n:'Aldebaran', ra:4.599, dec:16.51, m:0.87 },
      { n:'Elnath', ra:5.438, dec:28.61, m:1.65 },
      { n:'Alcyone', ra:3.791, dec:24.11, m:2.87 },
      { n:'Ain', ra:4.477, dec:19.18, m:3.53 },
      { n:'Hyadum I', ra:4.329, dec:15.63, m:3.65 },
      { n:'Tianguan', ra:5.627, dec:21.14, m:3.00 }
    ],
    lines:[[4,0],[0,3],[3,1],[0,5],[2,4]]
  },
  {
    name: 'Gemini', common: 'The Twins', iau: 'Gem', family: 'zodiac', symbol: '♊',
    season: 'Winter', hemisphere: 'Northern / Equatorial',
    description: 'The celestial twins are marked by the bright pair Castor and Pollux.',
    stars: [
      { n:'Castor', ra:7.576, dec:31.89, m:1.58 },
      { n:'Pollux', ra:7.755, dec:28.03, m:1.14 },
      { n:'Alhena', ra:6.629, dec:16.40, m:1.93 },
      { n:'Wasat', ra:7.335, dec:21.98, m:3.53 },
      { n:'Mebsuta', ra:6.732, dec:25.13, m:3.06 },
      { n:'Mekbuda', ra:7.068, dec:20.57, m:4.01 }
    ],
    lines:[[0,4],[4,5],[5,2],[1,3],[3,5],[0,1]]
  },
  {
    name: 'Cancer', common: 'The Crab', iau: 'Cnc', family: 'zodiac', symbol: '♋',
    season: 'Winter / Spring', hemisphere: 'Northern / Equatorial',
    description: 'A subtle zodiac constellation surrounding the Beehive Cluster region.',
    stars: [
      { n:'Acubens', ra:8.975, dec:11.86, m:4.26 },
      { n:'Altarf', ra:8.275, dec:9.19, m:3.52 },
      { n:'Asellus Borealis', ra:8.721, dec:21.47, m:4.66 },
      { n:'Asellus Australis', ra:8.745, dec:18.15, m:3.94 }
    ],
    lines:[[1,3],[3,2],[3,0]]
  },
  {
    name: 'Leo', common: 'The Lion', iau: 'Leo', family: 'zodiac', symbol: '♌',
    season: 'Spring', hemisphere: 'Northern / Equatorial',
    description: 'One of the easiest zodiac figures to recognize, anchored by Regulus and Denebola.',
    stars: [
      { n:'Regulus', ra:10.139, dec:11.97, m:1.35 },
      { n:'Denebola', ra:11.818, dec:14.57, m:2.14 },
      { n:'Algieba', ra:10.333, dec:19.84, m:2.08 },
      { n:'Zosma', ra:11.235, dec:20.52, m:2.56 },
      { n:'Chertan', ra:11.237, dec:15.43, m:3.33 },
      { n:'Rasalas', ra:9.879, dec:26.01, m:3.88 }
    ],
    lines:[[0,2],[2,5],[2,3],[3,1],[1,4],[4,0]]
  },
  {
    name: 'Virgo', common: 'The Maiden', iau: 'Vir', family: 'zodiac', symbol: '♍',
    season: 'Spring', hemisphere: 'Equatorial',
    description: 'A broad zodiac constellation whose brilliant blue-white Spica is the principal beacon.',
    stars: [
      { n:'Spica', ra:13.420, dec:-11.16, m:0.98 },
      { n:'Porrima', ra:12.694, dec:-1.45, m:2.74 },
      { n:'Vindemiatrix', ra:13.036, dec:10.96, m:2.83 },
      { n:'Zaniah', ra:12.332, dec:-0.67, m:3.89 },
      { n:'Heze', ra:13.578, dec:-0.60, m:3.38 },
      { n:'Auva', ra:12.927, dec:3.40, m:3.38 }
    ],
    lines:[[3,1],[1,0],[1,5],[5,2],[1,4]]
  },
  {
    name: 'Libra', common: 'The Scales', iau: 'Lib', family: 'zodiac', symbol: '♎',
    season: 'Spring / Summer', hemisphere: 'Equatorial / Southern',
    description: 'The zodiac scales lie between Virgo and Scorpius, marked by the traditional Zuben stars.',
    stars: [
      { n:'Zubeneschamali', ra:15.283, dec:-9.38, m:2.61 },
      { n:'Zubenelgenubi', ra:14.848, dec:-16.04, m:2.75 },
      { n:'Brachium', ra:15.067, dec:-25.28, m:3.29 },
      { n:'Zubenelhakrabi', ra:15.617, dec:-28.14, m:3.91 }
    ],
    lines:[[0,1],[1,2],[2,3],[3,0]]
  },
  {
    name: 'Scorpius', common: 'The Scorpion', iau: 'Sco', family: 'zodiac', symbol: '♏',
    season: 'Summer', hemisphere: 'Southern / Equatorial',
    description: 'A dramatic summer constellation with red Antares at its heart and a hooked stellar tail.',
    stars: [
      { n:'Antares', ra:16.490, dec:-26.43, m:0.96 },
      { n:'Shaula', ra:17.560, dec:-37.10, m:1.62 },
      { n:'Sargas', ra:17.622, dec:-42.99, m:1.86 },
      { n:'Dschubba', ra:16.005, dec:-22.62, m:2.32 },
      { n:'Acrab', ra:16.091, dec:-19.81, m:2.56 },
      { n:'Alniyat', ra:16.353, dec:-25.59, m:2.89 },
      { n:'Lesath', ra:17.512, dec:-37.30, m:2.70 }
    ],
    lines:[[4,3],[3,5],[5,0],[0,2],[2,1],[1,6]]
  },
  {
    name: 'Sagittarius', common: 'The Archer', iau: 'Sgr', family: 'zodiac', symbol: '♐',
    season: 'Summer', hemisphere: 'Southern / Equatorial',
    description: 'The Archer points toward the Milky Way’s galactic-center region; its core stars form the Teapot asterism.',
    stars: [
      { n:'Kaus Australis', ra:18.402, dec:-34.38, m:1.79 },
      { n:'Nunki', ra:18.921, dec:-26.30, m:2.05 },
      { n:'Ascella', ra:19.043, dec:-29.88, m:2.60 },
      { n:'Kaus Media', ra:18.350, dec:-29.83, m:2.72 },
      { n:'Kaus Borealis', ra:18.466, dec:-25.42, m:2.82 },
      { n:'Alnasl', ra:18.097, dec:-30.42, m:2.98 }
    ],
    lines:[[5,3],[3,0],[0,2],[2,1],[1,4],[4,3]]
  },
  {
    name: 'Capricornus', common: 'The Sea-Goat', iau: 'Cap', family: 'zodiac', symbol: '♑',
    season: 'Summer / Autumn', hemisphere: 'Equatorial / Southern',
    description: 'A faint but ancient zodiac figure shaped like a broad celestial wedge.',
    stars: [
      { n:'Deneb Algedi', ra:21.784, dec:-16.13, m:2.83 },
      { n:'Dabih', ra:20.351, dec:-14.78, m:3.05 },
      { n:'Nashira', ra:21.668, dec:-16.66, m:3.68 },
      { n:'Algedi', ra:20.300, dec:-12.54, m:3.58 }
    ],
    lines:[[3,1],[1,2],[2,0],[0,3]]
  },
  {
    name: 'Aquarius', common: 'The Water Bearer', iau: 'Aqr', family: 'zodiac', symbol: '♒',
    season: 'Autumn', hemisphere: 'Equatorial / Southern',
    description: 'A sprawling autumn zodiac constellation in the traditional watery region of the sky.',
    stars: [
      { n:'Sadalsuud', ra:21.526, dec:-5.57, m:2.87 },
      { n:'Sadalmelik', ra:22.096, dec:-0.32, m:2.95 },
      { n:'Skat', ra:22.911, dec:-15.82, m:3.27 },
      { n:'Albali', ra:20.795, dec:-9.50, m:3.77 },
      { n:'Ancha', ra:22.281, dec:-7.78, m:4.16 },
      { n:'Hydor', ra:22.361, dec:-1.39, m:3.84 }
    ],
    lines:[[3,0],[0,1],[1,5],[5,4],[4,2]]
  },
  {
    name: 'Pisces', common: 'The Fishes', iau: 'Psc', family: 'zodiac', symbol: '♓',
    season: 'Autumn', hemisphere: 'Equatorial',
    description: 'Two celestial fish joined by a long cord, meeting near the star Alrescha.',
    stars: [
      { n:'Alrescha', ra:2.034, dec:2.76, m:3.82 },
      { n:'Eta Piscium', ra:1.524, dec:15.35, m:3.62 },
      { n:'Gamma Piscium', ra:23.286, dec:3.28, m:3.70 },
      { n:'Omega Piscium', ra:23.989, dec:6.86, m:4.03 },
      { n:'Kullat Nunu', ra:1.690, dec:5.49, m:4.44 },
      { n:'Torcular', ra:1.194, dec:9.16, m:4.26 }
    ],
    lines:[[0,4],[4,1],[1,5],[5,3],[3,2]]
  },

  // ─────────────────────────── NORTHERN SKY ───────────────────────────
  {
    name:'Ursa Major', common:'The Great Bear', iau:'UMa', family:'northern', symbol:'✦', season:'Spring', hemisphere:'Northern',
    description:'Home of the Big Dipper, one of the most familiar guide patterns in the northern sky.',
    stars:[
      {n:'Dubhe',ra:11.062,dec:61.75,m:1.79},{n:'Merak',ra:11.031,dec:56.38,m:2.37},
      {n:'Phecda',ra:11.897,dec:53.69,m:2.44},{n:'Megrez',ra:12.257,dec:57.03,m:3.31},
      {n:'Alioth',ra:12.900,dec:55.96,m:1.77},{n:'Mizar',ra:13.399,dec:54.93,m:2.23},
      {n:'Alkaid',ra:13.792,dec:49.31,m:1.86}
    ], lines:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]]
  },
  {
    name:'Ursa Minor', common:'The Little Bear', iau:'UMi', family:'northern', symbol:'✦', season:'All year', hemisphere:'Northern',
    description:'The Little Dipper ends at Polaris, the present northern pole star.',
    stars:[
      {n:'Polaris',ra:2.530,dec:89.26,m:1.98},{n:'Yildun',ra:17.537,dec:86.59,m:4.35},
      {n:'Epsilon UMi',ra:16.766,dec:82.04,m:4.22},{n:'Zeta UMi',ra:15.734,dec:77.79,m:4.32},
      {n:'Kochab',ra:14.845,dec:74.16,m:2.08},{n:'Pherkad',ra:15.345,dec:71.83,m:3.05}
    ], lines:[[0,1],[1,2],[2,3],[3,4],[4,5]]
  },
  {
    name:'Cassiopeia', common:'The Seated Queen', iau:'Cas', family:'northern', symbol:'✦', season:'Autumn', hemisphere:'Northern',
    description:'Its famous W shape is circumpolar from much of northern Europe.',
    stars:[
      {n:'Segin',ra:1.907,dec:63.67,m:3.35},{n:'Ruchbah',ra:1.430,dec:60.24,m:2.68},
      {n:'Gamma Cas',ra:0.945,dec:60.72,m:2.47},{n:'Schedar',ra:0.675,dec:56.54,m:2.24},
      {n:'Caph',ra:0.153,dec:59.15,m:2.28}
    ], lines:[[0,1],[1,2],[2,3],[3,4]]
  },
  {
    name:'Cygnus', common:'The Swan', iau:'Cyg', family:'northern', symbol:'✦', season:'Summer', hemisphere:'Northern',
    description:'The Northern Cross follows the Milky Way and is crowned by luminous Deneb.',
    stars:[
      {n:'Deneb',ra:20.690,dec:45.28,m:1.25},{n:'Sadr',ra:20.370,dec:40.26,m:2.23},
      {n:'Gienah',ra:20.770,dec:33.97,m:2.46},{n:'Delta Cyg',ra:19.750,dec:45.13,m:2.87},
      {n:'Albireo',ra:19.512,dec:27.96,m:3.18}
    ], lines:[[0,1],[1,2],[1,3],[1,4]]
  },
  {
    name:'Lyra', common:'The Lyre', iau:'Lyr', family:'northern', symbol:'✦', season:'Summer', hemisphere:'Northern',
    description:'A compact summer constellation dominated by Vega, one vertex of the Summer Triangle.',
    stars:[
      {n:'Vega',ra:18.615,dec:38.78,m:0.03},{n:'Sheliak',ra:18.834,dec:33.36,m:3.52},
      {n:'Sulafat',ra:18.983,dec:32.69,m:3.24},{n:'Delta Lyr',ra:18.908,dec:36.90,m:4.30}
    ], lines:[[0,3],[3,1],[1,2],[2,3]]
  },
  {
    name:'Perseus', common:'The Hero', iau:'Per', family:'northern', symbol:'✦', season:'Autumn / Winter', hemisphere:'Northern',
    description:'A rich Milky Way constellation featuring Mirfak and the famous eclipsing variable Algol.',
    stars:[
      {n:'Mirfak',ra:3.405,dec:49.86,m:1.79},{n:'Algol',ra:3.136,dec:40.96,m:2.12},
      {n:'Zeta Per',ra:3.902,dec:31.88,m:2.85},{n:'Epsilon Per',ra:3.964,dec:40.01,m:2.89},
      {n:'Atik',ra:3.902,dec:31.88,m:2.86}
    ], lines:[[0,1],[0,3],[3,2],[2,4]]
  },
  {
    name:'Boötes', common:'The Herdsman', iau:'Boo', family:'northern', symbol:'✦', season:'Spring / Summer', hemisphere:'Northern',
    description:'A kite-shaped northern figure dominated by orange Arcturus, one of the brightest stars in the sky.',
    stars:[
      {n:'Arcturus',ra:14.261,dec:19.18,m:-0.05},{n:'Izar',ra:14.750,dec:27.07,m:2.35},
      {n:'Seginus',ra:14.534,dec:38.31,m:3.03},{n:'Nekkar',ra:15.032,dec:40.39,m:3.49},
      {n:'Muphrid',ra:13.912,dec:18.40,m:2.68},{n:'Princeps',ra:14.685,dec:13.73,m:3.48}
    ], lines:[[0,4],[0,5],[0,1],[1,2],[2,3],[3,1]]
  },
  {
    name:'Draco', common:'The Dragon', iau:'Dra', family:'northern', symbol:'✦', season:'All year', hemisphere:'Northern',
    description:'A long circumpolar dragon winding between the two celestial bears.',
    stars:[
      {n:'Eltanin',ra:17.943,dec:51.49,m:2.24},{n:'Rastaban',ra:17.507,dec:52.30,m:2.79},
      {n:'Grumium',ra:17.893,dec:56.87,m:3.75},{n:'Altais',ra:19.210,dec:67.66,m:3.07},
      {n:'Edasich',ra:15.416,dec:58.97,m:3.29},{n:'Thuban',ra:14.073,dec:64.38,m:3.65},
      {n:'Kuma',ra:17.537,dec:55.17,m:4.88}
    ], lines:[[0,1],[1,6],[6,2],[2,0],[2,3],[3,4],[4,5]]
  },
  {
    name:'Andromeda', common:'The Chained Princess', iau:'And', family:'northern', symbol:'✦', season:'Autumn', hemisphere:'Northern',
    description:'A long chain of bright stars leading away from the Great Square of Pegasus toward the Andromeda Galaxy region.',
    stars:[
      {n:'Alpheratz',ra:0.140,dec:29.09,m:2.06},{n:'Mirach',ra:1.163,dec:35.62,m:2.05},
      {n:'Almach',ra:2.065,dec:42.33,m:2.10},{n:'Delta And',ra:0.655,dec:30.86,m:3.27}
    ], lines:[[0,3],[3,1],[1,2]]
  },
  {
    name:'Pegasus', common:'The Winged Horse', iau:'Peg', family:'northern', symbol:'✦', season:'Autumn', hemisphere:'Northern / Equatorial',
    description:'The Great Square of Pegasus is one of autumn’s most useful naked-eye landmarks.',
    stars:[
      {n:'Markab',ra:23.079,dec:15.21,m:2.49},{n:'Scheat',ra:23.063,dec:28.08,m:2.42},
      {n:'Algenib',ra:0.221,dec:15.18,m:2.84},{n:'Enif',ra:21.737,dec:9.88,m:2.39},
      {n:'Matar',ra:22.717,dec:30.22,m:2.95}
    ], lines:[[0,1],[1,2],[2,0],[0,3],[1,4]]
  },
  {
    name:'Auriga', common:'The Charioteer', iau:'Aur', family:'northern', symbol:'✦', season:'Winter', hemisphere:'Northern',
    description:'A bright winter pentagon headed by golden Capella.',
    stars:[
      {n:'Capella',ra:5.279,dec:45.99,m:0.08},{n:'Menkalinan',ra:5.992,dec:44.95,m:1.90},
      {n:'Mahasim',ra:5.108,dec:41.23,m:2.65},{n:'Hassaleh',ra:4.950,dec:33.17,m:2.69},
      {n:'Almaaz',ra:5.033,dec:43.82,m:3.03}
    ], lines:[[0,4],[4,1],[1,3],[3,2],[2,0]]
  },
  {
    name:'Hercules', common:'The Hero', iau:'Her', family:'northern', symbol:'✦', season:'Summer', hemisphere:'Northern',
    description:'A large northern constellation known for its Keystone asterism and the great globular cluster M13 region.',
    stars:[
      {n:'Kornephoros',ra:16.504,dec:21.49,m:2.78},{n:'Zeta Her',ra:16.689,dec:31.60,m:2.81},
      {n:'Eta Her',ra:16.715,dec:38.92,m:3.49},{n:'Pi Her',ra:17.251,dec:36.81,m:3.16},
      {n:'Rasalgethi',ra:17.244,dec:14.39,m:3.48},{n:'Sarin',ra:17.251,dec:24.84,m:3.14}
    ], lines:[[1,2],[2,3],[3,5],[5,1],[5,0],[0,4]]
  },
  {
    name:'Corona Borealis', common:'The Northern Crown', iau:'CrB', family:'northern', symbol:'✦', season:'Summer', hemisphere:'Northern',
    description:'A graceful semicircle of stars centered on bright Alphecca.',
    stars:[
      {n:'Alphecca',ra:15.578,dec:26.71,m:2.23},{n:'Nusakan',ra:15.463,dec:29.11,m:3.68},
      {n:'Gamma CrB',ra:15.713,dec:26.30,m:3.84},{n:'Delta CrB',ra:15.827,dec:26.07,m:4.63},
      {n:'Epsilon CrB',ra:15.960,dec:26.88,m:4.15}
    ], lines:[[1,0],[0,2],[2,3],[3,4]]
  },

  // ───────────────────────── EQUATORIAL / SOUTHERN ─────────────────────────
  {
    name:'Orion', common:'The Hunter', iau:'Ori', family:'equatorial', symbol:'✦', season:'Winter', hemisphere:'Equatorial',
    description:'Perhaps the sky’s most recognizable stellar figure, with the three Belt stars between Betelgeuse and Rigel.',
    stars:[
      {n:'Betelgeuse',ra:5.919,dec:7.41,m:0.50},{n:'Bellatrix',ra:5.418,dec:6.35,m:1.64},
      {n:'Alnitak',ra:5.679,dec:-1.94,m:1.77},{n:'Alnilam',ra:5.604,dec:-1.20,m:1.69},
      {n:'Mintaka',ra:5.533,dec:-0.30,m:2.23},{n:'Saiph',ra:5.796,dec:-9.67,m:2.09},
      {n:'Rigel',ra:5.242,dec:-8.20,m:0.13},{n:'Meissa',ra:5.585,dec:9.93,m:3.39}
    ], lines:[[7,0],[7,1],[0,2],[1,4],[4,3],[3,2],[2,5],[5,6],[6,4]]
  },
  {
    name:'Aquila', common:'The Eagle', iau:'Aql', family:'equatorial', symbol:'✦', season:'Summer', hemisphere:'Equatorial',
    description:'A Milky Way constellation centered on Altair, another vertex of the Summer Triangle.',
    stars:[
      {n:'Altair',ra:19.846,dec:8.87,m:0.77},{n:'Tarazed',ra:19.771,dec:10.61,m:2.72},
      {n:'Alshain',ra:19.922,dec:6.41,m:3.71},{n:'Theta Aql',ra:20.188,dec:-0.82,m:3.24}
    ], lines:[[1,0],[0,2],[2,3]]
  },
  {
    name:'Canis Minor', common:'The Little Dog', iau:'CMi', family:'equatorial', symbol:'✦', season:'Winter', hemisphere:'Equatorial',
    description:'A small figure whose dominant star Procyon forms part of the Winter Triangle.',
    stars:[{n:'Procyon',ra:7.655,dec:5.23,m:0.38},{n:'Gomeisa',ra:7.453,dec:8.29,m:2.89}], lines:[[0,1]]
  },
  {
    name:'Delphinus', common:'The Dolphin', iau:'Del', family:'equatorial', symbol:'✦', season:'Summer', hemisphere:'Equatorial / Northern',
    description:'A tiny diamond-shaped constellation near Aquila, surprisingly distinctive under dark skies.',
    stars:[
      {n:'Rotanev',ra:20.625,dec:14.60,m:3.63},{n:'Sualocin',ra:20.660,dec:15.91,m:3.77},
      {n:'Gamma Del',ra:20.778,dec:16.12,m:3.87},{n:'Delta Del',ra:20.725,dec:15.07,m:4.43},
      {n:'Epsilon Del',ra:20.553,dec:11.30,m:4.03}
    ], lines:[[0,1],[1,2],[2,3],[3,0],[0,4]]
  },
  {
    name:'Canis Major', common:'The Great Dog', iau:'CMa', family:'southern', symbol:'✦', season:'Winter', hemisphere:'Southern / Equatorial',
    description:'Home to Sirius, the brightest star in the night sky.',
    stars:[
      {n:'Sirius',ra:6.752,dec:-16.72,m:-1.46},{n:'Adhara',ra:6.977,dec:-28.97,m:1.50},
      {n:'Wezen',ra:7.140,dec:-26.39,m:1.84},{n:'Mirzam',ra:6.378,dec:-17.96,m:1.98},
      {n:'Aludra',ra:7.402,dec:-29.30,m:2.45}
    ], lines:[[3,0],[0,2],[2,1],[2,4]]
  },
  {
    name:'Cetus', common:'The Sea Monster', iau:'Cet', family:'southern', symbol:'✦', season:'Autumn / Winter', hemisphere:'Equatorial / Southern',
    description:'A huge constellation in the watery part of the sky, including Menkar and the famous variable Mira.',
    stars:[
      {n:'Diphda',ra:0.726,dec:-17.99,m:2.04},{n:'Menkar',ra:3.038,dec:4.09,m:2.54},
      {n:'Kaffaljidhma',ra:2.721,dec:3.24,m:3.47},{n:'Mira',ra:2.322,dec:-2.98,m:3.0},
      {n:'Tau Cet',ra:1.734,dec:-15.94,m:3.50}
    ], lines:[[1,2],[2,3],[3,4],[4,0]]
  },
  {
    name:'Ophiuchus', common:'The Serpent Bearer', iau:'Oph', family:'equatorial', symbol:'⛎', season:'Summer', hemisphere:'Equatorial',
    description:'The Serpent Bearer lies on the ecliptic between Scorpius and Sagittarius. Astronomically the Sun passes through it, although it is not one of the twelve classical astrological zodiac signs.',
    stars:[
      {n:'Rasalhague',ra:17.582,dec:12.56,m:2.07},{n:'Cebalrai',ra:17.724,dec:4.57,m:2.76},
      {n:'Sabik',ra:17.173,dec:-15.72,m:2.43},{n:'Yed Prior',ra:16.239,dec:-3.69,m:2.73},
      {n:'Yed Posterior',ra:16.305,dec:-4.69,m:3.23},{n:'Marfik',ra:16.515,dec:1.98,m:3.82},
      {n:'Sinistra',ra:17.984,dec:-9.77,m:3.54}
    ], lines:[[0,1],[1,6],[6,2],[0,5],[5,4],[4,3],[5,2]]
  }
];

window.CONSTELLATIONS = CONSTELLATIONS;
