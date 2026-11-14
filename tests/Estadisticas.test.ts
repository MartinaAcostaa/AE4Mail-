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

    it("cuenta los correos no leidos de un usuario con reduce", () => {
    // Ana les envia tres correos a Luis y a Maria
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const maria = new Contacto('Maria', 'maria@mail.com');
    const correo1 = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis, maria]);
    const correo2 = new Correo('Proyecto', 'Te paso el informe', ana, [luis, maria]);
    const correo3 = new Correo('Examen', 'Estudiar el tema 3', ana, [luis, maria]);
    gestor.enviarCorreo(correo1);
    gestor.enviarCorreo(correo2);
    gestor.enviarCorreo(correo3);
    const estadisticas = new Estadisticas();

    // Luis lee el primero (Maria no lee ninguno)
    correo1.marcarComoLeido('luis@mail.com');

    // Luis tiene 2 sin leer y Maria tiene los 3
    expect(estadisticas.contarNoLeidos(gestor.getEntrada('luis@mail.com'), 'luis@mail.com')).toBe(2);
    expect(estadisticas.contarNoLeidos(gestor.getEntrada('maria@mail.com'), 'maria@mail.com')).toBe(3);
    // con una bandeja vacia el total es 0
    expect(estadisticas.contarNoLeidos([], 'luis@mail.com')).toBe(0);
    });


});