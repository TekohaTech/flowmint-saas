import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthService } from './auth.service';

/** Mirrors AuthService.fingerprintPassword for assertions and fixtures. */
const fingerprint = (passHash: string | null) =>
  crypto.createHash('sha256').update(passHash ?? '').digest('hex').slice(0, 16);

describe('AuthService — password reset flow', () => {
  let service: AuthService;
  let jwt: { verify: jest.Mock; sign: jest.Mock };
  let prisma: any;
  let email: any;
  let config: { get: jest.Mock };

  const currentHash = bcrypt.hashSync('OldPass123', 10);

  beforeEach(() => {
    jwt = { verify: jest.fn(), sign: jest.fn().mockReturnValue('signed-token') };
    prisma = {
      usuario: { findFirst: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    };
    email = {
      sendPasswordChangedEmail: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
    };
    config = { get: jest.fn().mockReturnValue('http://localhost:5173') };

    service = new AuthService(
      {} as any,
      jwt as any,
      prisma as any,
      email as any,
      config as any,
    );
  });

  describe('forgotPassword', () => {
    it('signs a token bound to the current password hash and emails the user', async () => {
      prisma.usuario.findFirst.mockResolvedValue({
        usuario_id: 7,
        correo: 'ana@test.com',
        nombre: 'Ana',
        pass: currentHash,
      });

      const result = await service.forgotPassword('ana@test.com');

      const payload = jwt.sign.mock.calls[0][0];
      expect(payload).toMatchObject({
        sub: 7,
        type: 'reset_password',
        fph: fingerprint(currentHash),
      });
      expect(email.sendResetPasswordEmail).toHaveBeenCalledWith(
        'ana@test.com',
        expect.stringContaining('/reset-password?token=signed-token'),
        'Ana',
      );
      // Same response whether or not the account exists (no user enumeration)
      expect(result.message).toMatch(/si el correo existe/i);
    });

    it('does not leak whether the email exists', async () => {
      prisma.usuario.findFirst.mockResolvedValue(null);

      const result = await service.forgotPassword('ghost@test.com');

      expect(jwt.sign).not.toHaveBeenCalled();
      expect(email.sendResetPasswordEmail).not.toHaveBeenCalled();
      expect(result.message).toMatch(/si el correo existe/i);
    });
  });

  describe('resetPassword', () => {
    it('updates the password and sends a confirmation email', async () => {
      jwt.verify.mockReturnValue({
        sub: 7,
        type: 'reset_password',
        fph: fingerprint(currentHash),
      });
      prisma.usuario.findUnique.mockResolvedValue({
        usuario_id: 7,
        correo: 'ana@test.com',
        nombre: 'Ana',
        pass: currentHash,
      });
      prisma.usuario.update.mockResolvedValue({ usuario_id: 7 });

      const result = await service.resetPassword('token', 'NewPass123');

      expect(prisma.usuario.update).toHaveBeenCalledTimes(1);
      const storedPass = prisma.usuario.update.mock.calls[0][0].data.pass;
      expect(storedPass).not.toBe(currentHash);
      expect(await bcrypt.compare('NewPass123', storedPass)).toBe(true);

      expect(email.sendPasswordChangedEmail).toHaveBeenCalledWith(
        'ana@test.com',
        'Ana',
      );
      expect(result.message).toMatch(/actualizada/i);
    });

    it('rejects a replayed token once the password has changed', async () => {
      // Token was issued for an older hash — password already changed.
      jwt.verify.mockReturnValue({
        sub: 7,
        type: 'reset_password',
        fph: fingerprint('an-old-hash'),
      });
      prisma.usuario.findUnique.mockResolvedValue({
        usuario_id: 7,
        correo: 'ana@test.com',
        nombre: 'Ana',
        pass: currentHash,
      });

      await expect(
        service.resetPassword('token', 'NewPass123'),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.usuario.update).not.toHaveBeenCalled();
      expect(email.sendPasswordChangedEmail).not.toHaveBeenCalled();
    });

    it('rejects an expired or forged token', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(
        service.resetPassword('bad-token', 'NewPass123'),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.usuario.update).not.toHaveBeenCalled();
    });

    it('rejects a token of the wrong type', async () => {
      jwt.verify.mockReturnValue({ sub: 7, type: 'verify_email' });

      await expect(
        service.resetPassword('token', 'NewPass123'),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.usuario.update).not.toHaveBeenCalled();
    });

    it('rejects when the user no longer exists', async () => {
      jwt.verify.mockReturnValue({
        sub: 99,
        type: 'reset_password',
        fph: fingerprint(currentHash),
      });
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(
        service.resetPassword('token', 'NewPass123'),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.usuario.update).not.toHaveBeenCalled();
    });
  });
});
