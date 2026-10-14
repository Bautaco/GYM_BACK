export class Exercise {
    id;
    nombre;
    grupoMuscularPrincipal;
    zonasTrabajadas;
    descripcion;
    videoUrl;
    createdAt;
    constructor(id, nombre, grupoMuscularPrincipal, zonasTrabajadas, descripcion, videoUrl, createdAt) {
        this.id = id;
        this.nombre = nombre;
        this.grupoMuscularPrincipal = grupoMuscularPrincipal;
        this.zonasTrabajadas = zonasTrabajadas;
        this.descripcion = descripcion;
        this.videoUrl = videoUrl;
        this.createdAt = createdAt;
    }
    hasVideo() {
        return Boolean(this.videoUrl && this.videoUrl.trim().length > 0);
    }
}
//# sourceMappingURL=exercise.entity.js.map