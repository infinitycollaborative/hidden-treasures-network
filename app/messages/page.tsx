'use client'

import { useAuth } from '@/hooks/use-auth'
import { MessageThreadList } from '@/components/messaging/MessageThreadList'
import { Card } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MessagesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-2">
            Messages
          </h1>
          <p className="text-gray-600">Connect with mentors and students</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Thread List */}
          <div className="md:col-span-1">
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
              <MessageThreadList />
            </Card>
          </div>

          {/* Empty State */}
          <div className="md:col-span-2">
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the list to view messages
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
