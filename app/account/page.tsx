import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PatronAccountClient from './PatronAccountClient';

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?redirect=/account');
  }

  // Fetch full patron data from Prisma
  const patron = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      addresses: { orderBy: { isDefault: 'desc' } },
      measurements: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
      },
      appointments: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!patron) {
    redirect('/login');
  }

  return <PatronAccountClient initialPatron={patron as any} />;
}
