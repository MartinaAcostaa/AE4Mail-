import  { ICorreo } from './ICorreo';

export abstract class Bandeja {
    private readonly _correos: ICorreo[] = []; //almacena los correos de la bandeja

    public agregarCorreo(correo: ICorreo): void { //agrega un correo a la bandeja
        this._correos.push(correo);
    }

    public getCorreos(): ICorreo[] {
        return [...this._correos]; //devuelve una copia para que no se modifique la bandeja desde afuera
    }
}