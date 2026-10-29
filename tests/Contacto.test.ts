import { describe, it, expect } from 'vitest';
import { Contacto } from '../src/Contacto'
import { Correo } from '../src/correo';

describe('RF-01: Creación de correos electrónicos', () => {
  it('crea correos con identificadores únicos', () => {
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    const luis = new Contacto('Luis', 'luis@ejemplo.com');

    const correo1 = new Correo('Primer asunto','Primer mensaje', ana, [luis] );

    const correo2 = new Correo('Segundo asunto', 'Segundo mensaje', luis, [ana] );

    expect(correo1.id).not.toBe(correo2.id);
    expect(correo1.getRemitente()).toBe(ana);
    expect(correo2.getRemitente()).toBe(luis);
    expect(correo1.getDestinatarios()).toEqual([luis]);
    expect(correo2.getDestinatarios()).toEqual([ana]);
  });

  it('inicia como no leído y no favorito', () => {
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    const luis = new Contacto('Luis', 'luis@ejemplo.com');

    const correo = new Correo(
      'Consulta',
      'Hola',
      ana,
      [luis]
    );

    expect(correo.getLeido()).toBe(false);
    expect(correo.getFavorito()).toBe(false);
  });


  it('rechaza datos obligatorios vacíos', () => {
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    const luis = new Contacto('Luis', 'luis@ejemplo.com');

    expect(() => new Correo('', 'Mensaje', ana, [luis]))
      .toThrow();

    expect(() => new Correo('Asunto', '   ', ana, [luis]))
      .toThrow();

    expect(() => new Correo('Asunto', 'Mensaje', ana, []))
      .toThrow();

  });

   it('no expone la colección interna de destinatarios', () => {
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    const luis = new Contacto('Luis', 'luis@ejemplo.com');
    const Marta = new Contacto('Marta', 'marta@ejemplo.com');

    const destinatarios = [luis];

    const correo = new Correo(
      'Reunión',
      'Nos reunimos mañana',
      ana,
      destinatarios
    );

    // Modificar el arreglo original no cambia el correo
    destinatarios.push(Marta);
    expect(correo.getDestinatarios()).toEqual([luis]);

    // Modificar el arreglo obtenido tampoco cambia el correo
    const copia = correo.getDestinatarios();
    copia.push(Marta);

    expect(correo.getDestinatarios()).toEqual([luis]);
  });




});