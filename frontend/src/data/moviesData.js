export const comingSoonMovies = [
  { id: 'cs-1', poster: '/imgs/s5.png', trailerUrl: 'https://youtu.be/nb_fFj_0rq8' },
  { id: 'cs-2', poster: '/imgs/s2.png', trailerUrl: 'https://youtu.be/YShVEXb7-ic' },
  { id: 'cs-3', poster: '/imgs/s1.png', trailerUrl: 'https://youtu.be/vAtUHeMQ1F8' },
  { id: 'cs-4', poster: '/imgs/s3.png', trailerUrl: 'https://youtu.be/Vsn7sVxCq1M' },
];

export const movies = [
  {
    slug: 'dark-knight',
    title: 'The Dark Knight',
    displayTitle: 'Batman: The Dark Knight',
    category: 'action',
    poster: '/imgs/dk.png',
    imdb: '9.0/10', // veya 6.8/10
    trailerUrl: 'https://youtu.be/EXeTwQWrcwY',
    watchUrl: 'https://watch.plex.tv/movie/the-dark-knight',
    description: `The Dark Knight is a 2008 superhero film directed by Christopher Nolan. It follows Batman as he works with police lieutenant James Gordon and district attorney Harvey Dent to dismantle organized crime in Gotham City. Their efforts are challenged by a new criminal mastermind known as the Joker, whose unpredictable and chaotic tactics threaten the city's stability and push Batman to his limits. The film blends action, suspense, and psychological tension, exploring themes of justice, morality, and the fine line between heroism and vigilantism.`,
    comments: [
      { user: "Bruce K.", text: "I'm BATMANNNN" },
      { user: "Andrea T.", text: "Bruce and Selina...My favourite couple❤️" },
      { user: "Marvin S.", text: "Amazing movie!" },
      { user: "Emilia C.", text: "My fav❤️" },
      { user: "Maxie maxie", text: "WHEN WİLL YOU LOAD THE OTHER MOVİESSS" },
      { user: "Sky B.", text: "Bruce is soooooo hot" },
      { user: "Hailey E.", text: "Guys, stop givin spoieess!!!" },
      { user: "Skylerr", text: "Switching to Gotham🚗🚗🚗🚗" },
      { user: "spongebobsquarepants", text: "2000's... You know the 2000's Patrick?" }
    ],
    cast: [
    { 
      name: "Christian Bale", 
      role: "Bruce Wayne / Batman", 
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "Heath Ledger", 
      role: "Joker", 
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "Gary Oldman", 
      role: "Jim Gordon", 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" 
    },
    { 
      name: "Michael Caine", 
      role: "Alfred", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" 
    }
  ],

  // 2. AÇILIR KAPANIR BİLGİ KUTULARI (trivia / faq)
  trivia: [
    {
      title: "🃏 Heath Ledger'ın Hazırlık Süreci",
      content: "Heath Ledger, Joker rolüne hazırlanmak için yaklaşık altı hafta boyunca bir otel odasına kapandı, karakterin günlüğünü tuttu ve ses tonu üzerinde çalıştı."
    },
    {
      title: "💥 Gerçek Hastane Patlaması",
      content: "Filmdeki hastane patlama sahnesi tamamen pratik efektlerle ve gerçek bir binanın kontrollü olarak patlatılmasıyla çekildi; CGI kullanılmadı."
    },
    {
      title: "🎥 IMAX Kameraları",
      content: "The Dark Knight, önemli aksiyon sekanslarında geleneksel 35mm kameralar yerine devasa 70mm IMAX kameraları kullanan ilk büyük Hollywood yapımıdır."
    }
  ]
  },
  {
    slug: 'fast-and-furious',
    title: 'Fast&Furious',
    category: 'action',
    poster: '/imgs/faf.png',
    imdb: '6.5/10',
    description: 'Brian O’Conner, back working for the FBI in LA, teams up with Dominic Toretto to bring down a heroin importer.',
    comments: []
  },
  {
    slug: 'tokyo-drift',
    title: 'Fast&Furious: Tokyo Drift',
    category: 'action',
    poster: '/imgs/faff.png',
    imdb: '6.0/10',
    description: 'A teenager becomes a major competitor in the world of drift racing after moving to Tokyo.',
    comments: []
  },
  {
    slug: 'avengers',
    title: 'The Avengers',
    category: 'action',
    poster: '/imgs/avengers.png',
    imdb: '8.0/10',
    description: 'Earth’s mightiest heroes must come together and learn to fight as a team to stop Loki and his alien army.',
    comments: []
  },
  {
    slug: 'mad-max',
    title: 'Mad Max: Fury Road',
    category: 'action',
    poster: '/imgs/mm.png',
    imdb: '8.1/10',
    description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.',
    comments: []
  },
  // Animation
  { slug: 'up', title: 'Up', category: 'animation', poster: '/imgs/up.png', imdb: '8.3/10', comments: [] },
  { slug: 'coraline', title: 'Coraline', category: 'animation', poster: '/imgs/coraline.png', imdb: '7.8/10', comments: [] },
  { slug: 'coco', title: 'Coco', category: 'animation', poster: '/imgs/coco.png', imdb: '8.4/10', comments: [] },
  { slug: 'corpse-bride', title: 'Corpse Bride', category: 'animation', poster: '/imgs/corpseb.png', imdb: '7.4/10', comments: [] },
  { slug: 'despicable-me', title: 'Despicable Me', category: 'animation', poster: '/imgs/ch.png', imdb: '7.6/10', comments: [] },
  // Sci-fi
  { slug: 'tenet', title: 'Tenet', category: 'scifi', poster: '/imgs/tenet.png', imdb: '7.3/10', comments: [] },
  { slug: 'lucy', title: 'Lucy', category: 'scifi', poster: '/imgs/lucy.png', imdb: '6.4/10', comments: [] },
  { slug: 'interstellar', title: 'Interstellar', category: 'scifi', poster: '/imgs/interstelllar.png', imdb: '8.7/10', comments: [] },
  { slug: 'inception', title: 'Inception', category: 'scifi', poster: '/imgs/inc.png', imdb: '8.8/10', comments: [] },
  { slug: 'matrix', title: 'Matrix', category: 'scifi', poster: '/imgs/matrix.png', imdb: '8.7/10', comments: [] },
  // Romantic
  { slug: 'me-before-you', title: 'Me before you', category: 'romantic', poster: '/imgs/mby.png', imdb: '7.4/10', comments: [] },
  { slug: 'notebook', title: 'The Notebook', category: 'romantic', poster: '/imgs/notebook.png', imdb: '7.8/10', comments: [] },
  { slug: 'one-day', title: 'One Day', category: 'romantic', poster: '/imgs/oneday.png', imdb: '7.0/10', comments: [] },
  { slug: '10-things', title: '10 Things', category: 'romantic', poster: '/imgs/tenth.png', imdb: '7.3/10', comments: [] },
  { slug: 'titanic', title: 'Titanic', category: 'romantic', poster: '/imgs/titanic.png', imdb: '7.9/10', comments: [] },
  // Horror
  { slug: 'elm-street', title: 'A Nightmare...', category: 'horror', poster: '/imgs/elm.png', imdb: '7.4/10', comments: [] },
  { slug: 'scream', title: 'Scream', category: 'horror', poster: '/imgs/scream.png', imdb: '7.4/10', comments: [] },
  { slug: 'weapons', title: 'Weapons', category: 'horror', poster: '/imgs/wp.png', imdb: '6.2/10', comments: [] },
  { slug: 'annabelle', title: 'Annabelle', category: 'horror', poster: '/imgs/anna.png', imdb: '5.9/10', comments: [] },
  { slug: 'it', title: 'IT', category: 'horror', poster: '/imgs/it.png', imdb: '7.3/10', comments: [] },
  // Comedy
  { slug: 'once-upon-a-time', title: 'Once upon a time...', category: 'comedy', poster: '/imgs/once.png', imdb: '7.6/10', comments: [] },
  { slug: 'deadpool', title: 'Deadpool', category: 'comedy', poster: '/imgs/dp.png', imdb: '8.0/10', comments: [] },
  { slug: 'home-alone', title: 'Home alone', category: 'comedy', poster: '/imgs/ha.png', imdb: '7.7/10', comments: [] },
  { slug: 'daddys-home', title: "Daddy's Home", category: 'comedy', poster: '/imgs/dadh.png', imdb: '6.2/10', comments: [] },
  { slug: 'home-alone-2', title: 'Home alone 2', category: 'comedy', poster: '/imgs/haa.png', imdb: '6.9/10', comments: [] },
];