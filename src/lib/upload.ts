/**
 * Resilient Multi-Tier Image Upload Engine:
 * 1. ImgBB Cloud API (when API key is provided)
 * 2. High-speed free cloud hosting (Litterbox API - no key needed)
 * 3. Client-side Base64 Data URL (guaranteed 100% offline & zero-failure fallback)
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  // 1. Try ImgBB if key exists
  if (apiKey && apiKey !== 'your_imgbb_api_key_here') {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (data?.success && data?.data?.url) {
        return data.data.url;
      }
    } catch (err) {
      console.warn('ImgBB API attempt bypassed, using cloud fallback:', err);
    }
  }

  // 2. Try free cloud image hosting (Litterbox by Catbox)
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('time', '72h');
    formData.append('fileToUpload', file);

    const res = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const urlText = await res.text();
      if (urlText && urlText.trim().startsWith('http')) {
        return urlText.trim();
      }
    }
  } catch (err) {
    console.warn('Cloud hosting bypassed, using Data URL fallback:', err);
  }

  // 3. Guaranteed Fallback: Read as base64 Data URL
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
