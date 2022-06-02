import { Module, CacheModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AwsService } from "./services/aws/aws.service";
import { CacheService } from "./services/cache/cache.service";
import { EmailService } from "./services/email/email.service";

@Module({
  imports: [
    ConfigModule,
    CacheModule.register()
  ],
  providers: [AwsService, EmailService, CacheService],
  exports:[AwsService, EmailService, CacheService]
})
export class SharedModule {}
