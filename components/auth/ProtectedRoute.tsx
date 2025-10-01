'use client';

import React from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useProtectedRoute();

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useProtectedRoute hook
  }

  return <>{children}</>;
}