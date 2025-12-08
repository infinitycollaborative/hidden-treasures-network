'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NotificationDropdown } from './NotificationDropdown'
import {
  getNotificationsForUser,
  markAllNotificationsRead,
  markNotificationRead,
  watchUserNotifications,
} from '@/lib/db-notifications'
import { useAuth } from '@/hooks/use-auth'
import { AppNotification } from '@/types/notification'

export function NotificationBell() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  useEffect(() => {
    if (!user?.uid) return

    getNotificationsForUser(user.uid).then(setNotifications)
    const unsubscribe = watchUserNotifications(user.uid, setNotifications)
    return () => unsubscribe()
  }, [user?.uid])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id)
  }

  const handleMarkAll = async () => {
    if (!user?.uid) return
    await markAllNotificationsRead(user.uid)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="relative"
        aria-label="Notifications"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        ) : null}
      </Button>
      {open ? (
        <NotificationDropdown
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAll}
        />
      ) : null}
    </div>
  )
}
