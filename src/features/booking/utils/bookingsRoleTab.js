/** Default bookings tab: consultants land on client (consultant) list to avoid an extra user fetch. */
export function getInitialBookingsRoleTab() {
  try {
    const raw = localStorage.getItem('consolto_user');
    if (!raw) return 'user';
    const u = JSON.parse(raw);
    const r = String(u?.role || '').toUpperCase();
    if (r === 'CONSULTANT' || r === 'EXPERT') return 'consultant';
    return 'user';
  } catch {
    return 'user';
  }
}
