import { GananciasService } from './ganancias.service';
export declare class GananciasController {
    private readonly gananciasService;
    constructor(gananciasService: GananciasService);
    getGananciasDiarias(req: any, startDate?: string, endDate?: string): Promise<unknown[]>;
    getGananciasSemanales(req: any, startDate?: string, endDate?: string): Promise<unknown[]>;
    getGananciasMensuales(req: any, startDate?: string, endDate?: string): Promise<unknown[]>;
    getGananciasAnuales(req: any, startDate?: string, endDate?: string): Promise<unknown[]>;
    getGananciasMensualesPorServicio(req: any, startDate?: string, endDate?: string): Promise<unknown[]>;
    getGananciasMensualesPorEmpleado(req: any, startDate?: string, endDate?: string): Promise<unknown[]>;
    getGananciasAnualesPorServicio(req: any, startDate?: string, endDate?: string): Promise<unknown[]>;
    getGananciasAnualesPorEmpleado(req: any, startDate?: string, endDate?: string): Promise<unknown[]>;
    getResumenGanancias(req: any, startDate?: string, endDate?: string): Promise<{
        total: number;
        totalTurnos: number;
        promedioPorDia: number;
    }>;
}
