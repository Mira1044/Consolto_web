import { apiClient } from '@/shared/services/api';

/**
 * Stream service — wraps all /stream/* backend endpoints.
 *
 * Mobile-app equivalent:
 *   authenticatedRequest(`${API_URL}/stream/token`)
 *   authenticatedRequest(`${API_URL}/stream/create-channel`, 'POST', { ... })
 *   etc.
 *
 * The apiClient already attaches the Bearer token via interceptor.
 */
export const streamService = {
  /**
   * Fetch Stream token bundle (video token, chat token, apiKey, userId, user).
   * GET /stream/token
   */
  async getToken() {
    const { data } = await apiClient.get('/stream/token');
    return data;
  },

  /**
   * Create a chat channel for an appointment.
   * POST /stream/create-channel
   */
  async createChannel(appointmentId, otherUserId) {
    const { data } = await apiClient.post('/stream/create-channel', {
      appointmentId,
      otherUserId,
    });
    return data;
  },

  /**
   * Notify backend that a video call has started.
   * POST /stream/start-call
   */
  async startCall(appointmentId) {
    const { data } = await apiClient.post('/stream/start-call', { appointmentId });
    return data;
  },

  /**
   * End a call/session on the backend.
   * POST /stream/end-call
   */
  async endCall(appointmentId, isChatOnly = false) {
    const { data } = await apiClient.post('/stream/end-call', {
      appointmentId,
      isChatOnly,
    });
    return data;
  },

  /**
   * Check if the current user has an active session.
   * GET /stream/check-active-session
   */
  async checkActiveSession() {
    const { data } = await apiClient.get('/stream/check-active-session');
    return data;
  },

  /**
   * Force-end a previous active session.
   * POST /stream/force-end-session
   */
  async forceEndSession() {
    const { data } = await apiClient.post('/stream/force-end-session');
    return data;
  },

  /**
   * Upload a file (image / video / document) for chat attachments.
   * POST /upload-file — multipart/form-data
   */
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'chat');

    const { data } = await apiClient.post('/upload-file', formData, {
      headers: { 'Content-Type': undefined },
      timeout: 60_000,
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });

    return data?.url ?? data;
  },
};
