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

    expect(gestor.getEnviados()).toHaveLength(1);  // Comprueba que haya exactamente un correo almacenado 
    expect(gestor.getEnviados()[0]).toBe(correo);  // Comprueba que el elemento almacenado sea exactamente el mismo objeto que enviamos
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

        expect(gestor.getEnviados()).toHaveLength(1); // Se comprueba que se haya almacenado un solo correo
        expect(gestor.getEnviados()[0].getDestinatarios()).toHaveLength(2);
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
    expect(gestor.getEnviados()).toHaveLength(0);
});

    it('RF 2: No debe permitir enviar un correo sin asunto', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');

        // El correo se puede crear sin asunto (puede ser un borrador), pero no se puede enviar
        const correo = new Correo('   ', 'Contenido', ana, [luis]);
        expect(() => gestor.enviarCorreo(correo)).toThrow('El asunto es obligatorio.');
        expect(gestor.getEnviados()).toHaveLength(0);
    });

    it('RF 2: No debe permitir enviar un correo sin destinatarios', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');

        // El correo se puede crear sin destinatarios (puede ser un borrador), pero no se puede enviar
        const correo = new Correo('Reunion', 'Contenido', ana, []);
        expect(() => gestor.enviarCorreo(correo)).toThrow('Debe existir al menos un destinatario válido.');
        expect(gestor.getEnviados()).toHaveLength(0);
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
    expect(gestor.getEnviados()).toHaveLength(0);
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
    expect(gestor.getEnviados()).toHaveLength(0);
   });
    

    
    it('RF 2: Debe almacenar el correo enviado en la Bandeja de Enviados', () => {
        const gestor = new GestorCorreos();  // Creamos un gestor nuevo

        //Creamos 2 contactos 
        const ana = new Contacto('Ana', 'ana@mail.com'); 
        const luis = new Contacto('Luis', 'luis@mail.com');

        //Creamos un correo real con Ana como remitente y Luis como destinatario
        const correo = new Correo('Aviso', 'Se informa una novedad.', ana, [luis]);

        gestor.enviarCorreo(correo); // Enviamos el correo y se almacena en la bandeja de enviados

        expect(gestor.getEnviados()).toContain(correo); // Se comprueba que el correo enviado este dentro de esa coleccion
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
    expect(gestor.getEnviados()).toHaveLength(1);
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

        expect(gestor.getEnviados()).toHaveLength(2); // Se comprueba que existan dos correos en la bandeja
        expect(gestor.getEnviados()).toContain(correo1);  // Se comprueba que el primero siga almacenado
        expect(gestor.getEnviados()).toContain(correo2); // Se comprueba que el segundo también esté almacenado
    });

    it('RF2: Debe devolver una copia de la Bandeja de Enviados', () => {
        const gestor = new GestorCorreos(); // Creamos un gestor

        // Creamos 2 contactos
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        
        // Construimos un correo
        const correo = new Correo('Reunion', 'Nos reunimos mañana.', ana, [luis]);

        gestor.enviarCorreo(correo); // Enviamos el correo y se queda almacendo en la bandeja

        const enviados = gestor.getEnviados(); // Devuelve una copia de la lista y la guardamos en enviados

        enviados.pop(); // Elimina el ultimo elemento de esa copia

        expect(gestor.getEnviados()).toHaveLength(1); 
        // Volvemos a consultar la bandeja original
        // Se comprueba que el correo siga almacenado en enviados
    });

    describe('Integración de bandejas en GestorCorreos', () => {

    it('recibe un correo en Entrada y permite buscar en esa bandeja', () => {
        const gestor = new GestorCorreos();
        const buscador = new Buscador();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const correo = new Correo('Reunión de equipo', 'Hablamos mañana', ana, [luis]);

        gestor.recibirCorreo(correo);

        expect(gestor.getEntrada()).toEqual([correo]);
        expect(buscador.buscarCorreos(gestor.getEntrada(), 'reunión')).toEqual([correo]);
    });

    it('guarda el envío en Enviados y rechaza enviarlo otra vez', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const correo = new Correo('Aviso', 'Contenido', ana, [luis]);

        gestor.enviarCorreo(correo);

        expect(gestor.getEnviados()).toEqual([correo]);
        expect(() => gestor.enviarCorreo(correo)).toThrow('Este correo ya fue enviado.');
        expect(gestor.getEnviados()).toEqual([correo]);
    });

    it('quita de Borradores un correo que se envía', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const correo = new Correo('Borrador', 'Contenido', ana, [luis]);

        gestor.guardarBorrador(correo);
        gestor.enviarCorreo(correo);

        expect(gestor.getBorradores()).toEqual([]);
        expect(gestor.getEnviados()).toEqual([correo]);
    });

    it('mueve un correo a Eliminados y lo restaura a su bandeja de origen', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const correo = new Correo('Recibido', 'Contenido', ana, [luis]);

        gestor.recibirCorreo(correo);
        gestor.eliminarCorreo(correo);

        expect(gestor.getEntrada()).toEqual([]);
        expect(gestor.getEliminados()).toEqual([correo]);

        gestor.restaurarCorreo(correo);

        expect(gestor.getEliminados()).toEqual([]);
        expect(gestor.getEntrada()).toEqual([correo]);
    });

    it('elimina un correo de Enviados y lo restaura a Enviados', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const correo = new Correo('Aviso', 'Contenido', ana, [luis]);
        gestor.enviarCorreo(correo);

        gestor.eliminarCorreo(correo);
        expect(gestor.getEnviados()).toEqual([]);
        expect(gestor.getEliminados()).toEqual([correo]);

        gestor.restaurarCorreo(correo);
        expect(gestor.getEnviados()).toEqual([correo]);
        expect(gestor.getEliminados()).toEqual([]);
    });

    it('elimina un borrador y lo restaura a Borradores', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const borrador = new Correo('', 'Todavia lo estoy escribiendo', ana, []);
        gestor.guardarBorrador(borrador);

        gestor.eliminarCorreo(borrador);
        expect(gestor.getBorradores()).toEqual([]);
        expect(gestor.getEliminados()).toEqual([borrador]);

        gestor.restaurarCorreo(borrador);
        expect(gestor.getBorradores()).toEqual([borrador]);
    });

    it('no permite eliminar un correo que no esta en ninguna bandeja', () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const correo = new Correo('Suelto', 'Contenido', ana, [luis]);

        expect(() => gestor.eliminarCorreo(correo)).toThrow('El correo no pertenece a ninguna bandeja activa.');
        expect(gestor.getEliminados()).toEqual([]);
    });
});
});

