import { cn } from '../utils';

interface CardProps extends React.ComponentProps<'div'> {
  variant?: 'primary' | 'secondary';
}

export const Card: React.FC<React.PropsWithChildren<CardProps>> = ({
  children,
  variant = 'primary',
  ...restProps
}) => {
  const className = cn('border-border rounded-md border p-6', {
    'bg-surface-primary': variant === 'primary',
    'bg-surface-tertiary': variant === 'secondary',
  });

  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
};
