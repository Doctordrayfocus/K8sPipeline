export interface AuthStrategy {
  id?: number;
  uuid?: string;
  profileId: string;
  type: string;
  access_token: string;
  refresh_token: string;
}
