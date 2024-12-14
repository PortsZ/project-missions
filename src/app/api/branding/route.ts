import { prisma } from '@/src/lib/prisma';
import { validateRequest } from '@/src/services/validateReq';

export async function POST(req: Request) {
  const validated = await validateRequest(req);
  if (validated instanceof Response) return validated;

  const company = await prisma.company.findFirst({
    where: {
      id: validated.companyId,
    },
    include: {
      branding: true,
    },
  });

  if (!company) {
    return new Response('company not found', { status: 404 });
  }

  if (company.branding !== null) {
    return new Response('company already has a branding', { status: 409 });
  }

  try {
    await prisma.branding.create({
      data: {
        termsAndConditions: validated.termsAndConditions,
        description: validated.description,
        deliveryTime: validated.deliveryTime,
        paymentMethods: validated.paymentMethods,
        company: {
          connect: {
            id: validated.companyId,
          },
        },
      },
    });
    return new Response('branding created', { status: 201 });
  } catch (e: any) {
    return new Response(`An error occurred: ${e.message}`, { status: 500 });
  }
}
