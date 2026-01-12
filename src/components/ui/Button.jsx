export const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-br from-accent-primary to-purple-600 text-white hover:shadow-lg hover:shadow-accent-primary/40 hover:scale-105',
    secondary: 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 hover:text-text-primary',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/40 hover:text-red-300',
    success: 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/40 hover:text-green-300',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
