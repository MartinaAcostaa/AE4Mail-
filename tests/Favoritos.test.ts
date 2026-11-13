import { describe, it, expect } from 'vitest';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';
import { GestorCorreos } from '../src/GestorCorreos';

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



   
});