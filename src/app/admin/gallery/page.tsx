import React from 'react';
import { getGalleryImages } from '@/lib/db';
import GalleryManagerClient from './GalleryManagerClient';


export default async function AdminGalleryPage() {
  const images = await getGalleryImages(false);
  return <GalleryManagerClient initialImages={images} />;
}
