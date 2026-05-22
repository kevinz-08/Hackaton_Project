import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_BUCKET_NAME!;

// ─── Subir imagen original ────────────────────────────────────────────────────
export async function subirImagenS3(
  buffer: Buffer,
  filename: string,
  mimetype: string,
): Promise<string> {
  const key = `img/${Date.now()}-${filename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket:      BUCKET,
      Key:         key,
      Body:        buffer,
      ContentType: mimetype,
    }),
  );

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

// ─── Descargar .glb desde Hitem3D y subirlo a S3 ─────────────────────────────
export async function subirGlbS3(
  glbUrl: string,
  taskId: string,
): Promise<string> {
  // Descargar el .glb desde la URL temporal de Hitem3D
  const response = await fetch(glbUrl);
  if (!response.ok) throw new Error(`No se pudo descargar el .glb: ${response.statusText}`);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const key = `GBL/${taskId}.glb`;

  await s3.send(
    new PutObjectCommand({
      Bucket:      BUCKET,
      Key:         key,
      Body:        buffer,
      ContentType: 'model/gltf-binary',
    }),
  );

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
