const HolderToken = () => {
    return (
        <div className="text-gray-300">
            <h3 className="text-lg font-semibold text-white mb-3">Top Holders</h3>
            <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg">
                    <span className="text-sm">0x1234...5678</span>
                    <span className="text-sm text-green-400">15.2%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg">
                    <span className="text-sm">0x9abc...def0</span>
                    <span className="text-sm text-green-400">12.8%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg">
                    <span className="text-sm">0x2468...ace1</span>
                    <span className="text-sm text-green-400">9.5%</span>
                </div>
            </div>
        </div>
    );
};

export default HolderToken;
