const constellationData = [
    {
        id: 'orion',
        name: 'Orion',
        region: 'Winter sky',
        color: '#7dd3fc',
        lore: 'The celestial hunter, one of the most recognizable constellations in the night sky.',
        points: [
            { x: 0.30, y: 0.18, radius: 3.8 },
            { x: 0.46, y: 0.28, radius: 4.5 },
            { x: 0.60, y: 0.18, radius: 4.1 },
            { x: 0.42, y: 0.46, radius: 4.8 },
            { x: 0.55, y: 0.53, radius: 4.4 },
            { x: 0.48, y: 0.66, radius: 4.9 }
        ],
        connections: [
            [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [3, 5]
        ]
    },
    {
        id: 'ursa-major',
        name: 'Ursa Major',
        region: 'Northern sky',
        color: '#f9a8d4',
        lore: 'The Great Bear, often used to locate Polaris and navigate the northern heavens.',
        points: [
            { x: 0.68, y: 0.22, radius: 3.6 },
            { x: 0.76, y: 0.30, radius: 3.8 },
            { x: 0.80, y: 0.42, radius: 4.2 },
            { x: 0.74, y: 0.54, radius: 4.1 },
            { x: 0.62, y: 0.52, radius: 3.9 },
            { x: 0.55, y: 0.60, radius: 4.4 },
            { x: 0.48, y: 0.70, radius: 4.7 }
        ],
        connections: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
        ]
    }
];