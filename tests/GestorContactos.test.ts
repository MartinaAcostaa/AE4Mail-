import  { describe, it, expect } from 'vitest';
import { Contacto } from '../src/Contacto';
import { GestorContactos } from '../src/GestorContactos';
import { Correo } from '../src/Correo';

describe('RF-03: Gestión de contactos', () => { //agrupa todos los tests del requerimiento 3
    it('agrega un contacto y lo encuentra por su mail', () => { //describe lo q se espera que pase
    // 1. preparar: creamos una agenda vacía y un contacto
    const agenda = new GestorContactos();
    const ana = new Contacto('Ana', 'ana@ejemplo.com');

    // 2. actuar: agregamos el contacto a la agenda
    agenda.agregarContacto(ana);

    // 3. comprobar: buscamos el contacto por su mail y verificamos que sea el mismo
    // toBe compara que sea el mismo objeto, no solo que tengan los mismos valores
    expect(agenda.buscarContactoPorEmail('ana@ejemplo.com')).toBe(ana);
    });

    it('encuentra el contacto aunque el mail se escriba con mayusculas o espacios', () => {
        // 1. preparar: Contacto guarda el mail en minusculas y sin espacios
    const agenda = new GestorContactos();
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    agenda.agregarContacto(ana);

    // 2 y 3. buscar con mayusculas y espacios y comprobar que encuentra a la misma Ana
    expect(agenda.buscarContactoPorEmail('  ANA@Ejemplo.com ')).toBe(ana);
    });

    it('no permite agregar dos contactos con el mismo mail', () => {
        // 1. prepaarar agenda con Ana ya agregada
        const agenda = new GestorContactos();
        const ana = new Contacto('Ana', 'ana@ejemplo.com');
        agenda.agregarContacto(ana);

        // 2. actuar: intentar agregar otro contacto con el mismo mail pero en mayusuculas
        const otraAna = new Contacto('Ana Gomez', 'ANA@EJEMPLO.COM');

        // 3. comprobar: agregarlo tiene que tirar error 
        // se ecribe () => ... para que expect ejecute la funcion y atrape el error
        expect(() => agenda.agregarContacto(otraAna)).toThrow();

        // y la agenda sigue teniendo solo a la primera Ana
        expect(agenda.buscarContactoPorEmail('ana@ejemplo.com')).toBe(ana);
    });

    it('modifica el nombre y el mail de un contacto existente', () => {
    // 1. preparar: agenda con Ana
    const agenda = new GestorContactos();
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    agenda.agregarContacto(ana);

    // 2. actuar: la buscamos por su mail actual y le cambiamos nombre y mail
    agenda.modificarContacto('ana@ejemplo.com', 'Ana Gomez', 'ana.gomez@ejemplo.com');

    // 3. comprobar: se encuentra con el mail nuevo, es el mismo objeto y tiene el nombre nuevo
    expect(agenda.buscarContactoPorEmail('ana.gomez@ejemplo.com')).toBe(ana);
    expect(ana.getNombre()).toBe('Ana Gomez');
    // con el mail viejo ya no se encuentra
    expect(agenda.buscarContactoPorEmail('ana@ejemplo.com')).toBeUndefined();
    });

    it('no permite modificar un contacto que no existe', () => {
    const agenda = new GestorContactos();

    expect(() => agenda.modificarContacto('nadie@ejemplo.com', 'Nadie', 'nadie2@ejemplo.com')).toThrow();
    });

    it('no permite cambiar el mail por uno que ya tiene otro contacto', () => {
        // 1. preparar: agenda con Ana y Luis
    const agenda = new GestorContactos();
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    const luis = new Contacto('Luis', 'luis@ejemplo.com');
    agenda.agregarContacto(ana);
    agenda.agregarContacto(luis);

     // 2 y 3. querer ponerle a Ana el mail de Luis tiene que tirar error
    expect(() => agenda.modificarContacto('ana@ejemplo.com', 'Ana Gomez', 'LUIS@ejemplo.com')).toThrow();

    // Ana queda sin cambios
    expect(ana.getEmail()).toBe('ana@ejemplo.com');
    expect(ana.getNombre()).toBe('Ana');
    });

    it('permite cambiar solo el nombre dejando el mismo mail', () => {
    const agenda = new GestorContactos();
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    agenda.agregarContacto(ana);

    // el mail nuevo es el mismo que ya tiene Ana: no es un duplicado
    agenda.modificarContacto('ana@ejemplo.com', 'Ana Gomez', 'ana@ejemplo.com');

    expect(ana.getNombre()).toBe('Ana Gomez');
    expect(ana.getEmail()).toBe('ana@ejemplo.com');
    });

    it('elimina un contacto de la agenda', () => {
    // 1. preparar: agenda con Ana y Luis
    const agenda = new GestorContactos();
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    const luis = new Contacto('Luis', 'luis@ejemplo.com');
    agenda.agregarContacto(ana);
    agenda.agregarContacto(luis);

    // 2. actuar: eliminamos a Ana
    agenda.eliminarContacto('ana@ejemplo.com');

    // 3. comprobar: Ana ya no esta y Luis sigue
    expect(agenda.buscarContactoPorEmail('ana@ejemplo.com')).toBeUndefined();
    expect(agenda.buscarContactoPorEmail('luis@ejemplo.com')).toBe(luis);
    });

    it('no permite eliminar un contacto que no existe', () => {
    const agenda = new GestorContactos();

    expect(() => agenda.eliminarContacto('nadie@ejemplo.com')).toThrow();
    });

    it('eliminar un contacto no borra los correos que lo tienen como remitente o destinatario', () => {
    // 1. preparar: agenda con Ana y Luis, y un correo de Ana para Luis
    const agenda = new GestorContactos();
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    const luis = new Contacto('Luis', 'luis@ejemplo.com');
    agenda.agregarContacto(ana);
    agenda.agregarContacto(luis);
    const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);

    // 2. actuar: eliminamos a los dos de la agenda
    agenda.eliminarContacto('ana@ejemplo.com');
    agenda.eliminarContacto('luis@ejemplo.com');

    // 3. comprobar: ya no estan en la agenda...
    expect(agenda.buscarContactoPorEmail('ana@ejemplo.com')).toBeUndefined();
    //pero el correo sigue teniendo a Ana como remitente y a Luis como destinatario
    expect(correo.getRemitente()).toBe(ana);
    expect(correo.getRemitente().getEmail()).toBe('ana@ejemplo.com');
    expect(correo.getDestinatarios()).toEqual([luis]);
    });
});
