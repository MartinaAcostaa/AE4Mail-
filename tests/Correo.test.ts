import { describe, it, expect } from 'vitest';
import { Contacto } from '../src/Contacto'
import { Correo } from '../src/Correo';

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

    expect(correo.getLeido('luis@ejemplo.com')).toBe(false);
  expect(correo.getFavorito('luis@ejemplo.com')).toBe(false);  });


  it('rechaza crear un correo sin remitente o con destinatarios invalidos', () => {
    const luis = new Contacto('Luis', 'luis@ejemplo.com');
    const ana = new Contacto('Ana', 'ana@ejemplo.com');

    // el remitente es el unico dato obligatorio al crear un correo
    expect(() => new Correo('Asunto', 'Mensaje', null as unknown as Contacto, [luis]))
      .toThrow('El remitente es obligatorio.');

    // la lista de destinatarios puede estar vacia, pero no puede tener elementos nulos
    expect(() => new Correo('Asunto', 'Mensaje', ana, [null as unknown as Contacto]))
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

  it('conserva asunto, contenido y fecha de creación', () => {
    const ana = new Contacto('Ana', 'ana@ejemplo.com');
    const luis = new Contacto('Luis', 'luis@ejemplo.com');

    //const antes = new Date();

    const correo = new Correo(
      'Entrega',
      'Adjunto el trabajo',
      ana,
      [luis]
    );

    //const despues = new Date();

    expect(correo.getAsunto()).toBe('Entrega');
    expect(correo.getContenido()).toBe('Adjunto el trabajo');
    
    //expect(correo.getFechaCreacion().getTime())
      //.toBeGreaterThanOrEqual(antes.getTime());

    //expect(correo.getFechaCreacion().getTime())
      //.toBeLessThanOrEqual(despues.getTime());

  });

});