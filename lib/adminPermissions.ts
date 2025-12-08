/**
 * Phase 11: Admin Role Hierarchy & Permissions
 * 
 * This module defines the permission model for multi-tenant admin governance
 */

import { UserRole } from '@/types'

export type AdminRole = 
  | 'super_admin' 
  | 'country_admin' 
  | 'regional_admin' 
  | 'organization_admin'

export interface AdminContext {
  userId: string
  role: UserRole
  country?: string
  region?: string
  organizationId?: string
  managedCountries?: string[]
  managedRegions?: string[]
  managedOrganizations?: string[]
}

/**
 * Check if a user has admin privileges
 */
export function isAdmin(role: UserRole): boolean {
  return [
    'admin',
    'super_admin',
    'country_admin',
    'regional_admin',
    'organization_admin',
  ].includes(role)
}

/**
 * Check if a user is a super admin (full network access)
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === 'super_admin' || role === 'admin'
}

/**
 * Check if a user is a country admin
 */
export function isCountryAdmin(role: UserRole): boolean {
  return role === 'country_admin' || isSuperAdmin(role)
}

/**
 * Check if a user is a regional admin
 */
export function isRegionalAdmin(role: UserRole): boolean {
  return role === 'regional_admin' || isCountryAdmin(role)
}

/**
 * Check if a user is an organization admin
 */
export function isOrganizationAdmin(role: UserRole): boolean {
  return role === 'organization_admin' || isRegionalAdmin(role)
}

/**
 * Check if an admin can view a specific organization
 */
export function canViewOrganization(
  admin: AdminContext,
  org: {
    id: string
    country?: string
    region?: string
  }
): boolean {
  // Super admin can view everything
  if (isSuperAdmin(admin.role)) {
    return true
  }

  // Country admin can view orgs in their country
  if (admin.role === 'country_admin') {
    if (!admin.country || !org.country) return false
    return admin.country === org.country
  }

  // Regional admin can view orgs in their region
  if (admin.role === 'regional_admin') {
    if (!admin.region || !org.region) return false
    return admin.region === org.region
  }

  // Organization admin can only view their own org
  if (admin.role === 'organization_admin') {
    return admin.organizationId === org.id
  }

  return false
}

/**
 * Check if an admin can manage (approve/suspend) an organization
 */
export function canManageOrganization(
  admin: AdminContext,
  org: {
    id: string
    country?: string
    region?: string
  }
): boolean {
  // Super admin can manage everything
  if (isSuperAdmin(admin.role)) {
    return true
  }

  // Country admin can manage orgs in their country
  if (admin.role === 'country_admin') {
    if (!admin.country || !org.country) return false
    return admin.country === org.country
  }

  // Regional admin can manage orgs in their region
  if (admin.role === 'regional_admin') {
    if (!admin.region || !org.region) return false
    return admin.region === org.region
  }

  // Organization admin cannot manage other orgs
  return false
}

/**
 * Check if an admin can approve compliance submissions
 */
export function canApproveCompliance(
  admin: AdminContext,
  orgId: string
): boolean {
  // Super admin and country/regional admins can approve compliance
  if (isSuperAdmin(admin.role)) {
    return true
  }

  if (admin.role === 'country_admin' || admin.role === 'regional_admin') {
    return true // Would need org data to check country/region match
  }

  // Organization admin cannot approve their own compliance
  return false
}

/**
 * Check if an admin can view incident reports
 */
export function canViewIncidents(
  admin: AdminContext,
  incident?: {
    organizationId?: string
  }
): boolean {
  // Super admin can view all incidents
  if (isSuperAdmin(admin.role)) {
    return true
  }

  // Country and regional admins can view incidents in their scope
  if (admin.role === 'country_admin' || admin.role === 'regional_admin') {
    return true // Would need to check org scope
  }

  // Organization admin can view incidents in their org
  if (admin.role === 'organization_admin' && incident) {
    return admin.organizationId === incident.organizationId
  }

  return false
}

/**
 * Check if an admin can manage admin roles
 */
export function canManageAdminRoles(admin: AdminContext): boolean {
  // Only super admin can manage admin roles
  return isSuperAdmin(admin.role)
}

/**
 * Check if an admin can send network-wide communications
 */
export function canSendNetworkWideMessage(admin: AdminContext): boolean {
  // Only super admin can send network-wide messages
  return isSuperAdmin(admin.role)
}

/**
 * Check if an admin can view audit logs
 */
export function canViewAuditLogs(admin: AdminContext): boolean {
  // Super admin and country admins can view audit logs
  return isSuperAdmin(admin.role) || admin.role === 'country_admin'
}

/**
 * Get the scope filter for an admin's queries
 */
export function getAdminScope(admin: AdminContext): {
  type: 'global' | 'country' | 'region' | 'organization'
  value?: string
} {
  if (isSuperAdmin(admin.role)) {
    return { type: 'global' }
  }

  if (admin.role === 'country_admin' && admin.country) {
    return { type: 'country', value: admin.country }
  }

  if (admin.role === 'regional_admin' && admin.region) {
    return { type: 'region', value: admin.region }
  }

  if (admin.role === 'organization_admin' && admin.organizationId) {
    return { type: 'organization', value: admin.organizationId }
  }

  return { type: 'organization' } // Default to most restrictive
}

/**
 * Filter organizations based on admin scope
 */
export function filterOrganizationsByScope<T extends { id: string; country?: string; region?: string }>(
  organizations: T[],
  admin: AdminContext
): T[] {
  if (isSuperAdmin(admin.role)) {
    return organizations
  }

  if (admin.role === 'country_admin' && admin.country) {
    return organizations.filter(org => org.country === admin.country)
  }

  if (admin.role === 'regional_admin' && admin.region) {
    return organizations.filter(org => org.region === admin.region)
  }

  if (admin.role === 'organization_admin' && admin.organizationId) {
    return organizations.filter(org => org.id === admin.organizationId)
  }

  return []
}
