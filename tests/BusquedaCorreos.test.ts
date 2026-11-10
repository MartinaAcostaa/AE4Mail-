import { describe, it, expect } from 'vitest';
import { GestorCorreos } from '../src/GestorCorreos';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';

describe('RF-04: Búsqueda de correos en la Bandeja de Entrada', () => {

    it('recibe un correo y lo guarda en la Bandeja de Entrada', () => {
    // preparar: un gestor vacio y un correo que le llega a Luis
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const correo = new Correo('Reunion', 'Nos reunimos mañana.', ana, [luis]);

    // simulamos que el correo llega
    gestor.recibirCorreo(correo, 'luis@mail.com');

    // comprobar: esta en la Entrada y es el mismo objeto
    expect(gestor.getEntrada('ana@mail.com')).toHaveLength(1);
    expect(gestor.getEntrada('ana@mail.com')[0]).toBe(correo);

    // la Entrada devuelve una copia: modificarla no cambia la bandeja original
    gestor.getEntrada('ana@mail.com').pop();
    expect(gestor.getEntrada('ana@mail.com')).toHaveLength(1);
    });

    it('busca solo en los correos de la Bandeja de Entrada', () => {
    // un correo que llega a la Entrada y otro que se envia (va a Enviados)
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const recibido = new Correo('Proyecto final', 'Te paso el informe', ana, [luis]);
    const enviado = new Correo('Proyecto nuevo', 'Arrancamos el lunes', luis, [ana]);
    gestor.recibirCorreo(recibido, 'luis@mail.com');
    gestor.enviarCorreo(enviado);

    // buscamos un texto que esta en los dos correos
    const resultado = gestor.buscarEnEntrada('ana@mail.com', 'proyecto');

    // solo encuentra el de la Entrada, no el de Enviados
    expect(resultado).toEqual([recibido]);
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

     it('RF4.13: No debe modificar la bandeja original', () => {

        const gestor = new GestorCorreos();  // se crea un nuevo gestor

        // se crean 2 contactos
        const ana = new Contacto('Ana Lopez', 'ana@mail.com');
        const luis = new Contacto('Luis Perez', 'luis@mail.com');

        const correo = new Correo( // se crea un correo
            'Reunion',
            'Contenido del correo.',
            ana,
            [luis]
        );

        // Creamos la bandeja original
        const bandeja = [correo];

        // Guardamos una copia antes de realizar la busqueda
        const copiaOriginal = [...bandeja];

        // Realizamos la busqueda
        gestor.buscarCorreos(bandeja, 'reunion');

        // Verificamos que la bandeja siga teniendo los mismos elementos
        expect(bandeja).toEqual(copiaOriginal); 
        // esperamos que la bandeja sea igual a la copia original

        expect(bandeja).toHaveLength(1); // esperamos que la bandeja tenga 1 elemento
    });



});