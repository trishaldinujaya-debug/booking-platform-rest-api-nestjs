import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with a securely hashed password.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid registration data.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email is already registered.',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticates a user and returns a JWT access token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid login data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('bearer')
  @ApiSecurity('bearer')
  @ApiOperation({
    summary: 'Get authenticated user profile',
    description:
      'Returns the profile information of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Authenticated user profile returned successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid.',
  })
  getProfile(
    @Request() request: {
      user: {
        userId: number;
        email: string;
      };
    },
  ) {
    return {
      message: 'JWT authentication is working',
      user: request.user,
    };
  }
}