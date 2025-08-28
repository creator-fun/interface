const path = {
    home: '/',
    create: '/create',
    livestreamHome: '/livestream-home',
    hostLive: '/host-live',
    watchLive: '/watch-live/:sessionId'
} as const;

export default path;
