import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import { BookingLayout } from '../components/BookingLayout';

/**
 * BookingPage
 * Thin page wrapper: wires routing to feature hook and presentational layout.
 * No business logic lives here.
 */
export const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || null;
  const expert = state?.expert;
  const initialDuration = state?.duration ?? 15;

  if (!expert) return null;

  const booking = useBooking(expert, initialDuration, navigate);

  return (
    <BookingLayout
      expert={expert}
      state={booking}
      actions={booking}
      navigateBack={() => navigate('/experts')}
    />
  );
};
