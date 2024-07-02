import { Request } from 'next/dist/compiled/@edge-runtime/primitives';
import { prisma } from '@/src/lib/prisma';
import { Token, User } from '.prisma/client';
import { assert, object, string } from 'superstruct';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

type userWithToken = User & { token: Token[] };

export async function POST(req: Request) {
  const validated = await validateRequest(req);
  if (validated instanceof Response) return validated;

  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (!token) {
    return new Response('token não encontrado', { status: 404 });
  }

  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
  if (!decoded) {
    return new Response('o token não é valido', { status: 401 });
  }

  const user = await getUserWithToken(decoded.sub);
  if (!user || !user.token) {
    return new Response('usuário não foi encontrado', { status: 404 });
  }

  const tokenID = await isTokenValid(token, decoded, user);
  if (tokenID === null) {
    return new Response('o token está expirado, já foi usado ou não é valido', {
      status: 401,
    });
  }

  await changePassword(decoded.sub, tokenID, validated.password);
  return new Response('password changed');
}

type requestData = {
  password: string;
  confirmPassword: string;
};

async function validateRequest(req: Request): Promise<requestData | Response> {
  try {
    const data = await req.json();

    const validation = object({
      password: string(),
      confirmPassword: string(),
    });

    if (data.password !== data.confirmPassword) {
      return new Response('passwords do not match', { status: 422 });
    }

    assert(data, validation);
    return data;
  } catch (e: any) {
    return new Response(e, { status: 422 });
  }
}

function isTokenExpired(decoded: any): boolean {
  return decoded.exp < Date.now() / 1000;
}

async function isTokenValid(
  token: string,
  decoded: any,
  user: userWithToken,
): Promise<string | null> {
  const jwt = user.token.find((t) => t.token === token);
  if (!jwt) return null;

  if (
    jwt.token !== token ||
    jwt.type !== decoded.type ||
    jwt.expirationDate != decoded.exp ||
    jwt.creationDate != decoded.iat ||
    jwt.used
  ) {
    return null;
  }

  if (isTokenExpired(decoded)) {
    return null;
  }

  return jwt.id;
}

async function getUserWithToken(id: string): Promise<userWithToken | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        token: true,
      },
    });
  } catch (e) {
    throw e;
  }
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10);
  return await bcrypt.hash(password, salt);
}

async function changePassword(
  id: string,
  token: string,
  password: string,
): Promise<void> {
  try {
    const newPassword = await hashPassword(password);
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: newPassword,
        token: {
          update: {
            where: {
              id: token,
            },
            data: {
              used: true,
            },
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
}
