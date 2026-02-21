
/**
 * PURE UTILITIES: Signal & Payload transformations.
 * Zero dependencies on state or external services.
 */

/**
 * Converts a Blob to a Base64 string for model ingestion.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Handle potential variation in Data URL format
      const base64String = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Strips undefined values from objects to prevent Supabase 400 errors.
 * Now handles null/undefined input gracefully by returning empty object.
 */
export const cleanPayload = <T extends object>(obj: T | undefined | null): T => {
  if (!obj) return {} as T;
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
  ) as T;
};

/**
 * Normalizes MIME types for Gemini API.
 * The API is strict. Browsers are messy. This bridges the gap.
 */
export const getEffectiveMimeType = (blobType: string, fileName?: string): string => {
  // 1. Trust strict types if present
  if (blobType === 'audio/mp3' || blobType === 'audio/mpeg') return 'audio/mp3';
  if (blobType === 'audio/wav' || blobType === 'audio/x-wav') return 'audio/wav';
  if (blobType === 'audio/webm') return 'audio/webm';
  
  // 2. Fallback to extension for generic/missing types
  if (fileName) {
    const lowerName = fileName.toLowerCase();
    if (lowerName.endsWith('.mp3')) return 'audio/mp3';
    if (lowerName.endsWith('.wav')) return 'audio/wav';
    if (lowerName.endsWith('.m4a') || lowerName.endsWith('.mp4') || lowerName.endsWith('.aac')) return 'audio/mp4';
    if (lowerName.endsWith('.webm')) return 'audio/webm';
  }

  // 3. If it's an audio container but specific codec is messy, simplify it
  if (blobType.startsWith('audio/')) {
    // Strip codecs (e.g. "audio/webm;codecs=opus" -> "audio/webm")
    return blobType.split(';')[0];
  }

  // 4. Default safe fallback for audio
  return 'audio/mp3';
};
