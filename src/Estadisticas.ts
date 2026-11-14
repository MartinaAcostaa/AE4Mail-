import { ICorreo } from './ICorreo';

// obtiene informacion resumida de una coleccion de correos usando programacion funcional (RF-10)
export class Estadisticas {

    public obtenerAsuntos(correos: ICorreo[]): string[] { //transforma cada correo en su asunto
        return correos.map(correo => correo.getAsunto()); //map:misma cantidad de elementos, pero de otro tipo
    }
    
    public filtrarCorreos(correos: ICorreo[], condicion: (correo: ICorreo) => boolean): ICorreo[] { //recibe la condicion como funcion
        return correos.filter(condicion); //filter: se queda solo con los correos para los que la condicion da true
    }
}