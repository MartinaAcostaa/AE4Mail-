import { describe, it, expect } from 'vitest';

import { GestorCorreos } from '../src/GestorCorreos';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';

describe('GestorCorreos', () => {

    it('debe enviar un correo a un destinatario', () => {
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    const correo = new Correo('Reunion', 'Nos reunimos mañana.', ana, [luis]);

    gestor.enviarCorreo(correo);

    expect(gestor.getEnviados()).toHaveLength(1);
    expect(gestor.getEnviados()[0]).toBe(correo);
});


});