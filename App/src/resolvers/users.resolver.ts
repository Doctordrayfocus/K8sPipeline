import { User } from '@/interfaces/users.interface';
import { CreateUserDto } from '@dtos/users.dto';
import UserRepository from '@repositories/users.repository';

export class userResolver extends UserRepository {
  async getUsers(): Promise<User[]> {
    const users: User[] = await this.userFindAll();
    return users;
  }

  async getUserById(userId: number): Promise<User> {
    const user: User = await this.userFindById(userId);
    return user;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const user: User = await this.userCreate(userData);
    return user;
  }

  async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    const user: User = await this.userUpdate(userId, userData);
    return user;
  }

  async deleteUser(userId: number): Promise<User> {
    const user: User = await this.userDelete(userId);
    return user;
  }
}
