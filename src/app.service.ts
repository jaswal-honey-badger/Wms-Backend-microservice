import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
// import { GeoDbService } from './geo-db/geo-db.service';
import { CreateRoleDto } from './role/dto/create-role.dto';
import { RoleService } from './role/role.service';
import { CreateSettingDto } from './setting/dto/create-setting.dto';
import { SettingService } from './setting/setting.service';
import { ESettingKeys } from './shared/enums/setting.enum';
import { CreateUserServiceDto } from './user/dto/create-user-service.dto';
import { UserService } from './user/user.service';
// import { CreateCityDto, CreateCountryDto, CreateStateDto } from './geo-db/dto/create-geo-db.dto';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
// import * as countriesJson from "./shared/seeds/countries.json";
import { CategoryService } from './category/category.service';
// const countriesJson = [];
const CountriesToImport = ["CA"];


@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private schedulerRegistry: SchedulerRegistry, private readonly settingService: SettingService, private readonly roleService: RoleService,
    private readonly userService: UserService, private readonly categoryService: CategoryService) {
  }

  onApplicationBootstrap() {
    // if (process.env.NODE_ENV === "TakeOff") {
    //   this.seedTheDb();
    // }
    this.seedTheDb();
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  startCron() {
    console.log(new Date());
  }

  async seedTheDb() {
    try {
      const IsDbSeeded = await this.settingService.findOneByKey(ESettingKeys.IsDbSeeded);
      if (IsDbSeeded) {
        return;
      }

      const settings: CreateSettingDto[] = [
        {
          title: "Flag For Db Seed Status",
          key: ESettingKeys.IsDbSeeded,
          value: true.toString(),
          priority: 0,
          type: "",
          config: null,
          isInternal: true
        }
      ];

      const permissions = [];

      const adminRole: CreateRoleDto = {
        name: "Admin",
        isPublic: false,
        identifier: "admin",
        permissions: permissions.map((x) => x.identifier),
        isDeleteAble: false
      }

      await this.roleService.createManyPermissions(permissions);
      await this.roleService.create(adminRole);
      await this.roleService.createManyRoles([
        {
          name: "Employee",
          isPublic: true,
          identifier: "employee",
          permissions: permissions.map((x) => x.identifier),
          isDeleteAble: false
        },
         {
           name: "Office",
           isPublic: true,
           identifier: "office",
           permissions: permissions.map((x) => x.identifier),
           isDeleteAble: false
         }
      ])
      await this.settingService.createMany(settings);
      const insertedAdminRole = await this.roleService.findAll({ identifier: adminRole.identifier });

      const adminUser: CreateUserServiceDto = {
        fName: "Super",
        lName: "Admin",
        email: "admin@example.com",
        password: "hello@12",
        RoleId: insertedAdminRole[0]._id,
        OfficeId: undefined,
        officeName: "Hello",
        pNumber: 0,

        university: '',
        address: '',
        city: '',
        lat: 0,
        lng: 0,
        pin: 1234
      }
      await this.userService.create(adminUser);

      const categories = [
        {
          "seo":
            { "title": "Filling", "description": "Filling", "keywords": "fjsdkfjk, sdfjkjs" },
          "slug": "filling",
          "priority": 0,
          "thumbnail": "./jhsd/",
          "description": "Filling",
          "summary": "Filling",
          "name": "Filling"
        }, {
          "seo":
            { "title": "Surgery", "description": "Surgery", "keywords": "fjsdkfjk, sdfjkjs" },
          "slug": "surgery",
          "priority": 0,
          "thumbnail": "./jhsd/",
          "description": "Surgery",
          "summary": "Surgery",
          "name": "Surgery"
        },
      ];

      categories.forEach((category) => this.categoryService.create(category))

      // GEO LOCATIONS INSERTION BELOW
      // const countriesToImport = countriesJson.filter(x => CountriesToImport.some(m => m === x.iso2))
      // countriesToImport.forEach(countryToImport => {
      //   const countryToImportObj: CreateCountryDto = {
      //     name: countryToImport.name,
      //     iso: countryToImport.iso2,
      //     flag: countryToImport.emoji
      //   };

      //   if (countryToImport.latitude && countryToImport.longitude) {
      //     countryToImportObj.location = {
      //       name: "Point",
      //       coordinates: [parseFloat(countryToImport.latitude), parseFloat(countryToImport.longitude)]
      //     }
      //   }

      //   this.geoDbService.createCountry(countryToImportObj).then((createdCountry) => {
      //     countryToImport.states.forEach(stateToImport => {
      //       const stateToImportObj: CreateStateDto = {
      //         name: stateToImport.name,
      //         code: stateToImport.state_code,
      //         countryIso: countryToImport.iso2,
      //         CountryId: createdCountry._id,
      //       }

      //       if (stateToImport.latitude && stateToImport.longitude) {
      //         stateToImportObj.location = {
      //           name: "Point",
      //           coordinates: [parseFloat(stateToImport.latitude), parseFloat(stateToImport.longitude)]
      //         }
      //       }

      //       this.geoDbService.createState(stateToImportObj).then((createdState) => {
      //         const citiesToCreate: CreateCityDto[] = stateToImport.cities.map(c => {
      //           const cityToImportObject: CreateCityDto = {
      //             name: c.name,
      //             countryIso: countryToImport.iso2,
      //             CountryId: createdCountry._id,
      //             stateCode: createdState.code,
      //             StateId: createdState._id
      //           }

      //           if (c.latitude && c.longitude) {
      //             cityToImportObject.location = {
      //               name: "Point",
      //               coordinates: [parseFloat(c.latitude), parseFloat(c.longitude)]
      //             }
      //           }

      //           return cityToImportObject;
      //         });

      //         return this.geoDbService.createManyCities(citiesToCreate)
      //       })
      //     })
      //   })
      // });
    } catch (error) {
      await this.roleService.truncateCollection();
      await this.settingService.truncateCollection();
    }
  }
}