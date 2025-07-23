import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';

anime({
    targets: '#imgfilm2',
    translateX: ['0rem', 0, 33, 33, 0, 0],
    scale: [1, 1, .7, .7, 1, 1],
    duration: 3000,
    // loop: true,
});

anime({
    targets: '#imgfilm3',
    translateX: ['0rem', 0, 33, 33, 0, 0],
    scale: [.7, .7, .7, .7, .7, .7],
    duration: 3000,
    // loop: true,
});

anime({
    targets: '#imgfilm1',
    translateX: ['0rem', 0, 33, 33, 0, 0],
    scale: [.7, .7, 1, 1, .7, .7],
    duration: 3000,
    // loop: true,
});
