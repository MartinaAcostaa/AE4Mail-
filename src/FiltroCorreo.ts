import { ICorreo } from './ICorreo';

export class FiltroCorreo {

    constructor(
        private readonly _nombre: string,
        private readonly _condicion: (correo: ICorreo) => boolean
    ) {}

    public get nombre(): string {
        return this._nombre;
    }

    public cumple(correo: ICorreo): boolean {
        return this._condicion(correo);
    }
}