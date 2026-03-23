import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
export const ExpertCard = ({
  expert = {
    name: 'Harsha Waghmare',
    specialization:
      'Technology & IT Support • Agriculture & Environment • Business Strategy Consulting',
    rating: 4.6,
    experience: '5 years',
    sessions: 128,
  },
  onBook: _onBook,
}) => {
  const initials = useMemo(() => {
    if (expert?.initials) {
return String(expert.initials).slice(0, 3).toUpperCase();
}
    const parts = String(expert?.name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const first = parts[0]?.[0] ?? '?';
    const second = parts.length > 1 ? parts[1]?.[0] ?? '' : parts[0]?.[1] ?? '';
    return (first + second).toUpperCase();
  }, [expert?.initials, expert?.name]);

  const specializationText = useMemo(() => {
    if (expert?.specialization) {
return String(expert.specialization);
}
    if (Array.isArray(expert?.tags) && expert.tags.length) {
return expert.tags.join(' • ');
}
    return 'General';
  }, [expert?.specialization, expert?.tags]);

  const options = useMemo(
    () => [
      { minutes: 15, label: '15 min', price: 499 },
      { minutes: 30, label: '30 min', price: 999 },
    ],
    [],
  );

  const [selected, setSelected] = useState(options[0]);
  const isManish = String(expert?.name || '').toLowerCase().includes('manish');

  return (
    <motion.div
      className={`w-full bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md ${
        isManish ? 'flex flex-col' : ''
      }`}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      whileHover={{ y: -2 }}
    >
      <div className={`p-5 sm:p-6 ${isManish ? 'flex flex-col h-full' : ''}`}>
        <div className="flex gap-4">
          <div
            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 ${
              expert?.color || 'bg-blue-50 text-blue-700'
            }`}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight truncate">
              {expert?.name}
            </h3>

            <p
              className="mt-1 text-sm sm:text-base text-slate-500 leading-relaxed overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
              title={specializationText}
            >
              {specializationText}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold text-slate-800">
                  {typeof expert?.rating === 'number' ? expert.rating.toFixed(1) : '—'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span className="truncate">{expert?.experience || '—'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span className="truncate">{expert?.sessions ?? '—'} sessions</span>
              </div>
            </div>
          </div>
        </div>

        {isManish ? <div className="flex-1" /> : null}

        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex w-full sm:w-auto rounded-lg border border-slate-200 bg-slate-50 p-1">
              {options.map((opt) => {
                const active = opt.minutes === selected.minutes;
                return (
                  <motion.button
                    key={opt.minutes}
                    aria-pressed={active}
                    className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                    type="button"
            whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(opt)}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>

            <div className="text-sm sm:text-base font-semibold text-slate-800">
              ₹{selected.price}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
