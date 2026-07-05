import type { IconType } from 'react-icons';
import { MdMonitor, MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from '../providers/theme';
import type { Theme } from '../types/app';
import { SectionWrapper } from './SectionWrapper';

export const Header = () => {
  return (
    <SectionWrapper sectionClassName="bg-header shadow-header">
      <aside className="flex justify-between p-5">
        <span className="text-text-primary">Logo</span>
        <ThemeButton />
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
