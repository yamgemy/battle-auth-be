export interface CreateUserDto {
    name: string;
    username: string;
    password: string;
    refreshToken?: string;
}
