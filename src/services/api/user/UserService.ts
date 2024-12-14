// Import statements remain the same
import { prisma } from "@/lib/prisma";
import {
  Church,
  ChurchAdmin,
  Missionary,
  Mission
} from "@prisma/client";
import {
  ChurchAdminInterface,
  ChurchInterface,
  MissionInterface,
  MissionaryInterface
} from "./UserTypes";

// Function to create a ChurchAdmin in the database
export async function CreateChurchAdmin(
  admin: ChurchAdminInterface
): Promise<ChurchAdmin | null> {
  try {
    const newAdmin = await prisma.churchAdmin.create({
      data: {
        email: admin.email,
        name: admin.name,
        password: admin.password, // Password hashing should be handled before this function is called
        contact: admin.contact,
        churchId: admin.churchId,
      },
    });
    return newAdmin;
  } catch (error) {
    console.error("Failed to create ChurchAdmin:", error);
    throw error; // Throwing the error for the caller to handle
  }
}

// Function to create a Church in the database
export async function CreateChurch(
  church: ChurchInterface
): Promise<Church | null> {
  try {
    const newChurch = await prisma.church.create({
      data: {
        name: church.name,
        address: church.address,
        bio: church.bio,
        email: church.email,
        phone: church.phone,
        profilePicUrl: church.profilePicUrl,
        adminId: church.adminId, // Ensure adminId is included in ChurchInterface
      },
    });
    return newChurch;
  } catch (error) {
    console.error("Failed to create Church:", error);
    throw error; // Throwing the error for the caller to handle
  }
}

// Function to create a Mission in the database
export async function CreateMission(
  mission: MissionInterface
): Promise<Mission | null> {
  try {
    const newMission = await prisma.mission.create({
      data: {
        name: mission.name,
        description: mission.description,
        donationInfo: mission.donationInfo,
        missionaryId: mission.missionaryId,
        churchId: mission.churchId,
      },
    });
    return newMission;
  } catch (error) {
    console.error("Failed to create Mission:", error);
    throw error; // Throwing the error for the caller to handle
  }
}

// Function to create a Missionary in the database
export async function CreateMissionary(
  missionary: MissionaryInterface
): Promise<Missionary | null> {
  try {
    const newMissionary = await prisma.missionary.create({
      data: {
        name: missionary.name,
        bio: missionary.bio,
        avatar: missionary.avatar,
        email: missionary.email,
        password: missionary.password, // Password hashing should be handled before this function is called
        contact: missionary.contact,
        donationInfo: missionary.donationInfo,
        churchId: missionary.churchId,
      },
    });
    return newMissionary;
  } catch (error) {
    console.error("Failed to create Missionary:", error);
    throw error; // Throwing the error for the caller to handle
  }
}
