import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<{
        rol: {
            nombre: string;
            rol_id: number;
        };
        nombre: string;
        apellido: string;
        dni: string | null;
        user: string | null;
        correo: string | null;
        rol_id: number;
        comercio_id: number | null;
        usuario_id: number;
        googleId: string | null;
        estado: string;
        email_verificado: boolean;
        token_verificacion: string | null;
        creado_en: Date;
    } | null>;
}
export {};
