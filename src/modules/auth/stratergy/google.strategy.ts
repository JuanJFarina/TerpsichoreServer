import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGooglePayload } from 'src/common/interface/auth-google-payload.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${process.env.URL_BACK}/auth/google/callback`,
      scope: ['profile', 'email'],
      profileFields: [
        'id',
        'displayName',
        'name',
        'emails',
        'picture.type(large)',
      ],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { given_name, family_name, email, picture } = profile._json;

    console.log(profile._json)
    const user: IGooglePayload = {
      name: given_name,
      lastName: family_name,
      email,
      picture_url: picture,
      // accessToken,
    };
    return done(null, user);
  }
}
