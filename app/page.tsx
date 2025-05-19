'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('http://localhost:3000/login');
    }, 500); // Redirect after 0.5 seconds
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to login page...</p>
    </div>
  );
}