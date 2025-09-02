
'use client';

import { useState, useEffect } from 'react';
import { Loader } from '@/components/loader';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for demonstration.
    // In a real app, you might wait for certain data to be fetched.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Show loader for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return loading ? <Loader /> : <>{children}</>;
}
