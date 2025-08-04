import { useSession, signIn, signOut } from 'next-auth/react';
import { useAuthContext } from 'src/auth/hooks';
import { useEffect } from 'react';

export const useNextAuth = () => {
  const { data: session, status } = useSession();
  const { login, logout, user } = useAuthContext();

  // Sync NextAuth session with existing auth context
  useEffect(() => {
    if (session && !user) {
      // Convert NextAuth session to existing auth format
      const authUser = {
        user: {
          _id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role || 'user',
          avatar: session.user.image,
        },
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      };

      // Update the existing auth context
      login?.(authUser);
    }
  }, [session, user, login]);

  const signInWithGoogle = async () => {
    try {
      const result = await signIn('google', {
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut({ redirect: false });
      logout?.();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    session,
    status,
    signInWithGoogle,
    signOutUser,
    isAuthenticated: !!session || !!user,
  };
}; 