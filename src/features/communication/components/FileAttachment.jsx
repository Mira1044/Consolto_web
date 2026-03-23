import { Film, FileText, Download } from 'lucide-react';

/**
 * FileAttachment
 *
 * Custom attachment renderer for chat messages.
 * Mirrors CustomAttachment from consolto_app videoCall.jsx lines 216-279.
 *
 * On web we can show image previews inline and provide download links.
 */
export const FileAttachment = ({ attachment }) => {
  if (!attachment) {
return null;
}

  const { type, asset_url, image_url, title, mime_type: _mime_type } = attachment;

  const handleDownload = () => {
    if (!asset_url) {
return;
}
    window.open(asset_url, '_blank', 'noopener');
  };

  if (type === 'image') {
    const src = image_url || asset_url;
    return (
      <button
        className="group relative w-full max-w-[320px] overflow-hidden rounded-lg border border-gray-600"
        onClick={handleDownload}
      >
        <img
          alt={title || 'Image'}
          className="max-h-60 w-full object-cover"
          loading="lazy"
          src={src}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
          <Download className="text-white opacity-0 transition-opacity group-hover:opacity-100" size={24} />
        </div>
      </button>
    );
  }

  const iconMap = {
    video: <Film className="text-primary-400" size={32} />,
    document: <FileText className="text-primary-400" size={32} />,
    file: <FileText className="text-primary-400" size={32} />,
  };

  return (
    <button
      className="flex w-full max-w-[320px] items-center gap-3 rounded-lg bg-gray-700 p-4 text-left transition-colors hover:bg-gray-600"
      onClick={handleDownload}
    >
      {iconMap[type] || <FileText className="text-primary-400" size={32} />}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{title || 'File'}</p>
        <p className="text-xs text-gray-400">Click to download</p>
      </div>
      <Download className="flex-shrink-0 text-white" size={18} />
    </button>
  );
};
