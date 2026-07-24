import { SessionRepository } from "../../repositories/session.repository";
import { UserRepository } from "../../repositories/user.repository";
import TokenService from "../../services/token.service";
import { ApiError } from "../../utils/apiError";
import { SignupPayload, LoginPayload } from "./auth.types";
import PasswordService from "../../services/password.service";
import { getRefreshTokenExpiry } from "../../constants/auth.constant";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async signup(data: SignupPayload) {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) {
      throw new ApiError(400, "user already exists", false);
    }
    const hashedPassword = await PasswordService.hashPassword(data.password);
    const user = await this.userRepository.create({
      userName: data.userName,
      email: data.email,
      mobNo: data.mobNo,
      passwordHash: hashedPassword,
    });
    const sessionId = crypto.randomUUID();

    //access token
    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      role: user.userRole,
    });

    //refresh token
    const refreshToken = TokenService.generateRefreshToken({
      userId: user.id,
      sessionId: sessionId,
    });

    const refreshTokenHash = await PasswordService.hashPassword(refreshToken);

    await this.sessionRepository.create({
      id: sessionId,
      user: {
        connect: {
          id: user.id,
        },
      },
      refreshTokenHash: refreshTokenHash,
      expiresAt: getRefreshTokenExpiry(),
    });

    return {
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        mobNo: user.mobNo,
        userRole: user.userRole,
      },
      accessToken,
    };
  }

  async login(data: LoginPayload) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new ApiError(401, "User does not exists please signup");
    }

    const comparePassword = await PasswordService.comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!comparePassword) {
      throw new ApiError(401, "Invalid password");
    }

    const sessionId = crypto.randomUUID();

    const accessToken = TokenService.generateAccessToken({
      role: user.userRole,
      userId: user.id,
    });
    const refreshToken = TokenService.generateRefreshToken({
      sessionId: sessionId,
      userId: user.id,
    });

    const refreshTokenHash = await PasswordService.hashPassword(refreshToken);

    await this.sessionRepository.create({
      id: sessionId,
      user: {
        connect: {
          id: user.id,
        },
      },
      refreshTokenHash: refreshTokenHash,
      expiresAt: getRefreshTokenExpiry(),
    });

    return {
      user,
      refreshToken,
      accessToken,
    };
  }

  async refresh(refreshToken: string) {

    if(!refreshToken){
      throw new ApiError(401, "Refresh token does not exist");
    }
    
    const payload = TokenService.verifyRefreshToken(refreshToken);

    if(!payload){
      throw new ApiError(401,"Unverified refresh token");
    }

    const session = await this.sessionRepository.findById(payload.sessionId);

    if(!session){
      throw new ApiError(401,"Session does not exist");
    }

    const match = await PasswordService.comparePassword(payload.sessionId,session.refreshTokenHash);

    if(!match){
      throw new ApiError(401,"unmatched token");
    }

    if(session.expiresAt < new Date()){
      throw new ApiError(401,"Session expired");
    }

    const user = await this.userRepository.findById(payload.userId);

    if(!user){
      throw new ApiError(401,"User not found");
    }

    if( user.status == "INACTIVE"){
      throw new ApiError(403,"User inactive");
    }

    await this.sessionRepository.delete(session.id);

    const sessionId = crypto.randomUUID();

    const accessToken = TokenService.generateAccessToken({userId:user.id, role:user.userRole});

    const newRefreshToken = TokenService.generateRefreshToken({userId:user.id, sessionId:sessionId});

    const refreshTokenHash = await PasswordService.hashPassword(newRefreshToken);

    await this.sessionRepository.create({
      id:sessionId,
      expiresAt:getRefreshTokenExpiry(),
      refreshTokenHash:refreshTokenHash,
      user:{
        connect:{id:user.id}
      }
    })

    return {
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        mobNo: user.mobNo,
        userRole: user.userRole,
      },
      accessToken,
      newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized");
    }

    const payload = TokenService.verifyRefreshToken(refreshToken);
    const session = await this.sessionRepository.findById(payload.sessionId);

    if (!session) {
      throw new ApiError(401, "Session does not exist");
    }

    const match = await PasswordService.comparePassword(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!match) {
      throw new ApiError(401, "refresh token is invalid");
    }

    await this.sessionRepository.delete(payload.sessionId);
  }

  async logoutAll(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized");
    }
    const payload = TokenService.verifyRefreshToken(refreshToken);

    const session = await this.sessionRepository.findById(payload.sessionId);

    if (!session) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const match = await PasswordService.comparePassword(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!match) {
      throw new ApiError(401, "Invalid refresh token");
    }

    await this.sessionRepository.deleteManyByUserId(payload.userId);
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId);
    if(!user){
      throw new ApiError(401,"User does not exist");
    }
    return {
      user:{
        id:user.id,
        userName: user.userName,
        email: user.email,
        mobno: user.mobNo,
        userRole: user.userRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    }
  }
}
