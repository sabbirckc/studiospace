import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') || formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: false, error: 'No image file provided.' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.IMGBB_API_KEY;

    // 1. If an ImgBB key is provided, try ImgBB
    if (apiKey && apiKey.length >= 20) {
      try {
        const imgbbForm = new FormData();
        imgbbForm.append('image', file);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: imgbbForm,
        });

        const imgbbData = await imgbbRes.json().catch(() => ({}));
        if (imgbbData?.success && imgbbData?.data?.url) {
          return NextResponse.json({
            success: true,
            url: imgbbData.data.url,
            provider: 'imgbb',
          });
        }
      } catch (e) {
        console.warn('ImgBB server upload failed, falling back to cloud CDN:', e);
      }
    }

    // 2. High-speed free cloud hosting (Litterbox by Catbox - server-side, no CORS)
    try {
      const cloudForm = new FormData();
      cloudForm.append('reqtype', 'fileupload');
      cloudForm.append('time', '72h');
      const fileName = file instanceof File ? file.name : 'studio-image.jpg';
      cloudForm.append('fileToUpload', file, fileName);

      const cloudRes = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
        method: 'POST',
        body: cloudForm,
      });

      if (cloudRes.ok) {
        const urlText = await cloudRes.text();
        if (urlText && urlText.trim().startsWith('http')) {
          return NextResponse.json({
            success: true,
            url: urlText.trim(),
            provider: 'cloud',
          });
        }
      }
    } catch (e) {
      console.warn('Cloud CDN upload failed, falling back to base64 buffer:', e);
    }

    // 3. Fallback: Convert to Base64 data URL
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      provider: 'base64',
    });
  } catch (err: any) {
    console.error('Upload API route error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Upload failed' }, { status: 500 });
  }
}
