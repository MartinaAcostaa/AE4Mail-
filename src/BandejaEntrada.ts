import { Bandeja } from './Bandeja';
import { ICorreo } from './ICorreo';

// bandeja de los correos recibidos
export class BandejaEntrada extends Bandeja {
    protected override validarIngreso(_correo: ICorreo): void {
        // no hay reglas especiales para la bandeja de entrada, cualquier correo es aceptado
    }
}