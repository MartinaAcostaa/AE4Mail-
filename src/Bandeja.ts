import  { ICorreo } from './ICorreo';

export abstract class Bandeja {
    private readonly _correos: ICorreo[] = []; //almacena los correos de la bandeja

    public agregarCorreo(correo: ICorreo): void { //agrega un correo a la bandeja
        if (this.contieneCorreo(correo)) { //si ya existe el correo en la bandeja lanza error
            throw new Error('El correo ya existe en la bandeja.'); //no lo agrega para no duplicarlo
        }
        this.validarIngreso(correo); //cada bandeja hija revisa sus propias reglas
        this._correos.push(correo);
    }

    // metodo abstracto, Bandeja lo declara pero no lo escribe
    // cada clase hija esta obligada a escribirlo con sus propias reglas (polimorfismo)
    protected abstract validarIngreso(correo: ICorreo): void;

    public quitarCorreo(correo: ICorreo): void { //saca un correo de la bandeja
        const posicion = this._correos.findIndex(guardado => guardado.id === correo.id); //busca en que posicion esta
        if (posicion === -1) { //findIndex devuelve -1 si no lo encuentra
            throw new Error('El correo no está en esta bandeja.');
        }
        this._correos.splice(posicion, 1); //saca el correo del arreglo: desde esa posicion, 1 elemento
    }

    public contieneCorreo(correo: ICorreo): boolean { //devuelve true si el correo ya esta en la bandeja
        return this._correos.some(guardado => guardado.id === correo.id); //recorre la lista de correos y devuelve true si encuentra uno con el mismo id
    }

    public getCorreos(): ICorreo[] {
        return [...this._correos]; //devuelve una copia para que no se modifique la bandeja desde afuera
    }

    public getNoLeidos(): ICorreo[] { //devuelve los correos de esta bandeja que todavia no se leyeron
        return this._correos.filter(correo => !correo.getLeido()); //filter con un predicado: se queda con los no leidos
    }
}