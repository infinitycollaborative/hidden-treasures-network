'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getNotificationsForUser,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/db-notifications'
import { useAuth } from '@/hooks/use-auth'
import { AppNotification, NotificationType } from '@/types/notification'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all')

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return
      const data = await getNotificationsForUser(user.uid)
      setNotifications(data)
    }
    load()
  }, [user?.uid])

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesRead = filter === 'all' ? true : !n.read
      const matchesType = typeFilter === 'all' ? true : n.type === typeFilter
      return matchesRead && matchesType
    })
  }, [notifications, filter, typeFilter])

  const handleMarkAll = async () => {
    if (!user?.uid) return
    await markAllNotificationsRead(user.uid)
    const data = await getNotificationsForUser(user.uid)
    setNotifications(data)
  }

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id)
    const data = await getNotificationsForUser(user?.uid || '')
    setNotifications(data)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-aviation-gold font-semibold">Notifications</p>
          <h1 className="text-3xl font-bold text-aviation-navy">Your alerts</h1>
          <p className="text-gray-600">Stay on top of registrations, approvals, and updates.</p>
        </div>
        <Button variant="outline" onClick={handleMarkAll} aria-label="Mark all notifications as read">
          Mark all read
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
              aria-label="Filter notifications by read state"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
            </select>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as NotificationType | 'all')}
              aria-label="Filter notifications by type"
            >
              <option value="all">All types</option>
              <option value="event_registration">Event registration</option>
              <option value="event_reminder">Event reminder</option>
              <option value="event_update">Event update</option>
              <option value="organization_approved">Organization approved</option>
              <option value="organization_rejected">Organization rejected</option>
              <option value="resource_uploaded">Resource uploaded</option>
              <option value="resource_approved">Resource approved</option>
              <option value="resource_rejected">Resource rejected</option>
              <option value="metrics_reminder">Metrics reminder</option>
              <option value="message_received">Message received</option>
              <option value="system_broadcast">System broadcast</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((notification) => (
            <div
              key={notification.id}
              className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!notification.read ? <Badge>Unread</Badge> : null}
                  <p className="text-sm text-gray-500">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-aviation-navy">{notification.title}</h3>
                <p className="text-sm text-gray-700">{notification.message}</p>
                {notification.link ? (
                  <Link href={notification.link} className="text-sm text-aviation-sky hover:underline">
                    Open
                  </Link>
                ) : null}
              </div>
              <Button variant="outline" size="sm" onClick={() => handleMarkRead(notification.id)}>
                Mark read
              </Button>
            </div>
          ))}
          {!filtered.length ? (
            <p className="text-sm text-gray-600">No notifications to show.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
