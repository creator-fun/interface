const path = {
    home: '/',
    create: '/create',
    livestreamHome: '/livestream-home',
    hostLive: '/host-live',
    watchLive: '/watch-live/:sessionId',
    profile: '/profile'
} as const;

export default path;
