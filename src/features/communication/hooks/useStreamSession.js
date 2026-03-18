import { useState, useRef, useCallback, useEffect } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';
import { streamService } from '../services/streamService';
import {
  getCallId,
  getChannelId,
  saveActiveSession,
  clearActiveSession,
  getActiveSession,
} from '../utils/sessionUtils';

/**
 * useStreamSession
 *
 * Core hook that manages the full lifecycle of Stream Video + Chat clients.
 * Mirrors the initializeServices / cleanup / checkExistingSession logic
 * from consolto_app/app/(specific)/videoCall.jsx.
 */
export const useStreamSession = ({ appointmentId, otherUserId, mode }) => {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [unreadCount, setUnreadCount] = useState(0);

  const isMountedRef = useRef(true);
  const isInitializingRef = useRef(false);
  const callRef = useRef(null);
  const streamClientRef = useRef(null);
  const chatClientRef = useRef(null);
  const currentModeRef = useRef(mode);

  useEffect(() => { currentModeRef.current = currentMode; }, [currentMode]);
  useEffect(() => { callRef.current = call; }, [call]);
  useEffect(() => { streamClientRef.current = streamClient; }, [streamClient]);
  useEffect(() => { chatClientRef.current = chatClient; }, [chatClient]);

  const cleanup = useCallback(async (forceCleanup = false) => {
    if (isCleaningUp && !forceCleanup) return;
    setIsCleaningUp(true);

    try {
      const currentCall = callRef.current;
      const currentStreamClient = streamClientRef.current;
      const currentChatClient = chatClientRef.current;

      if (isMountedRef.current) {
        setStreamClient(null);
        setCall(null);
        setChatClient(null);
        setChannel(null);
        setIsConnected(false);
      }

      if (!forceCleanup) {
        await new Promise((r) => setTimeout(r, 100));
      }

      if (currentCall) {
        try {
          await Promise.allSettled([
            currentCall.microphone?.disable(),
            currentCall.camera?.disable(),
          ]);
          const state = currentCall.state?.callingState;
          if (state !== 'left' && state !== 'idle') {
            await currentCall.leave();
          }
        } catch (err) {
          console.error('Error during call cleanup:', err);
        }
      }

      if (currentStreamClient) {
        try { await currentStreamClient.disconnectUser(); } catch { /* ok */ }
      }

      if (currentChatClient) {
        try { await currentChatClient.disconnectUser(); } catch { /* ok */ }
      }

      clearActiveSession();
    } catch (err) {
      console.error('Cleanup error:', err);
      if (isMountedRef.current) {
        setStreamClient(null);
        setCall(null);
        setChatClient(null);
        setChannel(null);
        setIsConnected(false);
      }
      clearActiveSession();
    } finally {
      if (isMountedRef.current) setIsCleaningUp(false);
    }
  }, [isCleaningUp]);

  const initializeServices = useCallback(async () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    let videoClient = null;
    let callInstance = null;
    let streamChatClient = null;

    try {
      setLoading(true);
      setError(null);

      if (streamClient || call || chatClient) {
        await cleanup();
        await new Promise((r) => setTimeout(r, 300));
      }

      const tokenData = await streamService.getToken();
      const { token, userId, user, apiKey, chatToken } = tokenData;
      if (!token || !chatToken || !apiKey) throw new Error('Incomplete Stream credentials');

      // Video client — only for video mode
      if (mode === 'video' || currentModeRef.current === 'video') {
        videoClient = new StreamVideoClient({
          apiKey,
          user: { id: userId, name: `${user.firstName} ${user.lastName}`, image: undefined },
          token,
        });

        const callId = getCallId(appointmentId);
        callInstance = videoClient.call('default', callId);
        await callInstance.join({ create: true });

        try {
          await streamService.startCall(appointmentId);
        } catch {
          // non-blocking
        }
      }

      // Chat client — always
      streamChatClient = StreamChat.getInstance(apiKey);
      if (streamChatClient.userID) {
        await streamChatClient.disconnectUser();
      }

      await streamChatClient.connectUser(
        { id: userId, name: `${user.firstName} ${user.lastName}` },
        chatToken,
      );

      try {
        await streamService.createChannel(appointmentId, otherUserId);
      } catch {
        // channel may already exist
      }

      const channelId = getChannelId(appointmentId);
      const chatChannel = streamChatClient.channel('messaging', channelId);
      await chatChannel.watch();

      if (isMountedRef.current) {
        setStreamClient(videoClient);
        setCall(callInstance);
        setChatClient(streamChatClient);
        setChannel(chatChannel);
        setIsConnected(true);
        setLoading(false);
      }

      saveActiveSession(appointmentId);
    } catch (err) {
      console.error('Error initializing Stream services:', err);

      try {
        if (callInstance) { await callInstance.leave().catch(() => {}); }
        if (videoClient) { await videoClient.disconnectUser().catch(() => {}); }
        if (streamChatClient?.userID) { await streamChatClient.disconnectUser().catch(() => {}); }
      } catch { /* cleanup partial */ }

      if (isMountedRef.current) {
        setStreamClient(null);
        setCall(null);
        setChatClient(null);
        setChannel(null);
        setIsConnected(false);
        setError(err.message || 'Failed to start session');
        setLoading(false);
      }
      clearActiveSession();
    } finally {
      isInitializingRef.current = false;
    }
  }, [appointmentId, otherUserId, mode, cleanup, streamClient, call, chatClient]);

  const switchToVideo = useCallback(async () => {
    if (streamClient && call) {
      setCurrentMode('video');
      return;
    }

    try {
      setLoading(true);
      const tokenData = await streamService.getToken();
      const { token, userId, user, apiKey } = tokenData;

      const videoClient = new StreamVideoClient({
        apiKey,
        user: { id: userId, name: `${user.firstName} ${user.lastName}` },
        token,
      });

      const callId = getCallId(appointmentId);
      const callInstance = videoClient.call('default', callId);
      await callInstance.join({ create: true });

      try { await streamService.startCall(appointmentId); } catch { /* ok */ }

      if (isMountedRef.current) {
        setStreamClient(videoClient);
        setCall(callInstance);
        setCurrentMode('video');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error switching to video:', err);
      if (isMountedRef.current) {
        setError('Failed to start video call');
        setLoading(false);
      }
    }
  }, [appointmentId, streamClient, call]);

  const endSession = useCallback(async () => {
    await cleanup();
    try {
      await streamService.endCall(appointmentId, mode === 'chat' && currentModeRef.current === 'chat');
    } catch (err) {
      console.error('Backend end-call error:', err);
    }
  }, [appointmentId, mode, cleanup]);

  const checkAndInit = useCallback(async () => {
    try {
      const sessionResp = await streamService.checkActiveSession().catch(() => null);

      if (sessionResp?.hasActiveSession) {
        if (sessionResp.appointmentId === appointmentId) {
          await initializeServices();
          return;
        }
        // Different session active — force end it
        await streamService.forceEndSession().catch(() => {});
        clearActiveSession();
      }

      // Fallback: check local storage
      const local = getActiveSession();
      if (local) {
        const ageMin = (Date.now() - local.timestamp) / 60_000;
        if (ageMin > 60 || local.appointmentId === appointmentId) {
          clearActiveSession();
        } else {
          clearActiveSession();
        }
      }

      await initializeServices();
    } catch {
      await initializeServices();
    }
  }, [appointmentId, initializeServices]);

  // Unread count listener
  useEffect(() => {
    if (!channel || !chatClient?.userID) return;

    setUnreadCount(channel.countUnread());

    const listener = channel.on('message.new', (event) => {
      if (event.user.id !== chatClient.userID && currentModeRef.current === 'video') {
        setUnreadCount((c) => c + 1);
      }
    });

    return () => listener.unsubscribe();
  }, [channel, chatClient]);

  // Initialize on mount
  useEffect(() => {
    isMountedRef.current = true;
    if (appointmentId) checkAndInit();

    return () => {
      isMountedRef.current = false;
      cleanup(true).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    loading,
    error,
    isConnected,
    currentMode,
    setCurrentMode,
    unreadCount,
    setUnreadCount,
    cleanup,
    endSession,
    switchToVideo,
  };
};
