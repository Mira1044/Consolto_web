import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/config';

const upcomingBookings = [
  {
    id: 1,
    doctor: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    date: 'Mon, 24 Mar 2026',
    time: '10:30 AM',
    mode: 'Video',
    status: 'upcoming',
    avatar: 'PS',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    id: 2,
    doctor: 'Dr. Rahul Mehta',
    specialty: 'Dermatologist',
    date: 'Wed, 26 Mar 2026',
    time: '02:00 PM',
    mode: 'In-person',
    status: 'upcoming',
    avatar: 'RM',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 3,
    doctor: 'Dr. Sneha Patel',
    specialty: 'Neurologist',
    date: 'Fri, 28 Mar 2026',
    time: '11:00 AM',
    mode: 'Video',
    status: 'upcoming',
    avatar: 'SP',
    color: 'bg-pink-100 text-pink-700',
  },
];

const pastBookings = [
  {
    id: 4,
    doctor: 'Dr. Amit Joshi',
    specialty: 'Orthopedic',
    date: 'Mon, 10 Mar 2026',
    time: '09:00 AM',
    mode: 'In-person',
    status: 'completed',
    avatar: 'AJ',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 5,
    doctor: 'Dr. Kavita Nair',
    specialty: 'Gynecologist',
    date: 'Thu, 06 Mar 2026',
    time: '03:30 PM',
    mode: 'Video',
    status: 'completed',
    avatar: 'KN',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    id: 6,
    doctor: 'Dr. Rohan Das',
    specialty: 'Psychiatrist',
    date: 'Tue, 04 Mar 2026',
    time: '01:00 PM',
    mode: 'Video',
    status: 'cancelled',
    avatar: 'RD',
    color: 'bg-red-100 text-red-700',
  },
  {
    id: 7,
    doctor: 'Dr. Meera Iyer',
    specialty: 'Pediatrician',
    date: 'Sat, 01 Mar 2026',
    time: '10:00 AM',
    mode: 'In-person',
    status: 'cancelled',
    avatar: 'MI',
    color: 'bg-orange-100 text-orange-700',
  },
];

function StatusBadge({ status }) {
  const styles = {
    upcoming: 'bg-blue-50 text-blue-600 border border-blue-200',
    completed: 'bg-green-50 text-green-600 border border-green-200',
    cancelled: 'bg-red-50 text-red-500 border border-red-200',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ModeIcon({ mode }) {
  if (mode === 'Video') {
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z"
        />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BookingCard({ booking, isUpcoming, onPrimary, onReschedule, onCancel, onBookAgain, onViewSummary }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 ${booking.color}`}
        >
          {booking.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-semibold text-slate-800 text-sm">{booking.doctor}</p>
              <p className="text-xs text-slate-500">{booking.specialty}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg
                className="w-3.5 h-3.5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {booking.date}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg
                className="w-3.5 h-3.5 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
              {booking.time}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-violet-400">
                <ModeIcon mode={booking.mode} />
              </span>
              {booking.mode}
            </div>
          </div>
        </div>
      </div>

      {isUpcoming && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onPrimary?.(booking)}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
          >
            {booking.mode === 'Video' ? 'Join Call' : 'View Details'}
          </button>
          <button
            type="button"
            onClick={() => onReschedule?.(booking)}
            className="flex-1 py-2 rounded-lg text-xs font-medium border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 transition-colors"
          >
            Reschedule
          </button>
          <button
            type="button"
            onClick={() => onCancel?.(booking)}
            className="py-2 px-3 rounded-lg text-xs font-medium border border-red-200 hover:bg-red-50 text-red-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {!isUpcoming && booking.status === 'completed' && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onBookAgain?.(booking)}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-900 text-white transition-colors"
          >
            Book Again
          </button>
          <button
            type="button"
            onClick={() => onViewSummary?.(booking)}
            className="flex-1 py-2 rounded-lg text-xs font-medium border border-slate-200 hover:border-slate-300 text-slate-600 transition-colors"
          >
            View Summary
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ tab, filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
        </svg>
      </div>
      <p className="font-semibold text-slate-700 mb-1">
        No {filter !== 'All' ? filter.toLowerCase() : ''} {tab.toLowerCase()} appointments
      </p>
      <p className="text-sm text-slate-400">Your appointments will appear here.</p>
    </div>
  );
}

export const BookingsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Upcoming');
  const [filter, setFilter] = useState('All');

  const [upcoming, setUpcoming] = useState(upcomingBookings);
  const [past, setPast] = useState(pastBookings);
  const [activeBooking, setActiveBooking] = useState(null);
  const [modal, setModal] = useState(null); // 'details' | 'summary' | null

  const filtered = useMemo(() => {
    const pool = tab === 'Upcoming' ? upcoming : past;
    if (filter === 'All') return pool;
    return pool.filter((b) => b.status === filter.toLowerCase());
  }, [tab, filter, upcoming, past]);

  const upcomingStats = useMemo(() => {
    return {
      total: upcoming.length,
      video: upcoming.filter((b) => b.mode === 'Video').length,
      inPerson: upcoming.filter((b) => b.mode === 'In-person').length,
    };
  }, [upcoming]);

  const closeModal = () => {
    setModal(null);
    setActiveBooking(null);
  };

  const openDetails = (booking) => {
    setActiveBooking(booking);
    setModal('details');
  };

  const openSummary = (booking) => {
    setActiveBooking(booking);
    setModal('summary');
  };

  const handlePrimary = (booking) => {
    openDetails(booking);
  };

  const handleCancel = (booking) => {
    const ok = window.confirm(`Cancel appointment with ${booking.doctor}?`);
    if (!ok) return;

    setUpcoming((prev) => prev.filter((b) => b.id !== booking.id));
    setPast((prev) => [
      {
        ...booking,
        status: 'cancelled',
        color: 'bg-red-100 text-red-700',
      },
      ...prev,
    ]);
  };

  const handleReschedule = (booking) => {
    const nextDate = window.prompt('Enter new date (e.g. Tue, 01 Apr 2026):', booking.date);
    if (!nextDate) return;
    const nextTime = window.prompt('Enter new time (e.g. 04:00 PM):', booking.time);
    if (!nextTime) return;

    setUpcoming((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, date: nextDate, time: nextTime, status: 'upcoming' } : b)),
    );
  };

  const handleBookAgain = (booking) => {
    const newId = Date.now();
    const cloned = {
      ...booking,
      id: newId,
      status: 'upcoming',
      date: 'Mon, 31 Mar 2026',
      time: '10:00 AM',
      color: 'bg-violet-100 text-violet-700',
    };

    setUpcoming((prev) => [cloned, ...prev]);
    setTab('Upcoming');
    setFilter('All');
    window.alert('Added to Upcoming bookings.');
  };
  const pastFilters = ['All', 'Completed', 'Cancelled'];

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-5" />
        <div className="absolute top-8 -right-4 w-28 h-28 rounded-full bg-white opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Your Bookings</h1>
              <p className="text-sm text-indigo-200 mt-0.5">View and manage your consultations</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.EXPERTS)}
              className="flex items-center gap-2 bg-white text-violet-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Booking
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
          <div className="flex bg-white/15 rounded-xl p-1 gap-2 w-full max-w-sm">
            {['Upcoming', 'Past'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setFilter('All');
                }}
                className={`h-10 min-w-[140px] flex-1 rounded-md px-4 text-sm font-semibold transition-all duration-200 ${
                  tab === t ? 'bg-white text-violet-700 shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === 'Past' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {pastFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`h-9 min-w-[110px] px-4 rounded-md text-sm font-semibold border transition-all duration-150 ${
                  filter === f
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        {tab === 'Upcoming' && filtered.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total', value: upcomingStats.total, color: 'text-violet-600', bg: 'bg-violet-50' },
              {
                label: 'Video',
                value: upcomingStats.video,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                label: 'In-person',
                value: upcomingStats.inPerson,
                color: 'text-green-600',
                bg: 'bg-green-50',
              },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 text-center`}>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState tab={tab} filter={filter} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                isUpcoming={tab === 'Upcoming'}
                onPrimary={handlePrimary}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onBookAgain={handleBookAgain}
                onViewSummary={openSummary}
              />
            ))}
          </div>
        )}
      </div>

      {modal && activeBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  {modal === 'summary' ? 'Consultation Summary' : 'Booking Details'}
                </p>
                <p className="font-semibold text-slate-800">{activeBooking.doctor}</p>
                <p className="text-sm text-slate-500">{activeBooking.specialty}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="text-sm font-semibold text-slate-800">{activeBooking.date}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Time</p>
                  <p className="text-sm font-semibold text-slate-800">{activeBooking.time}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Mode</p>
                  <p className="text-sm font-semibold text-slate-800">{activeBooking.mode}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {activeBooking.status.charAt(0).toUpperCase() + activeBooking.status.slice(1)}
                  </p>
                </div>
              </div>

              {modal === 'summary' ? (
                <div className="mt-4 rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-1">Notes</p>
                  <p className="text-sm text-slate-600">
                    This is a placeholder summary. When backend is ready, we’ll show prescription / advice / follow-up
                    here.
                  </p>
                </div>
              ) : null}

              <div className="flex gap-2 mt-5">
                {tab === 'Upcoming' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        closeModal();
                        handleReschedule(activeBooking);
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 text-slate-700"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeModal();
                        handleCancel(activeBooking);
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-red-200 hover:bg-red-50 text-red-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      handleBookAgain(activeBooking);
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-950 text-white"
                  >
                    Book Again
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

