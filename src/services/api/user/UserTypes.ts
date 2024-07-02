export interface ChurchAdminInterface {
  email: string;
  name: string;
  password: string; // Passwords are typically handled outside the database functions for security
  contact?: string; // Optional based on your schema
  churchId?: string; // Optional since a ChurchAdmin may not be linked to a Church immediately
}

export interface ChurchInterface {
  name: string;
  email: string; // Assuming it's required as per your schema having @unique
  bio?: string;
  profilePicUrl?: string;
  phone?: string;
  address?: string;
  adminId: string; // Required as per your schema, but could be optional depending on your app logic
}

export interface MissionInterface {
  name: string;
  description?: string;
  donationInfo?: string;
  missionaryId: string; // Assuming it's required to link a mission to a missionary
  churchId: string; // Assuming it's required to link a mission to a church
}

export interface MissionaryInterface {
  name: string;
  email: string; // Assuming it's required and unique
  password: string; // Passwords are typically handled outside the database functions for security
  bio?: string;
  avatar?: string;
  contact?: string;
  donationInfo?: string;
  churchId: string;
}
