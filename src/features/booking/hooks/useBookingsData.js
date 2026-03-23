import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useErrorHandler } from '@/shared/services/error';
import { bookingService } from '../services/bookingService';
import { useConsultantSelf } from './useConsultantSelf';
import { getInitialBookingsRoleTab } from '../utils/bookingsRoleTab';
import { normalizeAppointment } from '../utils/bookingNormalization';

const FALLBACK_UPCOMING = [];
const FALLBACK_PAST = [];

/**
 * useBookingsData
 *
 * Owns the full data lifecycle for BookingsPage:
 * consultant profile detection, role tab, data fetching,
 * normalization, tab/filter, and derived aggregates.
 */
export function useBookingsData() {
  const { user } = useAuth();
  const { handleApiError } = useErrorHandler();
  const { data: consultantSelf, isSuccess: hasConsultantSelf } = useConsultantSelf();

  const isConsultantByRole =
    String(user?.role || '').toUpperCase() === 'CONSULTANT' || String(user?.role || '').toUpperCase() === 'EXPERT';

  const [hasConsultantProfile, setHasConsultantProfile] = useState(false);
  const showBookingsRoleSwitcher = hasConsultantProfile || isConsultantByRole;

  const [roleTab, setRoleTab] = useState(() => getInitialBookingsRoleTab());
  const userRole = roleTab;
  const roleTabInitRef = useRef(false);

  useEffect(() => {
    if (!user?.token) {
      roleTabInitRef.current = false;
    }
  }, [user?.token]);

  useEffect(() => {
    const hasProfile = Boolean(consultantSelf?._id || hasConsultantSelf);
    setHasConsultantProfile(hasProfile);
  }, [consultantSelf, hasConsultantSelf]);

  useEffect(() => {
    if (!user || roleTabInitRef.current) {
return;
}
    if (!showBookingsRoleSwitcher) {
return;
}
    roleTabInitRef.current = true;
    setRoleTab('consultant');
  }, [user, showBookingsRoleSwitcher]);

  const [tab, setTab] = useState('Upcoming');
  const [filter, setFilter] = useState('All');
  const [upcoming, setUpcoming] = useState(FALLBACK_UPCOMING);
  const [past, setPast] = useState(FALLBACK_PAST);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const fetchAppointments =
          roleTab === 'consultant' ? bookingService.getConsultantAppointments : bookingService.getUserAppointments;

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

        if (!mounted) {
return;
}
        setUpcoming(normalizedUpcoming);
        setPast(normalizedPast);
      } catch (err) {
        handleApiError(err, {
          context: {
            feature: 'booking',
            action: roleTab === 'consultant' ? 'getConsultantAppointments' : 'getUserAppointments',
          },
        });
      } finally {
        if (mounted) {
setIsLoading(false);
}
      }
    };
    load();
    return () => {
 mounted = false;
};
  }, [handleApiError, roleTab, refreshTick]);

  const filtered = useMemo(() => {
    const pool = tab === 'Upcoming' ? upcoming : past;
    if (filter === 'All') {
return pool;
}
    return pool.filter((b) => b.status === filter.toLowerCase());
  }, [tab, filter, upcoming, past]);

  const upcomingStats = useMemo(() => ({
    total: upcoming.length,
    video: upcoming.filter((b) => b.mode === 'Video').length,
    inPerson: upcoming.filter((b) => b.mode === 'In-person').length,
  }), [upcoming]);

  return {
    user,
    userRole,
    roleTab,
    setRoleTab,
    showBookingsRoleSwitcher,
    tab,
    setTab,
    filter,
    setFilter,
    upcoming,
    past,
    isLoading,
    filtered,
    upcomingStats,
    refresh,
  };
}
