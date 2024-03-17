export interface CreateUserDto {
  email: string;
  password: string;
  username?: string;
  refreshToken?: string;
}
