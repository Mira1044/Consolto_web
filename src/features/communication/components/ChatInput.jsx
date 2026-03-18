import { useState, useRef } from 'react';
import { Plus, ImageIcon, Film, FileText, X } from 'lucide-react';

/**
 * ChatInput
 *
 * Custom input area with file attachment menu (image / video / document).
 * Mirrors the input + file menu from consolto_app videoCall.jsx lines 1929-1983.
 *
 * Wraps Stream Chat's built-in MessageInput but adds the attachment picker.
 */
export const ChatInput = ({ onUpload, uploading, uploadProgress, canSend }) => {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);
  const acceptRef = useRef('');

  if (!canSend) {
    return (
      <div className="border-t border-gray-700 bg-gray-800 px-4 py-4">
        <p className="text-center text-sm text-gray-400">
          You can no longer send messages in this chat.
        </p>
      </div>
    );
  }

  const triggerPicker = (accept) => {
    acceptRef.current = accept;
    setShowMenu(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = '';
  };

  return (
    <>
      {uploading && (
        <div className="border-t border-gray-700 bg-gray-800 px-4 py-3">
          <p className="mb-1 text-xs text-white">Uploading... {uploadProgress}%</p>
          <div className="h-2 overflow-hidden rounded-full bg-gray-600">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="relative">
        {showMenu && (
          <div className="absolute bottom-full left-3 mb-2 w-48 rounded-lg bg-white p-1.5 shadow-xl">
            <button
              onClick={() => triggerPicker('image/*')}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-gray-800 hover:bg-gray-100"
            >
              <ImageIcon size={20} className="text-blue-500" />
              <span className="text-sm">Image</span>
            </button>
            <button
              onClick={() => triggerPicker('video/*')}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-gray-800 hover:bg-gray-100"
            >
              <Film size={20} className="text-blue-500" />
              <span className="text-sm">Video</span>
            </button>
            <button
              onClick={() => triggerPicker('*/*')}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-gray-800 hover:bg-gray-100"
            >
              <FileText size={20} className="text-blue-500" />
              <span className="text-sm">Document</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-gray-700 bg-gray-800 px-3 py-2">
          <button
            onClick={() => setShowMenu((v) => !v)}
            disabled={uploading}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
          >
            {showMenu ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptRef.current}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </>
  );
};
