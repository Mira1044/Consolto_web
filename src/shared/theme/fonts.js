/**
 * Font System
 * Font loading and configuration
 */

/**
 * Font preload configuration
 * Add your custom fonts here
 */
export const fontConfig = {
  // Primary font (Inter)
  inter: {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    display: 'swap',
    preload: true,
  },
};

/**
 * Generate font-face CSS
 * Use this in your CSS file or inject dynamically
 */
export const generateFontFaces = () => {
  // Inter font is typically loaded via Google Fonts or self-hosted
  // Add your custom font-face declarations here if needed

  return `
    /* Inter font - loaded via Google Fonts or CDN */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  `;
};

/**
 * Font loading utility
 * Preloads fonts for better performance
 */
export const preloadFonts = () => {
  if (typeof document === 'undefined') return;

  const fonts = [
    { family: 'Inter', weights: [400, 500, 600, 700] },
  ];

  fonts.forEach((font) => {
    font.weights.forEach((weight) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      // Adjust URL based on your font hosting
      link.href = `https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2`;
      document.head.appendChild(link);
    });
  });
};
