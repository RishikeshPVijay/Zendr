import { FaUsersViewfinder } from 'react-icons/fa6';
import { TbTransfer } from 'react-icons/tb';
import { cn } from '../utils';

export type NavigationTab = 'discover' | 'transfer';

interface MobileNavigationTabProps {
  activeTab: NavigationTab;
  transferCount: number;
  onTabChange: (tab: NavigationTab) => void;
}

export const MobileNavigationTab: React.FC<MobileNavigationTabProps> = ({
  activeTab,
  transferCount,
  onTabChange,
}) => {
  const formattedTransferCount = transferCount > 9 ? '9+' : String(transferCount);

  return (
    <div className="bg-surface-secondary shadow-bottom-nav-bar text-text-primary text-body-large flex font-bold">
      <button
        className={cn('flex flex-1 cursor-pointer items-center justify-center gap-2 py-4', {
          'text-primary': activeTab === 'discover',
        })}
        onClick={() => onTabChange('discover')}
      >
        <FaUsersViewfinder />
        Discover
      </button>
      <button
        className={cn('flex flex-1 cursor-pointer items-center justify-center gap-2 py-4', {
          'text-primary': activeTab === 'transfer',
        })}
        onClick={() => onTabChange('transfer')}
      >
        <TbTransfer />
        Transfers
        {transferCount > 0 && (
          <div className="text-body-small bg-primary flex aspect-square h-5 shrink-0 items-center justify-center rounded-md font-bold text-white">
            {formattedTransferCount}
          </div>
        )}
      </button>
    </div>
  );
};
