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

});