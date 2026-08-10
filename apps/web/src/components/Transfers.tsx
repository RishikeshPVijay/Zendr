import { useTransfer } from '../providers/transfer/context';

export const Transfers: React.FC = () => {
  const { transfers } = useTransfer();

  return (
    <div>
      <h2 className="text-h2 text-text-primary">Transfers</h2>;
      <ul>
        {transfers.map((transfer, i) => (
          <li key={transfer.requestId} className="text-text-primary">
            {i + 1}. {transfer.state}
          </li>
        ))}
      </ul>
    </div>
  );
};
