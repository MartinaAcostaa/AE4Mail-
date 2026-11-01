import { ICorreo } from './ICorreo';

// Administra los correos enviados
export class GestorCorreos {

    private readonly _enviados: ICorreo[] = [];

    public enviarCorreo(correo: ICorreo): void {

        // Verificamos que exista el correo
        if (!correo) {
            throw new Error('El correo es obligatorio.');
        }

        // Verificamos que tenga remitente
        if (!correo.getRemitente()) {
            throw new Error('El remitente es obligatorio.');
        }

        // Verificamos que tenga asunto
        if (!correo.getAsunto() || correo.getAsunto().trim().length === 0) {
            throw new Error('El asunto es obligatorio.');
        }

        
        // Verificamos que tenga al menos un destinatario valido
        const destinatarios = correo.getDestinatarios();
        if (
            !Array.isArray(destinatarios) || //comprueba si la variable destinatarios es un arreglo
            destinatarios.length === 0 || // /comprueba si la lista de destinatarios no tiene ningun elemento, si la lista esta vacia no tiene  ningun elemento
            destinatarios.some(destinatario => destinatario == null) //recorre los elementos del arreglo  comprueba si al menos uno es null o undefined
            //si al menos uno cumple la conducion devuelve true
        ) {
            throw new Error('Debe existir al menos un destinatario válido.'); //si la condicion se cumple (devuelve true) se genera el error
        }

        // Verificamos que el correo no haya sido enviado anteriormente
        const yaEnviado = this._enviados.some(enviado => enviado.id === correo.id);

        if (yaEnviado) { // Si ya fue enviado lanza error
            throw new Error('Este correo ya fue enviado.');}

         // Registramos el correo en la Bandeja de Enviados
        this._enviados.push(correo);


    }

    public getEnviados(): ICorreo[] {
        return [...this._enviados];
    }

}