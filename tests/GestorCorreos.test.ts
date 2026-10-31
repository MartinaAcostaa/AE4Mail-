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

    it('RF 2: No debe permitir enviar un correo inexistente', () => {

    const gestor = new GestorCorreos(); // Creamos un gestor vacio

    // Intentamos enviar null en lugar de un objeto Correo
    // as unknown as ICorreo permite pasar ese valor
    // aunque el método espera recibir un ICorreo
    expect(() => gestor.enviarCorreo(null as unknown as ICorreo))
        // Comprobamos que se genere el error correspondiente.
        .toThrow('El correo es obligatorio.');

    // Verificamos que no se haya almacenado ningún correo
    expect(gestor.getEnviados()).toHaveLength(0);
});

    it('RF 2: No debe permitir crear un correo sin asunto', () => {
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    expect(() => new Correo('   ', 'Contenido', ana, [luis]))
        .toThrow('El asunto es obligatorio.');
    });

    it('RF 2: No debe permitir crear un correo sin destinatarios', () => {
    const ana = new Contacto('Ana', 'ana@mail.com');

    expect(() => new Correo('Reunion', 'Contenido', ana, []))
    .toThrow('Debe existir al menos un destinatario válido.');
    });

    it('RF 2: No debe permitir enviar un correo con destinatarios invalidos', () => {

    const gestor = new GestorCorreos(); // Creamos el gestor de correos

    // Creamos dos contactos
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    const correo = {  // Creamos un objeto que simula ser un correo
        //No usamos la clase Correo porque su constructor ya impediria crear un correo con destinatarios invalido
        id: 103,

        // Devuelve a Ana como remitente
        getRemitente: () => ana,

        // Devuelve el asunto del correo
        getAsunto: () => 'Reunion',

        // Devuelve una lista con un destinatario valido
        // (Luis) y uno inválido (null)
        getDestinatarios: () => [luis, null]

    } as unknown as ICorreo;

    // Intentamos enviar el correo y comprobamos que se genere el error por tener destinatarios invalidos
    expect(() => gestor.enviarCorreo(correo))
        .toThrow('Debe existir al menos un destinatario válido.');

    // Comprobamos que el correo no se haya almacenado
    expect(gestor.getEnviados()).toHaveLength(0);
});

    it('RF 2: No debe permitir enviar un correo sin remitente', () => {

    const gestor = new GestorCorreos(); //creamos el gestor

    const luis = new Contacto('Luis', 'luis@mail.com'); //creamos un destinatario valido

    const correo = {     // Creamos un objeto que simula ser un correo
        id: 100,

        // El remitente devuelve null, es decir, el correo no tiene remitente
        getRemitente: () => null,

        // El asunto es valido.
        getAsunto: () => 'Reunion',

        // Tiene un destinatario valido.
        getDestinatarios: () => [luis]

    } as unknown as ICorreo;

    // Intentamos enviarlo y comprobamos que se genere el error porque falta el remitente
    expect(() => gestor.enviarCorreo(correo))
        .toThrow('El remitente es obligatorio.');

    // Comprobamos que no se haya almacenado.
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

    
    it('RF 2; Debe permitir enviar diferentes correos sin perder los anteriores', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const maria = new Contacto('Maria', 'maria@mail.com');

        const correo1 = new Correo('Primer correo', 'Contenido 1', ana, [luis]);
        const correo2 = new Correo('Segundo correo', 'Contenido 2', ana, [maria]);

        gestor.enviarCorreo(correo1);
        gestor.enviarCorreo(correo2);

        expect(gestor.getEnviados()).toHaveLength(2);
        expect(gestor.getEnviados()).toContain(correo1);
        expect(gestor.getEnviados()).toContain(correo2);
    });

    it('RF2: Debe devolver una copia de la Bandeja de Enviados', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');

        const correo = new Correo('Reunion', 'Nos reunimos mañana.', ana, [luis]);

        gestor.enviarCorreo(correo);

        const enviados = gestor.getEnviados();
        enviados.pop();

        expect(gestor.getEnviados()).toHaveLength(1);
    });





});