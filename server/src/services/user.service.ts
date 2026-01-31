import prisma from '../config/database';
import { UserRepository } from '../repositories/user.repository';
import { User } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../utils/error';

const userRepo = new UserRepository(prisma);

export const getUserProfile = async (id: number) => {
  const user = await userRepo.getById(id);
  if (!user) throw new NotFoundError('User not found');
  
  // Exclude password
  const { password, ...rest } = user;
  return rest;
};

export const getAllUsers = async () => {
  return userRepo.getAll();
};

export const updateUserStatus = async (id: number, status: string) => {
  const user = await userRepo.getById(id);
  if (!user) throw new NotFoundError('User not found');

  return userRepo.update(id, { status });
};

export const updateUserRole = async (id: number, role: 'USER' | 'ADMIN' | 'OWNER') => {
  const user = await userRepo.getById(id);
  if (!user) throw new NotFoundError('User not found');

  return userRepo.updateRole(id, role);
};

export const deleteUser = async (id: number) => {
  // Prevent deleting the last owner or self? (Logic depends on requirements)
  const user = await userRepo.getById(id);
  if (!user) throw new NotFoundError('User not found');
  
  return userRepo.delete(id);
};