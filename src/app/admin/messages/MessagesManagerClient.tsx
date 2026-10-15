'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Inbox,
  Search,
  Check,
  Mail,
  Phone,
  Trash2,
  Archive,
  MessageSquare,
} from 'lucide-react';
import { ContactMessage } from '@/types/clinic';

export default function MessagesManagerClient({
  initialMessages,
}: {
  initialMessages: ContactMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = messages.filter((m) => {
    return (
      !searchTerm ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.contact_info.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: !currentRead }),
      });
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, is_read: !currentRead } : m))
      );
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleArchive = async (id: string, currentArchived: boolean) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_archived: !currentArchived }),
      });
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, is_archived: !currentArchived } : m))
      );
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#153E70] flex items-center gap-2">
            <Inbox className="w-5 h-5 text-[#0878F9]" />
            <span>Inquiries &amp; Messages Inbox</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct patient questions and contact form inquiries.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] bg-white"
          />
        </div>
      </div>

      {/* Messages list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-semibold">No messages found</p>
          <p className="text-slate-400 text-xs mt-1">
            New contact submissions will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border transition-all ${
                msg.is_read
                  ? 'bg-white border-slate-200'
                  : 'bg-blue-50/40 border-blue-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-[#153E70]">{msg.name}</span>
                  {!msg.is_read && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                      NEW
                    </span>
                  )}
                  {msg.is_archived && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                      Archived
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(msg.created_at).toLocaleDateString()} at{' '}
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h4 className="font-semibold text-xs text-slate-800 mb-1">
                Subject: {msg.subject}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {msg.message}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Contact Info:</span>
                  <strong className="text-slate-800 font-mono">{msg.contact_info}</strong>

                  {/* If phone */}
                  {msg.contact_info.match(/\d{5,}/) && (
                    <a
                      href={`tel:${msg.contact_info}`}
                      className="px-2 py-1 rounded-md bg-sky-50 text-[#0878F9] hover:bg-sky-100 text-[10px] font-semibold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  )}

                  {/* If email */}
                  {msg.contact_info.includes('@') && (
                    <a
                      href={`mailto:${msg.contact_info}`}
                      className="px-2 py-1 rounded-md bg-sky-50 text-[#0878F9] hover:bg-sky-100 text-[10px] font-semibold flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRead(msg.id, msg.is_read)}
                    className="text-xs text-slate-600 hover:text-[#0878F9] px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                  >
                    {msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    onClick={() => toggleArchive(msg.id, msg.is_archived)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title={msg.is_archived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
