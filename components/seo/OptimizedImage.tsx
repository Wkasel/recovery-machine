'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  onLoadingComplete?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  loading = 'lazy',
  onLoadingComplete,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Generate a simple blur placeholder if not provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="14" fill="#9ca3af">
        Loading...
      </text>
    </svg>`
  ).toString('base64')}`;

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-500 ${className}`}
        style={{ width: width, height: height }}
      >
        <svg 
          className="w-8 h-8" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    quality,
    onLoad: handleLoadingComplete,
    onError: handleError,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && !fill && { sizes }),
    ...(priority && { priority: true }),
    ...(loading && !priority && { loading }),
    ...(placeholder === 'blur' && {
      placeholder: 'blur',
      blurDataURL: blurDataURL || defaultBlurDataURL,
    }),
  };

  return (
    <div className="relative">
      <Image {...imageProps} />
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center"
          style={{ width: width, height: height }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
}

// Predefined image components for common wellness images
export function HeroImage({ className = '', ...props }: Omit<OptimizedImageProps, 'src' | 'alt'>) {
  return (
    <OptimizedImage
      src="/images/hero-recovery-machine.jpg"
      alt="The Recovery Machine mobile cold plunge and infrared sauna services"
      width={1200}
      height={630}
      priority={true}
      className={className}
      {...props}
    />
  );
}

export function ColdPlungeImage({ className = '', ...props }: Omit<OptimizedImageProps, 'src' | 'alt'>) {
  return (
    <OptimizedImage
      src="/images/cold-plunge-mobile.jpg"
      alt="Mobile cold plunge therapy session setup"
      width={600}
      height={400}
      className={className}
      {...props}
    />
  );
}

export function InfraredSaunaImage({ className = '', ...props }: Omit<OptimizedImageProps, 'src' | 'alt'>) {
  return (
    <OptimizedImage
      src="/images/infrared-sauna-mobile.jpg"
      alt="Mobile infrared sauna therapy session"
      width={600}
      height={400}
      className={className}
      {...props}
    />
  );
}

export function LogoImage({ className = '', ...props }: Omit<OptimizedImageProps, 'src' | 'alt' | 'width' | 'height'>) {
  return (
    <OptimizedImage
      src="/logo.png"
      alt="The Recovery Machine logo"
      width={200}
      height={50}
      priority={true}
      className={className}
      {...props}
    />
  );
}