import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import { BookingLayout } from '../components/BookingLayout';

const BookingPageContent = ({ expert, initialDuration, navigate }) => {
  const booking = useBooking(expert, initialDuration, navigate);

  return (
    <BookingLayout
      actions={booking}
      expert={expert}
      navigateBack={() => navigate('/experts')}
      state={booking}
    />
  );
};

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

  if (!expert) {
    return null;
  }

  return (
    <BookingPageContent
      expert={expert}
      initialDuration={initialDuration}
      navigate={navigate}
    />
  );
};
