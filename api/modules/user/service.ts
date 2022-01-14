import { Prisma } from '@prisma/client';
import argon2 from 'argon2';
import { nanoid } from 'nanoid/async';

import { generateDefaultTOTP } from '../../core/rfc6238';
import prisma from '../../infra/prisma';

/**
 * Almost all user operations return these attributes (usually exposed to the user as response),
 * this is intentional as we do not want sensitive values to be fetched and exposed to the end user.
 */
const select = Prisma.validator<Prisma.UserSelect>()({
  userID: true,
  username: true,
  email: true,
  phoneNumber: true,
  fullName: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Business logic and repositories for 'Users' entity.
 */
const UserService = {
  /**
   * Fetches all users from the database.
   *
   * @returns All users from the database, sensitive columns removed.
   */
  getUsers: async () => prisma.user.findMany({ select }),

  /**
   * Fetches a single user's complete data with no filters.
   *
   * @param where - Prisma's 'Where' object that accepts unique attributes only.
   * @returns A single user's complete data (with sensitive values).
   */
  getUserComplete: async (where: Prisma.UserWhereUniqueInput) =>
    prisma.user.findUnique({ where }),

  /**
   * Fetches a single user with their sensitive data removed.
   *
   * @param where - Prisma's 'Where' object that accepts unique attributes only.
   * @returns A single user data, filtered (no sensitive values).
   */
  getUser: async (where: Prisma.UserWhereUniqueInput) =>
    prisma.user.findUnique({ where, select }),

  /**
   * Creates a single user data, and generates their own QR code URI for Google Authenticator.
   *
   * @param data - All of a user's required data.
   * @returns A created 'User' object, with sensitive data removed.
   */
  createUser: async (data: Prisma.UserCreateInput) => {
    const u = { ...data };

    // Create TOTP secrets with a CSPRNG, and hash passwords with Argon2.
    u.totpSecret = await nanoid();
    u.password = await argon2.hash(u.password.normalize(), {
      timeCost: 300,
      hashLength: 50,
    });

    // Create a new user.
    const newUser = await prisma.user.create({ data: u, select });

    // Generates a TOTP based on that user, but do not expose them yet. Only fetch the URI.
    const { uri } = generateDefaultTOTP(u.username, u.totpSecret);

    // Return all objects.
    return { ...newUser, uri };
  },

  /**
   * Updates a single user data.
   *
   * @param where - Prisma's 'Where' object. Only accepts unique attributes.
   * @param data - A partial object to update the user. Already validated in validation layer.
   * @returns An updated 'User' object, with sensitive data removed.
   */
  updateUser: async (
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ) => {
    const u = { ...data };

    // Re-hash password if a user changes their own password.
    if (typeof u.password === 'string' && u.password) {
      u.password = await argon2.hash(u.password.normalize(), {
        timeCost: 300,
        hashLength: 50,
      });
    }

    return prisma.user.update({ where, data: u, select });
  },

  /**
   * Deletes a single user.
   *
   * @param where - Prisma's 'where' object to decide what to delete.
   * @returns An updated 'User' object.
   */
  deleteUser: async (where: Prisma.UserWhereUniqueInput) =>
    prisma.user.delete({ where }),
};

export default UserService;
