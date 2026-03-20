// import { useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ROUTES } from '@/routes/config';

// const upcomingBookings = [
//   {
//     id: 1,
//     doctor: 'Dr. Priya Sharma',
//     specialty: 'Cardiologist',
//     date: 'Mon, 24 Mar 2026',
//     time: '10:30 AM',
//     mode: 'Video',
//     status: 'upcoming',
//     avatar: 'PS',
//     color: 'bg-violet-100 text-violet-700',
//   },
//   {
//     id: 2,
//     doctor: 'Dr. Rahul Mehta',
//     specialty: 'Dermatologist',
//     date: 'Wed, 26 Mar 2026',
//     time: '02:00 PM',
//     mode: 'In-person',
//     status: 'upcoming',
//     avatar: 'RM',
//     color: 'bg-blue-100 text-blue-700',
//   },
//   {
//     id: 3,
//     doctor: 'Dr. Sneha Patel',
//     specialty: 'Neurologist',
//     date: 'Fri, 28 Mar 2026',
//     time: '11:00 AM',
//     mode: 'Video',
//     status: 'upcoming',
//     avatar: 'SP',
//     color: 'bg-pink-100 text-pink-700',
//   },
// ];

// const pastBookings = [
//   {
//     id: 4,
//     doctor: 'Dr. Amit Joshi',
//     specialty: 'Orthopedic',
//     date: 'Mon, 10 Mar 2026',
//     time: '09:00 AM',
//     mode: 'In-person',
//     status: 'completed',
//     avatar: 'AJ',
//     color: 'bg-green-100 text-green-700',
//   },
//   {
//     id: 5,
//     doctor: 'Dr. Kavita Nair',
//     specialty: 'Gynecologist',
//     date: 'Thu, 06 Mar 2026',
//     time: '03:30 PM',
//     mode: 'Video',
//     status: 'completed',
//     avatar: 'KN',
//     color: 'bg-teal-100 text-teal-700',
//   },
//   {
//     id: 6,
//     doctor: 'Dr. Rohan Das',
//     specialty: 'Psychiatrist',
//     date: 'Tue, 04 Mar 2026',
//     time: '01:00 PM',
//     mode: 'Video',
//     status: 'cancelled',
//     avatar: 'RD',
//     color: 'bg-red-100 text-red-700',
//   },
//   {
//     id: 7,
//     doctor: 'Dr. Meera Iyer',
//     specialty: 'Pediatrician',
//     date: 'Sat, 01 Mar 2026',
//     time: '10:00 AM',
//     mode: 'In-person',
//     status: 'cancelled',
//     avatar: 'MI',
//     color: 'bg-orange-100 text-orange-700',
//   },
// ];

// function StatusBadge({ status }) {
//   const styles = {
//     upcoming: 'bg-blue-50 text-blue-600 border border-blue-200',
//     completed: 'bg-green-50 text-green-600 border border-green-200',
//     cancelled: 'bg-red-50 text-red-500 border border-red-200',
//   };
//   return (
//     <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </span>
//   );
// }

// function ModeIcon({ mode }) {
//   if (mode === 'Video') {
//     return (
//       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z"
//         />
//       </svg>
//     );
//   }
//   return (
//     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
//       />
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   );
// }

// function BookingCard({ booking, isUpcoming, onPrimary, onReschedule, onCancel, onBookAgain, onViewSummary }) {
//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
//       <div className="flex items-start gap-4">
//         <div
//           className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 ${booking.color}`}
//         >
//           {booking.avatar}
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2 mb-1">
//             <div>
//               <p className="font-semibold text-slate-800 text-sm">{booking.doctor}</p>
//               <p className="text-xs text-slate-500">{booking.specialty}</p>
//             </div>
//             <StatusBadge status={booking.status} />
//           </div>

//           <div className="flex flex-wrap gap-3 mt-3">
//             <div className="flex items-center gap-1.5 text-xs text-slate-500">
//               <svg
//                 className="w-3.5 h-3.5 text-violet-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <rect x="3" y="4" width="18" height="18" rx="2" />
//                 <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
//               </svg>
//               {booking.date}
//             </div>
//             <div className="flex items-center gap-1.5 text-xs text-slate-500">
//               <svg
//                 className="w-3.5 h-3.5 text-violet-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path strokeLinecap="round" d="M12 6v6l4 2" />
//               </svg>
//               {booking.time}
//             </div>
//             <div className="flex items-center gap-1.5 text-xs text-slate-500">
//               <span className="text-violet-400">
//                 <ModeIcon mode={booking.mode} />
//               </span>
//               {booking.mode}
//             </div>
//           </div>
//         </div>
//       </div>

//       {isUpcoming && (
//         <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
//           <button
//             type="button"
//             onClick={() => onPrimary?.(booking)}
//             className="flex-1 py-2 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
//           >
//             {booking.mode === 'Video' ? 'Join Call' : 'View Details'}
//           </button>
//           <button
//             type="button"
//             onClick={() => onReschedule?.(booking)}
//             className="flex-1 py-2 rounded-lg text-xs font-medium border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 transition-colors"
//           >
//             Reschedule
//           </button>
//           <button
//             type="button"
//             onClick={() => onCancel?.(booking)}
//             className="py-2 px-3 rounded-lg text-xs font-medium border border-red-200 hover:bg-red-50 text-red-500 transition-colors"
//           >
//             Cancel
//           </button>
//         </div>
//       )}

//       {!isUpcoming && booking.status === 'completed' && (
//         <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
//           <button
//             type="button"
//             onClick={() => onBookAgain?.(booking)}
//             className="flex-1 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-900 text-white transition-colors"
//           >
//             Book Again
//           </button>
//           <button
//             type="button"
//             onClick={() => onViewSummary?.(booking)}
//             className="flex-1 py-2 rounded-lg text-xs font-medium border border-slate-200 hover:border-slate-300 text-slate-600 transition-colors"
//           >
//             View Summary
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function EmptyState({ tab, filter }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 text-center">
//       <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
//         <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//           <rect x="3" y="4" width="18" height="18" rx="2" />
//           <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
//         </svg>
//       </div>
//       <p className="font-semibold text-slate-700 mb-1">
//         No {filter !== 'All' ? filter.toLowerCase() : ''} {tab.toLowerCase()} appointments
//       </p>
//       <p className="text-sm text-slate-400">Your appointments will appear here.</p>
//     </div>
//   );
// }

// export const BookingsPage = () => {
//   const navigate = useNavigate();
//   const [tab, setTab] = useState('Upcoming');
//   const [filter, setFilter] = useState('All');

//   const [upcoming, setUpcoming] = useState(upcomingBookings);
//   const [past, setPast] = useState(pastBookings);
//   const [activeBooking, setActiveBooking] = useState(null);
//   const [modal, setModal] = useState(null); // 'details' | 'summary' | null

//   const filtered = useMemo(() => {
//     const pool = tab === 'Upcoming' ? upcoming : past;
//     if (filter === 'All') return pool;
//     return pool.filter((b) => b.status === filter.toLowerCase());
//   }, [tab, filter, upcoming, past]);

//   const upcomingStats = useMemo(() => {
//     return {
//       total: upcoming.length,
//       video: upcoming.filter((b) => b.mode === 'Video').length,
//       inPerson: upcoming.filter((b) => b.mode === 'In-person').length,
//     };
//   }, [upcoming]);

//   const closeModal = () => {
//     setModal(null);
//     setActiveBooking(null);
//   };

//   const openDetails = (booking) => {
//     setActiveBooking(booking);
//     setModal('details');
//   };

//   const openSummary = (booking) => {
//     setActiveBooking(booking);
//     setModal('summary');
//   };

//   const handlePrimary = (booking) => {
//     openDetails(booking);
//   };

//   const handleCancel = (booking) => {
//     const ok = window.confirm(`Cancel appointment with ${booking.doctor}?`);
//     if (!ok) return;

//     setUpcoming((prev) => prev.filter((b) => b.id !== booking.id));
//     setPast((prev) => [
//       {
//         ...booking,
//         status: 'cancelled',
//         color: 'bg-red-100 text-red-700',
//       },
//       ...prev,
//     ]);
//   };

//   const handleReschedule = (booking) => {
//     const nextDate = window.prompt('Enter new date (e.g. Tue, 01 Apr 2026):', booking.date);
//     if (!nextDate) return;
//     const nextTime = window.prompt('Enter new time (e.g. 04:00 PM):', booking.time);
//     if (!nextTime) return;

//     setUpcoming((prev) =>
//       prev.map((b) => (b.id === booking.id ? { ...b, date: nextDate, time: nextTime, status: 'upcoming' } : b)),
//     );
//   };

//   const handleBookAgain = (booking) => {
//     const newId = Date.now();
//     const cloned = {
//       ...booking,
//       id: newId,
//       status: 'upcoming',
//       date: 'Mon, 31 Mar 2026',
//       time: '10:00 AM',
//       color: 'bg-violet-100 text-violet-700',
//     };

//     setUpcoming((prev) => [cloned, ...prev]);
//     setTab('Upcoming');
//     setFilter('All');
//     window.alert('Added to Upcoming bookings.');
//   };
//   const pastFilters = ['All', 'Completed', 'Cancelled'];

//   return (
//     <div className="bg-slate-50 overflow-x-hidden">
//       <div
//         className="relative overflow-hidden"
//         style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)' }}
//       >
//         <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-5" />
//         <div className="absolute top-8 -right-4 w-28 h-28 rounded-full bg-white opacity-5" />

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
//           <div className="flex items-center justify-between mb-1">
//             <div>
//               <h1 className="text-2xl font-bold text-white tracking-tight">Your Bookings</h1>
//               <p className="text-sm text-indigo-200 mt-0.5">View and manage your consultations</p>
//             </div>
//             <button
//               type="button"
//               onClick={() => navigate(ROUTES.EXPERTS)}
//               className="flex items-center gap-2 bg-white text-violet-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors shadow-sm"
//             >
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//               </svg>
//               New Booking
//             </button>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
//           <div className="flex bg-white/15 rounded-xl p-1 gap-2 w-full max-w-sm">
//             {['Upcoming', 'Past'].map((t) => (
//               <button
//                 key={t}
//                 type="button"
//                 onClick={() => {
//                   setTab(t);
//                   setFilter('All');
//                 }}
//                 className={`h-10 min-w-[140px] flex-1 rounded-md px-4 text-sm font-semibold transition-all duration-200 ${
//                   tab === t ? 'bg-white text-violet-700 shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'
//                 }`}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {tab === 'Past' && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex flex-wrap gap-2">
//             {pastFilters.map((f) => (
//               <button
//                 key={f}
//                 type="button"
//                 onClick={() => setFilter(f)}
//                 className={`h-9 min-w-[110px] px-4 rounded-md text-sm font-semibold border transition-all duration-150 ${
//                   filter === f
//                     ? 'bg-violet-600 text-white border-violet-600'
//                     : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600'
//                 }`}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
//         {tab === 'Upcoming' && filtered.length > 0 && (
//           <div className="grid grid-cols-3 gap-3 mb-6">
//             {[
//               { label: 'Total', value: upcomingStats.total, color: 'text-violet-600', bg: 'bg-violet-50' },
//               {
//                 label: 'Video',
//                 value: upcomingStats.video,
//                 color: 'text-blue-600',
//                 bg: 'bg-blue-50',
//               },
//               {
//                 label: 'In-person',
//                 value: upcomingStats.inPerson,
//                 color: 'text-green-600',
//                 bg: 'bg-green-50',
//               },
//             ].map((s) => (
//               <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 text-center`}>
//                 <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
//                 <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {filtered.length === 0 ? (
//           <EmptyState tab={tab} filter={filter} />
//         ) : (
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {filtered.map((b) => (
//               <BookingCard
//                 key={b.id}
//                 booking={b}
//                 isUpcoming={tab === 'Upcoming'}
//                 onPrimary={handlePrimary}
//                 onReschedule={handleReschedule}
//                 onCancel={handleCancel}
//                 onBookAgain={handleBookAgain}
//                 onViewSummary={openSummary}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {modal && activeBooking && (
//         <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
//             <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
//               <div>
//                 <p className="text-xs text-slate-500">
//                   {modal === 'summary' ? 'Consultation Summary' : 'Booking Details'}
//                 </p>
//                 <p className="font-semibold text-slate-800">{activeBooking.doctor}</p>
//                 <p className="text-sm text-slate-500">{activeBooking.specialty}</p>
//               </div>
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
//               >
//                 Close
//               </button>
//             </div>

//             <div className="p-5">
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="rounded-xl bg-slate-50 p-3">
//                   <p className="text-xs text-slate-500">Date</p>
//                   <p className="text-sm font-semibold text-slate-800">{activeBooking.date}</p>
//                 </div>
//                 <div className="rounded-xl bg-slate-50 p-3">
//                   <p className="text-xs text-slate-500">Time</p>
//                   <p className="text-sm font-semibold text-slate-800">{activeBooking.time}</p>
//                 </div>
//                 <div className="rounded-xl bg-slate-50 p-3">
//                   <p className="text-xs text-slate-500">Mode</p>
//                   <p className="text-sm font-semibold text-slate-800">{activeBooking.mode}</p>
//                 </div>
//                 <div className="rounded-xl bg-slate-50 p-3">
//                   <p className="text-xs text-slate-500">Status</p>
//                   <p className="text-sm font-semibold text-slate-800">
//                     {activeBooking.status.charAt(0).toUpperCase() + activeBooking.status.slice(1)}
//                   </p>
//                 </div>
//               </div>

//               {modal === 'summary' ? (
//                 <div className="mt-4 rounded-xl border border-slate-200 p-4">
//                   <p className="text-sm font-semibold text-slate-800 mb-1">Notes</p>
//                   <p className="text-sm text-slate-600">
//                     This is a placeholder summary. When backend is ready, we’ll show prescription / advice / follow-up
//                     here.
//                   </p>
//                 </div>
//               ) : null}

//               <div className="flex gap-2 mt-5">
//                 {tab === 'Upcoming' ? (
//                   <>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         closeModal();
//                         handleReschedule(activeBooking);
//                       }}
//                       className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 text-slate-700"
//                     >
//                       Reschedule
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         closeModal();
//                         handleCancel(activeBooking);
//                       }}
//                       className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-red-200 hover:bg-red-50 text-red-600"
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       closeModal();
//                       handleBookAgain(activeBooking);
//                     }}
//                     className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-950 text-white"
//                   >
//                     Book Again
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/routes/config';
import { bookingService } from '../services/bookingService';
import { Button, Loader } from '@/shared/components/ui';
import { useErrorHandler } from '@/shared/services/error';
import { useAuth } from '@/context/AuthContext';
import { expertsService } from '@/features/experts/services/expertsService';
import { apiRequest } from '@/shared/services/api';
import { UpcomingAppointmentCard } from '../components/UpcomingAppointmentCard';

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
    accent: '#7c3aed',
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
    accent: '#2563eb',
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
    accent: '#db2777',
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
    accent: '#16a34a',
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
    accent: '#0d9488',
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
    accent: '#dc2626',
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
    accent: '#ea580c',
  },
];

function StatusBadge({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const styles = {
    upcoming: 'bg-blue-50 text-blue-600 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    cancelled: 'bg-red-50 text-red-500 border-red-200',
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled
      className={`inline-flex items-center justify-center h-7 px-3 rounded-full text-[11px] font-semibold border ${styles[status]} cursor-default select-none`}
    >
      {label}
    </Button>
  );
}

function ModeIcon({ mode }) {
  if (mode === 'Video') {
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BookingCard({ booking, index, isUpcoming, onPrimary, onReschedule, onCancel, onBookAgain, onViewSummary }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      {/* Accent top bar */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, ${booking.accent}cc, ${booking.accent}44)` }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Header – allow wrapping for long names */}
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 ${booking.color}`}
          >
            {booking.avatar}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm leading-tight break-words">
              {booking.doctor}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 break-words">{booking.specialty}</p>
          </div>
          <div className="flex-shrink-0">
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Info pills */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-violet-400 flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <span className="font-medium text-slate-600 break-words">
              {!booking.date || booking.date === '—' ? 'Date not set' : booking.date}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-violet-400 flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
            </span>
            <span className="font-medium text-slate-600 break-words">
              {!booking.time || booking.time === '—' ? 'Time not set' : booking.time}
            </span>
            <span className="ml-auto flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full text-slate-500 font-medium flex-shrink-0">
              <span className="text-violet-400">
                <ModeIcon mode={booking.mode} />
              </span>
              {booking.mode}
            </span>
          </div>
        </div>

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1" />

        {/* Upcoming actions – stacked, using reusable Button */}
        {isUpcoming && (
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                type="button"
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => onPrimary?.(booking)}
                className="h-9 text-xs rounded-xl"
              >
                {booking.mode === 'Video' ? 'Join Call' : 'View Details'}
              </Button>
            </motion.div>
            <div className="flex gap-2">
              <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => onReschedule?.(booking)}
                  className="h-9 text-xs rounded-xl border-slate-200"
                >
                  Reschedule
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => onCancel?.(booking)}
                  className="h-9 px-4 text-xs rounded-xl"
                >
                  Cancel
                </Button>
              </motion.div>
            </div>
          </div>
        )}

        {/* Past – completed */}
        {!isUpcoming && booking.status === 'completed' && (
          <div className="flex flex-row gap-2 pt-4 border-t border-slate-100">
            {/* <motion.div whileTap={{ scale: 0.97 }} className="flex-1 min-w-0">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onBookAgain?.(booking)}
                className="h-9 text-xs rounded-xl w-full"
              >
                Book Again
              </Button>
            </motion.div> */}
            <motion.div whileTap={{ scale: 0.97 }} className="flex-1 min-w-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onViewSummary?.(booking)}
                className="h-9 text-xs rounded-xl w-full border-slate-200"
              >
                View Summary
              </Button>
            </motion.div>
          </div>
        )}

        {/* Past – cancelled */}
        {!isUpcoming && booking.status === 'cancelled' && (
          <div className="pt-4 border-t border-slate-100">
            <div className="h-9 flex items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400 font-medium">
              Appointment Cancelled
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ tab, filter }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
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
    </motion.div>
  );
}

export const BookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleApiError } = useErrorHandler();
  const isConsultant =
    String(user?.role || '').toUpperCase() === 'CONSULTANT' || String(user?.role || '').toUpperCase() === 'EXPERT';
  const userRole = isConsultant ? 'consultant' : 'user';
  const [tab, setTab] = useState('Upcoming');
  const [filter, setFilter] = useState('All');

  const [upcoming, setUpcoming] = useState(upcomingBookings);
  const [past, setPast] = useState(pastBookings);
  const [isLoading, setIsLoading] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [modal, setModal] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);

  // Upcoming actions modals
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const [rescheduleFilterDate, setRescheduleFilterDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const initialsFromName = (name) => {
    const cleaned = String(name || '').trim();
    if (!cleaned) return '?';
    const parts = cleaned.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts.length > 1 ? parts[1]?.[0] ?? '' : (parts[0]?.[1] ?? '');
    return (first + second).toUpperCase().slice(0, 3) || cleaned.slice(0, 1).toUpperCase();
  };

  const formatDateTime = ({ bookedDate, startTime }) => {
    const d = bookedDate ? new Date(bookedDate) : null;
    if (!d || Number.isNaN(d.getTime())) {
      return { date: 'Date not set', time: startTime || 'Time not set', ts: null };
    }

    const date = d.toLocaleDateString(undefined, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    // Build a sortable timestamp from date + appointment_start_time (e.g. "5:00 PM")
    let ts = null;
    if (startTime) {
      const m = String(startTime).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (m) {
        let hour = Number(m[1]);
        const minute = Number(m[2]);
        const period = m[3].toUpperCase();
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        const withTime = new Date(d);
        withTime.setHours(hour, minute, 0, 0);
        ts = withTime.getTime();
      }
    }

    return { date, time: startTime || 'Time not set', ts };
  };

  const normalizeAppointment = (a, index) => {
    // Try common backend shapes; falls back safely if fields are missing
    const consultantName =
      a?.consultant?.user_name ??
      a?.consultant_name ??
      a?.consultant?.name ??
      a?.consultant?.userName ??
      'Consultant';

    const specialization =
      (Array.isArray(a?.consultant?.specialization) && a.consultant.specialization[0]) ||
      a?.specialization ||
      a?.category ||
      'Consultation';

    const modeRaw = a?.mode ?? a?.meeting_type ?? a?.type ?? a?.session_type ?? a?.appointment_mode;
    const mode = String(modeRaw || '').toLowerCase().includes('video') ? 'Video' : 'In-person';

    const statusRaw = String(a?.status ?? a?.appointment_status ?? '').toLowerCase();
    const when = formatDateTime({
      bookedDate: a?.appointment_booked_date ?? a?.scheduledAt ?? a?.start_time ?? a?.startTime ?? a?.dateTime ?? a?.createdAt,
      startTime: a?.appointment_start_time ?? a?.start_time_label ?? a?.startTimeLabel ?? a?.start_time,
    });
    const now = Date.now();
    const computedUpcoming = when.ts != null ? when.ts > now : statusRaw === 'upcoming';

    let status = 'upcoming';
    if (statusRaw.includes('cancel')) status = 'cancelled';
    else if (statusRaw.includes('complete') || statusRaw.includes('done')) status = 'completed';
    else status = computedUpcoming ? 'upcoming' : 'completed';

    const palette = [
      ['bg-violet-100 text-violet-700', '#7c3aed'],
      ['bg-blue-100 text-blue-700', '#2563eb'],
      ['bg-pink-100 text-pink-700', '#db2777'],
      ['bg-green-100 text-green-700', '#16a34a'],
      ['bg-orange-100 text-orange-700', '#ea580c'],
      ['bg-teal-100 text-teal-700', '#0d9488'],
    ];
    const [color, accent] = palette[index % palette.length];

    return {
      id: a?._id ?? a?.id ?? `appt-${index}`,
      doctor: String(consultantName).trim(),
      specialty: String(specialization).trim(),
      date: when.date,
      time: when.time,
      mode,
      status,
      avatar: initialsFromName(consultantName),
      color,
      accent,
      raw: a,
    };
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const fetchAppointments = isConsultant
          ? bookingService.getConsultantAppointments
          : bookingService.getUserAppointments;

        const [upcomingResp, pastResp] = await Promise.all([
          fetchAppointments({ page: 1, limit: 10, status_type: 'upcoming' }),
          fetchAppointments({ page: 1, limit: 10, status_type: 'past' }),
        ]);

        const normalizedUpcoming = (upcomingResp?.appointments || []).map((a, i) =>
          normalizeAppointment(a, i),
        );
        const normalizedPast = (pastResp?.appointments || []).map((a, i) =>
          normalizeAppointment(a, i + normalizedUpcoming.length),
        );

        if (!mounted) return;
        setUpcoming(normalizedUpcoming);
        setPast(normalizedPast);
      } catch (err) {
        handleApiError(err, {
          context: {
            feature: 'booking',
            action:
              String(user?.role || '').toUpperCase() === 'CONSULTANT' ? 'getConsultantAppointments' : 'getUserAppointments',
          },
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [handleApiError, user?.role, refreshTick]);

  const filtered = useMemo(() => {
    const pool = tab === 'Upcoming' ? upcoming : past;
    if (filter === 'All') return pool;
    return pool.filter((b) => b.status === filter.toLowerCase());
  }, [tab, filter, upcoming, past]);

  const upcomingStats = useMemo(() => ({
    total: upcoming.length,
    video: upcoming.filter((b) => b.mode === 'Video').length,
    inPerson: upcoming.filter((b) => b.mode === 'In-person').length,
  }), [upcoming]);

  const closeModal = () => {
    setModal(null);
    setActiveBooking(null);

    // Cancel state
    setCancelReason('');
    setCancelLoading(false);

    // Reschedule state
    setRescheduleFilterDate('');
    setAvailableSlots([]);
    setSelectedAvailabilityId('');
    setLoadingSlots(false);
    setRescheduleLoading(false);
  };
  const openDetails = (booking) => { setActiveBooking(booking); setModal('details'); };
  const openSummary = (booking) => { setActiveBooking(booking); setModal('summary'); };
  const handlePrimary = (booking) => openDetails(booking);

  const toDateOnly = (d) => String(d || '').slice(0, 10);

  const timeToMinutes = (timeStr) => {
    const t = String(timeStr || '').trim();
    if (!t) return 0;

    // "2:30 PM"
    const m12 = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m12) {
      let hour = Number(m12[1]);
      const mins = Number(m12[2]);
      const period = m12[3].toUpperCase();
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return hour * 60 + mins;
    }

    // "14:30"
    const m24 = t.match(/^(\d{1,2}):(\d{2})$/);
    if (m24) {
      const hour = Number(m24[1]);
      const mins = Number(m24[2]);
      return hour * 60 + mins;
    }

    return 0;
  };

  const fetchAvailabilitySlots = async (consultantId, duration, currentBookingRaw, dateOnly = '') => {
    if (!consultantId || !duration) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    setAvailableSlots([]);

    try {
      const params = {
        consultant_id: consultantId,
        duration,
        is_booked: false,
      };
      if (dateOnly) params.date = dateOnly;

      const payload = await apiRequest.get('/consultant/availability', { params });

      const slots = Array.isArray(payload?.data?.data)
        ? payload.data.data
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

      const currentAvailabilityId =
        currentBookingRaw?.availability_id || currentBookingRaw?.availabilityId || currentBookingRaw?.availabilityID;

      const currentAppointmentBookedDate = currentBookingRaw?.appointment_booked_date;

      const filteredSlots = slots
        .filter((slot) => {
          if (!slot) return false;
          if (slot.type === 'SPECIFIC') {
            return slot._id !== currentAvailabilityId && slot.available_date !== currentAppointmentBookedDate;
          }
          return slot._id !== currentAvailabilityId;
        })
        .sort((a, b) => timeToMinutes(a?.start_time) - timeToMinutes(b?.start_time));

      setAvailableSlots(filteredSlots);
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'fetchAvailabilitySlots' } });
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleCancel = (booking) => {
    setActiveBooking(booking);
    setCancelReason('');
    setCancelLoading(false);
    setModal('cancel');
  };

  const handleReschedule = async (booking) => {
    const raw = booking?.raw || {};
    const consultantId = raw?.consultant?._id || raw?.consultant_id;
    const duration = raw?.appointment_duration;
    const initialDate = toDateOnly(raw?.appointment_booked_date);

    if (!consultantId || !duration || !initialDate) return;

    setActiveBooking(booking);
    setModal('reschedule');

    setRescheduleFilterDate(initialDate);
    setAvailableSlots([]);
    setSelectedAvailabilityId('');

    await fetchAvailabilitySlots(consultantId, duration, raw, initialDate);
  };

  const handleConfirmCancel = async () => {
    if (!activeBooking) return;
    const raw = activeBooking?.raw || {};

    const appointmentId = raw?._id || activeBooking?.id;
    const reason = cancelReason.trim();

    if (!appointmentId) return;
    if (reason.length < 20) {
      // Match mobile min-length requirement.
      window.alert('Cancellation reason must be at least 20 characters.');
      return;
    }

    setCancelLoading(true);
    try {
      await bookingService.cancelAppointment({
        appointmentId,
        roleTab: userRole,
        reasonToCancel: reason,
      });

      setModal(null);
      setActiveBooking(null);
      setCancelReason('');
      setRefreshTick((t) => t + 1);
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'cancelAppointment' } });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!activeBooking) return;
    const raw = activeBooking?.raw || {};
    const appointmentId = raw?._id || activeBooking?.id;

    const bookingDate = rescheduleFilterDate;
    const selectedSlot = availableSlots.find((s) => s._id === selectedAvailabilityId);

    if (!appointmentId) return;
    if (!selectedAvailabilityId) {
      window.alert('Please select a time slot.');
      return;
    }
    if (!bookingDate) {
      window.alert('Please select a date for the appointment.');
      return;
    }
    if (!selectedSlot) {
      window.alert('Selected slot is no longer available. Please try again.');
      return;
    }

    setRescheduleLoading(true);
    try {
      await bookingService.rescheduleAppointment({
        appointmentId,
        roleTab: userRole,
        newAvailabilityId: selectedAvailabilityId,
        booking_date: ['WEEKLY', 'DAILY'].includes(selectedSlot?.type) ? bookingDate : undefined,
      });

      setModal(null);
      setActiveBooking(null);
      setSelectedAvailabilityId('');
      setAvailableSlots([]);
      setRescheduleFilterDate('');

      setRefreshTick((t) => t + 1);
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'rescheduleAppointment' } });
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleRescheduleDateChange = async (newDateValue) => {
    const dateOnly = String(newDateValue || '').slice(0, 10);
    setRescheduleFilterDate(dateOnly);
    setSelectedAvailabilityId('');

    const raw = activeBooking?.raw || {};
    const consultantId = raw?.consultant?._id || raw?.consultant_id;
    const duration = raw?.appointment_duration;

    if (!consultantId || !duration || !dateOnly) return;
    await fetchAvailabilitySlots(consultantId, duration, raw, dateOnly);
  };

  const handleBookAgain = async (booking) => {
    try {
      const consultantId =
        booking?.raw?.consultant?._id ??
        booking?.raw?.consultantId ??
        booking?.raw?.consultant_id ??
        booking?.raw?.consultantID ??
        null;

      if (!consultantId) {
        navigate(ROUTES.EXPERTS);
        return;
      }

      const { expert } = await expertsService.getConsultantById(consultantId);
      navigate(ROUTES.BOOKING, { state: { expert, duration: 15 } });
    } catch (err) {
      handleApiError(err, { context: { feature: 'booking', action: 'bookAgain' } });
    }
  };

  const pastFilters = ['All', 'Completed', 'Cancelled'];

  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Loader size="lg" text="Loading your bookings..." />
        </div>
      ) : null}
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-5" />
        <div className="absolute top-8 -right-4 w-28 h-28 rounded-full bg-white opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-2xl font-bold text-white tracking-tight">Your Bookings</h1>
              <p className="text-sm text-indigo-200 mt-0.5">View and manage your consultations</p>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => navigate(ROUTES.EXPERTS)}
              className="self-start sm:self-auto flex items-center gap-2 bg-white text-violet-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Booking
            </motion.button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
          <div className="flex bg-white/15 rounded-xl p-1 gap-1 w-full max-w-xs mx-auto">
            {['Upcoming', 'Past'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setFilter('All'); }}
                className={`relative flex-1 h-10 rounded-lg px-4 text-sm font-semibold transition-all duration-200 ${
                  tab === t ? 'text-violet-700' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === t && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter pills (Past only) */}
      <AnimatePresence>
        {tab === 'Past' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
          >
            <div className="flex flex-wrap gap-2">
              {pastFilters.map((f) => {
                const isActive = filter === f;
                return (
                  <Button
                    key={f}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setFilter(f)}
                    className={`inline-flex items-center justify-center !h-8 !px-5 !py-0 rounded-full text-sm font-semibold border !transition-none ${
                      isActive
                        ? 'bg-violet-600 text-white border-violet-600 shadow-sm hover:!bg-violet-600 hover:!text-white hover:!border-violet-600 hover:!shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:!bg-white hover:!text-slate-600 hover:!border-slate-200 hover:!shadow-none'
                    }`}
                  >
                    {f}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats (Upcoming only) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <AnimatePresence mode="wait">
          {tab === 'Upcoming' && filtered.length > 0 && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4"
            >
              {[
                { label: 'Total', value: upcomingStats.total, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                { label: 'Video', value: upcomingStats.video, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                { label: 'In-person', value: upcomingStats.inPerson, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`${s.bg} border ${s.border} rounded-2xl px-4 py-3.5 text-center`}
                >
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <EmptyState key="empty" tab={tab} filter={filter} />
          ) : (
            <motion.div
              key={`${tab}-${filter}`}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
            >
              {filtered.map((b, i) => {
                if (tab === 'Upcoming') {
                  return (
                    <UpcomingAppointmentCard
                      key={b.id}
                      booking={b}
                      userRole={userRole}
                      rescheduleLoading={rescheduleLoading && activeBooking?.id === b.id}
                      cancelLoading={cancelLoading && activeBooking?.id === b.id}
                      onJoinChat={(booking) => {
                        const raw = booking?.raw || {};
                        const appointmentId = raw?._id || booking?.id;
                        const appointmentDate = String(raw?.appointment_booked_date || '').slice(0, 10);
                        const appointmentStartTime = raw?.appointment_start_time;
                        const appointmentEndTime = raw?.appointment_end_time;

                        const otherUserName =
                          userRole === 'consultant'
                            ? raw?.user?.firstName && raw?.user?.lastName
                              ? `${raw.user.firstName} ${raw.user.lastName}`
                              : raw?.user?.firstName || raw?.user?.phoneNumber || 'Client'
                            : raw?.consultant?.user_name || raw?.consultant?.name || 'Consultant';

                        const otherUserId =
                          userRole === 'consultant'
                            ? raw?.user?._id || raw?.user_id
                            : raw?.consultant?._id || raw?.consultant_id;

                        if (!appointmentId || !appointmentDate || !otherUserId) return;

                        navigate(ROUTES.SESSION, {
                          state: {
                            appointmentId,
                            appointmentStartTime,
                            appointmentEndTime,
                            appointmentDate,
                            otherUserName,
                            otherUserId,
                            mode: 'chat',
                            userRole,
                            appointmentStatus: raw?.appointment_status,
                          },
                        });
                      }}
                      onJoinCall={(booking) => {
                        const raw = booking?.raw || {};
                        const appointmentId = raw?._id || booking?.id;
                        const appointmentDate = String(raw?.appointment_booked_date || '').slice(0, 10);
                        const appointmentStartTime = raw?.appointment_start_time;
                        const appointmentEndTime = raw?.appointment_end_time;

                        const otherUserName =
                          userRole === 'consultant'
                            ? raw?.user?.firstName && raw?.user?.lastName
                              ? `${raw.user.firstName} ${raw.user.lastName}`
                              : raw?.user?.firstName || raw?.user?.phoneNumber || 'Client'
                            : raw?.consultant?.user_name || raw?.consultant?.name || 'Consultant';

                        const otherUserId =
                          userRole === 'consultant'
                            ? raw?.user?._id || raw?.user_id
                            : raw?.consultant?._id || raw?.consultant_id;

                        if (!appointmentId || !appointmentDate || !otherUserId) return;

                        navigate(ROUTES.SESSION, {
                          state: {
                            appointmentId,
                            appointmentStartTime,
                            appointmentEndTime,
                            appointmentDate,
                            otherUserName,
                            otherUserId,
                            mode: 'video',
                            userRole,
                            appointmentStatus: raw?.appointment_status,
                          },
                        });
                      }}
                      onRescheduleBooking={handleReschedule}
                      onCancelBooking={handleCancel}
                    />
                  );
                }

                return (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    index={i}
                    isUpcoming={false}
                    onBookAgain={handleBookAgain}
                    onViewSummary={openSummary}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && activeBooking && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Modal accent bar */}
              <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(90deg, ${activeBooking.accent}cc, ${activeBooking.accent}33)` }}
              />

              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${activeBooking.color}`}>
                    {activeBooking.avatar}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      {modal === 'summary'
                        ? 'Consultation Summary'
                        : modal === 'cancel'
                          ? 'Cancel Appointment'
                          : modal === 'reschedule'
                            ? 'Reschedule Appointment'
                            : 'Booking Details'}
                    </p>
                    <p className="font-semibold text-slate-800">{activeBooking.doctor}</p>
                    <p className="text-sm text-slate-500">{activeBooking.specialty}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5">
                {(modal === 'details' || modal === 'summary') && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Date', value: activeBooking.date },
                        { label: 'Time', value: activeBooking.time },
                        { label: 'Mode', value: activeBooking.mode },
                        {
                          label: 'Status',
                          value: activeBooking.status.charAt(0).toUpperCase() + activeBooking.status.slice(1),
                        },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs text-slate-400 font-medium mb-0.5">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {modal === 'summary' && (
                      <div className="mt-4 rounded-xl border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-800 mb-1">Notes</p>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          This is a placeholder summary. When backend is ready, we'll show prescription / advice / follow-up here.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-5">
                      {tab === 'Upcoming' ? (
                        <>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => { closeModal(); handleReschedule(activeBooking); }}
                            className="flex-1 h-10 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 transition-colors"
                          >
                            Reschedule
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => { closeModal(); handleCancel(activeBooking); }}
                            className="flex-1 h-10 rounded-xl text-sm font-semibold border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                          >
                            Cancel
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          type="button"
                          onClick={() => { closeModal(); handleBookAgain(activeBooking); }}
                          className="flex-1 h-10 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-950 text-white transition-colors"
                        >
                          Book Again
                        </motion.button>
                      )}
                    </div>
                  </>
                )}

                {modal === 'cancel' && (
                  <div>
                    <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-4">
                      <p className="text-sm font-semibold text-red-700 mb-1">Appointment</p>
                      <p className="text-sm text-red-800">
                        {activeBooking.date} at {activeBooking.time}
                      </p>
                    </div>

                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Enter cancellation reason..."
                      rows={4}
                      className="w-full resize-none border border-red-200 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-colors bg-white"
                    />

                    <p
                      className={`text-xs mt-2 ${cancelReason.trim().length < 20 ? 'text-red-600' : 'text-slate-500'}`}
                    >
                      {cancelReason.trim().length} / 20 characters minimum
                    </p>

                    <div className="flex items-center gap-2 mt-5">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={closeModal}
                        className="flex-1 h-10 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 transition-colors"
                        disabled={cancelLoading}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={handleConfirmCancel}
                        disabled={cancelLoading || cancelReason.trim().length < 20}
                        className="flex-1 h-10 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                      </motion.button>
                    </div>
                  </div>
                )}

                {modal === 'reschedule' && (
                  <div>
                    <div className="mb-4 rounded-xl bg-blue-50 border-l-4 border-blue-500 p-4">
                      <p className="text-sm text-blue-800 font-medium mb-1">Current Appointment</p>
                      <p className="text-sm text-blue-700">Date: {activeBooking.date}</p>
                      <p className="text-sm text-blue-700">
                        Time: {activeBooking.time}
                      </p>
                      {activeBooking?.raw?.appointment_duration && (
                        <p className="text-sm text-blue-700">
                          Duration: {String(activeBooking.raw.appointment_duration).replaceAll('_', ' ')}
                        </p>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1 font-medium">Select filter date</p>
                      <input
                        type="date"
                        value={rescheduleFilterDate}
                        min={toDateOnly(activeBooking?.raw?.appointment_booked_date)}
                        onChange={(e) => handleRescheduleDateChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1 font-medium">Select new time slot (same duration)</p>
                    </div>

                    {loadingSlots ? (
                      <div className="py-8 items-center justify-center">
                        <p className="text-sm text-slate-600">Loading available slots...</p>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="py-6 items-center justify-center bg-gray-50 rounded-xl">
                        <p className="text-sm text-slate-600 text-center">No available slots found.</p>
                      </div>
                    ) : (
                      <div className="max-h-56 overflow-y-auto pr-1">
                        {availableSlots.map((slot) => {
                          const isSelected = selectedAvailabilityId === slot._id;
                          return (
                            <button
                              key={slot._id}
                              type="button"
                              onClick={() => setSelectedAvailabilityId(slot._id)}
                              className={`w-full text-left p-3 mb-2 rounded-xl border-2 transition-colors ${
                                isSelected
                                  ? 'border-yellow-500 bg-yellow-50'
                                  : 'border-slate-200 bg-white hover:bg-slate-50'
                              }`}
                              disabled={rescheduleLoading}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className={`font-semibold ${
                                    isSelected ? 'text-yellow-800' : 'text-slate-800'
                                  }`}>
                                    {slot.type === 'SPECIFIC'
                                      ? new Date(String(slot.available_date || '')).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                      : `${slot.type} Availability`}
                                  </p>
                                  <p className={`text-sm ${
                                    isSelected ? 'text-yellow-700' : 'text-slate-600'
                                  }`}>
                                    {slot.start_time} - {slot.end_time}
                                  </p>
                                </div>
                                {isSelected && (
                                  <span className="text-yellow-700 font-semibold">✓</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-5">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={closeModal}
                        className="flex-1 h-10 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 transition-colors"
                        disabled={rescheduleLoading}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={handleConfirmReschedule}
                        disabled={rescheduleLoading || !selectedAvailabilityId || !rescheduleFilterDate}
                        className="flex-1 h-10 rounded-xl text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {rescheduleLoading ? 'Rescheduling...' : 'Reschedule'}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};