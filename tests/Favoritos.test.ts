import { describe, it, expect } from 'vitest';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';
import { GestorCorreos } from '../src/GestorCorreos';

import { GestorFiltros } from '../src/GestorFiltros';
import { FiltroCorreo } from '../src/FiltroCorreo';

describe('RF-09: Gestión de correos favoritos', () => {

    it('Permite marcar y desmarcar un correo como favorito', () => {
        const gestor = new GestorCorreos();

        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');

        const correo = new Correo(
            'Reunión',
            'Nos reunimos mañana',
            ana,
            [luis]
        );

        gestor.enviarCorreo(correo);

        gestor.marcarComoFavorito(correo, 'luis@mail.com');

        expect(correo.getFavorito('luis@mail.com')).toBe(true);

        gestor.quitarComoFavorito(correo, 'luis@mail.com');

        expect(correo.getFavorito('luis@mail.com')).toBe(false);
    });
    

    it('Permite consultar todos los correos favoritos', () => {
        const gestor = new GestorCorreos();

        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');

        const correo1 = new Correo('Reunión', 'Contenido 1', ana, [luis]);
        const correo2 = new Correo('Entrega', 'Contenido 2', ana, [luis]);

        gestor.enviarCorreo(correo1);
        gestor.enviarCorreo(correo2);

        gestor.marcarComoFavorito(correo1, 'luis@mail.com');
        gestor.marcarComoFavorito(correo2, 'luis@mail.com');

        expect(gestor.getFavoritos('luis@mail.com')).toEqual([
            correo1,
            correo2
        ]);
    });

     it('Los favoritos son independientes para cada usuario', () => {
        const gestor = new GestorCorreos();

        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const maria = new Contacto('Maria', 'maria@mail.com');

        const correo = new Correo(
            'Reunión',
            'Nos reunimos mañana',
            ana,
            [luis, maria]
        );

        gestor.enviarCorreo(correo);

        gestor.marcarComoFavorito(correo, 'luis@mail.com');

        expect(gestor.getFavoritos('luis@mail.com')).toEqual([correo]);
        expect(gestor.getFavoritos('maria@mail.com')).toEqual([]);
    });

    it('Marcar como favorito no mueve el correo de su bandeja', () => {
        const gestor = new GestorCorreos();

        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');

        const correo = new Correo('Reunión', 'Contenido', ana, [luis]);

        gestor.enviarCorreo(correo);
        gestor.marcarComoFavorito(correo, 'luis@mail.com');

        expect(gestor.getEntrada('luis@mail.com')).toContain(correo);
        expect(gestor.getFavoritos('luis@mail.com')).toContain(correo);
    });

      it('No muestra correos eliminados en la vista de favoritos', () => {
        const gestor = new GestorCorreos();

        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');

        const correo = new Correo('Reunión', 'Contenido', ana, [luis]);

        gestor.enviarCorreo(correo);
        gestor.marcarComoFavorito(correo, 'luis@mail.com');

        gestor.eliminarCorreo(correo, 'luis@mail.com');

        expect(gestor.getEliminados('luis@mail.com')).toContain(correo);
        expect(gestor.getFavoritos('luis@mail.com')).not.toContain(correo);
    });

    it('No muestra duplicados si el correo aparece en más de una bandeja', () => {
    const gestor = new GestorCorreos();

    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    const correo = new Correo('Reunión', 'Contenido', ana, [luis]);

    gestor.enviarCorreo(correo);

    // El correo está en Enviados de Ana y en Entrada de Luis.
    // Para comprobar duplicados dentro de la vista de un usuario,
    // lo incorporamos también a otra bandeja activa de ese usuario.
    gestor.recibirCorreo(correo, 'ana@mail.com');

    gestor.marcarComoFavorito(correo, 'ana@mail.com');

    expect(gestor.getFavoritos('ana@mail.com')).toEqual([correo]);
});


it('Permite combinar filtros para buscar dentro de los favoritos', () => {
    const gestor = new GestorCorreos();
    const gestorFiltros = new GestorFiltros();

    const ana = new Contacto('Ana', 'ana@ucp.edu.ar');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const juan = new Contacto('Juan', 'juan@gmail.com');

    const correo1 = new Correo('Proyecto AE4', 'Contenido', ana, [luis]);
    const correo2 = new Correo('Examen Física', 'Contenido', ana, [luis]);
    const correo3 = new Correo('Proyecto final', 'Contenido', juan, [luis]);

    gestor.enviarCorreo(correo1);
    gestor.enviarCorreo(correo2);
    gestor.enviarCorreo(correo3);

    // Marcamos los tres correos como favoritos de Luis.
    gestor.marcarComoFavorito(correo1, 'luis@mail.com');
    gestor.marcarComoFavorito(correo2, 'luis@mail.com');
    gestor.marcarComoFavorito(correo3, 'luis@mail.com');

    // Creamos dos filtros independientes.
    const filtroUCP = new FiltroCorreo(
        'Remitentes UCP',
        correo => correo.getRemitente().getEmail().endsWith('@ucp.edu.ar')
    );

    const filtroProyecto = new FiltroCorreo(
        'Asunto Proyecto',
        correo => correo.getAsunto().toLowerCase().includes('proyecto')
    );

    gestorFiltros.agregarFiltro(filtroUCP);
    gestorFiltros.agregarFiltro(filtroProyecto);

    // Obtenemos primero la colección de favoritos.
    const favoritos = gestor.getFavoritos('luis@mail.com');

    // Aplicamos ambos filtros sobre esa colección.
    const resultadoUCP = gestorFiltros.aplicarFiltro(
        'Remitentes UCP',
        favoritos
    );

    const resultadoFinal = gestorFiltros.aplicarFiltro(
        'Asunto Proyecto',
        resultadoUCP
    );

    // Solo el primer correo cumple ambas condiciones.
    expect(resultadoFinal).toEqual([correo1]);
});




   
});