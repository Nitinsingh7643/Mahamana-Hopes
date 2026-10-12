import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  MessageSquare, Search, Filter, Mail, Phone, Trash2, 
  CheckCheck, Reply, Clock, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { contactAPI } from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnread, setFilterUnread] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [filterUnread]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 50 };
      if (filterUnread) params.isRead = 'false';
      const res = await contactAPI.getAll(params);
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg: any) => {
    try {
      const newStatus = !msg.isRead;
      const res = await contactAPI.update(msg._id, { isRead: newStatus });
      if (res.data.success) {
        toast.success(newStatus ? 'Marked as read' : 'Marked as unread');
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: newStatus } : m))
        );
        if (selectedMessage?._id === msg._id) {
          setSelectedMessage((prev: any) => ({ ...prev, isRead: newStatus }));
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update message');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await contactAPI.delete(id);
      if (res.data.success) {
        toast.success('Message deleted');
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete message');
    }
  };

  const openMessageModal = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleToggleRead(msg);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const s = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(s) ||
      m.email?.toLowerCase().includes(s) ||
      m.subject?.toLowerCase().includes(s) ||
      m.message?.toLowerCase().includes(s)
    );
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Contact Messages — NGO Admin Panel</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">Inquiries & Contact Messages</h2>
          <p className="text-sm text-gray-600">Review feedback, donor questions, and partnership requests from the Contact page.</p>
        </div>
      </div>

      {/* Top Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterUnread(!filterUnread)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterUnread
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Unread Only ({unreadCount})</span>
          </button>
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-16 px-4">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700">No messages found</h3>
            <p className="text-sm text-gray-500 mt-1">Inquiries submitted via the Contact form will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => openMessageModal(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/80 transition-colors ${
                  !msg.isRead ? 'bg-amber-50/40 border-l-4 border-amber-500' : ''
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    !msg.isRead ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {msg.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{msg.name}</h4>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{msg.email} {msg.phone ? `• ${msg.phone}` : ''}</p>
                    <p className="text-xs font-medium text-gray-800 mt-1 truncate">{msg.subject || 'General Inquiry'}</p>
                    <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{msg.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs text-gray-500">
                  <span>
                    {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleRead(msg)}
                      className={`p-1.5 rounded-lg hover:bg-gray-200 transition-colors ${
                        msg.isRead ? 'text-gray-400' : 'text-amber-600 font-bold'
                      }`}
                      title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your inquiry to Mahamana Hopes')}`}
                      className="p-1.5 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-200"
                      title="Reply via Email"
                    >
                      <Reply className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-gray-900">
                  {selectedMessage.subject || 'Contact Inquiry'}
                </h3>
                <p className="text-xs text-gray-500">
                  Received on {new Date(selectedMessage.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Sender Name:</span>
                  <span className="font-bold text-gray-900">{selectedMessage.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Email:</span>
                  <a href={`mailto:${selectedMessage.email}`} className="font-mono text-primary-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Phone:</span>
                    <a href={`tel:${selectedMessage.phone}`} className="font-mono text-primary-600 hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Message Body</span>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Your message to Mahamana Hopes')}`}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Reply className="w-3.5 h-3.5" /> Reply to Sender
                </a>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
