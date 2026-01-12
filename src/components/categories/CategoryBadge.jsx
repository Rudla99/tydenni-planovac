export const CategoryBadge = ({ category, size = 'sm', onClick, className = '' }) => {
  if (!category) return null;

  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizes = {
    xs: 'text-[0.65rem]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${className}
      `}
      style={{ backgroundColor: `${category.color}20` }}
    >
      <div
        className={`${sizes[size]} rounded-full`}
        style={{ backgroundColor: category.color }}
      />
      <span className={`${textSizes[size]} font-medium`} style={{ color: category.color }}>
        {category.name}
      </span>
    </div>
  );
};
