import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Mail, MailOpen, Trash2, Check, Phone, Mountain } from 'lucide-react'
import { getMessages, markRead, markReplied, deleteMessage } from '../../api/contact'
import Spinner from '../../components/common/Spinner'

const AdminMessages = () => {
  const queryClient = useQueryClient()

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn:  getMessages,
  })

  const readMutation = useMutation({
    mutationFn: markRead,
    onSuccess: () => queryClient.invalidateQueries(['messages']),
  })

  const repliedMutation = useMutation({
    mutationFn: markReplied,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
      toast.success('Marked as replied')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
      toast.success('Message deleted')
    },
  })

  const handleDelete = (id) => {
    if (window.confirm('Delete this message?')) deleteMutation.mutate(id)
  }

  if (isLoading) return <Spinner />

  const unread = messages?.filter(m => !m.isRead).length || 0

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Messages
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {messages?.length || 0} total
          {unread > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
              {unread} unread
            </span>
          )}
        </p>
      </div>

      {!messages?.length ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <p className="text-5xl mb-4">📭</p>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No messages yet</h3>
          <p className="text-gray-400 text-sm">Messages from your contact form will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div
              key={msg._id}
              className="bg-white rounded-2xl p-6 shadow-sm border transition-all"
              style={{ borderColor: msg.isRead ? '#f3f4f6' : '#bbf7d0' }}
            >
              <div className="flex items-start justify-between gap-4">

                {/* Message content */}
                <div className="flex-1">

                  {/* Header row */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: 'var(--color-forest-700)' }}
                    >
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{msg.name}</p>
                      <p className="text-xs text-gray-500">{msg.email}</p>
                    </div>

                    {/* Status badges */}
                    {!msg.isRead && (
                      <span className="badge text-xs font-semibold bg-green-100 text-green-700">
                        New
                      </span>
                    )}
                    {msg.isReplied && (
                      <span className="badge text-xs font-semibold bg-blue-100 text-blue-700">
                        Replied
                      </span>
                    )}
                    {msg.trekInterest && (
                      <span className="badge text-xs bg-amber-100 text-amber-700 flex items-center gap-1">
                        <Mountain size={10} />
                        {msg.trekInterest}
                      </span>
                    )}
                  </div>

                  {/* Message body */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {msg.message}
                  </p>

                  {/* Contact details */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={11} />
                        {msg.phone}
                      </span>
                    )}
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 shrink-0">

                  {/* Mark as read */}
                  <button
                    onClick={() => readMutation.mutate(msg._id)}
                    title={msg.isRead ? 'Already read' : 'Mark as read'}
                    disabled={msg.isRead}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                    style={{ backgroundColor: '#f0fdf4', color: 'var(--color-forest-700)' }}
                  >
                    {msg.isRead ? <MailOpen size={15} /> : <Mail size={15} />}
                  </button>

                  {/* Mark as replied */}
                  <button
                    onClick={() => repliedMutation.mutate(msg._id)}
                    title="Mark as replied"
                    disabled={msg.isReplied}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                    style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}
                  >
                    <Check size={15} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(msg._id)}
                    title="Delete"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-600 text-gray-400"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>
              </div>

              {/* Reply via email button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href={'mailto:' + msg.email + '?subject=Re: Your Trek Inquiry&body=Dear ' + msg.name + ','}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: '#f0fdf4', color: 'var(--color-forest-700)' }}
                  onClick={() => repliedMutation.mutate(msg._id)}
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminMessages