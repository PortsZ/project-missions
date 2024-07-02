// import { Request } from 'next/dist/compiled/@edge-runtime/primitives';
// import { prisma } from '@/src/lib/prisma';
// import { Token, User } from '.prisma/client';

// const jwt = require('jsonwebtoken');

// type userWithToken = User & { token: Token[] };

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const token = url.searchParams.get('token');
//   if (!token) {
//     return new Response('no token');
//   }

//   const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
//   if (!decoded) {
//     return new Response('invalid token');
//   }

//   const user = await getUserWithToken(decoded.sub);
//   if (!user || !user.token) {
//     return new Response('no user');
//   }

//   const tokenID = await isTokenValid(token, decoded, user);

//   if (tokenID === null) {
//     return new Response('token invalid');
//   }

//   await confirmUser(decoded.sub, tokenID);
//   return new Response('email confirmed');
// }

// function isTokenExpired(decoded: any): boolean {
//   return decoded.exp < Date.now() / 1000;
// }

// async function isTokenValid(
//   token: string,
//   decoded: any,
//   user: userWithToken,
// ): Promise<string | null> {
//   const jwt = user.token.find((t) => t.token === token);
//   if (!jwt) return null;

//   if (
//     jwt.token !== token ||
//     jwt.type !== decoded.type ||
//     jwt.expirationDate != decoded.exp ||
//     jwt.creationDate != decoded.iat ||
//     jwt.used
//   ) {
//     return null;
//   }

//   if (isTokenExpired(decoded)) {
//     return null;
//   }

//   return jwt.id;
// }

// async function getUserWithToken(id: string): Promise<userWithToken | null> {
//   try {
//     return await prisma.user.findUnique({
//       where: {
//         id: id,
//       },
//       include: {
//         token: true,
//       },
//     });
//   } catch (e) {
//     throw e;
//   }
// }

// async function confirmUser(id: string, tokenID: string): Promise<void> {
//   try {
//     await prisma.user.update({
//       where: {
//         id: id,
//       },
//       data: {
//         isConfirmed: true,
//         token: {
//           update: {
//             where: {
//               id: tokenID,
//             },
//             data: {
//               used: true,
//             },
//           },
//         },
//       },
//     });
//   } catch (e) {
//     console.log(e);
//   }
// }
