'use client';

import { useRef, useState, useCallback } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { PACKAGES, CONTENT_RULES, formatCurrency } from '@/lib/utils';
import { Package, UploadedAsset } from '@/types';
import Button from '@/components/ui/Button';

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];

export default function Step1PackageContent() {
  const { selectedPackage, uploadedAsset, setPackage, setAsset, nextStep } = useBookingStore();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) return 'Format non supporté. Utilisez JPG, PNG, WEBP, MP4, MOV ou WEBM.';
    if (file.type.startsWith('image') && file.size > MAX_IMAGE_SIZE) return 'Image trop volumineuse. Maximum 20 MB.';
    if (file.type.startsWith('video') && file.size > MAX_VIDEO_SIZE) return 'Vidéo trop volumineuse. Maximum 100 MB.';
    return null;
  };

  const processFile = useCallback(async (file: File) => {
    setFileError(null);
    const err = validateFile(file);
    if (err) { setFileError(err); return; }

    setUploading(true);

    // Create object URL for local preview
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : 'image';

    // Simulate upload (in production, this would upload to Supabase/S3)
    await new Promise(r => setTimeout(r, 800));

    let width: number | undefined, height: number | undefined, duration: number | undefined;

    if (type === 'image') {
      await new Promise<void>(resolve => {
        const img = new Image();
        img.onload = () => { width = img.naturalWidth; height = img.naturalHeight; resolve(); };
        img.src = url;
      });
    } else {
      await new Promise<void>(resolve => {
        const video = document.createElement('video');
        video.onloadedmetadata = () => { width = video.videoWidth; height = video.videoHeight; duration = video.duration; resolve(); };
        video.src = url;
      });

      // Validate video duration against package
      if (selectedPackage && duration && duration > selectedPackage.duration) {
        setFileError(`Votre vidéo (${Math.round(duration)}s) dépasse la durée du forfait ${selectedPackage.name} (${selectedPackage.duration}s).`);
        setUploading(false);
        URL.revokeObjectURL(url);
        return;
      }
    }

    const asset: UploadedAsset = {
      id: `asset_${Date.now()}`,
      type,
      url,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      width,
      height,
      duration,
      createdAt: new Date().toISOString(),
    };

    setAsset(asset);
    setUploading(false);
  }, [selectedPackage, setAsset]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const canProceed = selectedPackage && uploadedAsset;

  return (
    <div className="flex flex-col gap-10">
      {/* Section 1: Choose Package */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center">1</div>
          <h2 className="text-xl font-bold text-white">Choisissez votre forfait</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PACKAGES.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => setPackage(pkg)}
              className={`relative rounded-2xl p-6 text-left transition-all duration-200 border ${
                selectedPackage?.id === pkg.id
                  ? 'border-amber-500 bg-amber-500/8 shadow-lg shadow-amber-500/10'
                  : 'border-amber-500/15 hover:border-amber-500/35'
              }`}
              style={{ background: selectedPackage?.id === pkg.id ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)' }}
            >
              {pkg.featured && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'linear-gradient(90deg, #C9A84C, #E8C97A)', color: '#0A0A0A' }}>
                  Populaire
                </div>
              )}

              {selectedPackage?.id === pkg.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="text-amber-500 font-black text-3xl mb-1">
                {pkg.duration}<span className="text-xl">s</span>
              </div>
              <div className="text-white font-bold mb-1">{pkg.name}</div>
              <div className="text-gray-500 text-xs mb-4">{pkg.bestFor}</div>
              <div className="text-xl font-black text-white">{formatCurrency(pkg.price)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Upload */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center">2</div>
          <h2 className="text-xl font-bold text-white">Uploadez votre contenu</h2>
        </div>

        {/* Content rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {CONTENT_RULES.map(rule => (
            <div key={rule.title} className="flex gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-xl">{rule.icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-300">{rule.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Zone */}
        <div
          className={`upload-zone rounded-2xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'active' : ''} ${fileError ? 'border-red-500/50' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-amber-400 font-medium">Traitement du fichier...</p>
            </div>
          ) : uploadedAsset ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {uploadedAsset.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={uploadedAsset.url} alt="" className="w-28 h-28 object-cover rounded-xl border border-amber-500/30" />
                ) : (
                  <video src={uploadedAsset.url} className="w-28 h-28 object-cover rounded-xl border border-amber-500/30" muted />
                )}
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-green-400 font-bold">{uploadedAsset.filename}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {uploadedAsset.type === 'video' ? 'Vidéo' : 'Image'} ·{' '}
                  {(uploadedAsset.fileSize / 1024 / 1024).toFixed(1)} MB
                  {uploadedAsset.width && ` · ${uploadedAsset.width}×${uploadedAsset.height}px`}
                  {uploadedAsset.duration && ` · ${Math.round(uploadedAsset.duration)}s`}
                </p>
                <p className="text-amber-500/60 text-xs mt-2">Cliquez pour changer le fichier</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Glissez votre fichier ici</p>
                <p className="text-gray-500 mt-1">ou cliquez pour parcourir</p>
                <p className="text-gray-700 text-sm mt-2">JPG · PNG · WEBP · MP4 · MOV · WEBM</p>
              </div>
            </div>
          )}
        </div>

        {fileError && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fileError}
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="flex justify-end">
        <Button
          variant="gold"
          size="lg"
          disabled={!canProceed}
          onClick={nextStep}
        >
          Voir l&apos;aperçu
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
