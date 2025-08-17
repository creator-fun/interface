import { truncateAddress } from '@/utils/utils';
import { FilesIcon } from 'lucide-react';
import { toast } from 'sonner';

const CopyComponent = ({ address, className }: { address?: string; className?: string }) => {
    const handleCopyAddress = () => {
        if (!address) {
            toast.error('Some things went wrong', {
                position: 'top-right',
            });
            return;
        }
        navigator.clipboard
            .writeText(address || '')
            .then(() => {
                toast.success('Copy successful', {
                    position: 'top-right',
                });
            })
            .catch((err) => {
                console.error('error', err);
            });
    };
    return (
        <div className="flex items-center gap-2 ml-auto">
            <button className={className} onClick={handleCopyAddress}>
                <FilesIcon className="w-5 h-5 text-white  transition-all duration-300" />
            </button>
            <div className="text-base font-normal mt-1 text-white">{truncateAddress(address || '')}</div>
        </div>
    );
};

export default CopyComponent;
