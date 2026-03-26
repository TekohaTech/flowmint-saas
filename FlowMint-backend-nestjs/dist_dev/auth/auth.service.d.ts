import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CompletarRegistroDto } from './dto/completar-registro.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private usuariosService;
    private jwtService;
    private prisma;
    private emailService;
    constructor(usuariosService: UsuariosService, jwtService: JwtService, prisma: PrismaService, emailService: EmailService);
    validateUser(username: string, pass: string): Promise<any>;
    completarRegistro(dto: CompletarRegistroDto): Promise<{
        mensaje: string;
        comercio: {
            comercio_id: number;
            nombre: string;
            estado: string;
        };
    }>;
    getProfile(usuarioId: number): Promise<{
        comercio: {
            nombre: string;
            comercio_id: number;
            estado: string;
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
    }>;
    login(user: any): Promise<{
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
    verificarEmail(token: string): Promise<{
        message: string;
    }>;
    private verificarControlIP;
}
