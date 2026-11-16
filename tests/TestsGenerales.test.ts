import { describe, it, expect } from 'vitest';

import { Contacto } from '../src/Contacto';
import { Correo } from '../src/Correo';

describe('Pruebas generales de integración del Gestor de Correos', () => {
    // RF-01: Creación de correos electrónicos
    it('RF-01: Permite crear correos y conservar correctamente sus datos', () => {

        //se crean 3 contactos
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const maria = new Contacto('Maria', 'maria@mail.com');

        // Se crea un nuevo correo de parte de ana con destinatarios luis y maria
        const correo1 = new Correo(
            'Proyecto AE4',
            'Entrega del trabajo',
            ana,
            [luis, maria]
        );

        // luis envia un correo a ana
        const correo2 = new Correo(
            'Consulta',
            'Necesito información',
            luis,
            [ana]
        );

        expect(correo1.id).not.toBe(correo2.id); // verificamos que cada correo tenga un ID diferente
        expect(correo1.getAsunto()).toBe('Proyecto AE4'); // Comprobamos que el asunto se haya almacenado correctamente
        expect(correo1.getContenido()).toBe('Entrega del trabajo'); // Comprobamos que el contenido sea el esperado
        expect(correo1.getRemitente()).toBe(ana); // Verificamos que el remitente sea Ana
        expect(correo1.getDestinatarios()).toEqual([luis, maria]); // Comprobamos que los destinatarios sean Luis y María

        expect(correo1.getLeido('luis@mail.com')).toBe(false);  // Verificamos que inicialmente el correo no esté leído por Luis
        expect(correo1.getFavorito('luis@mail.com')).toBe(false); // Verificamos que inicialmente tampoco sea favorito para Luis
    });


});