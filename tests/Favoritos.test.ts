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

    

   
});