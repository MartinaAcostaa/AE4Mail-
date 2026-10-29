export interface IContacto {
    readonly id: number;

    getNombre(): string;
    getEmail(): string;

    modificarNombre(nombre: string): void;
    modificarEmail(email: string): void;
}