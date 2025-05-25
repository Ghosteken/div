import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const generateCode = async (prompt: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-code`, { prompt });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error generating code');
    }
    throw error;
  }
}; 