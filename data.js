// =============================================
// PROMPTFORGE STUDIO v4.0 - BANCO DE DADOS GLOBAL
// 61 Nichos + 30 Estilos + Traduções PT/EN/ES
// ✅ Janeiro 2026
// =============================================

// ==================== CONFIGURAÇÃO ====================
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwdQRWNtAydhEjuGlBB_-p0jd3qWbl8FbjBVSvKFI15EnRDTLjIsENGHaSTD3mdVTPp/exec';

// ==================== NICHOS GLOBAIS (61) ====================
const NICHOS = [
    // === SPORTS & FITNESS (15) ===
    { 
        id: 'tennis', 
        icon: '🎾',
        name: { pt: 'Tênis', en: 'Tennis', es: 'Tenis' },
        keywords: 'tennis, racket, tennis ball, court, tennis player, grand slam, serve, volley',
        market: ['BR', 'US', 'EU']
    },
    { 
        id: 'soccer', 
        icon: '⚽',
        name: { pt: 'Futebol', en: 'Soccer', es: 'Fútbol' },
        keywords: 'football, soccer ball, goal, stadium, player, championship, kick',
        market: ['BR', 'US', 'EU', 'LATAM']
    },
    { 
        id: 'basketball', 
        icon: '🏀',
        name: { pt: 'Basquete', en: 'Basketball', es: 'Baloncesto' },
        keywords: 'basketball, hoop, court, dunk, NBA, player, ball',
        market: ['US', 'EU', 'BR']
    },
    { 
        id: 'surf', 
        icon: '🏄',
        name: { pt: 'Surf', en: 'Surf', es: 'Surf' },
        keywords: 'surfing, surfboard, wave, ocean, beach, surfer, barrel wave',
        market: ['BR', 'US', 'AU']
    },
    { 
        id: 'skate', 
        icon: '🛹',
        name: { pt: 'Skate', en: 'Skateboard', es: 'Skate' },
        keywords: 'skateboard, skating, tricks, street, urban, halfpipe, ollie',
        market: ['US', 'BR', 'EU']
    },
    { 
        id: 'fitness', 
        icon: '💪',
        name: { pt: 'Fitness', en: 'Fitness', es: 'Fitness' },
        keywords: 'gym, workout, weights, muscles, training, athlete, fitness',
        market: ['Global']
    },
    { 
        id: 'crossfit', 
        icon: '🏋️',
        name: { pt: 'CrossFit', en: 'CrossFit', es: 'CrossFit' },
        keywords: 'crossfit, wod, functional training, athlete, box, burpee',
        market: ['US', 'BR', 'EU']
    },
    { 
        id: 'yoga', 
        icon: '🧘',
        name: { pt: 'Yoga', en: 'Yoga', es: 'Yoga' },
        keywords: 'yoga, meditation, zen, mindfulness, wellness, balance, namaste',
        market: ['Global']
    },
    { 
        id: 'running', 
        icon: '🏃',
        name: { pt: 'Corrida', en: 'Running', es: 'Running' },
        keywords: 'running, marathon, runner, jogger, sprint, track, athlete',
        market: ['Global']
    },
    { 
        id: 'cycling', 
        icon: '🚴',
        name: { pt: 'Ciclismo', en: 'Cycling', es: 'Ciclismo' },
        keywords: 'cycling, bicycle, bike, rider, road bike, mountain bike',
        market: ['EU', 'US', 'BR']
    },
    { 
        id: 'hiking', 
        icon: '🥾',
        name: { pt: 'Trilha', en: 'Hiking', es: 'Senderismo' },
        keywords: 'hiking, trail, mountain, trekking, outdoor, nature walk',
        market: ['US', 'EU', 'BR']
    },
    { 
        id: 'climbing', 
        icon: '🧗',
        name: { pt: 'Escalada', en: 'Climbing', es: 'Escalada' },
        keywords: 'rock climbing, climber, mountain climbing, bouldering, rope',
        market: ['US', 'EU']
    },
    { 
        id: 'boxing', 
        icon: '🥊',
        name: { pt: 'Boxe', en: 'Boxing', es: 'Boxeo' },
        keywords: 'boxing, fighter, gloves, ring, punch, knockout, training',
        market: ['US', 'BR', 'EU']
    },
    { 
        id: 'mma', 
        icon: '🥋',
        name: { pt: 'MMA', en: 'MMA', es: 'MMA' },
        keywords: 'mma, martial arts, ufc, fighter, octagon, combat sports',
        market: ['US', 'BR', 'Global']
    },
    { 
        id: 'golf', 
        icon: '⛳',
        name: { pt: 'Golfe', en: 'Golf', es: 'Golf' },
        keywords: 'golf, golfer, course, club, hole in one, swing, putter',
        market: ['US', 'EU']
    },
    
    // === LIFESTYLE & HOBBIES (16) ===
    { 
        id: 'coffee', 
        icon: '☕',
        name: { pt: 'Café', en: 'Coffee', es: 'Café' },
        keywords: 'coffee, espresso, beans, cafe, barista, cup, latte art',
        market: ['Global']
    },
    { 
        id: 'beer', 
        icon: '🍺',
        name: { pt: 'Cerveja', en: 'Beer', es: 'Cerveza' },
        keywords: 'beer, craft beer, brewery, hops, pub, cheers, pint glass',
        market: ['Global']
    },
    { 
        id: 'wine', 
        icon: '🍷',
        name: { pt: 'Vinho', en: 'Wine', es: 'Vino' },
        keywords: 'wine, vineyard, sommelier, wine glass, tasting, red wine',
        market: ['EU', 'US', 'BR']
    },
    { 
        id: 'bbq', 
        icon: '🥩',
        name: { pt: 'Churrasco', en: 'BBQ', es: 'Asado' },
        keywords: 'barbecue, grill, meat, steak, fire, cooking, smoke, ribs',
        market: ['BR', 'US', 'LATAM']
    },
    { 
        id: 'food', 
        icon: '🍕',
        name: { pt: 'Gastronomia', en: 'Food', es: 'Gastronomía' },
        keywords: 'food, cooking, chef, cuisine, gourmet, restaurant, delicious',
        market: ['Global']
    },
    { 
        id: 'travel', 
        icon: '✈️',
        name: { pt: 'Viagem', en: 'Travel', es: 'Viajes' },
        keywords: 'travel, adventure, wanderlust, explore, destination, passport',
        market: ['Global']
    },
    { 
        id: 'camping', 
        icon: '⛺',
        name: { pt: 'Camping', en: 'Camping', es: 'Camping' },
        keywords: 'camping, tent, outdoor, campfire, nature, wilderness',
        market: ['US', 'EU', 'BR']
    },
    { 
        id: 'fishing', 
        icon: '🎣',
        name: { pt: 'Pesca', en: 'Fishing', es: 'Pesca' },
        keywords: 'fishing, fish, rod, lake, river, angler, bass, catch',
        market: ['US', 'BR']
    },
    { 
        id: 'hunting', 
        icon: '🦌',
        name: { pt: 'Caça', en: 'Hunting', es: 'Caza' },
        keywords: 'hunting, hunter, deer, outdoor, rifle, wildlife, forest',
        market: ['US', 'BR']
    },
    { 
        id: 'photography', 
        icon: '📷',
        name: { pt: 'Fotografia', en: 'Photography', es: 'Fotografía' },
        keywords: 'photography, camera, photographer, lens, photo, capture',
        market: ['Global']
    },
    { 
        id: 'books', 
        icon: '📚',
        name: { pt: 'Livros', en: 'Books', es: 'Libros' },
        keywords: 'books, reading, literature, library, writer, novel, bookworm',
        market: ['Global']
    },
    { 
        id: 'music', 
        icon: '🎸',
        name: { pt: 'Música', en: 'Music', es: 'Música' },
        keywords: 'guitar, music, rock, concert, band, musician, vinyl record',
        market: ['Global']
    },
    { 
        id: 'vinyl', 
        icon: '💿',
        name: { pt: 'Vinil', en: 'Vinyl', es: 'Vinilo' },
        keywords: 'vinyl, record, turntable, music collector, vintage, retro',
        market: ['US', 'EU', 'BR']
    },
    { 
        id: 'dj', 
        icon: '🎧',
        name: { pt: 'DJ', en: 'DJ', es: 'DJ' },
        keywords: 'dj, music, turntables, mixer, club, electronic music, edm',
        market: ['Global']
    },
    { 
        id: 'tattoo', 
        icon: '🖋️',
        name: { pt: 'Tattoo', en: 'Tattoo', es: 'Tatuaje' },
        keywords: 'tattoo, ink, tattoo artist, body art, design, tattooed',
        market: ['Global']
    },
    { 
        id: 'art', 
        icon: '🎨',
        name: { pt: 'Arte', en: 'Art', es: 'Arte' },
        keywords: 'art, artist, painting, creativity, canvas, brush, gallery',
        market: ['Global']
    },
    
    // === ANIMALS & PETS (5) ===
    { 
        id: 'pets', 
        icon: '🐕',
        name: { pt: 'Cachorros', en: 'Dogs', es: 'Perros' },
        keywords: 'dog, puppy, pet, cute animal, loyal companion, paw print',
        market: ['Global']
    },
    { 
        id: 'cats', 
        icon: '🐱',
        name: { pt: 'Gatos', en: 'Cats', es: 'Gatos' },
        keywords: 'cat, kitten, feline, cute cat, whiskers, meow, cat lover',
        market: ['Global']
    },
    { 
        id: 'horses', 
        icon: '🐴',
        name: { pt: 'Cavalos', en: 'Horses', es: 'Caballos' },
        keywords: 'horse, equestrian, riding, stallion, ranch, cowboy',
        market: ['US', 'BR', 'EU']
    },
    { 
        id: 'birds', 
        icon: '🦜',
        name: { pt: 'Pássaros', en: 'Birds', es: 'Pájaros' },
        keywords: 'bird, parrot, eagle, feather, flying, birdwatching',
        market: ['Global']
    },
    { 
        id: 'wildlife', 
        icon: '🦁',
        name: { pt: 'Vida Selvagem', en: 'Wildlife', es: 'Vida Salvaje' },
        keywords: 'wildlife, wild animals, safari, nature, conservation, lion, bear',
        market: ['Global']
    },
    
    // === VEHICLES (3) ===
    { 
        id: 'cars', 
        icon: '🏎️',
        name: { pt: 'Carros', en: 'Cars', es: 'Autos' },
        keywords: 'car, automobile, racing, sports car, engine, speed, horsepower',
        market: ['Global']
    },
    { 
        id: 'motos', 
        icon: '🏍️',
        name: { pt: 'Motos', en: 'Motorcycles', es: 'Motos' },
        keywords: 'motorcycle, biker, chopper, racing bike, rider, harley',
        market: ['Global']
    },
    { 
        id: 'trucks', 
        icon: '🚚',
        name: { pt: 'Caminhões', en: 'Trucks', es: 'Camiones' },
        keywords: 'truck, pickup, off-road, diesel, trucker, heavy duty',
        market: ['US', 'BR']
    },
    
    // === TECH & GAMING (4) ===
    { 
        id: 'gaming', 
        icon: '🎮',
        name: { pt: 'Games', en: 'Gaming', es: 'Videojuegos' },
        keywords: 'video game, controller, gamer, esports, console, arcade',
        market: ['Global']
    },
    { 
        id: 'tech', 
        icon: '💻',
        name: { pt: 'Tech', en: 'Tech', es: 'Tecnología' },
        keywords: 'technology, coding, computer, digital, innovation, programming',
        market: ['Global']
    },
    { 
        id: 'crypto', 
        icon: '₿',
        name: { pt: 'Crypto', en: 'Crypto', es: 'Cripto' },
        keywords: 'cryptocurrency, bitcoin, blockchain, crypto, trading, digital currency',
        market: ['Global']
    },
    { 
        id: 'ai', 
        icon: '🤖',
        name: { pt: 'Inteligência Artificial', en: 'AI', es: 'IA' },
        keywords: 'artificial intelligence, ai, robot, machine learning, technology, future',
        market: ['Global']
    },
    
    // === NATURE (2) ===
    { 
        id: 'nature', 
        icon: '🌿',
        name: { pt: 'Natureza', en: 'Nature', es: 'Naturaleza' },
        keywords: 'nature, mountains, forest, outdoor, wilderness, hiking',
        market: ['Global']
    },
    { 
        id: 'beach', 
        icon: '🏖️',
        name: { pt: 'Praia', en: 'Beach', es: 'Playa' },
        keywords: 'beach, ocean, sand, sun, summer, tropical, paradise',
        market: ['Global']
    },
    
    // === PROFESSIONS (com submenu) ===
    { 
        id: 'jobs', 
        icon: '💼',
        name: { pt: 'Profissões', en: 'Professions', es: 'Profesiones' },
        keywords: 'profession, work, career, occupation, professional, job',
        hasSubmenu: true, 
        submenuType: 'profissoes',
        market: ['Global']
    },
    
    // === ZODIAC (com submenu) ===
    { 
        id: 'zodiac', 
        icon: '♌',
        name: { pt: 'Signos', en: 'Zodiac', es: 'Signos' },
        keywords: 'zodiac, astrology, horoscope, constellation, stars, celestial',
        hasSubmenu: true, 
        submenuType: 'signos',
        market: ['Global']
    },
    
    // === SPIRITUAL & RELIGIOUS (3) ===
    { 
        id: 'gospel', 
        icon: '✝️',
        name: { pt: 'Gospel', en: 'Christian', es: 'Cristiano' },
        keywords: 'christian, faith, cross, jesus, spiritual, bible, religious, god',
        market: ['BR', 'US', 'LATAM']
    },
    { 
        id: 'meditation', 
        icon: '🕉️',
        name: { pt: 'Meditação', en: 'Meditation', es: 'Meditación' },
        keywords: 'meditation, mindfulness, zen, spiritual, peace, inner calm',
        market: ['Global']
    },
    { 
        id: 'witchcraft', 
        icon: '🔮',
        name: { pt: 'Bruxaria', en: 'Witchcraft', es: 'Brujería' },
        keywords: 'witchcraft, witch, magic, mystical, crystal, tarot, spell',
        market: ['US', 'EU', 'BR']
    },
    
    // === MOM/DAD (2) ===
    { 
        id: 'mom', 
        icon: '👩‍👧',
        name: { pt: 'Mãe', en: 'Mom', es: 'Mamá' },
        keywords: 'mom, mother, motherhood, mama, mommy, family, love',
        market: ['Global']
    },
    { 
        id: 'dad', 
        icon: '👨‍👦',
        name: { pt: 'Pai', en: 'Dad', es: 'Papá' },
        keywords: 'dad, father, fatherhood, papa, daddy, family, love',
        market: ['Global']
    },
    
    // === TEACHERS (1) ===
    { 
        id: 'teachers', 
        icon: '👩‍🏫',
        name: { pt: 'Professores', en: 'Teachers', es: 'Profesores' },
        keywords: 'teacher, education, school, classroom, educator, teaching',
        market: ['Global']
    },
    
    // === NURSE (1) ===
    { 
        id: 'nurses', 
        icon: '👩‍⚕️',
        name: { pt: 'Enfermagem', en: 'Nursing', es: 'Enfermería' },
        keywords: 'nurse, nursing, healthcare, hospital, medical, care',
        market: ['Global']
    },
    
    // === CUSTOM ===
    { 
        id: 'custom', 
        icon: '✨',
        name: { pt: 'Personalizado', en: 'Custom', es: 'Personalizado' },
        keywords: '',
        market: ['Global']
    }
];

// ==================== SUBMENUS ====================
const PROFISSOES = [
    { id: 'jobs_medico', name: { pt: 'Médico', en: 'Doctor', es: 'Médico' }, icon: '👨‍⚕️' },
    { id: 'jobs_enfermeiro', name: { pt: 'Enfermeiro', en: 'Nurse', es: 'Enfermero' }, icon: '👩‍⚕️' },
    { id: 'jobs_dentista', name: { pt: 'Dentista', en: 'Dentist', es: 'Dentista' }, icon: '🦷' },
    { id: 'jobs_chef', name: { pt: 'Chef', en: 'Chef', es: 'Chef' }, icon: '👨‍🍳' },
    { id: 'jobs_engenheiro', name: { pt: 'Engenheiro', en: 'Engineer', es: 'Ingeniero' }, icon: '👷' },
    { id: 'jobs_professor', name: { pt: 'Professor', en: 'Teacher', es: 'Profesor' }, icon: '👨‍🏫' },
    { id: 'jobs_advogado', name: { pt: 'Advogado', en: 'Lawyer', es: 'Abogado' }, icon: '👩‍⚖️' },
    { id: 'jobs_bombeiro', name: { pt: 'Bombeiro', en: 'Firefighter', es: 'Bombero' }, icon: '👨‍🚒' },
    { id: 'jobs_policial', name: { pt: 'Policial', en: 'Police Officer', es: 'Policía' }, icon: '👮' },
    { id: 'jobs_piloto', name: { pt: 'Piloto', en: 'Pilot', es: 'Piloto' }, icon: '🧑‍✈️' },
    { id: 'jobs_programador', name: { pt: 'Programador', en: 'Programmer', es: 'Programador' }, icon: '👨‍💻' },
    { id: 'jobs_barbeiro', name: { pt: 'Barbeiro', en: 'Barber', es: 'Barbero' }, icon: '💇' },
    { id: 'jobs_mecanico', name: { pt: 'Mecânico', en: 'Mechanic', es: 'Mecánico' }, icon: '👨‍🔧' },
    { id: 'jobs_caminhoneiro', name: { pt: 'Caminhoneiro', en: 'Truck Driver', es: 'Camionero' }, icon: '🚚' },
    { id: 'jobs_contador', name: { pt: 'Contador', en: 'Accountant', es: 'Contador' }, icon: '📊' },
    { id: 'jobs_agricultor', name: { pt: 'Agricultor', en: 'Farmer', es: 'Agricultor' }, icon: '🧑‍🌾' }
];

const SIGNOS = [
    { id: 'zodiac_aries', name: { pt: 'Áries', en: 'Aries', es: 'Aries' }, icon: '♈' },
    { id: 'zodiac_touro', name: { pt: 'Touro', en: 'Taurus', es: 'Tauro' }, icon: '♉' },
    { id: 'zodiac_gemeos', name: { pt: 'Gêmeos', en: 'Gemini', es: 'Géminis' }, icon: '♊' },
    { id: 'zodiac_cancer', name: { pt: 'Câncer', en: 'Cancer', es: 'Cáncer' }, icon: '♋' },
    { id: 'zodiac_leao', name: { pt: 'Leão', en: 'Leo', es: 'Leo' }, icon: '♌' },
    { id: 'zodiac_virgem', name: { pt: 'Virgem', en: 'Virgo', es: 'Virgo' }, icon: '♍' },
    { id: 'zodiac_libra', name: { pt: 'Libra', en: 'Libra', es: 'Libra' }, icon: '♎' },
    { id: 'zodiac_escorpiao', name: { pt: 'Escorpião', en: 'Scorpio', es: 'Escorpio' }, icon: '♏' },
    { id: 'zodiac_sagitario', name: { pt: 'Sagitário', en: 'Sagittarius', es: 'Sagitario' }, icon: '♐' },
    { id: 'zodiac_capricornio', name: { pt: 'Capricórnio', en: 'Capricorn', es: 'Capricornio' }, icon: '♑' },
    { id: 'zodiac_aquario', name: { pt: 'Aquário', en: 'Aquarius', es: 'Acuario' }, icon: '♒' },
    { id: 'zodiac_peixes', name: { pt: 'Peixes', en: 'Pisces', es: 'Piscis' }, icon: '♓' }
];

// ==================== CATEGORIAS ====================
const CATEGORIAS = [
    { id: 'acao', name: { pt: 'Ação', en: 'Action', es: 'Acción' }, icon: '🎬' },
    { id: 'equipamento', name: { pt: 'Equipamento', en: 'Equipment', es: 'Equipo' }, icon: '🛠️' },
    { id: 'humor', name: { pt: 'Humor', en: 'Humor', es: 'Humor' }, icon: '😂' },
    { id: 'icones', name: { pt: 'Ícones', en: 'Icons', es: 'Íconos' }, icon: '⭐' },
    { id: 'frases', name: { pt: 'Frases', en: 'Phrases', es: 'Frases' }, icon: '💬' },
    { id: 'arte', name: { pt: 'Arte', en: 'Art', es: 'Arte' }, icon: '🎨' }
];

// ==================== PALETAS DE CORES ====================
const PALETAS = [
    { 
        id: 'vibrant', 
        name: { pt: 'Vibrante', en: 'Vibrant', es: 'Vibrante' },
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'], 
        keywords: 'vibrant bold saturated colors, high contrast, eye-catching bright tones, vivid palette'
    },
    { 
        id: 'pastel', 
        name: { pt: 'Pastel', en: 'Pastel', es: 'Pastel' },
        colors: ['#FFB5E8', '#B5DEFF', '#BFFCC6'], 
        keywords: 'soft pastel colors, gentle muted tones, light and airy palette, delicate hues'
    },
    { 
        id: 'bw', 
        name: { pt: 'P&B', en: 'B&W', es: 'B&N' },
        colors: ['#000000', '#666666', '#FFFFFF'], 
        keywords: 'black and white only, monochromatic, high contrast grayscale, no colors'
    },
    { 
        id: 'neon', 
        name: { pt: 'Neon', en: 'Neon', es: 'Neón' },
        colors: ['#FF00FF', '#00FFFF', '#39FF14'], 
        keywords: 'neon glowing colors, electric bright fluorescent tones, cyberpunk palette, radioactive glow'
    },
    { 
        id: 'earth', 
        name: { pt: 'Terroso', en: 'Earthy', es: 'Terroso' },
        colors: ['#8B4513', '#D2691E', '#F5DEB3'], 
        keywords: 'earthy natural tones, warm browns and beiges, organic color palette, terracotta ochre'
    },
    { 
        id: 'ocean', 
        name: { pt: 'Oceano', en: 'Ocean', es: 'Océano' },
        colors: ['#006994', '#40E0D0', '#E0FFFF'], 
        keywords: 'ocean inspired colors, blues and teals, aquatic sea palette, deep water tones'
    },
    { 
        id: 'sunset', 
        name: { pt: 'Pôr do Sol', en: 'Sunset', es: 'Atardecer' },
        colors: ['#FF6B35', '#F7931E', '#FDC830'], 
        keywords: 'sunset warm colors, orange pink purple, golden hour, dusk palette'
    },
    { 
        id: 'forest', 
        name: { pt: 'Floresta', en: 'Forest', es: 'Bosque' },
        colors: ['#2D5016', '#6A994E', '#A7C957'], 
        keywords: 'forest green tones, nature inspired, woodland colors, moss and leaves'
    },
    { 
        id: 'auto', 
        name: { pt: 'IA Decide', en: 'AI Decides', es: 'IA Decide' },
        colors: ['#00f260', '#0575e6', '#f857a6'], 
        keywords: ''
    }
];

// ==================== ESTILOS VISUAIS (30) ====================
const ESTILOS = [
    // === EM DESTAQUE (Top sellers) ===
    {
        id: 'editorial',
        name: { pt: 'Editorial Artístico', en: 'Artistic Editorial', es: 'Editorial Artístico' },
        group: { pt: 'Em Destaque', en: 'Featured', es: 'Destacados' },
        emoji: '🎨',
        description: { 
            pt: 'Minimalista com pinceladas texturizadas, figuras sem rosto, cores vibrantes.',
            en: 'Minimalist with textured brushstrokes, faceless figures, vibrant colors.',
            es: 'Minimalista con pinceladas texturizadas, figuras sin rostro, colores vibrantes.'
        },
        promptBase: 'flat minimalist illustration, artistic editorial style, faceless figures with simple geometric body shapes, thick textured painterly brushstrokes, clean graphic design composition'
    },
    {
        id: 'watercolor',
        name: { pt: 'Aquarela', en: 'Watercolor', es: 'Acuarela' },
        group: { pt: 'Em Destaque', en: 'Featured', es: 'Destacados' },
        emoji: '💧',
        description: { 
            pt: 'Pintura aquarela delicada com cores fluidas e bordas suaves.',
            en: 'Delicate watercolor painting with fluid colors and soft edges.',
            es: 'Pintura acuarela delicada con colores fluidos y bordes suaves.'
        },
        promptBase: 'beautiful watercolor painting illustration, soft delicate brushstrokes, paint bleeding effects, artistic color blending, wet on wet technique'
    },
    {
        id: 'minimalist',
        name: { pt: 'Minimalista', en: 'Minimalist', es: 'Minimalista' },
        group: { pt: 'Mais Populares', en: 'Most Popular', es: 'Más Populares' },
        emoji: '◻️',
        description: { 
            pt: 'Linhas finas, formas simples, uso inteligente de espaço negativo.',
            en: 'Thin lines, simple shapes, clever use of negative space.',
            es: 'Líneas finas, formas simples, uso inteligente del espacio negativo.'
        },
        promptBase: 'minimalist geometric graphic design, clean line art illustration, clever use of negative space, thin precise elegant strokes'
    },
    {
        id: 'typography',
        name: { pt: 'Tipografia Bold', en: 'Bold Typography', es: 'Tipografía Bold' },
        group: { pt: 'Mais Populares', en: 'Most Popular', es: 'Más Populares' },
        emoji: '✏️',
        description: { 
            pt: 'Foco em lettering criativo e frases impactantes.',
            en: 'Focus on creative lettering and impactful phrases.',
            es: 'Enfoque en lettering creativo y frases impactantes.'
        },
        promptBase: 'bold typography design, creative lettering layout, dynamic text composition with varying font sizes and weights'
    },
    {
        id: 'vintage',
        name: { pt: 'Vintage Retrô', en: 'Vintage Retro', es: 'Vintage Retro' },
        group: { pt: 'Mais Populares', en: 'Most Popular', es: 'Más Populares' },
        emoji: '📼',
        description: { 
            pt: 'Nostalgia anos 70-90, cores quentes, texturas envelhecidas.',
            en: 'Nostalgic 70s-90s, warm colors, aged textures.',
            es: 'Nostalgia años 70-90, colores cálidos, texturas envejecidas.'
        },
        promptBase: 'retro vintage style graphic, nostalgic 70s 80s 90s aesthetic, warm sepia and faded colors, distressed aged texture'
    },
    {
        id: 'streetwear',
        name: { pt: 'Streetwear Urbano', en: 'Urban Streetwear', es: 'Streetwear Urbano' },
        group: { pt: 'Mais Populares', en: 'Most Popular', es: 'Más Populares' },
        emoji: '🛹',
        description: { 
            pt: 'Graffiti, edgy, agressivo. Hip hop e skate culture.',
            en: 'Graffiti, edgy, aggressive. Hip hop and skate culture.',
            es: 'Graffiti, atrevido, agresivo. Hip hop y cultura skate.'
        },
        promptBase: 'streetwear urban graphic design, street art graffiti style, dripping paint effects, bold aggressive composition'
    },
    
    // === CULTURA POP ===
    {
        id: 'anime',
        name: { pt: 'Anime / Mangá', en: 'Anime / Manga', es: 'Anime / Manga' },
        group: { pt: 'Cultura Pop', en: 'Pop Culture', es: 'Cultura Pop' },
        emoji: '🎌',
        description: { 
            pt: 'Estética japonesa, personagens expressivos.',
            en: 'Japanese aesthetic, expressive characters.',
            es: 'Estética japonesa, personajes expresivos.'
        },
        promptBase: 'anime manga style graphic illustration, expressive anime character design, Japanese manga visual effects, speed lines'
    },
    {
        id: 'pixel',
        name: { pt: 'Pixel Art', en: 'Pixel Art', es: 'Pixel Art' },
        group: { pt: 'Cultura Pop', en: 'Pop Culture', es: 'Cultura Pop' },
        emoji: '🎮',
        description: { 
            pt: '8-bit, arcade nostálgico. Público gamer.',
            en: '8-bit, nostalgic arcade. Gamer audience.',
            es: '8-bit, arcade nostálgico. Público gamer.'
        },
        promptBase: 'retro pixel art style graphic, 8-bit video game aesthetic, pixelated characters, classic arcade game look'
    },
    {
        id: 'meme',
        name: { pt: 'Meme / Humor', en: 'Meme / Humor', es: 'Meme / Humor' },
        group: { pt: 'Cultura Pop', en: 'Pop Culture', es: 'Cultura Pop' },
        emoji: '😂',
        description: { 
            pt: 'Cultura de internet, formatos virais.',
            en: 'Internet culture, viral formats.',
            es: 'Cultura de internet, formatos virales.'
        },
        promptBase: 'modern internet meme style graphic, viral humor aesthetic, simple clean design, relatable humor'
    },
    {
        id: 'comic',
        name: { pt: 'HQ / Comics', en: 'Comic Book', es: 'Cómic' },
        group: { pt: 'Cultura Pop', en: 'Pop Culture', es: 'Cultura Pop' },
        emoji: '💥',
        description: { 
            pt: 'Estilo quadrinhos americanos, balões de fala, onomatopeias.',
            en: 'American comic book style, speech bubbles, onomatopoeia.',
            es: 'Estilo cómic americano, bocadillos, onomatopeyas.'
        },
        promptBase: 'comic book style illustration, pop art dots, bold outlines, dynamic action lines, BAM POW text effects'
    },
    
    // === ARTÍSTICOS ===
    {
        id: 'psychedelic',
        name: { pt: 'Psicodélico', en: 'Psychedelic', es: 'Psicodélico' },
        group: { pt: 'Artísticos', en: 'Artistic', es: 'Artísticos' },
        emoji: '🌀',
        description: { 
            pt: 'Surreal, trippy, colagens impossíveis.',
            en: 'Surreal, trippy, impossible collages.',
            es: 'Surreal, trippy, collages imposibles.'
        },
        promptBase: 'psychedelic surreal graphic design, trippy abstract interpretation, impossible geometry and optical illusions'
    },
    {
        id: 'diagram',
        name: { pt: 'Diagrama Técnico', en: 'Technical Diagram', es: 'Diagrama Técnico' },
        group: { pt: 'Artísticos', en: 'Artistic', es: 'Artísticos' },
        emoji: '📐',
        description: { 
            pt: 'Blueprint, patente falsa, specs de engenharia.',
            en: 'Blueprint, fake patent, engineering specs.',
            es: 'Blueprint, patente falsa, especificaciones de ingeniería.'
        },
        promptBase: 'technical blueprint diagram style, engineering schematic, fake patent drawing with measurements and annotations'
    },
    {
        id: 'neon',
        name: { pt: 'Neon Glow', en: 'Neon Glow', es: 'Neón Brillante' },
        group: { pt: 'Artísticos', en: 'Artistic', es: 'Artísticos' },
        emoji: '💡',
        description: { 
            pt: 'Luzes neon brilhantes, cyberpunk vibes.',
            en: 'Bright neon lights, cyberpunk vibes.',
            es: 'Luces neón brillantes, vibras cyberpunk.'
        },
        promptBase: 'neon glow graphic design, bright neon tubes effect, cyberpunk aesthetic, night city vibes, glowing light effects'
    },
    {
        id: 'abstract',
        name: { pt: 'Abstrato', en: 'Abstract', es: 'Abstracto' },
        group: { pt: 'Artísticos', en: 'Artistic', es: 'Artísticos' },
        emoji: '🎭',
        description: { 
            pt: 'Formas abstratas, cores vibrantes, composição fluida.',
            en: 'Abstract shapes, vibrant colors, fluid composition.',
            es: 'Formas abstractas, colores vibrantes, composición fluida.'
        },
        promptBase: 'abstract modern art style, fluid organic shapes, dynamic color composition, contemporary abstract design'
    },
    {
        id: 'grunge',
        name: { pt: 'Grunge', en: 'Grunge', es: 'Grunge' },
        group: { pt: 'Artísticos', en: 'Artistic', es: 'Artísticos' },
        emoji: '🎸',
        description: { 
            pt: 'Textura suja, desgastada, rock alternativo.',
            en: 'Dirty texture, worn, alternative rock.',
            es: 'Textura sucia, desgastada, rock alternativo.'
        },
        promptBase: 'grunge style design, distressed texture, rough edges, alternative rock aesthetic, worn and weathered look'
    },
    
    // === CLÁSSICOS ===
    {
        id: 'realistic',
        name: { pt: 'Realista', en: 'Realistic', es: 'Realista' },
        group: { pt: 'Clássicos', en: 'Classic', es: 'Clásicos' },
        emoji: '📸',
        description: { 
            pt: 'Ultra-realista, fotográfico, detalhes precisos.',
            en: 'Ultra-realistic, photographic, precise details.',
            es: 'Ultra-realista, fotográfico, detalles precisos.'
        },
        promptBase: 'photorealistic illustration, highly detailed, professional photography quality, sharp focus, realistic textures'
    },
    {
        id: 'sketch',
        name: { pt: 'Sketch / Rascunho', en: 'Sketch', es: 'Boceto' },
        group: { pt: 'Clássicos', en: 'Classic', es: 'Clásicos' },
        emoji: '✏️',
        description: { 
            pt: 'Desenho à mão, traços soltos, estilo rascunho.',
            en: 'Hand-drawn, loose strokes, sketch style.',
            es: 'Dibujado a mano, trazos sueltos, estilo boceto.'
        },
        promptBase: 'hand drawn sketch style, pencil drawing, loose expressive linework, artistic sketch aesthetic'
    },
    {
        id: 'line_art',
        name: { pt: 'Line Art', en: 'Line Art', es: 'Line Art' },
        group: { pt: 'Clássicos', en: 'Classic', es: 'Clásicos' },
        emoji: '🖊️',
        description: { 
            pt: 'Apenas contornos, sem preenchimento, elegante.',
            en: 'Outlines only, no fill, elegant.',
            es: 'Solo contornos, sin relleno, elegante.'
        },
        promptBase: 'clean line art illustration, continuous line drawing, single weight outlines, no shading or fill'
    },
    {
        id: 'silhouette',
        name: { pt: 'Silhueta', en: 'Silhouette', es: 'Silueta' },
        group: { pt: 'Clássicos', en: 'Classic', es: 'Clásicos' },
        emoji: '🌑',
        description: { 
            pt: 'Apenas contorno preenchido, sem detalhes internos.',
            en: 'Filled outline only, no internal details.',
            es: 'Solo contorno relleno, sin detalles internos.'
        },
        promptBase: 'bold silhouette design, solid black shape, no internal details, strong recognizable outline'
    },
    
    // === VINTAGE & RETRÔ ===
    {
        id: 'art_deco',
        name: { pt: 'Art Deco', en: 'Art Deco', es: 'Art Déco' },
        group: { pt: 'Vintage', en: 'Vintage', es: 'Vintage' },
        emoji: '🏛️',
        description: { 
            pt: 'Elegância anos 20-30, geometria, luxo.',
            en: 'Elegant 1920s-30s, geometry, luxury.',
            es: 'Elegancia años 20-30, geometría, lujo.'
        },
        promptBase: 'art deco style design, 1920s geometric patterns, elegant vintage aesthetic, gold accents, luxurious composition'
    },
    {
        id: 'pin_up',
        name: { pt: 'Pin-up', en: 'Pin-up', es: 'Pin-up' },
        group: { pt: 'Vintage', en: 'Vintage', es: 'Vintage' },
        emoji: '💃',
        description: { 
            pt: 'Estilo anos 40-50, ilustração clássica americana.',
            en: '1940s-50s style, classic American illustration.',
            es: 'Estilo años 40-50, ilustración clásica americana.'
        },
        promptBase: 'vintage pin-up style illustration, 1940s 1950s american retro art, classic poster aesthetic'
    },
    {
        id: 'propaganda',
        name: { pt: 'Propaganda Vintage', en: 'Vintage Propaganda', es: 'Propaganda Vintage' },
        group: { pt: 'Vintage', en: 'Vintage', es: 'Vintage' },
        emoji: '📢',
        description: { 
            pt: 'Cartazes de propaganda retrô, patriótico.',
            en: 'Retro propaganda posters, patriotic.',
            es: 'Carteles de propaganda retro, patriótico.'
        },
        promptBase: 'vintage propaganda poster style, retro patriotic design, bold typography, 1940s war poster aesthetic'
    },
    
    // === MODERNOS ===
    {
        id: 'geometric',
        name: { pt: 'Geométrico', en: 'Geometric', es: 'Geométrico' },
        group: { pt: 'Modernos', en: 'Modern', es: 'Modernos' },
        emoji: '🔷',
        description: { 
            pt: 'Formas geométricas puras, design matemático.',
            en: 'Pure geometric shapes, mathematical design.',
            es: 'Formas geométricas puras, diseño matemático.'
        },
        promptBase: 'geometric abstract design, mathematical precision, clean shapes, modern geometric composition'
    },
    {
        id: 'gradient',
        name: { pt: 'Gradiente', en: 'Gradient', es: 'Gradiente' },
        group: { pt: 'Modernos', en: 'Modern', es: 'Modernos' },
        emoji: '🌈',
        description: { 
            pt: 'Degradês suaves, cores que fluem, moderno.',
            en: 'Smooth gradients, flowing colors, modern.',
            es: 'Degradados suaves, colores que fluyen, moderno.'
        },
        promptBase: 'smooth gradient design, blended colors, fluid transitions, modern color flow aesthetic'
    },
    {
        id: 'isometric',
        name: { pt: 'Isométrico', en: 'Isometric', es: 'Isométrico' },
        group: { pt: 'Modernos', en: 'Modern', es: 'Modernos' },
        emoji: '🎲',
        description: { 
            pt: 'Perspectiva 3D isométrica, design técnico.',
            en: '3D isometric perspective, technical design.',
            es: 'Perspectiva 3D isométrica, diseño técnico.'
        },
        promptBase: 'isometric 3D illustration, technical perspective, architectural style, geometric depth'
    },
    {
        id: 'flat',
        name: { pt: 'Flat Design', en: 'Flat Design', es: 'Diseño Plano' },
        group: { pt: 'Modernos', en: 'Modern', es: 'Modernos' },
        emoji: '🎨',
        description: { 
            pt: 'Design plano, sem sombras, cores sólidas.',
            en: 'Flat design, no shadows, solid colors.',
            es: 'Diseño plano, sin sombras, colores sólidos.'
        },
        promptBase: 'flat design illustration, no gradients or shadows, solid colors, simple clean shapes'
    },
    
    // === ESPECIAIS ===
    {
        id: 'sticker',
        name: { pt: 'Sticker', en: 'Sticker', es: 'Sticker' },
        group: { pt: 'Especiais', en: 'Special', es: 'Especiales' },
        emoji: '🏷️',
        description: { 
            pt: 'Estilo adesivo, borda branca, colorido.',
            en: 'Sticker style, white border, colorful.',
            es: 'Estilo adhesivo, borde blanco, colorido.'
        },
        promptBase: 'die-cut sticker style, thick white border, vibrant colors, cartoon aesthetic, glossy finish look'
    },
    {
        id: 'badge',
        name: { pt: 'Badge / Emblema', en: 'Badge', es: 'Emblema' },
        group: { pt: 'Especiais', en: 'Special', es: 'Especiales' },
        emoji: '🛡️',
        description: { 
            pt: 'Emblema, brasão, circular, tradicional.',
            en: 'Badge, crest, circular, traditional.',
            es: 'Emblema, escudo, circular, tradicional.'
        },
        promptBase: 'vintage badge design, circular emblem, traditional crest style, shield shape, classic heraldic'
    },
    {
        id: 'mascot',
        name: { pt: 'Mascote', en: 'Mascot', es: 'Mascota' },
        group: { pt: 'Especiais', en: 'Special', es: 'Especiales' },
        emoji: '🦁',
        description: { 
            pt: 'Personagem mascote, carismático, marca.',
            en: 'Mascot character, charismatic, brand.',
            es: 'Personaje mascota, carismático, marca.'
        },
        promptBase: 'mascot character design, charismatic personality, brand mascot style, friendly approachable character'
    }
];

// ==================== SUFIXOS TÉCNICOS PARA PROMPTS ====================
const PROMPT_SUFFIXES = {
    common: {
        pt: 'design de camiseta, arte vetorial, fundo branco, composição centralizada, alto contraste, pronto para impressão, qualidade profissional',
        en: 't-shirt design, vector art, white background, centered composition, high contrast, print ready, professional quality',
        es: 'diseño de camiseta, arte vectorial, fondo blanco, composición centrada, alto contraste, listo para imprimir, calidad profesional'
    },
    no_mockup: {
        pt: 'sem mockup, sem pessoa vestindo a camiseta, sem modelo, apenas o design isolado',
        en: 'no mockup, no person wearing shirt, no model, isolated design only',
        es: 'sin mockup, sin persona usando la camiseta, sin modelo, solo diseño aislado'
    }
};

// ==================== FUNÇÕES DE DADOS ====================

/**
 * Obtém o nome traduzido de um item baseado no idioma atual
 * @param {Object} item - Item com campo 'name' que pode ser string ou objeto {pt, en, es}
 * @param {string} lang - Código do idioma ('pt', 'en', 'es')
 * @returns {string} Nome traduzido
 */
function getLocalizedName(item, lang = 'pt') {
    if (!item || !item.name) return '';
    
    // Se name é string simples, retornar direto
    if (typeof item.name === 'string') {
        return item.name;
    }
    
    // Se name é objeto com traduções, retornar idioma apropriado
    if (typeof item.name === 'object') {
        return item.name[lang] || item.name.en || item.name.pt || '';
    }
    
    return '';
}

/**
 * Filtra nichos por mercado
 * @param {string} market - Código do mercado ('BR', 'US', 'EU', 'LATAM', 'Global')
 * @returns {Array} Lista de nichos
 */
function getNichosByMarket(market = 'Global') {
    if (market === 'Global') return NICHOS;
    
    return NICHOS.filter(nicho => 
        nicho.market && (
            nicho.market.includes(market) || 
            nicho.market.includes('Global')
        )
    );
}

/**
 * Obtém estilo por ID
 * @param {string} id - ID do estilo
 * @returns {Object|null} Objeto do estilo
 */
function getEstiloById(id) {
    return ESTILOS.find(estilo => estilo.id === id) || null;
}

/**
 * Obtém nicho por ID
 * @param {string} id - ID do nicho
 * @returns {Object|null} Objeto do nicho
 */
function getNichoById(id) {
    return NICHOS.find(nicho => nicho.id === id) || null;
}

/**
 * Carrega banco de ideias do Google Sheets (fallback local)
 * @returns {Promise<Array>} Array de ideias
 */
async function carregarDadosExternos() {
    try {
        console.log('📡 Tentando carregar ideias do Google Sheets...');
        const response = await fetch(GOOGLE_SHEETS_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ ${data.length} ideias carregadas do Google Sheets`);
        return data;
    } catch (error) {
        console.warn('⚠️ Google Sheets offline, usando fallback local:', error.message);
        return BANCO_IDEIAS; // Fallback para banco local
    }
}

// ==================== BANCO DE IDEIAS LOCAL (FALLBACK) ====================
// Mantido para compatibilidade e funcionamento offline
const BANCO_IDEIAS = [
    // Este será o fallback quando Google Sheets não estiver disponível
    // Por enquanto vazio, mas pode ser populado com ideias básicas
    { nicho: 'coffee', categoria: 'humor', ideia: 'Coffee: because adulting is hard' },
    { nicho: 'beer', categoria: 'humor', ideia: 'Beer me' },
    { nicho: 'fitness', categoria: 'acao', ideia: 'No pain, no gain' },
    // ... adicionar mais conforme necessário
];

// ==================== ESTATÍSTICAS ====================
console.log(`📊 PromptForge v4.0 Data:
- Nichos: ${NICHOS.length}
- Estilos: ${ESTILOS.length}
- Paletas: ${PALETAS.length}
- Categorias: ${CATEGORIAS.length}
- Profissões: ${PROFISSOES.length}
- Signos: ${SIGNOS.length}
`);

console.log('✅ data.js v4.0 carregado');
