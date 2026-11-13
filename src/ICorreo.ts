import { IContacto } from "./IContacto";

export interface ICorreo {
    readonly id: number;

    getAsunto(): string;
    getContenido(): string;
    getRemitente(): IContacto;
    getDestinatarios(): IContacto[];
    getLeido(emailUsuario?: string): boolean;    

    getRemitente(): IContacto;

    marcarComoLeido(emailUsuario?: string): void;
    marcarComoNoLeido(emailUsuario?: string): void;

    getLeido(emailUsuario?: string): boolean;
    marcarComoLeido(emailUsuario?: string): void;
    marcarComoNoLeido(emailUsuario?: string): void;

    getFavorito(emailUsuario: string): boolean;
    marcarComoFavorito(emailUsuario: string): void;
    quitarComoFavorito(emailUsuario: string): void;


}