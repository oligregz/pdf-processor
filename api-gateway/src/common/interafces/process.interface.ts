export interface IUserPayload {
  userId: string;
  email: string;
}

export interface IAuthenticatedRequest extends Request {
  user: IUserPayload;
}
