import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, SessionPayload } from '@/lib/auth';
import { PatronLoginInput, PatronSignupInput } from '@/lib/validation';

export const authService = {
  async loginPatron(input: PatronLoginInput): Promise<SessionPayload> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { phone: input.email }],
      },
    });

    if (!user) {
      throw new Error('No patron account found with this credential.');
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid authentication password.');
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      vaultId: user.vaultId,
      tier: user.tier,
    };
  },

  async registerPatron(input: PatronSignupInput): Promise<SessionPayload> {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { phone: input.phone }],
      },
    });

    if (existing) {
      throw new Error('A patron account with this email or mobile already exists.');
    }

    const passwordHash = await hashPassword(input.password);
    const vaultId = `SOV-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash,
        role: 'CUSTOMER',
        vaultId,
        tier: 'Sovereign Patron',
        loyaltyPoints: 500, // Welcome gift
      },
    });

    // Initialize Default Measurement Vault
    await prisma.measurementVault.create({
      data: {
        userId: user.id,
        chest: 40,
        waist: 34,
        collar: 15.5,
        shoulder: 18,
        sleeve: 25.5,
        kurtaLength: 42,
      },
    });

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      vaultId: user.vaultId,
      tier: user.tier,
    };
  },

  async loginAdmin(email: string, pass: string): Promise<SessionPayload> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role === 'CUSTOMER') {
      throw new Error('Access denied: Unauthorized administrative identity.');
    }

    const isValid = await verifyPassword(pass, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid administrative master credentials.');
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      vaultId: user.vaultId,
      tier: user.tier,
    };
  },
};

export default authService;
