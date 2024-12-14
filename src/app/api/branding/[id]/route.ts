import { prisma } from '@/src/lib/prisma';

export async function GET(
  request: any,
  { params }: { params: { id: string } },
) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
      company: {
        include: {
          branding: true,
        },
      },
    },
  });

  if (!user) {
    return new Response('user not found', { status: 404 });
  }

  if (!user.company) {
    return new Response('user has no company', { status: 404 });
  }

  let branding = user.company.branding;

  if (!branding) {
    // If the company has no branding, create an empty one
    branding = await prisma.branding.create({
      data: {
        // Add whatever default or empty fields the branding needs
        company: {
          connect: {
            id: user.company.id,
          },
        },
      },
    });
  }

  return new Response(JSON.stringify(branding), { status: 200 });
}

export async function PUT(
  request: any,
  { params, body }: { params: { id: string }; body: any },
) {
  const data = await request.json();

  try {
    const user = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        company: {
          update: {
            branding: {
              update: data,
            },
          },
        },
      },
      include: {
        company: {
          include: {
            branding: true,
          },
        },
      },
    });

    if (!user) {
      return new Response('user not found', { status: 404 });
    }

    if (!user.company) {
      return new Response('user has no company', { status: 404 });
    }

    if (!user.company.branding) {
      return new Response('company has no branding', { status: 404 });
    }

    return new Response(JSON.stringify(user.company.branding), { status: 200 });
  } catch (e: any) {
    return new Response(e.message || 'An error occurred', { status: 500 });
  }
}

export async function DELETE(
  request: any,
  { params }: { params: { id: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      include: {
        company: {
          include: {
            branding: true,
          },
        },
      },
    });

    if (!user) {
      return new Response('user not found', { status: 404 });
    }

    if (!user.company) {
      return new Response('user has no company', { status: 404 });
    }

    if (!user.company.branding) {
      return new Response('company has no branding', { status: 404 });
    }

    const brandingId = user.company.branding.id;
    await prisma.branding.delete({
      where: {
        id: brandingId,
      },
    });

    return new Response('branding deleted', { status: 200 });
  } catch (e: any) {
    return new Response(e.message || 'An error occurred', { status: 500 });
  }
}
