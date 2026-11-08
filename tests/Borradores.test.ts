import { describe, it, expect } from 'vitest';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';

describe('RF-07: Gestión de borradores', () => {
    it("Permite crear un correo incompleto , solo con remitente", () => {
        const ana = new Contacto('Ana', 'ana@example.com');

        //creamos un correo sin asunto, sin contenido y sin destinatarios
        const borrador = new Correo('', '', ana, []);

        // comprobamos que el correo se crea igual con los datos vacios 
        expect(borrador.getRemitente()).toBe(ana);
    expect(borrador.getAsunto()).toBe('');
    expect(borrador.getContenido()).toBe('');
    expect(borrador.getDestinatarios()).toEqual([]);
    });

});