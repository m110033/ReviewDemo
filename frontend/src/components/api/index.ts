import axios from "axios";

interface LoginResponse {
  access_token: string;
}

export interface Employee {
  _id: number;
  email: string;
  username: string;
  role: string;
}

export interface Review {
  _id: number;
  username: string;
  title: string;
  description: string;
  targetEmployee: { _id: string; username: string };
  participants: { _id: string; username: string }[];
}

// Axios configuration
axios.defaults.baseURL = "http://localhost:3001/api/v1";
let accessToken: string | null = null;

const setAccessToken = (token: string) => {
  accessToken = token;
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

// Login API
export const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await axios.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    const token = response.data.access_token;

    // Store token and expiration time in localStorage
    localStorage.setItem("access_token", token);
    const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hour expiration
    localStorage.setItem("token_expiration", expirationTime.toString());

    setAccessToken(token);
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Check and refresh token if needed
export const checkAndRefreshToken = async (): Promise<void> => {
  const token = localStorage.getItem("access_token");
  const expiration = localStorage.getItem("token_expiration");

  if (token && expiration) {
    const isExpired = Date.now() > parseInt(expiration, 10);
    if (!isExpired) {
      // Token is valid
      setAccessToken(token);
      return;
    }
  }

  // Token is expired or not found, redirect to login page
  console.warn("Token expired or not found, redirecting to homepage...");
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_expiration");
  window.location.href = "/"; // Redirect to homepage
};

// Fetch all employees
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.get<Employee[]>("/employees");
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await checkAndRefreshToken();
    await axios.delete(`/employees/${id}`);
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
};

// Fetch all reviews
export const getReviews = async (): Promise<Review[]> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.get<Review[]>("/reviews");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (id: number): Promise<void> => {
  try {
    await checkAndRefreshToken();
    await axios.delete(`/reviews/${id}`);
  } catch (error) {
    console.error(`Error deleting review with id ${id}:`, error);
    throw error;
  }
};