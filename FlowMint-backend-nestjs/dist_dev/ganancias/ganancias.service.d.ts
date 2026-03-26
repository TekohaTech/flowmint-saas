import { PrismaService } from '../prisma/prisma.service';
export declare class GananciasService {
    private prisma;
    constructor(prisma: PrismaService);
    getGananciasDiarias(comercioId?: number, startDate?: Date, endDate?: Date): Promise<unknown[]>;
    getGananciasSemanales(comercioId?: number, startDate?: Date, endDate?: Date): Promise<unknown[]>;
    getGananciasMensuales(comercioId?: number, startDate?: Date, endDate?: Date): Promise<unknown[]>;
    getGananciasAnuales(comercioId?: number, startDate?: Date, endDate?: Date): Promise<unknown[]>;
    getGananciasMensualesPorServicio(comercioId?: number, startDate?: Date, endDate?: Date): Promise<unknown[]>;
    getGananciasMensualesPorEmpleado(comercioId?: number, startDate?: Date, endDate?: Date): Promise<unknown[]>;
    getResumenGanancias(comercioId?: number, startDate?: Date, endDate?: Date): Promise<{
        total: number;
        totalTurnos: number;
        promedioPorDia: number;
    }>;
    getGananciasAnualesPorServicio(comercioId?: number, startDate?: Date, endDate?: Date): Promise<unknown[]>;
    getGananciasAnualesPorEmpleado(comercioId?: number, startDate?: Date, endDate?: Date): Promise<unknown[]>;
}
