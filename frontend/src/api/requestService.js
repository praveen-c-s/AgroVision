import api from './axios';


// Get single request by ID
export const getRequest = async (requestId) => {
  const response = await api.get(`/requests/${requestId}`);
  return response.data;
};

// Submit new request
export const submitRequest = async (formData) => {
  const response = await api.post('/requests/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get farmer's requests
export const getAssignedRequests = async () => {
  const response = await api.get('/requests/assigned');
  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get('/requests/my');
  return response.data;
};

// Get pending requests for officer
export const getPendingRequests = async () => {
  const response = await api.get('/requests/pending');
  return response.data;
};

// Claim a request
export const claimRequest = async (requestId) => {
  const response = await api.post(`/requests/${requestId}/claim`);
  return response.data;
};

// Process AI for a request
export const processRequest = async (requestId, data) => {
  const response = await api.post(`/requests/${requestId}/process`, data);
  return response.data;
};

// Review AI result
export const reviewRequest = async (requestId, reviewData) => {
  const response = await api.post(`/requests/${requestId}/review`, reviewData);
  return response.data;
};

// Complete request
export const completeRequest = async (requestId) => {
  const response = await api.post(`/requests/${requestId}/complete`);
  return response.data;
};

// Schedule soil test
export const scheduleSoilTest = async (requestId, scheduleData) => {
  const response = await api.post(`/requests/${requestId}/schedule`, scheduleData);
  return response.data;
};

// Schedule appointment (alias for scheduleSoilTest)
export const scheduleAppointment = async (requestId, scheduleData) => {
  const response = await api.post(`/requests/${requestId}/schedule`, scheduleData);
  return response.data;
};

// Upload soil report
export const uploadSoilReport = async (requestId, formData) => {
  const response = await api.post(`/requests/${requestId}/upload-report`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Download soil report
export const downloadSoilReport = async (requestId) => {
  const response = await api.get(`/requests/${requestId}/download-report`, {
    responseType: 'blob',
  });
  return response.data;
};
export const extractSoil = async (requestId) => {
  const response = await api.post(`/requests/${requestId}/extract-soil`);
  return response.data.soil_data;
};
// Get completed requests for officer
export const getCompletedRequests = async () => {
  const response = await api.get('/requests/completed');
  return response.data;
};
export const submitReport = (requestId, formData) => {
  return api.post(`/requests/${requestId}/report`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

