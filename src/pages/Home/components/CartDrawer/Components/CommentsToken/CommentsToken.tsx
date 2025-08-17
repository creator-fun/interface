const CommentsToken = () => {
    return (
        <div className="text-gray-300">
            <h3 className="text-lg font-semibold text-white mb-3">Comments</h3>
            <div className="space-y-3">
                <div className="p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">User123</p>
                    <p>Great project! Looking forward to the launch 🚀</p>
                </div>
                <div className="p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">CryptoFan</p>
                    <p>The tokenomics look solid. When is the mainnet launch?</p>
                </div>
            </div>
        </div>
    );
};

export default CommentsToken;
