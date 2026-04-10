// lib/storage.js — S3-compatible persistent storage for render outputs.
// Works with Cloudflare R2, AWS S3, Backblaze B2, MinIO, etc.
// Zero external deps beyond @aws-sdk/client-s3.

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

// ------------------------------------------------------------------ env
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || "";
const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT || "";       // e.g. https://<account>.r2.cloudflarestorage.com
const STORAGE_REGION = process.env.STORAGE_REGION || "auto";       // "auto" for R2
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY || "";
const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY || "";
const STORAGE_PUBLIC_URL = process.env.STORAGE_PUBLIC_URL || "";   // e.g. https://pub-xxx.r2.dev  or custom domain

// ------------------------------------------------------------------ client (lazy)
let _client = null;
function client() {
  if (_client) return _client;
  _client = new S3Client({
    region: STORAGE_REGION,
    endpoint: STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: STORAGE_ACCESS_KEY,
      secretAccessKey: STORAGE_SECRET_KEY,
    },
    forcePathStyle: true,   // required for R2 / MinIO
  });
  return _client;
}

// ------------------------------------------------------------------ enabled?
function storageEnabled() {
  return !!(STORAGE_BUCKET && STORAGE_ENDPOINT && STORAGE_ACCESS_KEY && STORAGE_SECRET_KEY);
}

// ------------------------------------------------------------------ mime
function mimeForExt(ext) {
  const map = {
    ".mp4": "video/mp4",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".mp3": "audio/mpeg",
    ".svg": "image/svg+xml",
  };
  return map[ext.toLowerCase()] || "application/octet-stream";
}

// ------------------------------------------------------------------ upload
/**
 * Upload a local file to the S3-compatible bucket.
 *
 * @param {string} localPath  Absolute path to the rendered file on disk.
 * @param {string} key        Object key in the bucket (e.g. "renders/AUTH_BB_TOMHANKS_v1.mp4").
 * @returns {Promise<{url: string, bucket: string, key: string}>}
 *          url = public URL if STORAGE_PUBLIC_URL is set, otherwise s3:// URI.
 */
async function uploadFile(localPath, key) {
  if (!storageEnabled()) {
    throw new Error("Storage not configured — set STORAGE_BUCKET, STORAGE_ENDPOINT, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY");
  }

  const body = fs.readFileSync(localPath);
  const ext = path.extname(localPath);

  await client().send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      Body: body,
      ContentType: mimeForExt(ext),
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const url = STORAGE_PUBLIC_URL
    ? `${STORAGE_PUBLIC_URL.replace(/\/+$/, "")}/${key}`
    : `s3://${STORAGE_BUCKET}/${key}`;

  return { url, bucket: STORAGE_BUCKET, key };
}

module.exports = { storageEnabled, uploadFile };
