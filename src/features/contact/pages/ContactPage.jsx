import { useContact } from '../hooks/useContact';
import { ContactLayout } from '../components/ContactLayout';

/**
 * ContactPage
 * Thin page wrapper: wires feature hook to presentational layout.
 * No business logic lives here.
 */
export const ContactPage = () => {
  const contact = useContact();

  return <ContactLayout {...contact} />;
};
