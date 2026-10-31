import { describe, it, expect } from 'vitest';

import { GestorCorreos } from '../src/GestorCorreos';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';
import { ICorreo } from '../src/ICorreo';
describe('GestorCorreos', () => {

    it('RF2: Debe enviar un correo a un destinatario', () => {
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    const correo = new Correo('Reunion', 'Nos reunimos mañana.', ana, [luis]);

    gestor.enviarCorreo(correo);

    expect(gestor.getEnviados()).toHaveLength(1);
    expect(gestor.getEnviados()[0]).toBe(correo);
});

  it('RF 2: Debe enviar un correo a varios destinatarios', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const maria = new Contacto('Maria', 'maria@mail.com');

        const correo = new Correo('Trabajo grupal', 'Les envío el trabajo.', ana, [luis, maria]);

        gestor.enviarCorreo(correo);

        expect(gestor.getEnviados()).toHaveLength(1);
        expect(gestor.getEnviados()[0].getDestinatarios()).toHaveLength(2);
    });

     it('RF 2: o debe permitir enviar un correo inexistente', () => {
        const gestor = new GestorCorreos();

        expect(() => gestor.enviarCorreo(null as unknown as ICorreo))
        .toThrow('El correo es obligatorio.');

        expect(gestor.getEnviados()).toHaveLength(0);
    });

    
    it('RF 2: Debe almacenar el correo enviado en la Bandeja de Enviados', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');

        const correo = new Correo('Aviso', 'Se informa una novedad.', ana, [luis]);

        gestor.enviarCorreo(correo);

        expect(gestor.getEnviados()).toContain(correo);
    });


});