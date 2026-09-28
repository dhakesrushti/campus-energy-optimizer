const API_BASE_URL = 'http://192.168.0.103:5000/api'; // Using the IP from your earlier screenshot

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchLatestReading = async () => {
  const response = await fetch(`${API_BASE_URL}/latest-reading`);
  return handleResponse(response);
};

export const fetchDashboardSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard-summary`);
  return handleResponse(response);
};

export const fetchPrediction = async () => {
  const response = await fetch(`${API_BASE_URL}/predict`);
  return handleResponse(response);
};

export const fetchHistory = async (limit = 50) => {
  const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`);
  return handleResponse(response);
};

export const fetchSavings = async () => {
  const response = await fetch(`${API_BASE_URL}/savings`);
  return handleResponse(response);
};
