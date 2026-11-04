import  { ICorreo } from './ICorreo';

export abstract class Bandeja {
    private readonly _correos: ICorreo[] = []; //almacena los correos de la bandeja

    public agregarCorreo(correo: ICorreo): void { //agrega un correo a la bandeja
        if (this.contieneCorreo(correo)) { //si ya existe el correo en la bandeja lanza error
            throw new Error('El correo ya existe en la bandeja.'); //no lo agrega para no duplicarlo
        }
        this._correos.push(correo);
    }

    public contieneCorreo(correo: ICorreo): boolean { //devuelve true si el correo ya esta en la bandeja
        return this._correos.some(guardado => guardado.id === correo.id); //recorre la lista de correos y devuelve true si encuentra uno con el mismo id
    }

    public getCorreos(): ICorreo[] {
        return [...this._correos]; //devuelve una copia para que no se modifique la bandeja desde afuera
    }
}