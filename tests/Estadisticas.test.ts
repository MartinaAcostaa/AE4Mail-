import { describe, it, expect } from 'vitest';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';
import { GestorCorreos } from '../src/GestorCorreos';
import { Estadisticas } from '../src/Estadisticas';

describe("RF-10: Procesamiento funcional y estadísticas", () => {

    it("obtiene la lista de asuntos de una bandeja con map", () => {
    // Ana le envia tres correos a Luis
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    gestor.enviarCorreo(new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]));
    gestor.enviarCorreo(new Correo('Proyecto', 'Te paso el informe', ana, [luis]));
    gestor.enviarCorreo(new Correo('Examen', 'Estudiar el tema 3', ana, [luis]));
    const estadisticas = new Estadisticas();

    // pedimos los asuntos de la Entrada de Luis
    const asuntos = estadisticas.obtenerAsuntos(gestor.getEntrada('luis@mail.com'));

    // comprobamos que es una lista de textos, en el mismo orden que los correos
    expect(asuntos).toEqual(['Reunion', 'Proyecto', 'Examen']);
    });

    it("con una bandeja vacia devuelve una lista vacia", () => {
    const estadisticas = new Estadisticas();

    expect(estadisticas.obtenerAsuntos([])).toEqual([]);
    });

    it("obtiene los correos que cumplen una condicion con filter", () => {
        // Luis recibe correos de la profesora (UCP) y de una amiga
        const gestor = new GestorCorreos();
        const profe = new Contacto('Profe', 'profe@ucp.edu.ar');
        const sol = new Contacto('Sol', 'sol@gmail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const examen = new Correo('Examen final', 'El lunes a las 9', profe, [luis]);
        const salida = new Correo('Salida', 'Vamos al cine?', sol, [luis]);
        const aviso = new Correo('Aviso', 'No hay clases', profe, [luis]);
        gestor.enviarCorreo(examen);
        gestor.enviarCorreo(salida);
        gestor.enviarCorreo(aviso);
        const estadisticas = new Estadisticas();    

        // pedimos los correos cuyo remitente es de la UCP
        const deUCP = estadisticas.filtrarCorreos(
            gestor.getEntrada('luis@mail.com'),
            correo => correo.getRemitente().getEmail().endsWith('@ucp.edu.ar')
        );

        // comprobamos que son los dos de la profesora y la bandeja no cambio 
        expect(deUCP).toEqual([examen, aviso]);
        expect(gestor.getEntrada('luis@mail.com')).toHaveLength(3);
    });
});