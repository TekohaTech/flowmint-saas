import { AuthService } from './auth.service';
import { CompletarRegistroDto } from './dto/completar-registro.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any, res: any): Promise<{
        access_token: string;
        user: {
            usuario_id: any;
            nombre: any;
            apellido: any;
            user: any;
            rol: any;
            comercio_id: any;
        };
    }>;
    logout(res: any): Promise<{
        message: string;
    }>;
    register(dto: RegisterDto, ip: string): Promise<{
        message: string;
        comercio: {
            comercio_id: number;
            nombre: string;
            estado: string;
        };
        usuario: {
            usuario_id: number;
            nombre: string;
            apellido: string;
            user: string | null;
            correo: string | null;
            rol_id: number;
            email_verificado: boolean;
        };
    }>;
    completarRegistro(dto: CompletarRegistroDto, req: any): Promise<{
        mensaje: string;
        comercio: {
            comercio_id: number;
            nombre: string;
            estado: string;
        };
    }>;
    getProfile(req: any): Promise<{
        comercio: {
            nombre: string;
            estado: string;
            comercio_id: number;
            creado_en: Date;
            direccion: string | null;
            telefono: string | null;
            email: string | null;
            activo: boolean;
            categoria: string | null;
            logo_url: string | null;
            dueno_nombre: string | null;
            dueno_apellido: string | null;
            dueno_email: string | null;
            dueno_telefono: string | null;
            fecha_solicitud: Date;
            fecha_activacion: Date | null;
            fecha_suspension: Date | null;
            motivo_suspension: string | null;
            actualizado_en: Date;
        } | null;
        rol: {
            nombre: string;
            rol_id: number;
        };
        usuario_id: number;
        nombre: string;
        apellido: string;
        dni: string | null;
        user: string | null;
        googleId: string | null;
        correo: string | null;
        rol_id: number;
        estado: string;
        comercio_id: number | null;
        email_verificado: boolean;
        token_verificacion: string | null;
        creado_en: Date;
    }>;
    verificarEmail(token: string): Promise<{
        message: string;
    }>;
}
