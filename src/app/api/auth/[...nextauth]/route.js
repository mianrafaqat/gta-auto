import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.API_URL}/api/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (response.ok && data.user) {
            return {
              id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        try {
          // Call your backend API with the Google ID token
          const response = await fetch(`${process.env.API_URL}/api/user/google-auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: account.id_token,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            token.accessToken = data.accessToken;
            token.refreshToken = data.refreshToken;
            token.user = data.user;
            token.role = data.user.role;
          }
        } catch (error) {
          console.error('Google auth error:', error);
        }
      }

      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.user?.id || token.sub;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST }; 