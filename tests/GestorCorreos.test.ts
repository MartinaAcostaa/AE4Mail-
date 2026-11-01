import { describe, it, expect } from 'vitest';

import { GestorCorreos } from '../src/GestorCorreos';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';
import { ICorreo } from '../src/ICorreo';

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

    it('RF 2: No debe permitir crear un correo sin asunto', () => {
        //Creamos 2 contactos
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');

        // Intentamos crear un correo pero al pasarle el asunto dejamos espacio
        // El constructor de correo usa trim para quitar los espacios, como queda vacio se genera un error
        expect(() => new Correo('   ', 'Contenido', ana, [luis]))
        .toThrow('El asunto es obligatorio.'); // Se comprueba que el error sea el esperado
    });

    it('RF 2: No debe permitir crear un correo sin destinatarios', () => {
    const ana = new Contacto('Ana', 'ana@mail.com'); // Creamos un contacto

    //Intentamos crear un correo con asunto y contenido validos, pero como destinatario pasamos un arreglo vacio
    //El constructor comprueba que exista al menos un destinatario, como no hay ninguno se genera un error
    expect(() => new Correo('Reunion', 'Contenido', ana, []))
    .toThrow('Debe existir al menos un destinatario válido.'); // Se verifica que se haya producido ese error
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





});