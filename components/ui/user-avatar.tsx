'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const fallbackTextClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
};

export function UserAvatar({ 
  src, 
  alt, 
  fallback, 
  className, 
  size = 'md' 
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src && !imageError && (
        <AvatarImage
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="object-cover transition-opacity duration-200"
          style={{ 
            opacity: imageLoading ? 0 : 1 
          }}
        />
      )}
      <AvatarFallback 
        className={cn(
          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-medium transition-colors",
          fallbackTextClasses[size],
          imageLoading && "animate-pulse"
        )}
      >
        {imageLoading ? '...' : fallback}
      </AvatarFallback>
    </Avatar>
  );
}