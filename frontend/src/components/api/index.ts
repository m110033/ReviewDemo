import axios from "axios";

interface LoginResponse {
  access_token: string;
}

export interface Employee {
  _id: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

export interface CreateEmployee {
  email: string;
  username: string;
  password: string;
  role: string;
}

export interface Review {
  _id?: string;
  title: string;
  description: string;
  targetEmployee: { _id: string; username: string };
  participants: { _id: string; username: string }[];
}

export interface CreateReview {
  title: string;
  description: string;
  targetEmployee: string;
  participants: string[];
  feedbacks?: {
    _id: string;
    reviewId: string;
    participant: string;
    content: string;
  }[];
}

export interface Feedback {
  reviewId: string;
  content: string;
  participant: string;
}

export interface CreateFeedback {
  reviewId: string;
  content: string;
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

// Get information
export const getInfo = async (): Promise<Employee> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.get<Employee>("/auth/info");
    return response.data;
  } catch (error) {
    console.error("Error fetching info:", error);
    throw error;
  }
};

// create an employee
export const createEmployee = async (params: CreateEmployee): Promise<Employee> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.post<Employee>("/employees", params);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Fetch employees information
export const getEmployee = async (id: string): Promise<Employee> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.get<Employee>(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
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
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    await checkAndRefreshToken();
    await axios.delete(`/employees/${id}`);
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
};

// Update an employee
export const updateEmployee = async (id: string, params: Partial<Employee>): Promise<Employee> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.patch<Employee>(`/employees/${id}`, params);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    throw error;
  }
};

export const createReview = async (params: CreateReview): Promise<Review> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.post<Review>("/reviews", params);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Fetch a reviews
export const getReview = async (id: string): Promise<CreateReview> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.get<CreateReview>(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
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
export const deleteReview = async (id: string): Promise<void> => {
  try {
    await checkAndRefreshToken();
    await axios.delete(`/reviews/${id}`);
  } catch (error) {
    console.error(`Error deleting review with id ${id}:`, error);
    throw error;
  }
};

// Update an review
export const updateReview = async (id: string, params: Partial<CreateReview>): Promise<Review> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.patch<Review>(`/Reviews/${id}`, params);
    return response.data;
  } catch (error) {
    console.error(`Error updating review with id ${id}:`, error);
    throw error;
  }
};

// Create a feedback
export const createFeedback = async (id: string, params: CreateFeedback): Promise<Feedback> => {
  try {
    await checkAndRefreshToken();
    const response = await axios.post<Feedback>(`/feedbacks`, params);
    return response.data;
  } catch (error) {
    console.error(`Error updating review with id ${id}:`, error);
    throw error;
  }
};