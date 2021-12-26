import type { User } from '@prisma/client';
import argon2 from 'argon2';
import { nanoid } from 'nanoid/async';

import { generateDefaultTOTP } from '../../core/rfc6238';
import prisma from '../../infra/prisma';

/**
 * Business logic and repositories for 'Users' entity.
 */
const UserService = {
  /**
   * Fetches all users from the database.
   *
   * @returns All users from the database, sensitive columns removed.
   */
  getUsers: async () =>
    prisma.user.findMany({
      select: {
        userID: true,
        username: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

  /**
   * Fetches a single user data from the database, their complete data.
   *
   * @param id - A user's UUID.
   * @returns A single user's complete data from the database.
   */
  getUserCompleteDataByID: async (id: string) =>
    prisma.user.findUnique({ where: { userID: id } }),

  /**
   * Fetches a single user data from the database by their username, a complete data.
   *
   * @param username - A user's username.
   * @returns A single user's complete data from the database.
   */
  getUserCompleteDataByUsername: async (username: string) =>
    prisma.user.findUnique({ where: { username } }),

  /**
   * Fetches a single user data by using their UUID.
   *
   * @param id - A user's UUID.
   * @returns A single user data, sensitive columns removed.
   */
  getUserByID: async (id: string) =>
    prisma.user.findUnique({
      where: { userID: id },
      select: {
        userID: true,
        username: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

  /**
   * Fetches a single user data by using their username.
   *
   * @param username - A user's username.
   * @returns A single user data, sensitive columns removed.
   */
  getUserByUsername: async (username: string) =>
    prisma.user.findUnique({
      where: { username },
      select: {
        userID: true,
        username: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

  /**
   * Fetches a single user data using their phone number.
   *
   * @param phoneNumber - A user's phone number.
   * @returns A single user data, sensitive columns removed.
   */
  getUserByPhoneNumber: async (phoneNumber: string) =>
    prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        userID: true,
        username: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

  /**
   * Fetches a single user data using their email.
   *
   * @param email - A user's email.
   * @returns A single user data, sensitive columns removed.
   */
  getUserByEmail: async (email: string) =>
    prisma.user.findUnique({
      where: { email },
      select: {
        userID: true,
        username: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

  /**
   * Creates a single user data, and generates their own QR code URI for Google Authenticator.
   *
   * @param user - A user's complete data
   * @returns A created 'User' object, with sensitive data removed.
   */
  createUser: async (user: User) => {
    const u = { ...user };

    // Create TOTP secrets with a CSPRNG, and hash passwords with Argon2.
    u.totpSecret = await nanoid();
    u.password = await argon2.hash(u.password.normalize(), {
      timeCost: 300,
      hashLength: 50,
    });

    // Create a new user.
    const newUser = await prisma.user.create({
      data: u,
      select: {
        userID: true,
        username: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generates a TOTP based on that user, but do not expose them yet. Only fetch the URI.
    const { uri } = generateDefaultTOTP(u.username, u.totpSecret);

    // Return all objects.
    return { ...newUser, uri };
  },

  /**
   * Updates a single user data.
   *
   * @param id - A user's UUID
   * @param user - A partial object to update the user. Already validated in validation layer.
   * @returns An updated 'User' object, with sensitive data removed.
   */
  updateUser: async (id: string, user: Partial<User>) => {
    const u = { ...user };

    // Re-hash password if a user changes their own.
    if (u.password) {
      u.password = await argon2.hash(u.password.normalize(), {
        timeCost: 300,
        hashLength: 50,
      });
    }

    return prisma.user.update({
      where: { userID: id },
      data: user,
      select: {
        userID: true,
        username: true,
        email: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * Deletes a single user.
   *
   * @param id - A user's UUID.
   * @returns An updated 'User' object.
   */
  deleteUser: async (id: string) =>
    prisma.user.delete({ where: { userID: id } }),
};

export default UserService;
