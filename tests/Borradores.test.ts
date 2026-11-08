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

    it("Permite editar el asunto, contenido y destinatarios de un correo" , () => {
        // borrador vacio 
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const borrador = new Correo('', '', ana, []);

        //lo vamos completando 
    borrador.cambiarAsunto('  Reunion ');
    borrador.cambiarContenido('Nos vemos el lunes');
    borrador.cambiarDestinatarios([luis]);

    // comprobamos que los cambios se guardaron correctamente
     expect(borrador.getAsunto()).toBe('Reunion');
    expect(borrador.getContenido()).toBe('Nos vemos el lunes');
    expect(borrador.getDestinatarios()).toEqual([luis]);

    // los destinatarios tampoco pueden tener elementos nulos al editarlos
    expect(() => borrador.cambiarDestinatarios([null as unknown as Contacto])).toThrow();
    expect(borrador.getDestinatarios()).toEqual([luis]);
    });

});