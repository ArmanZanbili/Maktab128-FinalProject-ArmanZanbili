import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { loginUser } from '../services/authService';



export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ username: z.string(), password: z.string() })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;
                    try {
                        const response = await loginUser(username, password);

                        const user = response.data.user;
                        const token = response.token;

                        if (!user || !token) {
                            return null;
                        }

                        return {
                            id: user._id,
                            name: user.username,
                            role: user.role,
                            accessToken: token.accessToken,
                            refreshToken: token.refreshToken,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            address: user.address,
                        };
                    } catch (error) {
                        console.error("Authorize Error:", error);
                        return null;
                    }
                }
                return null;
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.firstname = user.firstname;
                token.lastname = user.lastname;
                token.address = user.address;
            }
            return token;
        },
        session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.accessToken = token.accessToken as string;
                session.user.refreshToken = token.refreshToken as string;
                session.user.firstname = token.firstname;
                session.user.lastname = token.lastname;
                session.user.address = token.address;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});