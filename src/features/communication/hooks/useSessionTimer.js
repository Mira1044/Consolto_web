import { useState, useEffect, useRef, useCallback } from 'react';
import { getTimeWindows, evaluateTimeStatus } from '../utils/sessionUtils';

/**
 * useSessionTimer
 *
 * Evaluates the current time against appointment windows every second.
 * Mirrors the checkTimeStatus / setInterval logic from
 * consolto_app/app/(specific)/videoCall.jsx.
 */
export const useSessionTimer = ({
  appointmentDate,
  appointmentStartTime,
  appointmentEndTime,
  mode,
  onExpired,
}) => {
  const [timeStatus, setTimeStatus] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [showTwoMinWarning, setShowTwoMinWarning] = useState(false);
  const twoMinWarningShown = useRef(false);
  const expiredHandled = useRef(false);

  const windows = useRef(null);

  useEffect(() => {
    if (!appointmentDate || !appointmentStartTime || !appointmentEndTime) return;
    windows.current = getTimeWindows(appointmentDate, appointmentStartTime, appointmentEndTime);
  }, [appointmentDate, appointmentStartTime, appointmentEndTime]);

  const tick = useCallback(() => {
    if (!windows.current) return;
    const result = evaluateTimeStatus(windows.current, mode);

    setTimeStatus(result.message);
    setCanSendMessage(result.canSendMessage);

    if (result.showTwoMinWarning && !twoMinWarningShown.current) {
      twoMinWarningShown.current = true;
      setShowTwoMinWarning(true);
    }

    if (result.expired && !expiredHandled.current) {
      expiredHandled.current = true;
      setIsExpired(true);
      onExpired?.();
    }
  }, [mode, onExpired]);

  useEffect(() => {
    if (!windows.current || isExpired) return;

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick, isExpired]);

  const dismissTwoMinWarning = useCallback(() => {
    setShowTwoMinWarning(false);
  }, []);

  return {
    timeStatus,
    isExpired,
    canSendMessage,
    showTwoMinWarning,
    dismissTwoMinWarning,
  };
};
