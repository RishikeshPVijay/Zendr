import type { IconType } from 'react-icons';
import { MdMonitor, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { TbTransfer } from 'react-icons/tb';
import { useResponsive } from '../hooks';
import { useTheme } from '../providers/theme';
import type { Theme } from '../types/app';
import { SectionWrapper } from './SectionWrapper';

export const Header = () => {
  const { isMobile } = useResponsive();

  return (
    <SectionWrapper sectionClassName="bg-header shadow-header">
      <aside className="flex justify-between p-5">
        <span className="text-text-primary">Logo</span>
        <div className="flex gap-4">
          {isMobile && <TbTransfer className="text-text-primary cursor-pointer text-2xl" />}
          <ThemeButton />
        </div>
      </aside>
    </SectionWrapper>
  );
};

const themeIconMap: Record<Theme, IconType> = {
  light: MdOutlineLightMode,
  dark: MdOutlineDarkMode,
  system: MdMonitor,
};

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  const Icon = themeIconMap[theme];

  return (
    <button onClick={toggleTheme} className="text-text-primary cursor-pointer">
      <Icon className="text-2xl" />
    </button>
  );
};
