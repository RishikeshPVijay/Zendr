import { useTheme } from '../providers/theme';
import { SectionWrapper } from './SectionWrapper';

export const Header = () => {
  return (
    <SectionWrapper sectionClassName="bg-header shadow-header">
      <aside className="p-5 flex justify-between">
        <h1 className="text-text-inverse dark:text-text-primary">Logo</h1>
        <ThemeButton />
      </aside>
    </SectionWrapper>
  );
};

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="text-text-inverse dark:text-text-primary">
      {theme}
    </button>
  );
};
