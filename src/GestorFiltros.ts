import { FiltroCorreo } from './FiltroCorreo';

import { ICorreo } from './ICorreo';


export class GestorFiltros {

    private readonly _filtros: FiltroCorreo[] = []; // array donde se almacenan los filtros

    // Registra un filtro

    // Devuelve una copia de los filtros registrados
    public getFiltros(): FiltroCorreo[] {
        return [...this._filtros];
    }

    // agregar filtro nuevo
    public agregarFiltro(filtro: FiltroCorreo): void {
        if (!filtro) { // si no hay nombre de filtro arroja error
            throw new Error('El filtro es obligatorio.');
        }

        if (this._filtros.length >= 5) { //si hay mas de 5 filtros en el array se arroja error
            throw new Error('No se pueden agregar más de cinco filtros.');
        }

        const existe = this._filtros.some( 
            f => f.nombre.toLowerCase() === filtro.nombre.toLowerCase()
        ); // busca al menos un filtro igual poniendolos a ambos en minusculas 
        // para encontrar coincidencias sin importar las mayusculas

        if (existe) { // si ya existe un filtro igual arroja error
            throw new Error('Ya existe un filtro con ese nombre.');
        }

        this._filtros.push(filtro); // agrega el filtro al arreglo de correos
    }

    // Aplica un filtro a una colección de correos
    public aplicarFiltro(nombre: string, correos: ICorreo[]): ICorreo[] {
        const filtro = this._filtros.find(  
            f => f.nombre.toLowerCase() === nombre.trim().toLowerCase()
        );// busca dentro del arreglo de filtros si existe algun filtro con el nombre que se recibio poniendolos a ambos en minusculas

        if (!filtro) { // si no existe arroja error
            throw new Error('No existe ese filtro.');
        }

        return correos.filter(correo => filtro.cumple(correo));
        // se aplica el filtro evaluando cada correo y aplicando el metodo cumple() de la 
        // clase FiltroCorreo para verificar si cumple con la condicion que se definio para el filtro, 
        // si devuelve true se incluye al resultado (el array con los correos que coincidan 
        // con el filtro de busqueda) 
    }


    
}