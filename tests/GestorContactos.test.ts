import  { describe, it, expect } from 'vitest';
import { Contacto } from '../src/Contacto';
import { GestorContactos } from '../src/GestorContactos';

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
});
