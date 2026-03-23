import { Search, User, X } from 'lucide-react';

import { ExpertCard } from './ExpertCard';
import { Loader } from '@/shared/components/ui';

/**
 * ExpertsLayout
 * Pure presentational component that renders the experts page UI.
 */
export const ExpertsLayout = ({
  user,
  isLoading,
  search,
  setSearch,
  activeCategory,
  setActiveCategory: _setActiveCategory,
  showAll: _showAll,
  setShowAll: _setShowAll,
  visibleCategories: _visibleCategories,
  filteredExperts,
  onBook,
}) => {
  if (isLoading) {
    return <Loader fullScreen size="lg" text="Loading experts..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header - web */}
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-8 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
              <div>
                <p className="text-white/80 text-base">Welcome</p>
                <p className="text-white font-semibold text-xl">{user?.firstName ?? 'User'}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 max-w-2xl">
            <div className="bg-white rounded-xl flex items-center gap-4 px-5 py-4 shadow-sm">
              <Search className="text-gray-400 flex-shrink-0" size={22} />
              <input
                className="flex-1 text-base text-gray-700 outline-none placeholder-gray-400 bg-transparent min-w-0"
                placeholder="Search experts..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="text-gray-400 hover:text-gray-600"
                  type="button"
                  onClick={() => setSearch('')}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Experts grid - web: 3 columns */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top experts</h2>
          {filteredExperts.length === 0 ? (
            <div className="text-center py-20 text-lg text-gray-500 bg-white rounded-2xl border border-gray-100">
              No experts found for &quot;{search || (activeCategory ?? '...')}&quot;
            </div>
          ) : (
            <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredExperts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} onBook={onBook} />
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
