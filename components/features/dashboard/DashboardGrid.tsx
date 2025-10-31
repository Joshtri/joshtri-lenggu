import { UserRole } from '@/enums/common';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import React from 'react'
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';

export default async function DashboardGrid() {
    const user = await getAuthUser();

    // For now, no protection - default to ADMIN role if not logged in
    const role = user?.role || UserRole.ADMIN;
    const email = user?.email || "guest@example.com";
  
    // Render appropriate dashboard based on role
    if (role === UserRole.ADMIN) {
      return <AdminDashboard userEmail={email} />;
    }

    return <UserDashboard userEmail={email} />;
}
