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

});

describe('RF4: Búsqueda de correos', () => {

    it('RF4: Debe buscar coincidencias en el asunto', () => {

        // Creamos un gestor para esta prueba
        const gestor = new GestorCorreos();

        // Creamos los contactos
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        // Creamos un correo
        const correo = new Correo(
            'Reunion de equipo',
            'Tenemos una reunion el lunes.',
            ana,
            [luis]
        );

        // Realizamos la busqueda segun el asunto 'Reunion'
        const resultado = gestor.buscarCorreos([correo], 'Reunion');

        // Comprobamos que encuentre el correo
        expect(resultado).toEqual([correo]);
    });

     it('RF4: Debe buscar coincidencias en el contenido', () => {

        const gestor = new GestorCorreos(); // Se crea un nuevo gestor

        // Creamos dos contactos
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        const correo = new Correo( //Se crea un correo
            'Entrega',
            'Enviar los archivos pendientes.',
            ana,
            [luis]
        );

        const resultado = gestor.buscarCorreos([correo], 'archivos');
        //se busca ese correo segun el contenido 'archivos'

        expect(resultado).toEqual([correo]); //esperamos que se encuente el correo
    });

     it('RF4: Debe buscar por nombre del remitente', () => {

        const gestor = new GestorCorreos(); // se crea un nuevo gestor

        // creamos dos contactos
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        const correo = new Correo( // Creamos un nuevo correo
            'Reunion',
            'Contenido del correo.',
            luis,
            [ana]
        );

        const resultado = gestor.buscarCorreos([correo], 'Luis'); 
        // Buscamos el correo por nombre del remitente

        expect(resultado).toEqual([correo]); // Se espera que se encuentre el correo por el remitente
    });

     it('RF4: Debe buscar por email del remitente', () => {

        const gestor = new GestorCorreos(); // creamos un nuevo gestor

        // creamos dos contactos

        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        const correo = new Correo( // creamos un correo
            'Reunion',
            'Contenido del correo.',
            ana,
            [luis]
        );

        const resultado = gestor.buscarCorreos([correo], 'ana@mail.com'); 
        // Buscamos el correo por email del remitente

        expect(resultado).toEqual([correo]); // esperamos que se encuentre el correo
    });

     it('RF4: Debe buscar por nombre de un destinatario', () => {

        const gestor = new GestorCorreos(); // se crea un nuevo gestor

        // se crean dos contactos
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        const correo = new Correo( // Se crea un correo
            'Reunion',
            'Contenido del correo.',
            ana,
            [luis]
        );

        const resultado = gestor.buscarCorreos([correo], 'Luis'); 
         // se busca el correo por el nombre del destinatario

        expect(resultado).toEqual([correo]); 
        // esperamos que se encuentre el correo
    });

     it('RF4: Debe buscar por email de un destinatario', () => {

        const gestor = new GestorCorreos(); // se crea un nuevo gestor

        // se crean dos contactos
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        const correo = new Correo( // se crea un nuevo correo
            'Reunion',
            'Contenido del correo.',
            ana,
            [luis]
        );

        const resultado = gestor.buscarCorreos([correo], 'luis@mail.com');
        // se busca el correo por el email del destinatario

        expect(resultado).toEqual([correo]); // se espera que se encuentre el correo
    });

    it('RF4: Debe ignorar mayusculas y minusculas', () => {

        const gestor = new GestorCorreos();  // se crea un nuevo gestor

        // se crean 2 contactos
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        const correo = new Correo( // se crea un nuevo correo
            'Reunion de equipo',
            'Contenido del correo.',
            ana,
            [luis]
        );

        const resultado = gestor.buscarCorreos([correo], 'REUNION'); 
        // se busca el correo con la palabra reunion en mayusculas

        expect(resultado).toEqual([correo]); // se espera que se encuentre el correo de igual forma
    });

     it('RF4: Debe permitir coincidencias parciales', () => {

        const gestor = new GestorCorreos();  // se crea un nuevo gestor

        // se crean 2 contactos
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        const correo = new Correo( // Se crea un nuevo correo
            'Documentacion',
            'Contenido del correo.',
            ana,
            [luis]
        );

        const resultado = gestor.buscarCorreos([correo], 'docum'); 
        // se busca el correo solo escribiendo 'docum'

        expect(resultado).toEqual([correo]); 
        // se espera que se encuentre el correo de igual manera
    });

    it('RF4: No debe repetir un correo si coincide en varios campos', () => {

        const gestor = new GestorCorreos();  // se crea un nuevo gestor

        // se crea un nuevo contacto
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');

        // Ana aparece como remitente y destinataria.
        const correo = new Correo(
            'Reunion con Ana',
            'Contenido para Ana.',
            ana,
            [ana]
        );

        const resultado = gestor.buscarCorreos([correo], 'ana');
        // se busca el correo 

        // Comprobamos que el correo aparezca una sola vez.
        expect(resultado).toHaveLength(1); // se espera que aparezca una sola vez
        expect(resultado[0]).toBe(correo); // se espera que el resultado de la busqueda sea el correo
    });

    it('RF4.10: Debe devolver una lista vacia si no encuentra coincidencias', () => {

        const gestor = new GestorCorreos(); // se crea un nuevo gestor

        // se crean dos contactos
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        const correo = new Correo( // se crea un nuevo correo
            'Reunion',
            'Contenido del correo.',
            ana,
            [luis]
        );

        const resultado = gestor.buscarCorreos([correo], 'inexistente'); 
        // se realia una busqueda con una palabra que no dara resultado

        expect(resultado).toEqual([]); // se espera que se devuelva una lista vacia
    });

     it('RF4.11: Debe devolver una lista vacia si el texto esta vacio', () => {

        const gestor = new GestorCorreos();  // se crea un nuevo gestor

        const resultado = gestor.buscarCorreos([], '   '); // se hace una busqueda con texto vacio

        expect(resultado).toEqual([]);  // se espera que devuelva una lista vacia
    });

     it('RF4.12: Debe devolver una lista vacia si la bandeja esta vacia', () => {

        const gestor = new GestorCorreos(); // se crea un nuevo gestor

        const resultado = gestor.buscarCorreos([], 'reunion'); 
        // se busca la palabra reunion sin tener ningun correo creado
 
        expect(resultado).toEqual([]); // se espera que se devuelva una lista vacia
    });



});