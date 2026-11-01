/**
 * Resilient Multi-Tier Image Upload Engine:
 * Uploads to internal /api/upload endpoint (same-origin, 0 CORS issues)
 * which seamlessly routes to ImgBB (if key configured) or free cloud CDN.
 * Fallback to direct client-side Base64 Data URL if anything fails.
 */
export async function uploadToImgBB(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data?.success && data?.url) {
      return data.url;
    }
  } catch (err) {
    console.warn('Internal upload endpoint failed, falling back to client reader:', err);
  }

  // Guaranteed client-side fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to parse image file.'));
    reader.readAsDataURL(file);
  });
}
