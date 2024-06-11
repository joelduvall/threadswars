import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/users/user.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get(
          'CLERK_ISSUER_URL',
        )}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `${configService.get('CLERK_ISSUER_URL')}`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // If incoming JWT does not contain an "externalid" (which is the threadwars userid stored in the external auth provider),
    // then we need to create a new user in the database and update the externalid in the incoming JWT
    if (!payload.externalId) {
      // since the externalId is not present in the incoming JWT, we need to see if there is some sort of mixup and the
      // threadwars database has the user stored in the external auth provider but the auth provider does not have the threadwars userid
      let user = await this.userService.findOne({ externalId: payload.userId });

      if (user == null) {
        // no the user just doesn't exist locally. but since we trust the external auth provider, we can create the user locally
        const createUserDTO: CreateUserDto = {
          externalId: payload.userId,
          email: payload.email,
          username: payload.username,
          firstName: payload.firstName,
          lastName: payload.lastName,
          avatar: payload.avatar,
          authProvider: 'clerk',
        };

        user = await this.userService.create(createUserDTO);
      }
      //update external auth provider because it clearly does not know about the threadwars userid
      clerkClient.users.updateUser(payload.userId, {
        externalId: user._id.toString(),
      });

      payload.externalId = user._id.toString();
    }

    return {
      userId: payload.userid,
      externalId: payload.externalId,
    };
  }
}
// function passportJwtSecret(arg0: { cache: boolean; rateLimit: boolean; jwksRequestsPerMinute: number; jwksUri: string; }) {
//     throw new Error('Function not implemented.');
//   }
/*
else
    {
      const user = this.userService.getUser(userId: req.user.externalId)
      if (user == null) {
        //Try to get it by externalId
        const user = this.threadService.getUser(externalId: req.user.userId)

        if user == null {
          WTF?
        }
        else{
          const user = await this.threadService.createUser(req.user);  
          //TODO: update clerk user      
        }
      }
    }
    */
