import { useState, useCallback } from 'react';
import { streamService } from '../services/streamService';
import { FILE_LIMITS, getFileType } from '../utils/sessionUtils';

/**
 * useFileUpload
 *
 * Handles file selection, validation, upload to backend, and sending
 * the attachment in a Stream Chat channel.
 *
 * Mirrors pickImage / pickVideo / pickDocument / uploadAndSendFile
 * from consolto_app/app/(specific)/videoCall.jsx.
 */
export const useFileUpload = (channel) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const upload = useCallback(
    async (file) => {
      if (!channel) {
        setUploadError('Chat not connected');
        return;
      }

      const fileType = getFileType(file.type);
      const limit = FILE_LIMITS[fileType];

      if (file.size > limit) {
        const limitMB = Math.round(limit / (1024 * 1024));
        setUploadError(`File too large. Max ${limitMB} MB for ${fileType}s.`);
        return;
      }

      try {
        setUploading(true);
        setUploadProgress(0);
        setUploadError(null);

        const fileUrl = await streamService.uploadFile(file, setUploadProgress);

        if (!fileUrl || typeof fileUrl !== 'string') {
          throw new Error('Invalid upload response');
        }

        const textPrefix =
          fileType === 'image' ? '📷 Image' : fileType === 'video' ? '🎥 Video' : `📎 ${file.name}`;

        await channel.sendMessage({
          text: textPrefix,
          attachments: [
            {
              type: fileType === 'image' ? 'image' : fileType,
              asset_url: fileUrl,
              image_url: fileType === 'image' ? fileUrl : undefined,
              thumb_url: fileType === 'image' ? fileUrl : undefined,
              title: file.name,
              file_size: file.size,
              mime_type: file.type,
            },
          ],
        });
      } catch (err) {
        console.error('File upload error:', err);
        setUploadError(err.message || 'Upload failed');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [channel],
  );

  const clearError = useCallback(() => setUploadError(null), []);

  return {
    upload,
    uploading,
    uploadProgress,
    uploadError,
    clearError,
  };
};
