'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AppNotification } from '@/types/notification'

interface NotificationDropdownProps {
  notifications: AppNotification[]
  onMarkRead: (id: string) => Promise<void>
  onMarkAllRead: () => Promise<void>
}

export function NotificationDropdown({ notifications, onMarkRead, onMarkAllRead }: NotificationDropdownProps) {
  return (
    <div
      className="absolute right-0 mt-2 w-80 rounded-lg border bg-white shadow-xl z-50"
      role="menu"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="text-sm font-semibold text-aviation-navy">Notifications</div>
        <Button variant="ghost" size="sm" onClick={onMarkAllRead} className="text-xs">
          Mark all as read
        </Button>
      </div>
      <ScrollArea className="max-h-80">
        <ul className="divide-y">
          {notifications.map((notification) => (
            <li key={notification.id} className="p-3 hover:bg-gray-50 transition" role="menuitem">
              <div className="flex items-start gap-3">
                {!notification.read ? <Badge className="mt-1">New</Badge> : null}
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-semibold text-aviation-navy">{notification.title}</div>
                  <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                  <div className="text-[11px] text-gray-500">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                  </div>
                  {notification.link ? (
                    <Link
                      href={notification.link}
                      className="text-xs text-aviation-sky hover:underline"
                      onClick={() => onMarkRead(notification.id)}
                    >
                      View details
                    </Link>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
          {!notifications.length ? (
            <li className="p-3 text-sm text-gray-600">You're all caught up.</li>
          ) : null}
        </ul>
      </ScrollArea>
    </div>
  )
}
