import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useExperts } from '../hooks/useExperts';
import { ExpertsLayout } from '../components/ExpertsLayout';

/**
 * ExpertsPage
 * Thin page wrapper: wires routing to feature hook and presentational layout.
 * No business logic lives here.
 */
export const ExpertsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const experts = useExperts();

  const handleBook = useCallback(
    (expert, duration) => {
      navigate('/booking', { state: { expert, duration } });
    },
    [navigate],
  );

  return <ExpertsLayout user={user} {...experts} onBook={handleBook} />;
};
