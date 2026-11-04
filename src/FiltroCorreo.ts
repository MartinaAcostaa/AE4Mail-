import { ICorreo } from './ICorreo';

export class FiltroCorreo {

    private readonly _nombre: string;
    private readonly _condicion: (correo: ICorreo) => boolean;

    constructor(
        nombre: string,
        condicion: (correo: ICorreo) => boolean
    ) {
        if (!nombre || nombre.trim().length === 0) { // arroja error si no hay nombre de filtro
            throw new Error('El nombre del filtro es obligatorio.');
        }

        if (typeof condicion !== 'function') { // arroja error si la coleccion no es una funcion
            throw new Error('La condición debe ser una función.');
        }

        this._nombre = nombre.trim(); //elimina los espacios al final y al inicio del nombre
        this._condicion = condicion;
    }

    public get nombre(): string {
        return this._nombre;
    }

    // Evalúa si un correo cumple la condición
    public cumple(correo: ICorreo): boolean {
        return this._condicion(correo);
    }
}