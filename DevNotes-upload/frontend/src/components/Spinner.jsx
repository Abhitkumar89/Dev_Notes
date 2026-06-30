/**
 * Loading spinner. Use `fullScreen` for page-level loading states.
 */
const Spinner = ({ fullScreen = false, size = 'md', label }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-brand-500 border-t-transparent`}
        role="status"
        aria-label="Loading"
      />
      {label && <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-10">{spinner}</div>;
};

export default Spinner;
