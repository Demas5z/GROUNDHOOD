import { unlink } from 'fs/promises'
import path from 'path'

/**
 * Delete a locally-stored upload (e.g. a rejected payment proof) from disk.
 *
 * Safe by design:
 *  - Only touches files under public/uploads/ (our own upload paths).
 *  - Ignores remote URLs (http/https) and anything with path traversal.
 *  - Never throws — a missing file is treated as already gone.
 */
export async function deleteUploadedFile(publicPath?: string | null) {
  if (!publicPath) return
  if (!publicPath.startsWith('/uploads/')) return
  if (publicPath.includes('..')) return

  const filePath = path.join(process.cwd(), 'public', publicPath)
  try {
    await unlink(filePath)
  } catch {
    // File already removed or inaccessible — nothing to do.
  }
}
