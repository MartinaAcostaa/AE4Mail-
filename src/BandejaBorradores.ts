import { Bandeja } from './Bandeja';
import { ICorreo } from './ICorreo';

// bandeja de los correos que todavia no se enviaron
export class BandejaBorradores extends Bandeja {
    protected override validarIngreso(_correo: ICorreo): void {
        // no hay reglas especiales para la bandeja de borradores, cualquier correo es aceptado
    }
}