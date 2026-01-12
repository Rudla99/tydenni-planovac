export const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  autoFocus = false,
  ...props
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={`
        w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2
        text-text-primary text-sm outline-none transition-all duration-200
        placeholder:text-text-muted
        focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  );
};
