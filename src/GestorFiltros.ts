import { FiltroCorreo } from './FiltroCorreo';

export class GestorFiltros {

    private readonly _filtros: FiltroCorreo[] = []; // array donde se almacenan los filtros

    // Registra un filtro

    // Devuelve una copia de los filtros registrados
    public getFiltros(): FiltroCorreo[] {
        return [...this._filtros];
    }

    public agregarFiltro(filtro: FiltroCorreo): void {
        if (!filtro) { // si no hay nombre de filtro arroja error
            throw new Error('El filtro es obligatorio.');
        }

        if (this._filtros.length >= 5) { //si hay mas de 5 filtros en el array se arroja error
            throw new Error('No se pueden agregar más de cinco filtros.');
        }

        const existe = this._filtros.some( 
            f => f.nombre.toLowerCase() === filtro.nombre.toLowerCase()
        ); // busca un filtro igual poniendolos a ambos en minusculas 
        // para encontrar coincidencias sin importar las mayusculas

        if (existe) { // si ya existe un filtro igual arroja error
            throw new Error('Ya existe un filtro con ese nombre.');
        }

        this._filtros.push(filtro);
    }

    
}