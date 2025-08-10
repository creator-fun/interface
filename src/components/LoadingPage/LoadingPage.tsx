const LoadingPage = () => {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center z-50">
            {/* Background animated particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-pulse opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    >
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                ))}
            </div>

            {/* Main loading content */}
            <div className="flex flex-col items-center space-y-8 z-10">
                {/* Spinning rings loader */}
                <div className="relative">
                    {/* Main ring */}
                    <div className="w-16 h-16 border-3 border-gray-700 border-t-gray-300 rounded-full animate-spin"></div>

                    {/* Center dot */}
                    <div className="absolute top-6 left-6 w-4 h-4 bg-gray-400 rounded-full animate-pulse"></div>
                </div>

                {/* Loading text with typewriter effect */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
                        Loading
                        <span className="inline-block animate-bounce ml-1">.</span>
                        <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.2s' }}>
                            .
                        </span>
                        <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.4s' }}>
                            .
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg animate-fade-in">Please wait while we prepare your content</p>
                </div>

                {/* Progress bar */}
                <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gray-500 via-gray-300 to-white rounded-full animate-loading-bar"></div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-gray-600 rounded-full opacity-20 animate-float"></div>
                <div
                    className="absolute top-1/3 right-1/4 w-4 h-4 bg-gray-500 rounded-full opacity-30 animate-float"
                    style={{ animationDelay: '1s' }}
                ></div>
                <div
                    className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-gray-400 rounded-full opacity-40 animate-float"
                    style={{ animationDelay: '2s' }}
                ></div>
            </div>
        </div>
    );
};

export default LoadingPage;
