import { Bandeja } from './Bandeja';
import { ICorreo } from './ICorreo';

// bandeja de los correos enviados, solo acepta correos completos
export class BandejaEnviados extends Bandeja {
    protected override validarIngreso(correo: ICorreo): void {
        // valida que el correo tenga asunto, contenido, remitente y al menos un destinatario
         if (correo.getAsunto().trim().length === 0) { // arroja error si el asunto esta vacio
            throw new Error('Para enviar, el correo debe tener asunto.');
        }

    // Validar contenido
    if (!correo.getContenido() || correo.getContenido().trim().length === 0) {
        throw new Error('Para enviar, el correo debe tener contenido.');
    }

    // Validar remitente
    if (!correo.getRemitente()) {
        throw new Error('Para enviar, el correo debe tener remitente.');
    }

    // Validar destinatarios
    const destinatarios = correo.getDestinatarios();

    if (
        !destinatarios ||
        destinatarios.length === 0 ||
        destinatarios.some(destinatario => destinatario == null)
    ) {
        throw new Error('Para enviar, el correo debe tener al menos un destinatario válido.');
    }
}
}
    