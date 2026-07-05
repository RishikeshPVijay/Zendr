import { cn } from '../utils';

export const Button: React.FC<React.PropsWithChildren<React.ComponentProps<'button'>>> = ({
  children,
  className: _className,
  ...restProps
}) => {
  const className = cn(
    'disabled:bg-text-disabled text-action bg-primary hover:bg-primary-hover active:bg-primary-active focus:ring-focus-ring rounded-md px-4 py-2 font-semibold text-white focus:ring-2 focus:ring-offset-2 focus:outline-none',
    _className,
    { 'cursor-pointer': !restProps.disabled },
  );

  return (
    <button className={className} {...restProps}>
      {children}
    </button>
  );
};
