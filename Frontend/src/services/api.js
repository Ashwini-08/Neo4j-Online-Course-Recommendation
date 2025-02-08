import axios from 'axios';

// Set up the base URL for your backend server
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api', // Change this to match your backend server's URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle user login
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Function to handle forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error during forgot password:', error);
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Function to handle password reset
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error during password reset:', error);
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Function to get course recommendations
export const getRecommendations = async () => {
  return [
    { id: 1, title: 'Introduction to Graph Theory', description: 'Learn the basics of graph theory and its applications.' },
    { id: 2, title: 'Machine Learning with Graphs', description: 'Explore how machine learning is applied to graph data.' },
    { id: 3, title: 'Data Structures and Algorithms', description: 'Master data structures like graphs and trees.' },
  ];
};
