import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // jalan saat login & refresh token
      if (account && profile) {
        token.accessToken = account.access_token;
        token.googleId = profile.sub;
      }
      return token;
    },

    async session({ session, token }) {
      // data yang dikirim ke client
      session.user.accessToken = token.accessToken;
      session.user.googleId = token.googleId;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };