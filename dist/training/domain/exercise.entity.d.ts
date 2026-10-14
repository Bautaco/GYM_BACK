export declare class Exercise {
    readonly id: string;
    nombre: string;
    grupoMuscularPrincipal: string;
    zonasTrabajadas: string[];
    descripcion: string;
    videoUrl?: string | undefined;
    createdAt?: Date | undefined;
    constructor(id: string, nombre: string, grupoMuscularPrincipal: string, zonasTrabajadas: string[], descripcion: string, videoUrl?: string | undefined, createdAt?: Date | undefined);
    hasVideo(): boolean;
}
