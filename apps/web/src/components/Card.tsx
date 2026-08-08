import { cn } from '../utils';

interface CardProps extends React.ComponentProps<'div'> {
  variant?: 'primary' | 'secondary';
}

export const Card: React.FC<React.PropsWithChildren<CardProps>> = ({
  children,
  variant = 'primary',
  className,
  ...restProps
}) => {
  const _className = cn(
    'border-border rounded-md border p-6',
    {
      'bg-surface-primary': variant === 'primary',
      'bg-surface-tertiary': variant === 'secondary',
    },
    className,
  );

  return (
    <div className={_className} {...restProps}>
      {children}
    </div>
  );
};
