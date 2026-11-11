import { describe, it, expect } from 'vitest';

import { GestorCorreos } from '../src/GestorCorreos';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';
import { ICorreo } from '../src/ICorreo';

import { Buscador } from '../src/Buscador';


describe('GestorCorreos', () => {

    it('RF2: Debe enviar un correo a un destinatario', () => {
    const gestor = new GestorCorreos(); // Creamos un gestor vacio 

    // Creamos dos contactos, Ana y Luis
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    // Creamos un correo con asunto, contenido, remitente y destinatario
    const correo = new Correo('Reunion', 'Nos reunimos mañana.', ana, [luis]);

    gestor.enviarCorreo(correo); // Envia el correo y lo almacena en la bandeja de enviados

    expect(gestor.getEnviados('ana@mail.com')).toHaveLength(1);  // Comprueba que haya exactamente un correo almacenado 
    expect(gestor.getEnviados('ana@mail.com')[0]).toBe(correo);  // Comprueba que el elemento almacenado sea exactamente el mismo objeto que enviamos
});

  it('RF 2: Debe enviar un correo a varios destinatarios', () => {
        const gestor = new GestorCorreos(); // Creamos un gestor

        // Creamos tres contactos
        const ana = new Contacto('Ana', 'ana@mail.com'); 
        const luis = new Contacto('Luis', 'luis@mail.com'); 
        
        const maria = new Contacto('Maria', 'maria@mail.com');

        const correo = new Correo('Trabajo grupal', 'Les envío el trabajo.', ana, [luis, maria]);
        // Creamos un correo cuyo remitente es Ana y cuyos destinatarios son Luis y Maria


        gestor.enviarCorreo(correo); // Enviamos el correo

        expect(gestor.getEnviados('ana@mail.com')).toHaveLength(1); // Se comprueba que se haya almacenado un solo correo
        expect(gestor.getEnviados('ana@mail.com')[0].getDestinatarios()).toHaveLength(2);
        // Se obtiene la lista de destinatarios de ese correo y se comprueba que tenga dos destinatarios
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
    expect(gestor.getEnviados('ana@mail.com')).toHaveLength(0);
});

    it('RF 2: No debe permitir enviar un correo sin asunto', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');

        // El correo se puede crear sin asunto (puede ser un borrador), pero no se puede enviar
        const correo = new Correo('   ', 'Contenido', ana, [luis]);
        expect(() => gestor.enviarCorreo(correo)).toThrow('El asunto es obligatorio.');
        expect(gestor.getEnviados('ana@mail.com')).toHaveLength(0);
    });

    it('RF 2: No debe permitir enviar un correo sin destinatarios', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');

        // El correo se puede crear sin destinatarios (puede ser un borrador), pero no se puede enviar
        const correo = new Correo('Reunion', 'Contenido', ana, []);
        expect(() => gestor.enviarCorreo(correo)).toThrow('Debe existir al menos un destinatario válido.');
        expect(gestor.getEnviados('ana@mail.com')).toHaveLength(0);
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
    // unknown as ICorreo permite que TypeScript interprete ese objeto como un ICorreo
    //aunque no tenga todos sus metodos

    // El gestor obtiene los destinatarios y comprueba si alguno es nulo

    expect(() => gestor.enviarCorreo(correo)) // Intentamos enviar el correo 
        .toThrow('Debe existir al menos un destinatario válido.'); 
        // Comprobamos que se genere el error por tener destinatarios invalidos

    // Comprobamos que el correo no se haya almacenado
    expect(gestor.getEnviados('ana@mail.com')).toHaveLength(0);
});

    it('RF 2: No debe permitir enviar un correo sin remitente', () => {

    const gestor = new GestorCorreos(); //creamos el gestor

    const luis = new Contacto('Luis', 'luis@mail.com'); //creamos un destinatario valido

    const correo = {     // Creamos un objeto simulado que representa un correo
        id: 100,

        // El remitente devuelve null, es decir, el correo no tiene remitente
        getRemitente: () => null, // devuelve null

        // El asunto es valido
        getAsunto: () => 'Reunion', // Devuelve un asunto valido

        // Tiene un destinatario valido
        getDestinatarios: () => [luis] //devuelve una lista con un destinatario valido

    } as unknown as ICorreo; // Utilizamos as unknown as ICorreo para tratar el objeto como un correo

    // Intentamos enviarlo y comprobamos que se genere el error porque falta el remitente (que es nulo)
    expect(() => gestor.enviarCorreo(correo))
        .toThrow('El remitente es obligatorio.');

    // Comprobamos que no se haya almacenado.
    expect(gestor.getEnviados('ana@mail.com')).toHaveLength(0);
   });
    

    
    it('RF 2: Debe almacenar el correo enviado en la Bandeja de Enviados', () => {
        const gestor = new GestorCorreos();  // Creamos un gestor nuevo

        //Creamos 2 contactos 
        const ana = new Contacto('Ana', 'ana@mail.com'); 
        const luis = new Contacto('Luis', 'luis@mail.com');

        //Creamos un correo real con Ana como remitente y Luis como destinatario
        const correo = new Correo('Aviso', 'Se informa una novedad.', ana, [luis]);

        gestor.enviarCorreo(correo); // Enviamos el correo y se almacena en la bandeja de enviados

        expect(gestor.getEnviados('ana@mail.com')).toContain(correo); // Se comprueba que el correo enviado este dentro de esa coleccion
    });

    it('RF2: No debe permitir enviar dos veces el mismo correo', () => {
    const gestor = new GestorCorreos();

    // Creamos dos contactos
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    // Creamos un correo
    const correo = new Correo('Reunion', 'Contenido', ana, [luis]);

    // Enviamos el correo por primera vez
    gestor.enviarCorreo(correo);

    // Intentamos enviar nuevamente el mismo correo
    expect(() => gestor.enviarCorreo(correo))
        .toThrow('Este correo ya fue enviado.');

    // Comprobamos que el correo esté almacenado una sola vez
    expect(gestor.getEnviados('ana@mail.com')).toHaveLength(1);
    });

    
    it('RF 2; Debe permitir enviar diferentes correos sin perder los anteriores', () => {
        const gestor = new GestorCorreos(); // Creamos un gestor nuevo

        // Creamos 3 contactos
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const maria = new Contacto('Maria', 'maria@mail.com');

        //Construimos un coreo de Ana con Luis como destinatario
        const correo1 = new Correo('Primer correo', 'Contenido 1', ana, [luis]);

        //Construimos un coreo de Ana con Maria como destinatario
        const correo2 = new Correo('Segundo correo', 'Contenido 2', ana, [maria]);

        // Enviamos los correos
        gestor.enviarCorreo(correo1); 
        gestor.enviarCorreo(correo2);

        expect(gestor.getEnviados('ana@mail.com')).toHaveLength(2); // Se comprueba que existan dos correos en la bandeja
        expect(gestor.getEnviados('ana@mail.com')).toContain(correo1);  // Se comprueba que el primero siga almacenado
        expect(gestor.getEnviados('ana@mail.com')).toContain(correo2); // Se comprueba que el segundo también esté almacenado
    });

    it('RF2: Debe devolver una copia de la Bandeja de Enviados', () => {
        const gestor = new GestorCorreos(); // Creamos un gestor

        // Creamos 2 contactos
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        
        // Construimos un correo
        const correo = new Correo('Reunion', 'Nos reunimos mañana.', ana, [luis]);

        gestor.enviarCorreo(correo); // Enviamos el correo y se queda almacendo en la bandeja

        const enviados = gestor.getEnviados('ana@mail.com'); // Devuelve una copia de la lista y la guardamos en enviados

        enviados.pop(); // Elimina el ultimo elemento de esa copia

        expect(gestor.getEnviados('ana@mail.com')).toHaveLength(1); 
        // Volvemos a consultar la bandeja original
        // Se comprueba que el correo siga almacenado en enviados
    });

    describe('Integración de bandejas por usuario en GestorCorreos', () => {
    it('recibe un correo en Entrada y permite buscar en esa bandeja', () => {
      const gestor = new GestorCorreos();
      const buscador = new Buscador();
      const ana = new Contacto('Ana', 'ana@mail.com');
      const luis = new Contacto('Luis', 'luis@mail.com');
      const correo = new Correo('Reunión de equipo', 'Hablamos mañana', ana, [luis]);

      // Se recibe en la casilla de Luis (destinatario)
      gestor.recibirCorreo(correo, 'luis@mail.com');

      expect(gestor.getEntrada('luis@mail.com')).toEqual([correo]);
      expect(buscador.buscarCorreos(gestor.getEntrada('luis@mail.com'), 'reunión')).toEqual([correo]);
    });

    it('guarda el envío en Enviados y rechaza enviarlo otra vez', () => {
      const gestor = new GestorCorreos();
      const ana = new Contacto('Ana', 'ana@mail.com');
      const luis = new Contacto('Luis', 'luis@mail.com');
      const correo = new Correo('Aviso', 'Contenido', ana, [luis]);

      gestor.enviarCorreo(correo);

      expect(gestor.getEnviados('ana@mail.com')).toEqual([correo]);
      expect(() => gestor.enviarCorreo(correo)).toThrow('Este correo ya fue enviado.');
      expect(gestor.getEnviados('ana@mail.com')).toEqual([correo]);
    });

    it('quita de Borradores un correo que se envía', () => {
      const gestor = new GestorCorreos();
      const ana = new Contacto('Ana', 'ana@mail.com');
      const luis = new Contacto('Luis', 'luis@mail.com');
      const correo = new Correo('Borrador', 'Contenido', ana, [luis]);

      gestor.guardarBorrador(correo);
      gestor.enviarCorreo(correo);

      expect(gestor.getBorradores('ana@mail.com')).toEqual([]);
      expect(gestor.getEnviados('ana@mail.com')).toEqual([correo]);
      expect(gestor.getEntrada('luis@mail.com')).toEqual([correo]);
    });

    it('mueve un correo a Eliminados y lo restaura a su bandeja de origen', () => {
      const gestor = new GestorCorreos();
      const ana = new Contacto('Ana', 'ana@mail.com');
      const luis = new Contacto('Luis', 'luis@mail.com');
      const correo = new Correo('Recibido', 'Contenido', ana, [luis]);

      // El correo entra a la casilla de Luis
      gestor.recibirCorreo(correo, 'luis@mail.com');
      
      // Se elimina de la casilla de Luis
      gestor.eliminarCorreo(correo, 'luis@mail.com');

      expect(gestor.getEntrada('luis@mail.com')).toEqual([]);
      expect(gestor.getEliminados('luis@mail.com')).toEqual([correo]);

      // Se restaura en la casilla de Luis
      gestor.restaurarCorreo(correo, 'luis@mail.com');

      expect(gestor.getEliminados('luis@mail.com')).toEqual([]);
      expect(gestor.getEntrada('luis@mail.com')).toEqual([correo]);
    });

    it('elimina un correo de Enviados y lo restaura a Enviados', () => {
      const gestor = new GestorCorreos();
      const ana = new Contacto('Ana', 'ana@mail.com');
      const luis = new Contacto('Luis', 'luis@mail.com');
      const correo = new Correo('Aviso', 'Contenido', ana, [luis]);

      gestor.enviarCorreo(correo);

      // Ana elimina su correo enviado
      gestor.eliminarCorreo(correo, 'ana@mail.com');
      expect(gestor.getEnviados('ana@mail.com')).toEqual([]);
      expect(gestor.getEliminados('ana@mail.com')).toEqual([correo]);

      // Ana restaura su correo a Enviados
      gestor.restaurarCorreo(correo, 'ana@mail.com');
      expect(gestor.getEnviados('ana@mail.com')).toEqual([correo]);
      expect(gestor.getEliminados('ana@mail.com')).toEqual([]);
    });

    it('elimina un borrador y lo restaura a Borradores', () => {
      const gestor = new GestorCorreos();
      const ana = new Contacto('Ana', 'ana@mail.com');
      const borrador = new Correo('', 'Todavia lo estoy escribiendo', ana, []);

      gestor.guardarBorrador(borrador);
      gestor.eliminarCorreo(borrador, 'ana@mail.com');

      expect(gestor.getBorradores('ana@mail.com')).toEqual([]);
      expect(gestor.getEliminados('ana@mail.com')).toEqual([borrador]);

      gestor.restaurarCorreo(borrador, 'ana@mail.com');
      expect(gestor.getBorradores('ana@mail.com')).toEqual([borrador]);
    });

    it('no permite eliminar un correo que no esta en ninguna bandeja', () => {
      const gestor = new GestorCorreos();
      const ana = new Contacto('Ana', 'ana@mail.com');
      const luis = new Contacto('Luis', 'luis@mail.com');
      const correo = new Correo('Suelto', 'Contenido', ana, [luis]);

      expect(() => gestor.eliminarCorreo(correo, 'ana@mail.com')).toThrow(
        'El correo no pertenece a ninguna bandeja activa.'
      );
      expect(gestor.getEliminados('ana@mail.com')).toEqual([]);
    });
  });

  describe('Flujo de envío múltiple y aislamiento de eliminación por usuario', () => {

  it('envía un correo a 3 destinatarios y verifica su presencia en Enviados del remitente y en la Entrada de los 3 destinatarios', () => {
    const gestor = new GestorCorreos();

    // Preparar el remitente y los 3 destinatarios
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const maria = new Contacto('Maria', 'maria@mail.com');
    const pedro = new Contacto('Pedro', 'pedro@mail.com');

    // Crear un correo de Ana para Luis, Maria y Pedro
    const correo = new Correo(
      'Comunicado importante',
      'Reunión general mañana a las 9 AM',
      ana,
      [luis, maria, pedro]
    );

    // Enviar el correo
    gestor.enviarCorreo(correo);

    // Verificar que esté en la Bandeja de Enviados del remitente (Ana)
    expect(gestor.getEnviados('ana@mail.com')).toEqual([correo]);
    expect(gestor.getEnviados('ana@mail.com')[0].getDestinatarios()).toHaveLength(3);

    // Verificar que esté en la Bandeja de Entrada de CADA uno de los destinatarios
    expect(gestor.getEntrada('luis@mail.com')).toEqual([correo]);
    expect(gestor.getEntrada('maria@mail.com')).toEqual([correo]);
    expect(gestor.getEntrada('pedro@mail.com')).toEqual([correo]);
  });

  it('elimina el correo de la bandeja de uno de los destinatarios y verifica el aislamiento entre casilleros', () => {
    const gestor = new GestorCorreos();

    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const maria = new Contacto('Maria', 'maria@mail.com');
    const pedro = new Contacto('Pedro', 'pedro@mail.com');

    const correo = new Correo(
      'Comunicado importante',
      'Reunión general mañana a las 9 AM',
      ana,
      [luis, maria, pedro]
    );

    gestor.enviarCorreo(correo);

    // Luis elimina el correo de su casilla
    gestor.eliminarCorreo(correo, 'luis@mail.com');

    // Verificar que el correo YA NO ESTÉ en la entrada de Luis, pero SÍ en sus Eliminados
    expect(gestor.getEntrada('luis@mail.com')).toEqual([]);
    expect(gestor.getEliminados('luis@mail.com')).toEqual([correo]);

    // Verificar que el correo SIGA ESTANDO intacto en la Entrada de los demás destinatarios
    expect(gestor.getEntrada('maria@mail.com')).toEqual([correo]);
    expect(gestor.getEntrada('pedro@mail.com')).toEqual([correo]);

    // Verificar que los demás no tengan nada en su bandeja de Eliminados
    expect(gestor.getEliminados('maria@mail.com')).toEqual([]);
    expect(gestor.getEliminados('pedro@mail.com')).toEqual([]);

    // Verificar que la bandeja de Enviados del remitente (Ana) siga intacta
    expect(gestor.getEnviados('ana@mail.com')).toEqual([correo]);
  });

});


   
});


