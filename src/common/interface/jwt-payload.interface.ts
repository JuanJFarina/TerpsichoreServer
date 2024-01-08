import { TokenTypes } from '../enums/token-types.enum';

export interface JwtPayload {
  type: TokenTypes;
  email: string;
  id: string;
}
