"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserState, UserContextType, ChildInfo } from "@/lib/types/user";
import { cookies } from "next/headers"; // Assume types are in a separate file
// Fetch function from Sanity, adjust as necessary

const initialState: UserState = {
  accountType: null,
  personalInfo: {
    fullName: "",
    email: "",
    nik: undefined,
    role: "",
    region: undefined,
  },
  motherInfo: undefined,
};

// Create the context with the defined type
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserState>(initialState);

  // Helper function to update user info
  const updateUser = (newInfo: Partial<UserState>) => {
    setUser((prev) => ({ ...prev, ...newInfo }));
  };

  // Helper function to add a child to the children array in motherInfo
  const addChild = (childData: ChildInfo) => {
    setUser((prev) => ({
      ...prev,
      motherInfo: {
        ...prev.motherInfo!,
        children: [...(prev.motherInfo?.children || []), childData],
      },
    }));
  };

  // Function to initialize motherInfo when a mother account is created
  const initializeMotherInfo = () => {
    setUser((prev) => ({
      ...prev,
      motherInfo: {
        isPregnant: false,
        children: [],
      },
    }));
  };

  const getUserDetails = async () => {
    const response = await fetch("/api/app/user", {
      method: "GET",
      credentials: "include", // Sends cookies with the request
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    return response.json();
  };

  useEffect(() => {
    // Check if app_account_cookie exists
    const fetchUserData = async () => {
      // const cookieExists = cookies().get("app_account_cookie")?.value;
      // if (cookieExists) {
      try {
        const response = await getUserDetails(); // Fetch user data from Sanity or your API
        const { user: userData } = response;
        setUser({
          accountType: userData.role === "mother" ? "Mother" : "Health Officer",
          personalInfo: {
            fullName: userData.fullName,
            email: userData.email,
            nik: userData.role === "health_officer" ? userData.nik : undefined,
            role: userData.role,
            region: userData.assignedRegion,
          },
          motherInfo:
            userData.role === "mother"
              ? {
                  isPregnant: userData.isPregnant,
                  pregnancyStartDate:
                    (userData.pregnancyStartDate &&
                      new Date(userData.pregnancyStartDate)) ||
                    undefined,
                  children: userData.children,
                }
              : undefined,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, updateUser, addChild, initializeMotherInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the context in components
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
