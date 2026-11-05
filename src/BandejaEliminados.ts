import { Bandeja } from './Bandeja';
import { ICorreo } from './ICorreo';

// bandeja de los correos eliminados , el correo no se borra, se mueve aca
export class BandejaEliminados extends Bandeja {

    protected override validarIngreso(_correo: ICorreo): void {
        // cualquier correo puede eliminarse, no hay reglas extra
    }

    public eliminarDesde(correo: ICorreo, origen: Bandeja): void { //recibe el correo y la bandeja donde esta
        origen.quitarCorreo(correo); //lo saca de su bandeja (si no esta ahi, quitarCorreo tira error)
        this.agregarCorreo(correo); //lo agrega a Eliminados
    }
}