"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const roles_module_1 = require("./roles/roles.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const auth_module_1 = require("./auth/auth.module");
const clientes_module_1 = require("./clientes/clientes.module");
const empleados_module_1 = require("./empleados/empleados.module");
const servicios_module_1 = require("./servicios/servicios.module");
const turnos_module_1 = require("./turnos/turnos.module");
const ganancias_module_1 = require("./ganancias/ganancias.module");
const ai_module_1 = require("./ai/ai.module");
const comercios_module_1 = require("./comercios/comercios.module");
const email_module_1 = require("./email/email.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            prisma_module_1.PrismaModule,
            roles_module_1.RolesModule,
            usuarios_module_1.UsuariosModule,
            auth_module_1.AuthModule,
            clientes_module_1.ClientesModule,
            empleados_module_1.EmpleadosModule,
            servicios_module_1.ServiciosModule,
            turnos_module_1.TurnosModule,
            ganancias_module_1.GananciasModule,
            ai_module_1.AiModule,
            comercios_module_1.ComerciosModule,
            email_module_1.EmailModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map