'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children, requireOnboarding = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Not logged in → login page
    if (!user) {
      router.replace('/login');
      return;
    }

    // Logged in but onboarding not done → onboarding
    // Unless we are already on the onboarding page
    if (!user.onboardingComplete && !requireOnboarding) {
      router.replace('/onboarding');
      return;
    }

    // Onboarding done but trying to visit /onboarding again → dashboard
    if (user.onboardingComplete && requireOnboarding) {
      router.replace('/dashboard');
      return;
    }

  }, [user, loading, router, requireOnboarding]);

  // Show nothing while checking
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F1F14',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #1C3524',
          borderTopColor: '#6FCF7F',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#3D6B4A', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
          Loading your farm...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If checks pass render children
  if (!user) return null;
  if (!user.onboardingComplete && !requireOnboarding) return null;
  if (user.onboardingComplete && requireOnboarding) return null;

  return children;
}