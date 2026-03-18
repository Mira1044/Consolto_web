import { useState } from 'react';
import { Star, Briefcase, CalendarDays, ChevronRight } from 'lucide-react';
import { formatINR } from '@/shared/utils/formatters/priceFormatter';

const VerifiedBadge = ({ size = 16 }) => (
  <svg
    className="flex-shrink-0"
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" fill="#2563EB" r="12" />
    <path
      d="M7 12.5l3.5 3.5 6.5-7"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
    />
  </svg>
);

/**
 * ExpertCard
 * Presentational component for a single expert item.
 */
export const ExpertCard = ({ expert, onBook }) => {
  const [selected, setSelected] = useState(15);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex gap-5 mb-5">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${expert.color}`}
        >
          {expert.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-semibold text-gray-900 truncate">{expert.name}</span>
            <VerifiedBadge size={18} />
          </div>
          <p className="text-base text-gray-500 leading-relaxed line-clamp-2">
            {expert.tags.join(' • ')}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {expert.rating != null && (
              <span className="flex items-center gap-1 text-base text-gray-700">
                <Star className="fill-yellow-400 text-yellow-400" size={16} />
                <span className="font-medium">{expert.rating.toFixed(1)}</span>
                {expert.reviews != null && (
                  <span className="text-gray-400">({expert.reviews})</span>
                )}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-base text-gray-500">
              <Briefcase className="text-gray-400" size={16} />
              {expert.experience}
            </span>
            {expert.sessions != null && (
              <span className="flex items-center gap-1.5 text-base text-gray-500">
                <CalendarDays className="text-gray-400" size={16} />
                {expert.sessions} sessions
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-5 border-top border-gray-100">
        <div className="flex items-center gap-6">
          {[15, 30].map((dur) => (
            <label
              key={dur}
              className="flex items-center gap-2.5 cursor-pointer text-base text-gray-700"
            >
              <input
                checked={selected === dur}
                className="accent-blue-600 w-4 h-4"
                name={`dur-${expert.id}`}
                type="radio"
                onChange={() => setSelected(dur)}
              />
              {dur} min: ₹{formatINR(dur === 15 ? expert.price15 : expert.price30)}/-
            </label>
          ))}
        </div>
        {/* <button
          className="bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-5 py-3 rounded-full transition-all flex items-center gap-2 shadow-sm"
          type="button"
          onClick={() => onBook(expert, selected)}
        >
          Book Now
          <ChevronRight size={18} />
        </button> */}
      </div>
    </div>
  );
};
