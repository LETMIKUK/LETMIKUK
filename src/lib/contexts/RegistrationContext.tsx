"use client";

import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type RegistrationInfo = {
  fullName: string;
  email: string;
  password: string;
  role?: "Mother" | "Health Officer";
  additionalInfo?: {
    isPregnant?: boolean;
    pregnancyStartDate?: string;
    children?: Array<{ name: string; birthDate: string }>;
  };
};

type RegistrationContextType = {
  registrationInfo: RegistrationInfo;
  setRegistrationInfo: Dispatch<SetStateAction<RegistrationInfo>>;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>({
    fullName: "",
    email: "",
    password: "",
  });
  return (
    <RegistrationContext.Provider
      value={{ registrationInfo, setRegistrationInfo }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context)
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  return context;
};
