import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  const { image } = await req.json();
  if (!image) return new Response('No image', { status: 400 });

  // Generate unique filename
  const filename = `strip_${Date.now()}.png`;
  const filePath = path.join(process.cwd(), 'public', 'tmp', filename);

  // Remove base64 prefix
  const base64Data = image.replace(/^data:image\/png;base64,/, '');
  await writeFile(filePath, base64Data, 'base64');

  // Return public URl baru
  return Response.json({ url: `/tmp/${filename}` });
}