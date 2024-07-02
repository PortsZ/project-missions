import { NextResponse } from "next/server";
import { Request } from "next/dist/compiled/@edge-runtime/primitives";
import { assert, object, pattern, size, string, optional } from "superstruct";
import { prisma } from "@/lib/prisma";
import { ChurchAdmin } from ".prisma/client";
import { CreateChurchAdmin } from "@/services/api/user/UserService";
import { ChurchAdminInterface } from "@/services/api/user/UserTypes";

const bcrypt = require("bcrypt");

export async function POST(req: Request): Promise<NextResponse> {
  const data = await req.json();
  //
  const validation = validate(data);
  console.log(validation)
  //
  if (validation) return validation;
  //
  await hashPassword(data);
//
  try {
    const userData: ChurchAdminInterface = {
      email: data.email,
      name: data.name,
      password: data.password,
    };
    const admin: ChurchAdmin | null | undefined = await CreateChurchAdmin(userData);
    if (!admin) throw "User could not be created";
    // else console.log(admin);

    // const token = await generateConfirmationToken(admin.id);
    // await sendEmail(user.email, token);

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: e,
      },
      { status: 500 }
    );
  }
}

function validate(data: any) {
  try {
    const User = object({
      email: size(
        pattern(string(), /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        1,
        50
      ),
      name: optional(size(string(), 1, 20)),
      password: string(),
    });

    assert(data, User);
  } catch (e) {
    return NextResponse.json(
      {
        message: e,
      },
      { status: 422 }
    );
  }
}

async function hashPassword(data: any): Promise<void> {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10);
  data.password = await bcrypt.hash(data.password, salt);
}

// interface Token {
//   sub: string;
//   type: string;
//   iat: number;
//   exp: number;
// }

// async function generateConfirmationToken(userId: string): Promise<string> {
//   const token = jwt.sign(
//     {
//       sub: userId,
//       type: "EMAIL_CONFIRMATION",
//     },
//     process.env.NEXTAUTH_SECRET,
//     { expiresIn: "1d" }
//   );

//   const decodedToken = jwt.decode(token) as Token;

//   try {
//     await prisma.token.create({
//       data: {
//         token: token,
//         userId: userId,
//         type: "EMAIL_CONFIRMATION",
//         creationDate: decodedToken.iat.toString(),
//         expirationDate: decodedToken.exp.toString(),
//       },
//     });
//   } catch (e) {
//     throw "Token could not be created";
//   }

//   return token;
// }

// async function sendEmail(to: string, token: string) {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.sendgrid.net",
//     port: 587,
//     auth: {
//       user: "apikey",
//       pass: process.env.SENDGRID_API_KEY,
//     },
//   });

//   let mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: to,
//     subject: "Confirme seu e-mail",
//     text: `Bem vindo a Antares Solar!
//            \n\n
//            Por favor verifique seu e-mail clicando no link a baixo:
//            \n\n
//            ${process.env.DOMAIN}/signup/confirm?token=${token}`,
//     html: `<b>Bem vindo a Antares Solar!</b>
//            <p>Por favor verifique seu e-mail clicando no link a baixo:</p>
//            <a href="${process.env.DOMAIN}/auth/sign-up/confirm?token=${token}">Confirm email</a>`,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//   } catch (error) {
//     console.log("An error occurred: ", JSON.stringify(error));
//   }
// }
