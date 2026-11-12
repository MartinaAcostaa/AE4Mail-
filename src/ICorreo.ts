import { IContacto } from "./IContacto";

export interface ICorreo {
    readonly id: number;

    getAsunto(): string;
    getContenido(): string;
    getRemitente(): IContacto;
    getDestinatarios(): IContacto[];
    getLeido(emailUsuario?: string): boolean;    
    getFavorito(): boolean;

    getRemitente(): IContacto;

    marcarComoLeido(emailUsuario?: string): void;
    marcarComoNoLeido(emailUsuario?: string): void;


}