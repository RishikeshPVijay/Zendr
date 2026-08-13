import { useTransfer } from '../providers/transfer/context';
import { TransferCard } from './TransferCard';

export const Transfers: React.FC = () => {
  const { transfers } = useTransfer();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="text-h2 text-text-primary">Transfers</h2>
      <div className="mt-4 flex-1 overflow-y-auto pr-2">
        <div className="flex flex-col gap-4">
          {transfers.map((transfer) => (
            <TransferCard key={transfer.id} transfer={transfer} />
          ))}
        </div>
      </div>
    </div>
  );
};
