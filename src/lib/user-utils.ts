// Utility functions for user data management

export interface UserData {
  username: string;
  email: string;
  role: string;
}

/**
 * Get user data from localStorage
 * This is used as a fallback when Redux store is not available
 */
export const getUserFromLocalStorage = (): UserData | null => {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
  }

  return null;
};

/**
 * Save user data to localStorage
 */
export const saveUserToLocalStorage = (userData: UserData): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("userData", JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user data to localStorage:", error);
  }
};

/**
 * Clear user data from localStorage
 */
export const clearUserFromLocalStorage = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("userData");
  } catch (error) {
    console.error("Error clearing user data from localStorage:", error);
  }
};

/**
 * Get initials from username
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
