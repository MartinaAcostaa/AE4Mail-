import { describe, it, expect } from 'vitest';
import { Contacto } from '../src/Contacto';

describe('RF-03: Validación de contactos', () => {  // test de la clase contacto 
    it('guarda el nombre y el mail sin espacios y el mail en minusculas', () => {
        // 1. preparar y actuar: creamos un contacto con espacios y mayusculas
    const ana = new Contacto('  Ana Lopez  ', '  ANA@Ejemplo.com ');

    // 2. comprobar: el constructor normaliza los datos 
    expect(ana.getNombre()).toBe('Ana Lopez');
    expect(ana.getEmail()).toBe('ana@ejemplo.com');

    });

    it('asigna un id distinto a cada contacto', () => {
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    const luis = new Contacto('Luis', 'luis@ejemplo.com');

    expect(ana.id).not.toBe(luis.id); //cada contacto tiene su propio id
    });

    it('rechaza un nombre vacio o con solo espacios', () => {
    // se usa () => para que expect ejecute el constructor y atrape el error
    expect(() => new Contacto('', 'ana@ejemplo.com')).toThrow();
    expect(() => new Contacto('   ', 'ana@ejemplo.com')).toThrow();
    });

    it('rechaza un mail con formato invalido', () => {
    expect(() => new Contacto('Ana', 'anaejemplo.com')).toThrow();   //sin @
    expect(() => new Contacto('Ana', 'ana@')).toThrow();             //sin dominio
    expect(() => new Contacto('Ana', 'ana@ejemplo')).toThrow();      //sin punto en el dominio
    expect(() => new Contacto('Ana', 'ana lopez@ejemplo.com')).toThrow(); //con espacio en el medio
    expect(() => new Contacto('Ana', '')).toThrow();                 //vacio
    });
});