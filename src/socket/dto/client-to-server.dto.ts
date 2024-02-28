export interface ClientToServerDto {
  accessToken: string;
  payload: string | Record<string, any>;
}
