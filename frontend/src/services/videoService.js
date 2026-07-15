import api from './api';

export const adminVideoService = {
  getAll: () => api.get('/admin/videos'),
  create: (data) => api.post('/admin/videos', data),
  update: (id, data) => api.put(`/admin/videos/${id}`, data),
  togglePublish: (id, isPublished) => api.patch(`/admin/videos/${id}/publish`, { isPublished }),
  getReports: (id) => api.get(`/admin/videos/${id}/reports`),
  
  // ADD THIS LINE:
  getLearnerMetrics: (learnerId) => api.get(`/admin/videos/metrics/${learnerId}`),
  
  getLearners: () => api.get('/admin/users/learners'),
  assignToLearners: (videoId, learnerIds) => api.post(`/admin/videos/${videoId}/assign`, { learnerIds }),

  delete: (id) => api.delete(`/admin/videos/${id}`),
};

export const learnerVideoService = {
  getAssigned: () => api.get('/learner/videos'),
  getVideo: (id) => api.get(`/learner/videos/${id}`),
  checkAnswer: (id, timestamp, answer) => api.post(`/learner/videos/${id}/check`, { timestamp, answer }),
  saveProgress: (id, currentTime, duration) => api.put(`/learner/videos/${id}/progress`, { currentTime, duration })
};