import { Prisma, User } from "../generated/prisma/client";
import { PrismaClient } from "../generated/prisma/client";

export class UserRepository {
  constructor(private readonly db: PrismaClient) {}

  //create user
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({
      data,
    });
  }

  // find user by id
  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        id,
      },
    });
  }

  // find user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        email,
      },
    });
  }

  //find users by name
  async findByUserName(userName: string): Promise<User[] | null> {
    return this.db.user.findMany({
      where: {
        userName,
      },
    });
  }

  //update user
  async update(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.db.user.update({
      where: {
        id,
      },
      data,
    });
  }

  //delete single user
  async delete(id: string): Promise<User> {
    return this.db.user.delete({
      where: {
        id,
      },
    });
  }

}