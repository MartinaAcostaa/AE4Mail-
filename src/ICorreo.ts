import { IContacto } from "./IContacto";

export interface ICorreo {
    readonly id: number;

    getAsunto(): string;
    getContenido(): string;
    getRemitente(): IContacto;
    getDestinatarios(): IContacto[];
    getLeido(): boolean;
    getFavorito(): boolean;
    getEnviado(): boolean;

    marcarComoLeido(): void;
    marcarComoNoLeido(): void;
    marcarComoFavorito(): void;
    quitarFavorito(): void;
    marcarComoEnviado(): void;
}