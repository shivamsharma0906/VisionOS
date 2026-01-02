// src/lib/api.ts
import { VisionData } from '../types/vision';

// 👇 THIS IS THE FIX
// It checks your .env files first. If found, it uses that. If not, it falls back to the Render Link.
const BACKEND_URL = import.meta.env.VITE_API_URL || "https://visionos-backend.onrender.com";
const API_BASE = `${BACKEND_URL}/api`;

// Helper to get the token from storage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

// --- VISION FUNCTIONS ---

// 1. SAVE FUNCTION (Updated with Token)
export const saveVisionToBackend = async (data: VisionData) => {
  try {
    const response = await fetch(`${API_BASE}/vision`, {
      method: "POST",
      headers: getAuthHeaders(), // <--- Adds the token here!
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save vision");
    }

    return await response.json();
  } catch (error) {
    console.error("Save API Error:", error);
    throw error;
  }
};

// 2. NEW FETCH FUNCTION (To load data on login)
export const fetchVisionFromBackend = async () => {
  try {
    const response = await fetch(`${API_BASE}/vision`, {
      method: "GET",
      headers: getAuthHeaders(), // <--- Adds the token here!
    });

    if (!response.ok) {
      // If 404, it just means new user has no data yet
      if (response.status === 404) return null;
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch vision");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch API Error:", error);
    throw error;
  }
};

// --- AUTH FUNCTIONS ---

export const registerUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
    throw error;
  }
};

export const deleteUserAccount = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE}/auth/delete/${email}`, {
      method: "DELETE", // Or GET if using the specific route defined
    });
    if (!response.ok) throw new Error("Delete user failed");
    return await response.json();
  } catch (error) {
    console.error("Delete User Error:", error);
    throw error;
  }
};

export const deleteVisionData = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE}/vision/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Delete vision data failed");
    return await response.json();
  } catch (error) {
    console.error("Delete Vision Error:", error);
    throw error;
  }
};