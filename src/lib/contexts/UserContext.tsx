// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import { UserState, UserContextType, ChildInfo } from "@/lib/types/user";

// Define the initial state for the user context
const initialState: UserState = {
  accountType: null,
  personalInfo: {
    fullName: "",
    email: "",
    nik: undefined,
    role: "",
    region: undefined,
  },
  motherInfo: undefined, // Set to undefined initially for health officers
  isVerified: false,
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
        ...prev.motherInfo!, // Use non-null assertion since we assume it's defined when adding children
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
