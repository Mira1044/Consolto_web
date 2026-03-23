import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, ImageIcon, Film, FileText, X } from 'lucide-react';

/**
 * ChatInput — attachment + to the left of the composer; Stream MessageInput as `children`.
 * Menu is portaled to `document.body` so it isn’t clipped by session overflow.
 */
export const ChatInput = ({
  onUpload,
  uploading,
  uploadProgress,
  canSend,
  children,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const fileInputRef = useRef(null);
  const acceptRef = useRef('');
  const buttonWrapRef = useRef(null);
  const menuPortalRef = useRef(null);

  const updateMenuPosition = useCallback(() => {
    if (!showMenu || !buttonWrapRef.current) {
      setMenuStyle(null);
      return;
    }
    const r = buttonWrapRef.current.getBoundingClientRect();
    const width = Math.min(window.innerWidth - 32, 240);
    const left = Math.max(16, Math.min(r.left, window.innerWidth - width - 16));
    const bottom = window.innerHeight - r.top + 10;
    setMenuStyle({ left, bottom, width });
  }, [showMenu]);

  useLayoutEffect(() => {
    updateMenuPosition();
    if (!showMenu) {
return undefined;
}
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [showMenu, updateMenuPosition]);

  useEffect(() => {
    if (!showMenu) {
return;
}
    const close = (e) => {
      const t = e.target;
      if (buttonWrapRef.current?.contains(t)) {
return;
}
      if (menuPortalRef.current?.contains(t)) {
return;
}
      setShowMenu(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showMenu]);

  if (!canSend) {
    return (
      <div className="border-t border-gray-800 bg-black px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
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
    if (file) {
onUpload(file);
}
    e.target.value = '';
  };

  const menuContent =
    showMenu && menuStyle ? (
      <div
        ref={menuPortalRef}
        className="session-chat-attachment-menu fixed rounded-xl border border-gray-600 bg-gray-900 py-2 pl-2 pr-2 shadow-2xl ring-1 ring-black/50 sm:py-2.5 sm:pl-2.5 sm:pr-2.5"
        role="menu"
        style={{
          left: menuStyle.left,
          bottom: menuStyle.bottom,
          width: menuStyle.width,
        }}
      >
        <div className="session-chat-attachment-menu__list flex flex-col gap-1.5 px-1.5 py-1 sm:gap-2 sm:px-2 sm:py-1.5">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-100 hover:bg-gray-800"
            role="menuitem"
            type="button"
            onClick={() => triggerPicker('image/*')}
          >
            <ImageIcon aria-hidden className="shrink-0 text-violet-400" size={20} />
            <span className="text-sm">Image</span>
          </button>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-100 hover:bg-gray-800"
            role="menuitem"
            type="button"
            onClick={() => triggerPicker('video/*')}
          >
            <Film aria-hidden className="shrink-0 text-violet-400" size={20} />
            <span className="text-sm">Video</span>
          </button>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-100 hover:bg-gray-800"
            role="menuitem"
            type="button"
            onClick={() => triggerPicker('*/*')}
          >
            <FileText aria-hidden className="shrink-0 text-violet-400" size={20} />
            <span className="text-sm">Document</span>
          </button>
        </div>
      </div>
    ) : null;

  return (
    <>
      {uploading && (
        <div className="w-full border-b border-gray-800 bg-gray-900/90 px-4 py-2.5">
          <p className="mb-1 text-xs text-white">Uploading… {uploadProgress}%</p>
          <div className="h-2 overflow-hidden rounded-full bg-gray-600">
            <div
              className="h-full bg-violet-500 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="session-chat-composer-row flex w-full min-w-0 items-center gap-2.5 sm:gap-3">
        <div ref={buttonWrapRef} className="session-chat-composer-attach-wrap shrink-0">
          <button
            aria-expanded={showMenu}
            aria-haspopup="menu"
            aria-label={showMenu ? 'Close attachment options' : 'Add attachment'}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-700 p-2.5 text-white shadow-sm transition-colors hover:bg-gray-600 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            disabled={uploading}
            type="button"
            onClick={() => setShowMenu((v) => !v)}
          >
            {showMenu ? (
              <X aria-hidden className="block shrink-0" size={18} strokeWidth={2.25} />
            ) : (
              <Plus aria-hidden className="block shrink-0" size={18} strokeWidth={2.25} />
            )}
          </button>
        </div>

        <div className="session-chat-composer-surface flex min-h-[3rem] min-w-0 flex-1 items-center">
          {children != null ? (
            <div className="session-chat-composer-input-slot min-h-0 min-w-0 flex-1">{children}</div>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          accept={acceptRef.current}
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      {typeof document !== 'undefined' && menuContent
        ? createPortal(menuContent, document.body)
        : null}
    </>
  );
};
