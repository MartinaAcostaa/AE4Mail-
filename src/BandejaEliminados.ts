import { Bandeja } from './Bandeja';
import { ICorreo } from './ICorreo';

// bandeja de los correos eliminados , el correo no se borra, se mueve aca
export class BandejaEliminados extends Bandeja {
        private readonly _origenes = new Map<number, Bandeja>(); //guarda de que bandeja vino cada correo 

    protected override validarIngreso(_correo: ICorreo): void {
        // cualquier correo puede eliminarse, no hay reglas extra
    }

    public eliminarDesde(correo: ICorreo, origen: Bandeja): void { //recibe el correo y la bandeja donde esta
        origen.quitarCorreo(correo); //lo saca de su bandeja (si no esta ahi, quitarCorreo tira error)
        this.agregarCorreo(correo); //lo agrega a Eliminados
                this._origenes.set(correo.id, origen); //anota de donde vino para poder restaurarlo
    }

    public restaurarCorreo(correo: ICorreo): void { //devuelve el correo a la bandeja de donde vino
        const origen = this._origenes.get(correo.id); //busca de que bandeja vino
        if (!origen) { //si no hay origen anotado, el correo no esta en Eliminados
            throw new Error('El correo no está en Eliminados.');
        }
        this.quitarCorreo(correo); //lo saca de Eliminados
        origen.agregarCorreo(correo); //lo vuelve a poner en su bandeja de origen
        this._origenes.delete(correo.id); //borra la anotacion porque ya no esta eliminado
    }
}