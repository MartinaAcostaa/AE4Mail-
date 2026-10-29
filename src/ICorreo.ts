import { IContacto } from "./IContacto";

export interface ICorreo {
    readonly id: number;

    getAsunto(): string;
    getContenido(): string;
    getRemitente(): IContacto;
    getDestinatarios(): IContacto[];
    getLeido(): boolean;


}