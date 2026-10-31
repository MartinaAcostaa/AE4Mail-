import { ICorreo } from './ICorreo';

// Administra los correos enviados
export class GestorCorreos {

    private readonly _enviados: ICorreo[] = [];

    public enviarCorreo(correo: ICorreo): void {

        // Verificamos que exista el correo
        if (!correo) {
            throw new Error('El correo es obligatorio.');
        }
    }

    public getEnviados(): ICorreo[] {
        return [...this._enviados];
    }

}