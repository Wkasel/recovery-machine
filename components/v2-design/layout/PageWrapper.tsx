import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl';
  className?: string;
}

/**
 * Consistent page wrapper for all secondary pages
 * Handles proper spacing for fixed header (Header is fixed at top, ~52px height + announcement bar ~40px = ~92px total)
 * Provides consistent container width and padding
 */
const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  maxWidth = '4xl',
  className = ''
}) => {
  const maxWidthClass = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  }[maxWidth];

  return (
    <div className="min-h-screen bg-mint">
      {/* pt-32 accounts for fixed header (~92px) + extra breathing room */}
      <div className={`container mx-auto px-4 py-32 md:py-40 ${maxWidthClass} ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
