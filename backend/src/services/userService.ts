import bcrypt from 'bcryptjs';

import prisma from '../libs/prisma';

export class UserService {
  async getAllUsers() {
    return await prisma.user.findMany();
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: { email: string; name?: string; password: string }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        // Hashed here so a plain password can never reach the database,
        // whichever route calls this.
        passwordHash: await bcrypt.hash(data.password, 10),
      },
    });
  }

  async updateUser(id: string, data: { email?: string; name?: string }) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
