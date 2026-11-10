import { describe, it, expect } from 'vitest';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';
import { GestorCorreos } from '../src/GestorCorreos';

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

    it('guarda un borrador incompleto, lo edita desde el gestor y lo envia', () => {
        //un gestor y un borrador vacio
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const borrador = new Correo('', '', ana, []);

    //lo guardamos , editamos y enviamos
    gestor.guardarBorrador(borrador);
    gestor.editarBorrador(borrador, 'Reunion', 'Nos vemos el lunes', [luis]);

    //el borrador recuperado tiene los cambios 
    const recuperado = gestor.getBorradores('ana@mail.com')[0];
    expect(recuperado.getAsunto()).toBe('Reunion');
    expect(recuperado.getDestinatarios()).toEqual([luis]);
    
    gestor.enviarCorreo(borrador);

    //el borrador ya no esta en la bandeja de borradores y si en la de enviados
    expect(gestor.getEnviados('ana@mail.com')).toEqual([borrador]);
    expect(gestor.getBorradores('ana@mail.com')).toEqual([]);
    });

    it('un borrador incompleto no se puede enviar y queda en Borradores', () => {
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const borrador = new Correo('', 'Todavia sin asunto', ana, []);
    gestor.guardarBorrador(borrador);

    expect(() => gestor.enviarCorreo(borrador)).toThrow();
    expect(gestor.getBorradores('ana@mail.com')).toEqual([borrador]);
    expect(gestor.getEnviados('ana@mail.com')).toEqual([]);
    });

    it('solo permite editar correos que estan en Borradores', () => {
    // un correo recibido esta en la Entrada, no en Borradores
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const recibido = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);
    gestor.recibirCorreo(recibido, 'luis@mail.com');

    expect(() => gestor.editarBorrador(recibido, 'Otro asunto', 'Otro texto', [luis])).toThrow();
    expect(recibido.getAsunto()).toBe('Reunion');
    });

});