import { PrismaClient, User } from '@prisma/client';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User, PrismaClient['user']> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient, prismaClient.user);
  }

  // ✅ Custom methods specific to UserRepository
  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({ where: { email } });
  }

  async updateRole(userId: number, role: User['role']): Promise<User> {
    return this.model.update({
      where: { id: userId },
      data: { role },
    });
  }

  async getAll(): Promise<Pick<User, 'id' | 'email' | 'name' | 'role'>[]> {
    return this.model.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
  }
}