import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, Heart, GraduationCap, TrendingUp, Building2,
  Monitor, Scale, Star, Briefcase, CalendarDays, ChevronRight,
  User, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
const categories = [
  { icon: Heart, label: "Health & Wellness" },
  { icon: GraduationCap, label: "Career & Education" },
  { icon: TrendingUp, label: "Finance & Investment" },
  { icon: Building2, label: "Business & Startup" },
  { icon: Monitor, label: "Technology & IT Support" },
  { icon: Scale, label: "Legal & Compliance" },
];

const experts = [
  {
    id: 1,
    name: "Mitali Harshal Zagade",
    tags: ["Finance & Investment", "Business & Startup Consulting", "Technology & IT Support"],
    rating: 3.7,
    reviews: 3,
    experience: "2 years",
    sessions: 7,
    price15: 500,
    price30: 1000,
    initials: "MH",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 2,
    name: "Shivraj Patil",
    tags: ["Health & Wellness", "Career & Education Guidance", "IT Infrastructure Planning"],
    rating: 3.0,
    reviews: 2,
    experience: "3 years",
    sessions: 3,
    price15: 499,
    price30: 999,
    initials: "SP",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    name: "Piyush Gayakwad",
    tags: ["Career & Education Guidance", "Health & Wellness"],
    rating: null,
    reviews: null,
    experience: "5 years",
    sessions: 2,
    price15: 580,
    price30: 900,
    initials: "PG",
    color: "bg-green-100 text-green-700",
  },
  {
    id: 4,
    name: "Harsha Waghmare",
    tags: ["Technology & IT Support", "Agriculture & Environment"],
    rating: null,
    reviews: null,
    experience: "5 years",
    sessions: null,
    price15: 600,
    price30: 600,
    initials: "HW",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: 5,
    name: "Manish",
    tags: ["Health & Wellness"],
    rating: null,
    reviews: null,
    experience: "10 years",
    sessions: null,
    price15: 10000,
    price30: 100000,
    initials: "M",
    color: "bg-teal-100 text-teal-700",
  },
];

function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <circle cx="12" cy="12" r="12" fill="#2563EB" />
      <path
        d="M7 12.5l3.5 3.5 6.5-7"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ExpertType {
  id: number;
  name: string;
  tags: string[];
  rating: number | null;
  reviews: number | null;
  experience: string;
  sessions: number | null;
  price15: number;
  price30: number;
  initials: string;
  color: string;
}

function ExpertCard({
  expert,
  onBook,
}: {
  expert: ExpertType;
  onBook: (expert: ExpertType, duration: number) => void;
}) {
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
            {expert.tags.join(" • ")}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {expert.rating != null && (
              <span className="flex items-center gap-1 text-base text-gray-700">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{expert.rating.toFixed(1)}</span>
                {expert.reviews != null && (
                  <span className="text-gray-400">({expert.reviews})</span>
                )}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-base text-gray-500">
              <Briefcase size={16} className="text-gray-400" />
              {expert.experience}
            </span>
            {expert.sessions != null && (
              <span className="flex items-center gap-1.5 text-base text-gray-500">
                <CalendarDays size={16} className="text-gray-400" />
                {expert.sessions} sessions
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
        <div className="flex items-center gap-6">
          {[15, 30].map((dur) => (
            <label
              key={dur}
              className="flex items-center gap-2.5 cursor-pointer text-base text-gray-700"
            >
              <input
                type="radio"
                name={`dur-${expert.id}`}
                checked={selected === dur}
                onChange={() => setSelected(dur)}
                className="accent-blue-600 w-4 h-4"
              />
              {dur} min: ₹{(dur === 15 ? expert.price15 : expert.price30).toLocaleString("en-IN")}/-
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onBook(expert, selected)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-5 py-3 rounded-full transition-all flex items-center gap-2 shadow-sm"
        >
          Book Now
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function ExpertsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleBook = (expert: ExpertType, duration: number) => {
    navigate("/booking", { state: { expert, duration } });
  };

  const visibleCats = showAll ? categories : categories.slice(0, 6);

  const filteredExperts = experts.filter((e) => {
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat =
      !activeCategory ||
      e.tags.some((t) =>
        t.toLowerCase().includes(activeCategory.split(" ")[0].toLowerCase())
      );
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header - web */}
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-8 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-base">Welcome back</p>
                <p className="text-white font-semibold text-xl">
                  {user?.email ?? "User"}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={24} className="text-white" />
            </button>
          </div>
          <div className="mt-8 max-w-2xl">
            <div className="bg-white rounded-xl flex items-center gap-4 px-5 py-4 shadow-sm">
              <Search size={22} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search experts or categories..."
                className="flex-1 text-base text-gray-700 outline-none placeholder-gray-400 bg-transparent min-w-0"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories - web: single row */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 text-base font-medium hover:underline"
            >
              {showAll ? "Show less" : "Show all"}
            </button>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {visibleCats.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveCategory(activeCategory === label ? null : label)}
                className={`rounded-xl border py-5 px-4 flex flex-col items-center gap-3 transition-all
                  ${
                    activeCategory === label
                      ? "bg-blue-600 border-blue-600 shadow-md text-white"
                      : "bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 shadow-sm"
                  }`}
              >
                <Icon
                  size={28}
                  strokeWidth={1.5}
                  className={activeCategory === label ? "text-white" : "text-blue-600"}
                />
                <span
                  className={`text-sm font-medium text-center leading-tight
                    ${activeCategory === label ? "text-white" : "text-gray-600"}`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
          {activeCategory && (
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="mt-4 text-base text-blue-600 hover:underline flex items-center gap-2"
            >
              <X size={18} /> Clear filter: {activeCategory}
            </button>
          )}
        </div>

        {/* Experts grid - web: 3 columns */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top experts</h2>
          {filteredExperts.length === 0 ? (
            <div className="text-center py-20 text-lg text-gray-500 bg-white rounded-2xl border border-gray-100">
              No experts found for &quot;{search || activeCategory || "..."}&quot;
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredExperts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  onBook={handleBook}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
