import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const buttonVariants = cva(
  [
    'inline-flex justify-center items-center',
    'rounded-md font-semibold',
    'focus:ring-2 focus:ring-offset-2 focus:outline-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-action-primary text-white',
          'hover:bg-action-primary-hover',
          'active:bg-action-primary-active',
          'focus:ring-focus-ring',
        ],
        secondary: [
          'bg-action-secondary text-white',
          'hover:bg-action-secondary-hover',
          'active:bg-secondary-active',
          'focus:ring-focus-ring-secondary',
        ],
      },
      size: {
        sm: ['text-action-sm', 'px-2', 'py-1.5'],
        base: ['text-action', 'px-4', 'py-2'],
      },
      disabled: {
        false: 'cursor-pointer',
        true: ['bg-text-disabled', 'hover:bg-text-disabled active:bg-text-disabled'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base',
    },
  },
);

export const Button: React.FC<
  React.PropsWithChildren<React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>>
> = ({ children, className, size, variant, ...restProps }) => {
  return (
    <button
      className={cn(buttonVariants({ size, variant, disabled: !!restProps.disabled }), className)}
      {...restProps}
    >
      {children}
    </button>
  );
};
