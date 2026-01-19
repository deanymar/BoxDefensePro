
import { v4 as uuidv4 } from 'uuid';
import { PhotoMetadata } from '../types';

/**
 * MOCK CLOUD STORAGE SERVICE
 * Simulates uploading to S3/GCS and generating thumbnails.
 */
export const photoService = {
  upload: async (base64Data: string): Promise<PhotoMetadata> => {
    const photoId = uuidv4();
    
    // In a real prod app, we'd send base64 to an API which uploads to S3.
    // Here we simulate the result of that process.
    return {
      id: photoId,
      // We use a high-quality placeholder for original
      original_url: `https://picsum.photos/seed/${photoId}/1200/800`,
      // We use a smaller placeholder for thumbnail
      thumbnail_url: `https://picsum.photos/seed/${photoId}/300/200`,
      created_at: new Date().toISOString()
    };
  }
};
