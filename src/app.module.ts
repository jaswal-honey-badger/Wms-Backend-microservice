import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from '@nestjs/config';
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";

import { RoleModule } from "./role/role.module";
import { SettingModule } from "./setting/setting.module";
import { SharedModule } from "./shared/shared.module";
import { AttendanceModule } from "./attendance/attendance.module";
import {LeaveModule} from "./leave/leave.module";
import { AppService } from "./app.service";
import { RolesGuard } from "./auth/guards/roles.guard";
import { ServicesModule } from './services/services.module';
import { ScheduleModule } from "@nestjs/schedule";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV.toLowerCase()}`,
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot( process.env.MONGO_CON_STRING || "mongodb://localhost:27017/WMS-main-service"),
    UserModule,
    CategoryModule,
    AttendanceModule,
    RoleModule,
    SettingModule,
    AuthModule,
    SharedModule,
    LeaveModule,
    ServicesModule,
  ],
  providers: [
    //  {
    //    provide: APP_GUARD,
    //    useClass: RolesGuard,
    //  },
    AppService
  ],
})
export class AppModule { }
