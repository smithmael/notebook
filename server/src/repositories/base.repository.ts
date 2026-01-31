import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<TData, TModel extends { create: any, findUnique: any, update: any, delete: any }> {
  protected prisma: PrismaClient;
  protected model: TModel;

  constructor(prisma: PrismaClient, model: TModel) {
    this.prisma = prisma;
    this.model = model;
  }

  // ✅ Accept Partial<TData> for creation (allows omitting ID, dates, etc.)
  async create(data: Partial<TData>): Promise<TData> {
    return this.model.create({ data });
  }

  async getById(id: number): Promise<TData | null> {
    return this.model.findUnique({ where: { id } });
  }

  async update(id: number, data: Partial<TData>): Promise<TData> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<TData> {
    return this.model.delete({ where: { id } });
  }
}