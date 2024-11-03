// types.ts
export interface ChildInfo {
  name: string;
  gender: "male" | "female";
  birthDate: Date;
  allergies?: string;
  notes?: string;
}

export interface MotherInfo {
  isPregnant: boolean; // This should be required since mothers will have this property.
  pregnancyStartDate?: Date; // Optional
  pregnancyMonths?: number; // Optional
  children: ChildInfo[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  nik?: string; // optional for health officers
  role: string; // e.g., 'Mother' or 'Health Officer'
  region?: string; // optional
}

export interface UserState {
  accountType: AccountType | null;
  personalInfo: PersonalInfo;
  motherInfo?: MotherInfo; // This is now optional, can be undefined for health officers
}

export type AccountType = "Mother" | "Health Officer" | null;

export interface UserContextType {
  user: UserState;
  updateUser: (newInfo: Partial<UserState>) => void;
  addChild: (childData: ChildInfo) => void;
  initializeMotherInfo: () => void; // Ensure this function is included in the context type
  logout: () => void; // Ensure this function is included in the context type
}
