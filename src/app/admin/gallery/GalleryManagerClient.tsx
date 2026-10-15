'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Star,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import { GalleryImage } from '@/types/clinic';

export default function GalleryManagerClient({
  initialImages,
}: {
  initialImages: GalleryImage[];
}) {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New photo upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryImage['category']>('treatment');

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMessage(null);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      // Save record in database
      const newRecord: GalleryImage = {
        id: `g-${Date.now()}`,
        title: newTitle || file.name.replace(/\.[^/.]+$/, ''),
        description: newDescription || 'Clinic facility photograph',
        image_url: json.url,
        category: newCategory,
        display_order: images.length + 1,
        is_featured: false,
        show_on_homepage: true,
      };

      const saveRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });

      const saveJson = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveJson.error || 'Failed to save image record');

      setImages([...images, saveJson.image]);
      setNewTitle('');
      setNewDescription('');
      setStatusMessage({ type: 'success', text: 'Photo uploaded and added to gallery!' });
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading photo';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete image "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete image');

      setImages(images.filter((img) => img.id !== id));
      setStatusMessage({ type: 'success', text: `Image deleted.` });
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleHomepage = async (img: GalleryImage) => {
    const updated = { ...img, show_on_homepage: !img.show_on_homepage };
    try {
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setImages(images.map((i) => (i.id === img.id ? updated : i)));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (img: GalleryImage) => {
    const updated = { ...img, is_featured: !img.is_featured };
    try {
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setImages(images.map((i) => (i.id === img.id ? updated : i)));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#153E70] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0878F9]" />
            <span>Clinic Photo Gallery</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload, arrange, and manage authentic photographs of the clinic, equipment, and waiting lounge.
          </p>
        </div>
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

      {/* Upload New Photo Section */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <h3 className="text-sm font-bold text-[#153E70] mb-4">
          Upload New Clinic Photograph
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Photo Title
            </label>
            <input
              type="text"
              placeholder="e.g. Treatment Room 2"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as GalleryImage['category'])}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] bg-white"
            >
              <option value="exterior">Clinic Exterior &amp; Signage</option>
              <option value="treatment">Treatment &amp; Operatory Room</option>
              <option value="equipment">Dental Equipment &amp; Sterilization</option>
              <option value="lounge">Patient Waiting Lounge</option>
              <option value="aesthetic">Cosmetic &amp; Smile Demonstration</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description / Alt Text
            </label>
            <input
              type="text"
              placeholder="Brief description for visitors"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadPhoto}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading to Storage...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Select File &amp; Upload</span>
            </>
          )}
        </label>
      </div>

      {/* Gallery Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 flex flex-col group"
          >
            <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
              <Image
                src={img.image_url}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {img.is_featured && (
                <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Featured</span>
                </div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs text-[#153E70] truncate">
                  {img.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                  {img.description}
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] uppercase font-semibold">
                  {img.category}
                </span>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleHomepage(img)}
                    className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                      img.show_on_homepage
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-400 bg-slate-100'
                    }`}
                    title="Toggle Homepage Visibility"
                  >
                    {img.show_on_homepage ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{img.show_on_homepage ? 'On Home' : 'Hidden'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(img)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      img.is_featured
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-slate-400 hover:text-amber-500 bg-slate-50'
                    }`}
                    title="Toggle Featured"
                  >
                    <Star className={`w-3.5 h-3.5 ${img.is_featured ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(img.id, img.title)}
                  disabled={deletingId === img.id}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
