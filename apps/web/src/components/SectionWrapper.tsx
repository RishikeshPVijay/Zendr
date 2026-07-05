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
      <div className={cn('max-w-360 mx-auto', className)}>{children}</div>
    </section>
  );
};
