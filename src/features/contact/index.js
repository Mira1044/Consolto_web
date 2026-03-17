// Contact feature barrel export
export { useContact } from './hooks/useContact';
export { ContactLayout } from './components/ContactLayout';
export { ContactPage } from './pages/ContactPage';
export { FloatField } from './components/FloatField';
export { MagneticButton } from './components/MagneticButton';
export { InfoItem } from './components/InfoItem';
export { contactSchema, createDefaultContact } from './models/contactModel';
export { validateContact } from './validators/contactValidator';
export { contactService } from './services/contactService';
export { staggerContainer, staggerItem, CONTACT_INFO } from './utils/contactUtils';
