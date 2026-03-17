import { useState, useCallback } from 'react';
import { createDefaultContact } from '../models/contactModel';
import { validateContact } from '../validators/contactValidator';
import { contactService } from '../services/contactService';
import { useErrorHandler } from '@/shared/services/error';

/**
 * useContact
 * Feature-level hook that encapsulates contact form state and submission logic.
 */
export const useContact = () => {
  const [fields, setFields] = useState(createDefaultContact());
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const { handleApiError } = useErrorHandler();

  /**
   * Update a single field value.
   */
  const setField = useCallback(
    (key) => (e) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      // Clear field error on change
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  /**
   * Submit the contact form through the service layer.
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Client-side validation
      const validation = validateContact(fields);
      if (!validation.success) {
        setErrors(validation.errors);
        return;
      }

      setErrors({});
      setSending(true);

      try {
        await contactService.submitContact(fields);
        setSubmitted(true);
        setFields(createDefaultContact());
        // Auto-dismiss the success banner after 3.5s
        setTimeout(() => setSubmitted(false), 3500);
      } catch (err) {
        handleApiError(err, { context: { feature: 'contact', action: 'submitContact' } });
      } finally {
        setSending(false);
      }
    },
    [fields, handleApiError],
  );

  return {
    fields,
    errors,
    submitted,
    sending,
    setField,
    handleSubmit,
  };
};
