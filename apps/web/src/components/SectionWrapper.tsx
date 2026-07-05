import { cn } from '../utils';

interface SectionWrapperProps {
  sectionClassName?: string;
  className?: string;
}

export const SectionWrapper: React.FC<React.PropsWithChildren<SectionWrapperProps>> = ({
  children,
  sectionClassName,
  className,
}) => {
  return (
    <section className={cn('w-full', sectionClassName)}>
      <div className={cn('mx-auto max-w-360', className)}>{children}</div>
    </section>
  );
};
