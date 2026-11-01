/**
 * Helper to upload image files to ImgBB free hosting API
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '6d207e02198a847aa5ad3ac2222c8252';

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (data?.success && data?.data?.url) {
    return data.data.url;
  }

  throw new Error(data?.error?.message || 'Failed to upload image to ImgBB.');
}
