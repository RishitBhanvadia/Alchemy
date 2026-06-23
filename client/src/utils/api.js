import apiClient from './apiClient';
import logger from './logger';

const api = apiClient;

api.interceptors.response.use(
  (response) => {
    // Check if the backend uses the { success, data, error } wrapper format
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      const { success, data, error } = response.data;
      if (success === false) {
        const err = new Error(error?.message || 'Request failed');
        err.code = error?.code;
        err.details = error?.details;
        logger.error('API Error Response:', error);
        return Promise.reject(err);
      }
      // Re-assign the wrapped data payload as the main response data
      response.data = data;
    }
    return response;
  },
  (error) => {
    logger.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export const getResult = (chemA, chemB, chemC, chemD, studentId = null) => {
  return api.post('/results', { 
    chem_a: chemA, 
    chem_b: chemB, 
    chem_c: chemC, 
    chem_d: chemD,
    student_id: studentId
  });
};

export const getTitrationData = () => {
  return api.get('/titration');
};

export const logExperiment = (data) => {
  return api.post('/experiments/log', data);
};

export const getHistory = () => {
  return api.get('/experiments/history');
};

export const getProfile = () => {
  return api.get('/auth/profile');
};

export const createClassroom = (name) => {
  return api.post('/classroom/create', { name });
};

export const joinClassroom = (code) => {
  return api.post('/classroom/join', { code });
};

export const getAnalytics = () => {
  return api.get('/teacher/analytics');
};

export const explainReaction = (chemicals, reactionOutcome, studentQuestion) => {
  return api.post('/ai/explain', {
    chemicals,
    reaction_outcome: reactionOutcome,
    student_question: studentQuestion,
  });
};

// ─── Meeting API functions ────────────────────────────────────────────────────

/** Create a Zoom instant meeting (teacher only) */
export const createZoomMeeting = () => {
  return api.post('/meetings/zoom');
};

/** Get the Google OAuth redirect URL via authenticated request */
export const getGoogleAuthUrl = () => {
  return api.get('/meetings/google/auth');
};

/** Create a Google Meet via Calendar API (teacher only, requires OAuth first) */
export const createGoogleMeeting = () => {
  return api.post('/meetings/google');
};

/** Look up a meeting code and get the meeting URL */
export const joinMeetingByCode = (code) => {
  return api.get(`/meetings/join?code=${encodeURIComponent(code)}`);
};

export default api;
