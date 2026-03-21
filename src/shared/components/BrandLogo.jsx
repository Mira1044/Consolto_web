import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/config';
import {
  CONSOLTO_LOGO_ON_DARK_SRC,
  CONSOLTO_LOGO_PRIMARY_SRC,
  CONSOLTO_WORDMARK_PRIMARY_CLASSES,
  CONSOLTO_WORDMARK_ON_DARK_CLASSES,
} from '@/shared/constants/brand';

/**
 * Shared sizes + layout; wordmark color comes from brand constants for consistency.
 */
const variants = {
  /** Navbar, auth header, booking — same look */
  primary: {
    img: 'h-10 md:h-11 w-auto max-w-[146px] md:max-w-[164px]',
    text: `text-2xl md:text-3xl ${CONSOLTO_WORDMARK_PRIMARY_CLASSES}`,
    gap: 'gap-2.5',
  },
  /** Footer & dark panels */
  onDark: {
    img: 'h-10 md:h-11 w-auto max-w-[146px] md:max-w-[164px]',
    text: `text-2xl md:text-3xl ${CONSOLTO_WORDMARK_ON_DARK_CLASSES}`,
    gap: 'gap-2.5',
  },
  /** Session chrome (dark) — image-only by default; text is white when shown */
  session: {
    img: 'h-8 w-auto max-w-[120px]',
    text: 'text-sm font-bold text-white',
    gap: 'gap-2',
  },
};

/**
 * Consolto logo + wordmark (shared across Navbar, auth layout, session, footer, etc.)
 */
export function BrandLogo({
  to = ROUTES.HOME,
  showText = true,
  variant = 'primary',
  className = '',
  imgClassName = '',
}) {
  const s = variants[variant] || variants.primary;
  const isOnDarkBg = variant === 'onDark' || variant === 'session';

  const hasDedicatedLightAsset =
    typeof CONSOLTO_LOGO_ON_DARK_SRC === 'string' && CONSOLTO_LOGO_ON_DARK_SRC.length > 0;

  const [useLightAssetFailed, setUseLightAssetFailed] = useState(false);

  const imgSrc = (() => {
    if (!isOnDarkBg) return CONSOLTO_LOGO_PRIMARY_SRC;
    if (hasDedicatedLightAsset && !useLightAssetFailed) return CONSOLTO_LOGO_ON_DARK_SRC;
    return CONSOLTO_LOGO_PRIMARY_SRC;
  })();

  const onImgError = useCallback(() => {
    if (isOnDarkBg && hasDedicatedLightAsset && !useLightAssetFailed) {
      setUseLightAssetFailed(true);
    }
  }, [isOnDarkBg, hasDedicatedLightAsset, useLightAssetFailed]);

  /** When no light PNG exists, invert the dark mark so it reads on dark UI */
  const invertForDarkBg =
    isOnDarkBg && (!hasDedicatedLightAsset || useLightAssetFailed);

  return (
    <Link to={to} className={`flex items-center ${s.gap} ${className}`}>
      <img
        src={imgSrc}
        alt="Consolto"
        onError={onImgError}
        className={`${s.img} flex-shrink-0 select-none object-contain ${invertForDarkBg ? 'brightness-0 invert' : ''} ${imgClassName}`}
        draggable={false}
      />
      {showText && <span className={s.text}>Consolto</span>}
    </Link>
  );
}
