export class Exercise {
  constructor(
    public readonly id: string,
    public nombre: string,
    public grupoMuscularPrincipal: string,
    public zonasTrabajadas: string[],
    public descripcion: string,
    public videoUrl?: string,
    public createdAt?: Date,
  ) {}

  hasVideo(): boolean {
    return Boolean(this.videoUrl && this.videoUrl.trim().length > 0);
  }
}
