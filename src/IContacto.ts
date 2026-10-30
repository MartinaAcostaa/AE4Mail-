export interface IContacto {
    readonly id: number;

    getNombre(): string;
    getEmail(): string;
    cambiarNombre(nuevoNombre: string): void;
    cambiarEmail(nuevoEmail: string): void;
}