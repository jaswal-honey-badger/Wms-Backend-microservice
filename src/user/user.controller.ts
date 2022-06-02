import { Permissions } from "../auth/decorators/permissions.decorator";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { CreateForgotPasswordDto } from "./dto/create-forgot-password.dto";
import { Request } from "express";
import { LoginUserDto } from "./dto/login-user.dto";
import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Patch, Param, Delete, Query, BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { VerifyUuidDto } from "./dto/verify-uuid.dto";
import { UserService } from "./user.service";
import { AuthGuard, PassportModule } from "@nestjs/passport";
import { RefreshAccessTokenDto } from "./dto/refresh-access-token.dto";
import { ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Public } from "src/auth/guards/roles.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResendVerificationDto } from "./dto/resend-verification.dto";
import { RoleService } from "src/role/role.service";
import { IdRequiredDto } from "src/shared/dto";
import { GetUserDto } from "./dto/get-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CurrentUser } from "src/auth/decorators/currentUser.decorator";
import { UpdateUserServiceDto } from "./dto/update-user-service.dto";
import { UtilService } from "src/shared/services/util/util.service";
import { UploadService } from "src/upload/upload.service";

@Controller("")
// @UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService, private readonly roleService: RoleService, private readonly uploadService: UploadService) { }

  @Post("auth/signup")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({})
  async signup(@Body() createUserDto: CreateUserDto) {
    const role = await this.roleService.findOneByIdentifier(createUserDto.role);
    if (!role || !role.isPublic || role.identifier === "admin") {
      throw new BadRequestException("Invalid role selected");
    }

    return await this.userService.signup({
      fName: createUserDto.fName, lName: createUserDto.lName, officeName: createUserDto.officeName, email: createUserDto.email,
      password: createUserDto.password, RoleId: role._id, OfficeId: createUserDto.OfficeId,
      pNumber: createUserDto.pNumber, university: createUserDto.university, address: createUserDto.address,
      city: createUserDto.city, lat: createUserDto.lat,lng: createUserDto.lng ,pin:createUserDto.pin
    });
  }

  @Public()
  @Post("auth/verify-email")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async verifyEmail(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto) {
    return await this.userService.verifyEmail(req, verifyUuidDto);
  }

  @Public()
  @Post("auth/resend-verify-email")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async verifyEmailSendNew(@Req() req: Request, @Body() resendVerificationDto: ResendVerificationDto) {
    return await this.userService.resendAccountVerificationEmail(resendVerificationDto);
  }

  @Public()
  @Post("auth/login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async login(@Req() req: Request, @Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(req, loginUserDto);
  }

  @Public()
  @Post("auth/refresh-access-token")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({})
  async refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessTokenDto) {
    return await this.userService.refreshAccessToken(refreshAccessTokenDto);
  }

  @Public()
  @Post("auth/forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async forgotPassword(@Req() req: Request, @Body() createForgotPasswordDto: CreateForgotPasswordDto) {
    return await this.userService.forgotPassword(req, createForgotPasswordDto);
  }

  @Public()
  @Post("auth/forgot-password-verify")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({})
  async forgotPasswordVerify(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto) {
    return await this.userService.forgotPasswordVerify(req, verifyUuidDto);
  }

  @Public()
  @Post("auth/reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({})
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @Post("user")
  async create(@Body() createUserDto: CreateUserDto) {
    const role = await this.roleService.findOneByIdentifier(createUserDto.role);
    return this.userService.create({
      fName: createUserDto.fName, lName: createUserDto.lName, officeName: createUserDto.officeName, email: createUserDto.email,
      password: createUserDto.password, RoleId: role._id, OfficeId: createUserDto.OfficeId,
      pNumber: createUserDto.pNumber, university: createUserDto.university, address: createUserDto.address,
      city: createUserDto.city ,lat: createUserDto.lat , lng: createUserDto.lng, pin: createUserDto.pin
    });
  }

  @Public()
  @Get("user")
  findAll(@Query() getUserDto: GetUserDto, @CurrentUser() currentUser) {
    return this.userService.findUsers(getUserDto);
  }

  @Get("user/count")
  countRecords(@Query() getUserDto: GetUserDto) {
    return this.userService.findUsersCount(getUserDto);
  }

  @Post("user/change-password")
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @CurrentUser() currentUser) {
    console.log(currentUser.email);
    return this.userService.changePassword(currentUser.email, changePasswordDto);
  }

  @Get("user/:id")
  findOne(@Param() { id }: IdRequiredDto) {
    return this.userService.findOneUser(id);
  }

  @Patch("user/:id")
  async update(@Param() { id }: IdRequiredDto, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findOneUser(id);
    if (!user) throw new BadRequestException("User not found");
    
    const updateUserServiceDto = new UpdateUserServiceDto();

    if (user.RoleId['identifier'] !==  updateUserDto.role) {
      const role = await this.roleService.findOneByIdentifier(updateUserDto.role);
      if (!role) throw new BadRequestException("Role not found");
      updateUserServiceDto.RoleId = role._id;
    }

    if (updateUserDto.fName) updateUserServiceDto.fName = updateUserDto.fName;
    if (updateUserDto.lName) updateUserServiceDto.lName = updateUserDto.lName;
    if (updateUserDto.email) updateUserServiceDto.email = updateUserDto.email;
    if (updateUserDto.password) updateUserServiceDto.password = updateUserDto.password;

    return this.userService.update(id, updateUserServiceDto);
  }

  @Patch("user")
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser) {
    const user = await this.userService.findOneUser(currentUser._id);
    if (!user) throw new BadRequestException("User not found");
    
    const updateUserServiceDto = new UpdateUserServiceDto();

    if (updateUserDto.fName) updateUserServiceDto.fName = updateUserDto.fName;
    if (updateUserDto.lName) updateUserServiceDto.lName = updateUserDto.lName;

    if (updateUserDto.profilePicture) {
      updateUserServiceDto.profilePicture =  UtilService.removeQueryString(updateUserDto.profilePicture);

      if (user.profilePicture && user.profilePicture !== updateUserServiceDto.profilePicture) {
        this.uploadService.removeFromUse(user.profilePicture);
      }

      this.uploadService.setInUse(updateUserServiceDto.profilePicture)
    }

    return this.userService.update(currentUser._id, updateUserServiceDto);
  }
}
