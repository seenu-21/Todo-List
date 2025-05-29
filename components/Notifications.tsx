import { useEffect, useState } from 'react'
import { Database } from '@/lib/schema'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Notifications({ userId }: { userId?: string }) {
  const supabase = useSupabaseClient<Database>()
  const [notifications, setNotifications] = useState<Database['public']['Tables']['notifications']['Row'][]>([])

  useEffect(() => {
    if (!userId) return
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      setNotifications(data || [])
    }

    fetchNotifications()
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setNotifications(prev => [payload.new as any, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  return (
    <div className="mb-4">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className="p-3 mb-2 bg-blue-100 rounded-lg"
        >
          {notification.message}
        </div>
      ))}
    </div>
  )
}