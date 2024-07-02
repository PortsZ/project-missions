import { Request } from 'next/dist/compiled/@edge-runtime/primitives';
import { assert, object, pattern, size, string } from 'superstruct';
import { User } from '.prisma/client';
import { prisma } from '@/src/lib/prisma';

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

export async function POST(req: Request) {
  const validated = await validateRequest(req);
  if (validated instanceof Response) return validated;
  const user = await findUser(validated.email);
  if (!user) return new Response('User not found', { status: 404 });
  const token = await generateResetPasswordToken(user.id);
  await sendEmail(user.email, token);
  return new Response('Email sent', { status: 200 });
}

type requestData = {
  email: string;
};

async function validateRequest(req: Request): Promise<requestData | Response> {
  try {
    const data = await req.json();

    const validation = object({
      email: size(
        pattern(string(), /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        1,
        50,
      ),
    });

    assert(data, validation);
    return data;
  } catch (e: any) {
    return new Response(e, { status: 422 });
  }
}

async function findUser(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

interface Token {
  sub: string;
  type: string;
  iat: number;
  exp: number;
}

async function generateResetPasswordToken(userId: string): Promise<string> {
  const token = jwt.sign(
    {
      sub: userId,
      type: 'RESET_PASSWORD',
    },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: '1h' },
  );

  const decodedToken = jwt.decode(token) as Token;

  try {
    await prisma.token.create({
      data: {
        token: token,
        userId: userId,
        type: 'RESET_PASSWORD',
        creationDate: decodedToken.iat.toString(),
        expirationDate: decodedToken.exp.toString(),
      },
    });
  } catch (e) {
    throw 'Token could not be created';
  }

  return token;
}

async function sendEmail(to: string, token: string) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Trocar senha',
    text:
      'Para trocar sua senha, clique no link abaixo:\n\n' +
      process.env.DOMAIN +
      '/reset-password?token=' +
      token,
    html:
      '<p>Para trocar a sua senha clique no link abaixo:</p>' +
      '<br>' +
      '<a href="' +
      process.env.DOMAIN +
      '/auth/forgot-password/new-password?token=' +
      token +
      '">Trocar senha</a>',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log('An error occurred: ', JSON.stringify(error));
  }
}
