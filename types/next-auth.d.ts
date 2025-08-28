import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            accessToken: string;
            refreshToken: string;
            firstname?: string;
            lastname?: string;
            address?: string;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        role: string;
        accessToken: string;
        refreshToken: string;
        firstname?: string;
        lastname?: string;
        address?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        role: string;
        accessToken: string;
        refreshToken: string;
        firstname?: string;
        lastname?: string;
        address?: string;
    }
}