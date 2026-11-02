import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { analyticsService } from '@/services/analyticsService';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const session = await getSession();

  if (!session || session.role === 'CUSTOMER') {
    redirect('/admin/login?redirect=/admin');
  }

  const [metrics, orders, lowStock] = await Promise.all([
    analyticsService.getDashboardMetrics(),
    orderService.getAllOrders(50),
    productService.getLowStock(),
  ]);

  return (
    <AdminDashboardClient
      initialMetrics={metrics}
      initialOrders={orders as any[]}
      initialLowStock={lowStock as any[]}
    />
  );
}
