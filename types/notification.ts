export type NotificationType =
  | 'event_registration'
  | 'event_reminder'
  | 'event_update'
  | 'organization_approved'
  | 'organization_rejected'
  | 'resource_uploaded'
  | 'resource_approved'
  | 'resource_rejected'
  | 'metrics_reminder'
  | 'message_received'
  | 'system_broadcast'

export interface AppNotification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  link?: string
  read: boolean
  createdAt: Date
}
