/**
 * ------------------------------------------------------------
 * API Route: route.ts
 * 
 * Purpose:
 * Handles the deletion of a specific user scan via an authenticated DELETE request.
 * 
 * Responsibilities:
 * • Extracts and validates the scan ID from the request URL.
 * • Invokes the service layer to remove the scan record for the authenticated user.
 * 
 * Used By:
 * • User Scan Management Module
 * ------------------------------------------------------------
 */

import { createRouteHandler } from '@/core/api/route-utils';
import { deleteUserScan } from '@/features/users/service';
import { NextRequest } from 'next/server';

export const DELETE = createRouteHandler({
  auth: 'user',
  async handler({ req, user }) {
    const url = new URL(req.url);
    const paths = url.pathname.split('/');
    const scanId = paths[paths.length - 1];
    
    if (!scanId || typeof scanId !== 'string') {
      return { success: false, error: 'Invalid scan ID provided' };
    }

    const result = await deleteUserScan(user.id, scanId);
    
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: 'Failed to delete scan or scan not found' };
    }
  }
});
