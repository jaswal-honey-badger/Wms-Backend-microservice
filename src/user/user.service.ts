import { ResetPasswordDto } from "./dto/reset-password.dto";
import { Request } from "express";
import { AuthService } from "./../auth/auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { Injectable, BadRequestException, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as mongoose from "mongoose";
import { v4 } from "uuid";
import { addHours } from "date-fns";
import * as bcrypt from "bcrypt";
import { CreateForgotPasswordDto } from "./dto/create-forgot-password.dto";
import { VerifyUuidDto } from "./dto/verify-uuid.dto";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";
import { ForgotPassword } from "./interfaces/forgot-password.interface";
import { User } from "./interfaces/user.interface";
import { EmailService } from "src/shared/services/email/email.service";
import { ResendVerificationDto } from "./dto/resend-verification.dto";
import { CreateUserServiceDto } from "./dto/create-user-service.dto";
import { RoleService } from "src/role/role.service";
import { GetUserDto } from "./dto/get-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateUserServiceDto } from "./dto/update-user-service.dto";

@Injectable()
export class UserService {
  HOURS_TO_VERIFY = 24;
  HOURS_TO_BLOCK = 6;
  LOGIN_ATTEMPTS_TO_BLOCK = 5;

  constructor(
    @InjectModel("User") private readonly userModel: Model<User>,
    @InjectModel("ForgotPassword")
    private readonly forgotPasswordModel: Model<ForgotPassword>,
    private readonly authService: AuthService,
    private emailService: EmailService,
    private roleService: RoleService
  ) { }

  async signup(createUserServiceDto: CreateUserServiceDto): Promise<any> {
    const user = new this.userModel(createUserServiceDto);
    await this.isEmailUnique(user.email);
    this.setVerificationInfo(user);
    await user.save();

    const emailBody = this.emailService.loadTemplate("account-verification", user);
    await this.emailService.send(user.email, "Account Verification", emailBody, emailBody);

    return {
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      verified: user.verified,
    };
  }

  async resendAccountVerificationEmail(resendVerificationDto: ResendVerificationDto): Promise<any> {
    const user = await this.userModel.findOne({ email: resendVerificationDto.email });
    if (!user) {
      throw new NotFoundException("Email not found");
    }

    this.setVerificationInfo(user);
    await user.save();

    const emailBody = this.emailService.loadTemplate("account-verification", user);
    await this.emailService.send(user.email, "Account Verification", emailBody, emailBody);

    return {
      email: user.email,
      success: 1
    };
  }

  async verifyEmail(req: Request, verifyUuidDto: VerifyUuidDto) {
    try {
      const user = await this.userModel.findOne({
        verification: verifyUuidDto.verification,
        verified: false,
        verificationExpires: { $gt: new Date() },
      });
      if (!user) {
        throw new BadRequestException("Invalid or expired link.");
      }

      user.verified = true;
      user.verification = "";
      user.verificationExpires = null;
      await user.save();

      return {
        id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        RoleId: user.RoleId,
        accessToken: await this.authService.createAccessToken(user._id),
        refreshToken: await this.authService.createRefreshToken(req, user._id),
      };
    } catch (error) {
      throw new BadRequestException("Invalid or expired link.");
    }
  }

  async login(req: Request, loginUserDto: LoginUserDto) {
    try {
      const user = await this.userModel.findOne({ email: loginUserDto.email });
      if (!user) {
        throw new NotFoundException("Invalid email or password.");
      }

      const isPasswordMatched = await this.isPasswordMatched(loginUserDto.password, user.password);
      if (!isPasswordMatched) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
          user.isBlocked = true;
        }

        if (user.isBlocked) {
          throw new BadRequestException("Please reset password", "account-blocked");
        }

        await user.save();
        throw new NotFoundException("Invalid email or password.");
      }

      if (!user.verified) {
        throw new BadRequestException("Please verify you account", "verify-account");
      }

      if (user.isBlocked) {
        throw new BadRequestException("Please reset password", "account-blocked");
      }

      user.loginAttempts = 0;
      await user.save();

      const role = await this.roleService.findOneCached(user.RoleId);
      return {
        id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        pNumber: user.pNumber,
        lat:user.lat,
        lng:user.lng,
        pin:user.pin,
        university: user.university,
        address: user.address,
        city: user.city,
        profilePicture: user.profilePicture || "",
        RoleId: user.RoleId,
        role: role ? role.identifier : "",
        OfficeId: user.OfficeId,
        permissions: role ? role.permissions : [],
        accessToken: await this.authService.createAccessToken(user._id),
        refreshToken: await this.authService.createRefreshToken(req, user._id),
      };
    } catch (error) {
      throw new NotFoundException("Invalid email or password.");
    }
  }

  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const userId = await this.authService.findRefreshToken(
      refreshAccessTokenDto.refreshToken
    );
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException("Bad request");
    }
    return {
      accessToken: await this.authService.createAccessToken(user._id),
    };
  }

  async forgotPassword(req: Request, createForgotPasswordDto: CreateForgotPasswordDto) {
    const forgotPassword = await this.forgotPasswordModel.create({
      email: createForgotPasswordDto.email,
      verification: v4(),
      expires: addHours(new Date(), this.HOURS_TO_VERIFY),
      ip: this.authService.getIp(req),
      browser: this.authService.getBrowserInfo(req),
      country: this.authService.getCountry(req),
    });
    await forgotPassword.save();

    const emailBody = this.emailService.loadTemplate("forgot-password", forgotPassword);
    await this.emailService.send(forgotPassword.email, "Reset Password", emailBody, emailBody);

    return {
      email: createForgotPasswordDto.email,
      success: 1,
    };
  }

  async forgotPasswordVerify(req: Request, verifyUuidDto: VerifyUuidDto) {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      verification: verifyUuidDto.verification,
      // firstUsed: false,
      finalUsed: false,
      expires: { $gt: new Date() },
    });

    if (!forgotPassword) {
      throw new BadRequestException("Invalid or expired link");
    }

    forgotPassword.firstUsed = true;
    forgotPassword.ipChanged = this.authService.getIp(req);
    forgotPassword.browserChanged = this.authService.getBrowserInfo(req);
    forgotPassword.countryChanged = this.authService.getCountry(req);
    await forgotPassword.save();

    return {
      email: forgotPassword.email,
      success: 1,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const forgotPassword = await this.forgotPasswordModel.findOne({
      email: resetPasswordDto.email,
      firstUsed: true,
      finalUsed: false,
      expires: { $gt: new Date() },
    });
    if (!forgotPassword) {
      throw new BadRequestException("Invalid or expired link");
    }

    forgotPassword.finalUsed = true;
    await forgotPassword.save();

    await this.resetUserPassword(resetPasswordDto);
    return {
      email: resetPasswordDto.email,
      success: 1,
    };
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException("Invalid password.");
    }

    if (!user.verified) {
      throw new BadRequestException("Please verify you account", "verify-account");
    }

    if (user.isBlocked) {
      throw new BadRequestException("Please reset password using link on the login", "account-blocked");
    }

    const isPasswordMatched = await this.isPasswordMatched(changePasswordDto.password, user.password);
    if (!isPasswordMatched) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
        user.isBlocked = true;
      }

      await user.save();
      throw new NotFoundException("Invalid password.");
    }

    user.loginAttempts = 0;
    user.password = changePasswordDto.newPassword;
    await user.save();

    return {
      email: email,
      success: 1,
    };
  }

  findUsers(getUserDto: GetUserDto) {
    const where = {};
    const roleWhere = {
      $expr: { $eq: ["$_id", "$$roleId"] }
    };

    if (getUserDto.s) {
      if (!where["$or"]) where["$or"] = [];

      where["$or"].push(
        { fName: new RegExp(getUserDto.s, "i") },
        { lName: new RegExp(getUserDto.s, "i") },
        { email: new RegExp(getUserDto.s, "i") },
        { phone: new RegExp(getUserDto.s, "i") }
      )
    }

    if (getUserDto.email) {
      where["email"] = getUserDto.email;
    }

    if (getUserDto.roleId) {
      where["RoleId"] = new mongoose.Types.ObjectId(getUserDto.roleId);
    }

    if (getUserDto.role) {
      roleWhere["identifier"] = getUserDto.role;
    }

    if (getUserDto.phone) {
      where["phone"] = getUserDto.phone;
    }

    if (getUserDto.verified) {
      where['verified'] = getUserDto.verified === '1' ? true : false;
    }

    if (getUserDto.blocked) {
      where['isBlocked'] = getUserDto.blocked === '1' ? true : false;
    }

    return this.userModel.aggregate([
      { "$match": where },
      {
        $lookup:
        {
          from: 'roles',
          as: 'role',
          let: { roleId: '$RoleId' },
          pipeline: [
            {
              $match: roleWhere,
            }
          ]
        }
      },
      { $unwind: "$role" },
      {
        $project: { verification: 0, password: 0, verificationExpires: 0 }
      },
      { $sort: { [getUserDto.sb]: Number(getUserDto.sd) } },
      { $skip: Number(getUserDto.o) },
      { $limit: Number(getUserDto.l) },
    ])

    // return this.userModel.find(where)
    //   .select(['-verification', '-password', '-verificationExpires'])
    //   .populate({
    //     path: 'RoleId',
    //     match: { identifier: "admins" },
    //   })
    //   .sort([[getUserDto.sb, getUserDto.sd]])
    //   .skip(Number(getUserDto.o))
    //   .limit(Number(getUserDto.l))
    //   .exec();
  }

  async findUsersCount(getUserDto: GetUserDto) {
    try {
      const where = {};
      const roleWhere = {
        $expr: { $eq: ["$_id", "$$roleId"] }
      };

      if (getUserDto.s) {
        if (!where["$or"]) where["$or"] = [];

        where["$or"].push(
          { fName: new RegExp(getUserDto.s, "i") },
          { lName: new RegExp(getUserDto.s, "i") },
          { email: new RegExp(getUserDto.s, "i") },
          { phone: new RegExp(getUserDto.s, "i") }
        )
      }

      if (getUserDto.email) {
        where["email"] = getUserDto.email;
      }

      if (getUserDto.roleId) {
        where["RoleId"] = new mongoose.Types.ObjectId(getUserDto.roleId);
      }

      if (getUserDto.role) {
        roleWhere["identifier"] = getUserDto.role;
      }

      if (getUserDto.phone) {
        where["phone"] = getUserDto.phone;
      }

      if (getUserDto.verified) {
        where['verified'] = getUserDto.verified === '1' ? true : false;
      }

      if (getUserDto.blocked) {
        where['isBlocked'] = getUserDto.blocked === '1' ? true : false;
      }

      const countResult = await this.userModel.aggregate([
        { "$match": where },
        {
          $lookup:
          {
            from: 'roles',
            as: 'role',
            let: { roleId: '$RoleId' },
            pipeline: [
              {
                $match: roleWhere,
              }
            ]
          }
        },
        { $unwind: "$role" },
        { $count: "count" }
      ])

      if (!countResult.length) return { count: 0 };

      return countResult[0];
    } catch (error) {
      return { count: 0 };
    }

    // return this.userModel.find(where)
    //   .select(['-verification', '-password', '-verificationExpires'])
    //   .populate({
    //     path: 'RoleId',
    //     match: { identifier: "admins" },
    //   })
    //   .sort([[getUserDto.sb, getUserDto.sd]])
    //   .skip(Number(getUserDto.o))
    //   .limit(Number(getUserDto.l))
    //   .exec();
  }

  findOneUser(id: string) {
    return this.userModel.findById(id)
      .select(['-verification', '-password', '-verificationExpires'])
      .populate("RoleId")
      .exec();
  }

  removeUser(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }

  async create(createUserServiceDto: CreateUserServiceDto): Promise<any> {
    createUserServiceDto[`verified`] = true;
    const user = new this.userModel(createUserServiceDto);
    await this.isEmailUnique(user.email);
    await user.save();

    return {
      fName: user.fName,
      lName: user.lName,
      email: user.email,
      verified: user.verified,
    };
  }

  async update(id: string, updateUserServiceDto: UpdateUserServiceDto) {
    try {
      const user = await this.userModel.findById(id);
      user.set(updateUserServiceDto);
      await user.save();
      return true;
    } catch (error) {
      throw new BadRequestException("User could not bbe updated");
    }
  }

  async updateUserInfo(UserId: string, key: string, value: any) {
    const user = await this.userModel.findById(UserId);
    if (!user) return false;

    let info = user.info;
    if (!info) info = {};
    info[key] = value;

    await this.userModel.updateOne({ _id: UserId }, { info }).exec();
    return true;
  }

  // ********************************************
  // ╔═╗╦═╗╦╦  ╦╔═╗╔╦╗╔═╗  ╔╦╗╔═╗╔╦╗╦ ╦╔═╗╔╦╗╔═╗
  // ╠═╝╠╦╝║╚╗╔╝╠═╣ ║ ║╣   ║║║║╣  ║ ╠═╣║ ║ ║║╚═╗
  // ╩  ╩╚═╩ ╚╝ ╩ ╩ ╩ ╚═╝  ╩ ╩╚═╝ ╩ ╩ ╩╚═╝═╩╝╚═╝
  // ********************************************

  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new ConflictException("Email already exist");
    }
  }

  private setVerificationInfo(user): any {
    user.verification = v4();
    user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
  }

  private async isPasswordMatched(attemptPass: string, password: string) {
    return await bcrypt.compare(attemptPass, password);
  }

  private async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: resetPasswordDto.email
    });
    user.verified = true;
    user.password = resetPasswordDto.password;
    await user.save();
  }
}
