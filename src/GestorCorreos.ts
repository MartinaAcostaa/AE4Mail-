import { ICorreo } from './ICorreo';

// Administra los correos enviados
export class GestorCorreos {

    private readonly _enviados: ICorreo[] = [];

    public getEnviados(): ICorreo[] {
        return [...this._enviados];
    }

}