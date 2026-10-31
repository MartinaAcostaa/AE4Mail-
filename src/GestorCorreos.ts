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


    }

    public getEnviados(): ICorreo[] {
        return [...this._enviados];
    }

}