import { Image, Film, FileText, Download } from 'lucide-react';

/**
 * FileAttachment
 *
 * Custom attachment renderer for chat messages.
 * Mirrors CustomAttachment from consolto_app videoCall.jsx lines 216-279.
 *
 * On web we can show image previews inline and provide download links.
 */
export const FileAttachment = ({ attachment }) => {
  if (!attachment) return null;

  const { type, asset_url, image_url, title, mime_type } = attachment;

  const handleDownload = () => {
    if (!asset_url) return;
    window.open(asset_url, '_blank', 'noopener');
  };

  if (type === 'image') {
    const src = image_url || asset_url;
    return (
      <button
        onClick={handleDownload}
        className="group relative w-full max-w-[320px] overflow-hidden rounded-lg border border-gray-600"
      >
        <img
          src={src}
          alt={title || 'Image'}
          className="max-h-60 w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
          <Download size={24} className="text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </button>
    );
  }

  const iconMap = {
    video: <Film size={32} className="text-primary-400" />,
    document: <FileText size={32} className="text-primary-400" />,
    file: <FileText size={32} className="text-primary-400" />,
  };

  return (
    <button
      onClick={handleDownload}
      className="flex w-full max-w-[320px] items-center gap-3 rounded-lg bg-gray-700 p-4 text-left transition-colors hover:bg-gray-600"
    >
      {iconMap[type] || <FileText size={32} className="text-primary-400" />}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{title || 'File'}</p>
        <p className="text-xs text-gray-400">Click to download</p>
      </div>
      <Download size={18} className="flex-shrink-0 text-white" />
    </button>
  );
};
