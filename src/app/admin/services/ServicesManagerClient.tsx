'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import { Service } from '@/types/clinic';
import { ServiceIconRenderer } from '@/components/DentalIcons';

export default function ServicesManagerClient({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const startNewService = () => {
    setIsNew(true);
    setEditingService({
      id: `s-${Date.now()}`,
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      icon_name: 'tooth',
      display_order: services.length + 1,
      is_active: true,
      price_range: 'Standard Consultation',
    });
  };

  const startEditService = (service: Service) => {
    setIsNew(false);
    setEditingService({ ...service });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save service');

      if (isNew) {
        setServices([...services, json.service]);
      } else {
        setServices(services.map((s) => (s.id === json.service.id ? json.service : s)));
      }

      setStatusMessage({ type: 'success', text: `Service "${editingService.title}" saved successfully!` });
      setEditingService(null);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving service';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');

      setServices(services.filter((s) => s.id !== id));
      setStatusMessage({ type: 'success', text: `Service "${title}" deleted.` });
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting service';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (service: Service) => {
    const updated = { ...service, is_active: !service.is_active };
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setServices(services.map((s) => (s.id === service.id ? updated : s)));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const list = [...services];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Update order numbers
    list.forEach((item, idx) => {
      item.display_order = idx + 1;
    });

    setServices(list);

    // Save both updated services
    await Promise.all([
      fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list[index]) }),
      fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(list[targetIndex]) }),
    ]);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#153E70] flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#0878F9]" />
            <span>Services Manager</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, edit, reorder, and control visibility of dental services offered at the clinic.
          </p>
        </div>

        <button
          onClick={startNewService}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Services List Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Icon</th>
                <th className="py-3 px-4">Service Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service, idx) => (
                <tr key={service.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-slate-400 w-4">{service.display_order}</span>
                      <button
                        onClick={() => handleMoveOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(idx, 'down')}
                        disabled={idx === services.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#0878F9]">
                      <ServiceIconRenderer iconName={service.icon_name} className="w-5 h-5 text-[#0878F9]" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {service.title}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                    {service.short_description}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer ${
                        service.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {service.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{service.is_active ? 'Active' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEditService(service)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#0878F9] hover:bg-sky-50 transition-colors"
                        title="Edit Service"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id, service.title)}
                        disabled={deletingId === service.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-[#153E70] text-base">
                {isNew ? 'Add New Dental Service' : `Edit: ${editingService.title}`}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Teeth Whitening"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Icon
                </label>
                <select
                  value={editingService.icon_name}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      icon_name: e.target.value as Service['icon_name'],
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] bg-white"
                >
                  <option value="tooth">Tooth Icon</option>
                  <option value="smile">Smile Icon</option>
                  <option value="sparkles">Sparkles / Cleaning Icon</option>
                  <option value="root-canal">Root Canal Icon</option>
                  <option value="clock">Emergency / Clock Icon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.short_description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, short_description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Service Description
                </label>
                <textarea
                  rows={3}
                  value={editingService.full_description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, full_description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.is_active}
                    onChange={(e) =>
                      setEditingService({ ...editingService, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#0878F9]"
                  />
                  <span className="text-xs font-semibold text-slate-700">Active &amp; Visible</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
