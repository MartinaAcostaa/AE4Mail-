import { Bandeja } from './Bandeja';
import { ICorreo } from './ICorreo';

// bandeja de los correos enviados, solo acepta correos completos
export class BandejaEnviados extends Bandeja {
    protected override validarIngreso(correo: ICorreo): void {
        // valida que el correo tenga asunto, contenido, remitente y al menos un destinatario
         if (correo.getAsunto().trim().length === 0) { // arroja error si el asunto esta vacio
            throw new Error('Para enviar, el correo debe tener asunto.');
        }

        if (correo.getDestinatarios().length === 0) { //tiene que tener al menos un destinatario
            throw new Error('Para enviar, el correo debe tener al menos un destinatario.');
        }
    }
}
    