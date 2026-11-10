import { ICorreo } from './ICorreo';

export class FiltroCorreo {

    private readonly _nombre: string;
    private readonly _condicion: (correo: ICorreo) => boolean;  //la condicion va a ser una funcion que reciba 
    //como parametro un objeto correo que cumpla con la interfaz ICorreo y devolvera true o false

    constructor( //a crear un filtro se toma el nombre y la condicion
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