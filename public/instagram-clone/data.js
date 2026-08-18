// IN-MEMORY MOCK DATABASE STATE
const INSTAGRAM_DB = {
    // Current User Session
    currentUser: {
        username: "aesthetic_coder",
        fullname: "Aesthetic Coder",
        avatar: "assets/images/user_avatar.png",
        bio: "💻 Transforming code into beautiful art. \n✨ HTML | CSS | Vanilla JS enthusiast.\n📍 DeepMind Sandbox",
        postsCount: 3,
        followersCount: "1.2K",
        followingCount: "394",
        posts: [],
        saved: []
    },

    // Feed Stories
    stories: [
        {
            id: "story-1",
            username: "travel_guru",
            fullname: "Marco Polo",
            avatar: "assets/images/travel_amalfi.png",
            viewed: false,
            slides: [
                { url: "assets/images/travel_amalfi.png", time: "2h" },
                { url: "assets/images/mountain_sunset.png", time: "2h" }
            ]
        },
        {
            id: "story-2",
            username: "cafe_lover",
            fullname: "Sophia Loren",
            avatar: "assets/images/cafe_flatlay.png",
            viewed: false,
            slides: [
                { url: "assets/images/cafe_flatlay.png", time: "4h" }
            ]
        },
        {
            id: "story-3",
            username: "nature_wild",
            fullname: "Jane Goodall",
            avatar: "assets/images/mountain_sunset.png",
            viewed: false,
            slides: [
                { url: "assets/images/mountain_sunset.png", time: "6h" },
                { url: "assets/images/travel_amalfi.png", time: "6h" }
            ]
        },
        {
            id: "story-4",
            username: "pixel_pioneer",
            fullname: "Grace Hopper",
            avatar: "assets/images/user_avatar.png",
            viewed: true,
            slides: [
                { url: "assets/images/user_avatar.png", time: "1d" }
            ]
        }
    ],

    // Feed / Explore / Profile Posts with enhanced comment structure
    posts: [
        {
            id: "post-101",
            user: {
                username: "travel_guru",
                avatar: "assets/images/travel_amalfi.png",
                location: "Amalfi Coast, Italy"
            },
            mediaUrl: "assets/images/travel_amalfi.png",
            caption: "Waking up to this view is a dream! 🍋⛵ Walking through the narrow streets, eating gelato, and enjoying the Mediterranean sun. Who wants to join?",
            likes: 1248,
            liked: false,
            bookmarked: false,
            time: "2 hours ago",
            comments: [
                { 
                    id: "comment-1",
                    username: "cafe_lover", 
                    text: "Stunning! Added to my travel bucket list immediately.",
                    timestamp: "2 hours ago",
                    replies: [
                        {
                            id: "reply-1-1",
                            username: "travel_guru",
                            text: "You should definitely visit! I can share my itinerary.",
                            timestamp: "1 hour ago"
                        }
                    ]
                },
                { 
                    id: "comment-2",
                    username: "nature_wild", 
                    text: "The color of the water is absolutely mesmerizing! 🌊",
                    timestamp: "1 hour ago",
                    replies: []
                }
            ]
        },
        {
            id: "post-102",
            user: {
                username: "cafe_lover",
                avatar: "assets/images/cafe_flatlay.png",
                location: "Le Petit Café, Paris"
            },
            mediaUrl: "assets/images/cafe_flatlay.png",
            caption: "Croissants, hot latte, and code. The perfect trinity of productivity ☕💻 Happy coding everyone!",
            likes: 942,
            liked: false,
            bookmarked: false,
            time: "5 hours ago",
            comments: [
                { 
                    id: "comment-3",
                    username: "aesthetic_coder", 
                    text: "My absolute favorite routine! Enjoy that croissant.",
                    timestamp: "4 hours ago",
                    replies: [
                        {
                            id: "reply-3-1",
                            username: "cafe_lover",
                            text: "Thanks! I'll save one for you next time 🥐",
                            timestamp: "3 hours ago"
                        }
                    ]
                },
                { 
                    id: "comment-4",
                    username: "pixel_pioneer", 
                    text: "What editor are you using? Looks cozy!",
                    timestamp: "3 hours ago",
                    replies: []
                }
            ]
        },
        {
            id: "post-103",
            user: {
                username: "nature_wild",
                avatar: "assets/images/mountain_sunset.png",
                location: "Banff National Park, Canada"
            },
            mediaUrl: "assets/images/mountain_sunset.png",
            caption: "Golden hour at the lake. 🏔️🌅 The snow capping the peaks makes the reflection look like a painting. Nature never ceases to amaze me.",
            likes: 3125,
            liked: false,
            bookmarked: false,
            time: "1 day ago",
            comments: [
                { 
                    id: "comment-5",
                    username: "travel_guru", 
                    text: "banff is pure magic. Great shot!",
                    timestamp: "23 hours ago",
                    replies: []
                },
                { 
                    id: "comment-6",
                    username: "emma_watson", 
                    text: "Breathtaking. Earth is beautiful.",
                    timestamp: "20 hours ago",
                    replies: [
                        {
                            id: "reply-6-1",
                            username: "nature_wild",
                            text: "Thank you Emma! It truly is a special place.",
                            timestamp: "18 hours ago"
                        },
                        {
                            id: "reply-6-2",
                            username: "travel_guru",
                            text: "I agree! Banff is a must-visit.",
                            timestamp: "15 hours ago"
                        }
                    ]
                }
            ]
        }
    ],

    // Reels Page Data
    reels: [
        {
            id: "reel-201",
            user: {
                username: "travel_guru",
                avatar: "assets/images/travel_amalfi.png"
            },
            mediaUrl: "assets/images/travel_amalfi.png",
            caption: "A quick cruise along the Amalfi Coast! 🇮🇹🚤 #travel #italy #reels",
            musicName: "travel_guru • Original Audio",
            likes: "45.2K",
            liked: false,
            commentsCount: "420"
        },
        {
            id: "reel-202",
            user: {
                username: "cafe_lover",
                avatar: "assets/images/cafe_flatlay.png"
            },
            mediaUrl: "assets/images/cafe_flatlay.png",
            caption: "How to pour the perfect latte art ☕✨ #coffee #latteart #satisfying",
            musicName: "Chill Lo-Fi Beats • Coffee Shop Mix",
            likes: "92.8K",
            liked: false,
            commentsCount: "890"
        },
        {
            id: "reel-203",
            user: {
                username: "nature_wild",
                avatar: "assets/images/mountain_sunset.png"
            },
            mediaUrl: "assets/images/mountain_sunset.png",
            caption: "Sunset timelapse from the mountain summit. 🌄❄️ #nature #timelapse #hiking",
            musicName: "nature_wild • Original Sound",
            likes: "128K",
            liked: false,
            commentsCount: "1.4K"
        }
    ],

    // Direct Messages Chat Threads
    chats: [
        {
            id: "chat-1",
            user: {
                username: "travel_guru",
                fullname: "Marco Polo",
                avatar: "assets/images/travel_amalfi.png",
                status: "Active now"
            },
            unread: true,
            messages: [
                { sender: "other", text: "Hey! Did you check out that travel itinerary I posted?" },
                { sender: "self", text: "Yes! The Amalfi Coast looks incredible." },
                { sender: "other", text: "You should absolutely go! Let me know if you need any hotel recommendations." }
            ],
            replies: [
                "Awesome! If you book, let me know. I've got some great coupons.",
                "Let me send you my Google Maps saved pins. It has the best pizza spots!",
                "Are you planning to travel this summer?"
            ]
        },
        {
            id: "chat-2",
            user: {
                username: "cafe_lover",
                fullname: "Sophia Loren",
                avatar: "assets/images/cafe_flatlay.png",
                status: "Active 4m ago"
            },
            unread: false,
            messages: [
                { sender: "self", text: "Love your café shot! Where was it taken?" },
                { sender: "other", text: "It's Le Petit Café in Paris! Very close to the Louvre. Excellent coffee." }
            ],
            replies: [
                "They also have the best pain au chocolat. Highly recommend!",
                "Let me know if you visit, I can recommend other spots too.",
                "Haha indeed! Code coffee repeat ☕"
            ]
        },
        {
            id: "chat-3",
            user: {
                username: "nature_wild",
                fullname: "Jane Goodall",
                avatar: "assets/images/mountain_sunset.png",
                status: "Offline"
            },
            unread: false,
            messages: [
                { sender: "other", text: "Thanks for liking my sunset photo! Banff is beautiful this time of year." },
                { sender: "self", text: "No problem! It looks majestic." }
            ],
            replies: [
                "Thank you! I'm planning a hiking trip to Patagonia next month.",
                "Indeed, the mountains are calling!",
                "Have a great day ahead! 🌄"
            ]
        }
    ],

    // Search History List
    searchHistory: [
        { username: "travel_guru", fullname: "Marco Polo", avatar: "assets/images/travel_amalfi.png" },
        { username: "cafe_lover", fullname: "Sophia Loren", avatar: "assets/images/cafe_flatlay.png" }
    ],

    // Active Notifications
    notifications: [
        { type: "like", username: "travel_guru", avatar: "assets/images/travel_amalfi.png", text: "liked your post.", postImg: "assets/images/user_avatar.png", timeframe: "3h" },
        { type: "follow", username: "nature_wild", avatar: "assets/images/mountain_sunset.png", text: "started following you.", postImg: null, timeframe: "1d", following: true },
        { type: "comment", username: "cafe_lover", avatar: "assets/images/cafe_flatlay.png", text: "commented: 'My absolute favorite routine!'", postImg: "assets/images/user_avatar.png", timeframe: "2d" }
    ]
};

// Initialize Current User default posts
INSTAGRAM_DB.currentUser.posts = [
    {
        id: "my-post-1",
        mediaUrl: "assets/images/user_avatar.png",
        likes: 412,
        commentsCount: 22,
        caption: "Hello world! This is my first post on the new clone 🚀 Let's code some aesthetic websites.",
        location: "DeepMind Sandbox"
    },
    {
        id: "my-post-2",
        mediaUrl: "assets/images/travel_amalfi.png",
        likes: 318,
        commentsCount: 15,
        caption: "Flashback to the beautiful coast view! 🍋🌊",
        location: "Amalfi Coast, Italy"
    },
    {
        id: "my-post-3",
        mediaUrl: "assets/images/cafe_flatlay.png",
        likes: 284,
        commentsCount: 8,
        caption: "Work sessions are always better with coffee.",
        location: "Le Petit Café, Paris"
    }
];