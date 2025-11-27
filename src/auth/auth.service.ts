import {
  Injectable,
  // UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { AuthResponse, JwtPayload } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponse> {
    const user = this.userService.create(signupDto);
    return this.generateTokens({ userId: user.id, login: user.login });
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = this.userService.findByLogin(loginDto.login);

    if (!user || user.password !== loginDto.password) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.generateTokens({ userId: user.id, login: user.login });
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY || 'refresh-secret-key',
      });

      return this.generateTokens({
        userId: payload.userId,
        login: payload.login,
      });
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  private generateTokens(payload: JwtPayload): AuthResponse {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY || 'secret-key',
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '10m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY || 'refresh-secret-key',
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
    });

    return { accessToken, refreshToken };
  }
}
