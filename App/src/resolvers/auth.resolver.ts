import { User } from '../interfaces/users.interface';
import { CreateUserDto } from '../dtos/users.dto';
import AuthRepository from '../repositories/auth.repository';

export class authResolver extends AuthRepository {
  async signup(userData: CreateUserDto): Promise<User> {
    const user: User = await this.userSignUp(userData);
    return user;
  }

  async login(userData: CreateUserDto): Promise<User> {
    const { findUser } = await this.userLogIn(userData);
    return findUser;
  }

  async logout(userData: any): Promise<User> {
    const user = await this.userLogOut(userData);
    return user;
  }
}
