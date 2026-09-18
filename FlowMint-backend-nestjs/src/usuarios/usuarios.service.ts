import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const MAX_EMPLEADOS_CUENTA = 2;

/** Obvious 6-digit PINs to reject */
const BANNED_PINS = new Set([
  '000000', '111111', '222222', '333333', '444444',
  '555555', '666666', '777777', '888888', '999999',
  '123456', '654321',
]);

function isRepeatingDigits(pin: string): boolean {
  return new Set(pin.split('')).size === 1;
}

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------------------
  //  CREATE — employee account (DUENO) or standard (SUPERADMIN)
  // ----------------------------------------------------------------

  async create(dto: CreateUsuarioDto, callerRole?: string) {
    const isDueno = callerRole === 'DUENO';

    // --- Uniqueness check (prevents 500 on DB constraint violation) ---
    const existingUser = await this.prisma.usuario.findFirst({
      where: { user: dto.user },
    });
    if (existingUser) {
      throw new BadRequestException(
        `El nombre de usuario "${dto.user}" ya está en uso`,
      );
    }

    if (dto.correo) {
      const existingEmail = await this.prisma.usuario.findFirst({
        where: { correo: dto.correo },
      });
      if (existingEmail) {
        throw new BadRequestException(
          `El correo electrónico "${dto.correo}" ya está registrado`,
        );
      }
    }

    // --- Employee account created by DUENO ---
    if (isDueno) {
      const count = await this.contarEmpleadosCuenta(dto.comercio_id!);
      if (count >= MAX_EMPLEADOS_CUENTA) {
        throw new BadRequestException(
          `Límite alcanzado: solo podés tener ${MAX_EMPLEADOS_CUENTA} empleados con acceso al sistema`,
        );
      }

      const empleado = await this.prisma.usuario.create({
        data: { ...dto, pass: null },
        include: { rol: true, comercio: true },
      });

      const pin = await this.generarPin(empleado.usuario_id, dto.comercio_id!);

      this.logger.log(
        `PIN generated for employee usuario_id=${empleado.usuario_id} in comercio_id=${dto.comercio_id}`,
      );

      return { ...this.stripSensitive(empleado), pin };
    }

    // --- Standard account created by SUPERADMIN ---
    if (!dto.pass) {
      throw new BadRequestException('La contraseña es requerida');
    }
    const hashedPassword = await bcrypt.hash(dto.pass, 10);
    const created = await this.prisma.usuario.create({
      data: { ...dto, pass: hashedPassword },
    });
    return this.stripSensitive(created);
  }

  // ----------------------------------------------------------------
  //  PIN operations
  // ----------------------------------------------------------------

  /**
   * Count employee login accounts in a commerce.
   * Used to enforce MAX_EMPLEADOS_CUENTA limit.
   */
  async contarEmpleadosCuenta(comercioId: number): Promise<number> {
    const empleadoRoleId = await this.getEmpleadoRoleId();
    return this.prisma.usuario.count({
      where: { comercio_id: comercioId, rol_id: empleadoRoleId },
    });
  }

  /**
   * Generate a 6-digit PIN for a given employee.
   * Returns the plain PIN ONCE — never stored in plain text.
   */
  async generarPin(usuarioId: number, comercioId: number): Promise<string> {
    const user = await this.prisma.usuario.findUnique({
      where: { usuario_id: usuarioId },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    if (user.comercio_id !== comercioId) {
      throw new BadRequestException(
        'El usuario no pertenece a este comercio',
      );
    }

    // Generate a valid random 6-digit PIN (no banned patterns)
    let pin: string;
    do {
      pin = String(Math.floor(100000 + Math.random() * 900000));
    } while (BANNED_PINS.has(pin) || isRepeatingDigits(pin));

    const pinHash = await bcrypt.hash(pin, 10);

    await this.prisma.usuario.update({
      where: { usuario_id: usuarioId },
      data: {
        pin_hash: pinHash,
        pin_expiracion: new Date(Date.now() + 24 * 60 * 60 * 1000),
        pin_intentos: 0,
      },
    });

    return pin;
  }

  /**
   * Activate an employee account by validating the 6-digit PIN
   * and setting a new password.
   */
  async activarConPin(user: string, pin: string, nuevaPass: string) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { user },
      include: { rol: true, comercio: true },
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }
    if (usuario.rol?.nombre !== 'EMPLEADO') {
      throw new BadRequestException(
        'Solo las cuentas de empleado pueden activarse con PIN',
      );
    }

    // --- PIN checks ---
    if (!usuario.pin_hash) {
      throw new BadRequestException('No se generó ningún PIN para esta cuenta');
    }
    if (usuario.pin_expiracion && usuario.pin_expiracion < new Date()) {
      throw new BadRequestException(
        'El PIN expiró. Pedile al dueño uno nuevo',
      );
    }
    if (usuario.pin_intentos >= 5) {
      // Invalidate PIN
      await this.prisma.usuario.update({
        where: { usuario_id: usuario.usuario_id },
        data: { pin_hash: null, pin_expiracion: null, pin_intentos: 0 },
      });
      throw new BadRequestException(
        'Demasiados intentos. El PIN fue invalidado',
      );
    }

    const pinValid = await bcrypt.compare(pin, usuario.pin_hash);

    if (!pinValid) {
      const newAttempts = usuario.pin_intentos + 1;
      const updateData: Record<string, unknown> = {
        pin_intentos: newAttempts,
      };
      // Invalidate PIN after 5th failed attempt
      if (newAttempts >= 5) {
        updateData.pin_hash = null;
        updateData.pin_expiracion = null;
      }
      await this.prisma.usuario.update({
        where: { usuario_id: usuario.usuario_id },
        data: updateData,
      });
      throw new BadRequestException('PIN incorrecto');
    }

    // --- PIN valid → set password, clear PIN fields ---
    const hashedPassword = await bcrypt.hash(nuevaPass, 10);
    const activated = await this.prisma.usuario.update({
      where: { usuario_id: usuario.usuario_id },
      data: {
        pass: hashedPassword,
        pin_hash: null,
        pin_expiracion: null,
        pin_intentos: 0,
      },
      include: { rol: true, comercio: true },
    });

    this.logger.log(
      `Employee account activated: usuario_id=${usuario.usuario_id}`,
    );

    return this.stripSensitive(activated);
  }

  // ----------------------------------------------------------------
  //  Standard CRUD
  // ----------------------------------------------------------------

  async findAll() {
    const users = await this.prisma.usuario.findMany({
      include: { rol: true, comercio: true },
    });
    return users.map((u) => this.stripSensitive(u));
  }

  async findAllByComercio(comercio_id: number) {
    const users = await this.prisma.usuario.findMany({
      where: { comercio_id },
      include: { rol: true, comercio: true },
    });
    return users.map((u) => this.stripSensitive(u));
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { usuario_id: id },
      include: { rol: true, comercio: true },
    });
    if (user) {
      return this.stripSensitive(user);
    }
    return null;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.pass) {
      updateUsuarioDto.pass = await bcrypt.hash(updateUsuarioDto.pass, 10);
    }
    const updated = await this.prisma.usuario.update({
      where: { usuario_id: id },
      data: updateUsuarioDto,
      include: { rol: true, comercio: true },
    });
    return this.stripSensitive(updated);
  }

  /**
   * Elimina un usuario y evita dejar comercios huérfanos.
   *
   * Regla de negocio (retención de datos):
   *  - Si el usuario borrado era el único vínculo de su comercio y este NO
   *    tiene datos asociados (clientes, empleados, servicios, turnos), el
   *    comercio se elimina para no dejar registros fantasma en el panel admin.
   *  - Si el comercio todavía tiene datos, NO se borra: se suspende para
   *    conservar el historial (retención) hasta su baja definitiva.
   */
  async remove(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { usuario_id: id },
      select: {
        usuario_id: true,
        comercio_id: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const comercioId = usuario.comercio_id;

    return this.prisma.$transaction(async (tx) => {
      // Las notificaciones referencian al usuario (FK) — limpiarlas primero
      await tx.notificacion.deleteMany({ where: { usuario_id: id } });

      const deleted = await tx.usuario.delete({ where: { usuario_id: id } });

      // El SUPERADMIN no pertenece a ningún comercio
      if (comercioId == null) {
        return deleted;
      }

      const [usuarios, clientes, empleados, servicios, turnos] =
        await Promise.all([
          tx.usuario.count({ where: { comercio_id: comercioId } }),
          tx.cliente.count({ where: { comercio_id: comercioId } }),
          tx.empleado.count({ where: { comercio_id: comercioId } }),
          tx.servicio.count({ where: { comercio_id: comercioId } }),
          tx.turno.count({ where: { comercio_id: comercioId } }),
        ]);

      const comercioVacio =
        usuarios === 0 &&
        clientes === 0 &&
        empleados === 0 &&
        servicios === 0 &&
        turnos === 0;

      if (comercioVacio) {
        await tx.notificacion.deleteMany({
          where: { comercio_id: comercioId },
        });
        await tx.comercio.delete({ where: { comercio_id: comercioId } });
        this.logger.log(
          `Comercio ${comercioId} eliminado junto a su último usuario (usuario_id=${id})`,
        );
      } else {
        await tx.comercio.update({
          where: { comercio_id: comercioId },
          data: {
            activo: false,
            estado: 'suspendido',
            fecha_suspension: new Date(),
            motivo_suspension: 'Propietario eliminado del sistema',
          },
        });
        this.logger.log(
          `Comercio ${comercioId} suspendido con datos conservados tras eliminar su dueño (usuario_id=${id})`,
        );
      }

      return deleted;
    });
  }

  async findByUsername(username: string) {
    return this.prisma.usuario.findUnique({
      where: { user: username },
      include: { rol: true, comercio: true },
    });
  }

  /**
   * Returns the rol_id for EMPLEADO. Used to prevent privilege escalation:
   * a DUENO may only create EMPLEADO accounts inside their own commerce.
   */
  async getEmpleadoRoleId(): Promise<number> {
    const empleado = await this.prisma.rol.findFirst({
      where: { nombre: 'EMPLEADO' },
      select: { rol_id: true },
    });
    if (!empleado) {
      throw new Error('EMPLEADO role not found');
    }
    return empleado.rol_id;
  }

  // ----------------------------------------------------------------
  //  Private helpers
  // ----------------------------------------------------------------

  /**
   * Remove sensitive fields (pass, pin_hash) from a Usuario record.
   * Applied to ALL responses to prevent accidental PIN leakage.
   */
  private stripSensitive<T extends { pass?: unknown; pin_hash?: unknown; pin_expiracion?: unknown }>(
    usuario: T,
  ): Omit<T, 'pass' | 'pin_hash' | 'pin_expiracion'> {
    const { pass, pin_hash, pin_expiracion, ...safe } = usuario;
    return safe as Omit<T, 'pass' | 'pin_hash' | 'pin_expiracion'>;
  }
}
