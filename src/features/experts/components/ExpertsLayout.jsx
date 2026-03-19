import { Search, Bell, User, X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import { ExpertCard } from './ExpertCard';
import { Button, Loader } from '@/shared/components/ui';

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
  setActiveCategory,
  showAll,
  setShowAll,
  visibleCategories,
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
            {/* <button
              aria-label="Notifications"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              type="button"
            >
              <Bell className="text-white" size={24} />
            </button> */}
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

        {/* Categories - web: single row */}
        {/* <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <button
              className="text-blue-600 text-base font-medium hover:underline"
              type="button"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show less' : 'Show all'}
            </button>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {visibleCategories.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className={`rounded-xl border py-5 px-4 flex flex-col items-center gap-3 transition-all ${
                  activeCategory === label
                    ? 'bg-blue-600 border-blue-600 shadow-md text-white'
                    : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 shadow-sm'
                }`}
                type="button"
                onClick={() => setActiveCategory(activeCategory === label ? null : label)}
              >
                <Icon
                  className={activeCategory === label ? 'text-white' : 'text-blue-600'}
                  size={28}
                  strokeWidth={1.5}
                />
                <span
                  className={`text-sm font-medium text-center leading-tight ${
                    activeCategory === label ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
          {activeCategory && (
            <button
              className="mt-4 text-base text-blue-600 hover:underline flex items-center gap-2"
              type="button"
              onClick={() => setActiveCategory(null)}
            >
              <X size={18} /> Clear filter: {activeCategory}
            </button>
          )}
        </div> */}

        {/* Experts grid - web: 3 columns */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top experts</h2>
          {filteredExperts.length === 0 ? (
            <div className="text-center py-20 text-lg text-gray-500 bg-white rounded-2xl border border-gray-100">
              No experts found for &quot;{search || (activeCategory ?? '...')}&quot;
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredExperts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} onBook={onBook} />
                  ))}
                </div>

                <motion.div
                  className="hidden md:block fixed right-6 top-[90%] -translate-y-1/2 z-50"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="New booking"
                    onClick={() => {
                      const first = filteredExperts?.[0];
                      if (first) onBook?.(first, 15);
                    }}
                    className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-blue-600 text-white shadow-md focus:ring-blue-500 !transition-none hover:!bg-blue-600 hover:!text-white hover:!shadow-md"
                  >
                    <Plus size={20} />
                  </Button>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
