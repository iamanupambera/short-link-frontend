import { Spinner } from '@/components/ui/spinner';

type LoaderProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function Loader({ className, size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'size-6',
    md: 'size-10',
    lg: 'size-16',
  };

  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <Spinner
        className={`${sizeClasses[size]} text-teal-600 ${className || ''}`}
      />
    </div>
  );
}
export default Loader;
