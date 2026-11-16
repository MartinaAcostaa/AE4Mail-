import { describe, it, expect } from 'vitest';

import { Contacto } from '../src/Contacto';
import { Correo } from '../src/Correo';

import { GestorCorreos } from '../src/GestorCorreos';
import { GestorContactos } from '../src/GestorContactos';
import { GestorFiltros } from '../src/GestorFiltros';
import { FiltroCorreo } from '../src/FiltroCorreo';
import { Estadisticas } from '../src/Estadisticas';
import { ICorreo } from '../src/ICorreo';

describe('Pruebas generales de integración del Gestor de Correos', () => {
    // RF 01: Creación de correos electrónicos
    it('RF 01: Permite crear correos y conservar correctamente sus datos', () => {

        //se crean 3 contactos
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const maria = new Contacto('Maria', 'maria@mail.com');

        // Se crea un nuevo correo de parte de ana con destinatarios luis y maria
        const correo1 = new Correo(
            'Proyecto AE4',
            'Entrega del trabajo',
            ana,
            [luis, maria]
        );

        // luis envia un correo a ana
        const correo2 = new Correo(
            'Consulta',
            'Necesito información',
            luis,
            [ana]
        );

        expect(correo1.id).not.toBe(correo2.id); // verificamos que cada correo tenga un ID diferente
        expect(correo1.getAsunto()).toBe('Proyecto AE4'); // Comprobamos que el asunto se haya almacenado correctamente
        expect(correo1.getContenido()).toBe('Entrega del trabajo'); // Comprobamos que el contenido sea el esperado
        expect(correo1.getRemitente()).toBe(ana); // Verificamos que el remitente sea Ana
        expect(correo1.getDestinatarios()).toEqual([luis, maria]); // Comprobamos que los destinatarios sean Luis y María

        expect(correo1.getLeido('luis@mail.com')).toBe(false);  // Verificamos que inicialmente el correo no esté leído por Luis
        expect(correo1.getFavorito('luis@mail.com')).toBe(false); // Verificamos que inicialmente tampoco sea favorito para Luis
    });

    // RF 02: Envío de correos electrónicos
it('RF 02: Permite enviar un correo a varios destinatarios y almacenarlo en las bandejas correspondientes', () => {

    // creamos el gestor que administra los correos y las bandejas
    const gestor = new GestorCorreos();

    // Creamos los contactos que participarán en el envío
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const maria = new Contacto('Maria', 'maria@mail.com');

    // Creamos un correo enviado por Ana a Luis y María
    const correo = new Correo(
        'Comunicado',
        'Reunión mañana a las 10',
        ana,
        [luis, maria]
    );

    // enviamos el correo utilizando el gestor
    gestor.enviarCorreo(correo);

    // verificamos que el correo aparezca en Enviados de Ana
    expect(gestor.getEnviados('ana@mail.com')).toEqual([correo]);

    // Comprobamos que aparezca en la bandeja de entrada de Luis
    expect(gestor.getEntrada('luis@mail.com')).toEqual([correo]);

    // Comprobamos que también aparezca en la entrada de María
    expect(gestor.getEntrada('maria@mail.com')).toEqual([correo]);

    // Verificamos que no se permita enviar nuevamente el mismo correo
    expect(() => gestor.enviarCorreo(correo))
        .toThrow('Este correo ya fue enviado.');
});

// RF 03: Gestión de contactos
it('RF 03: Permite administrar contactos sin perder las referencias históricas de los correos', () => {

    // creamos el gestor de contactos.
    const agenda = new GestorContactos();

    // Creamos dos contactos.
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    // agregamos ambos contactos a la agenda.
    agenda.agregarContacto(ana);
    agenda.agregarContacto(luis);

    // Creamos un correo que utiliza esos contactos.
    const correo = new Correo(
        'Proyecto',
        'Información del trabajo',
        ana,
        [luis]
    );

    // Modificamos los datos de Ana en la agenda.
    agenda.modificarContacto(
        'ana@mail.com',
        'Ana Gomez',
        'ana.gomez@mail.com'
    );

    // Comprobamos que ahora se pueda encontrar a Ana
    // utilizando su nueva dirección de correo.
    expect(agenda.buscarContactoPorEmail('ana.gomez@mail.com'))
        .toBe(ana);

    // Eliminamos a Ana de la agenda.
    agenda.eliminarContacto('ana.gomez@mail.com');

    // Comprobamos que ya no esté registrada en la agenda.
    expect(agenda.buscarContactoPorEmail('ana.gomez@mail.com'))
        .toBeUndefined();

    // comprobamos que el correo conserve sus referencias.
    // Aunque Ana fue eliminada de la agenda, sigue siendo su remitente.
    expect(correo.getRemitente()).toBe(ana);

    // Luis continúa siendo el destinatario del correo.
    expect(correo.getDestinatarios()).toEqual([luis]);
});

    // RF 04: Búsqueda de correos electrónicos
it('RF 04: Permite buscar correos recibidos por diferentes campos sin generar duplicados', () => {

    //  creamos el gestor de correos.
    const gestor = new GestorCorreos();

    // Creamos los contactos.
    const ana = new Contacto('Ana Lopez', 'ana@mail.com');
    const luis = new Contacto('Luis Perez', 'luis@mail.com');

    // Creamos un correo enviado por Ana a Luis.
    const correo = new Correo(
        'Reunión con Ana',
        'Tenemos que revisar el proyecto',
        ana,
        [luis]
    );

    // enviamos el correo para que aparezca en la entrada de Luis.
    gestor.enviarCorreo(correo);

    // Buscamos en la entrada de Luis utilizando el texto "ana".
    const resultado = gestor.buscarEnEntrada(
        'luis@mail.com',
        'ana'
    );

    //  comprobamos que el correo coincida con la búsqueda.
    expect(resultado).toEqual([correo]);

    // Verificamos que el resultado tenga un solo elemento.
    // Esto permite comprobar que no se devuelvan duplicados.
    expect(resultado).toHaveLength(1);

    // Comprobamos que la búsqueda no haya eliminado ni modificado
    // el correo de la bandeja de entrada original.
    expect(gestor.getEntrada('luis@mail.com')).toEqual([correo]);
});

// RF 05: Filtros personalizados
it('RF 05: Permite combinar predicados y aplicar filtros dinámicos sobre una colección', () => {

    // creamos el gestor de correos y el gestor de filtros.
    const gestor = new GestorCorreos();
    const gestorFiltros = new GestorFiltros();

    // Creamos los contactos.
    const ana = new Contacto('Ana', 'ana@ucp.edu.ar');
    const luis = new Contacto('Luis', 'luis@mail.com');

    // Creamos tres correos diferentes.
    const correo1 = new Correo(
        'Proyecto AE4',
        'Entrega del trabajo',
        ana,
        [luis]
    );

    const correo2 = new Correo(
        'Reunión',
        'Revisar pendientes',
        ana,
        [luis]
    );

    const correo3 = new Correo(
        'Proyecto final',
        'Entrega definitiva',
        ana,
        [luis]
    );

    // Enviamos los tres correos.
    gestor.enviarCorreo(correo1);
    gestor.enviarCorreo(correo2);
    gestor.enviarCorreo(correo3);

    // Definimos un predicado que verifica si el asunto
    // contiene la palabra "proyecto".
    const esProyecto = (correo: ICorreo) =>
        correo.getAsunto().toLowerCase().includes('proyecto');

    // Definimos otro predicado que verifica si el asunto
    // contiene la palabra "reunión".
    const esReunion = (correo: ICorreo) =>
        correo.getAsunto().toLowerCase().includes('reunión');

    // Este predicado comprueba si el correo está leído por Luis.
    const estaLeido = (correo: ICorreo) =>
        correo.getLeido('luis@mail.com');

    // Combinamos los predicados:
    // 1 - Debe ser un proyecto O una reunión.
    // 2 - Además, NO debe estar leído.
    const condicion = gestorFiltros.AND(
        gestorFiltros.OR(esProyecto, esReunion),
        gestorFiltros.NOT(estaLeido)
    );

    // Creamos un filtro llamado "Seguimiento"
    // y le asignamos la condición compuesta.
    gestorFiltros.agregarFiltro(
        new FiltroCorreo('Seguimiento', condicion)
    );

    // Obtenemos los correos de la bandeja de entrada de Luis.
    const entrada = gestor.getEntrada('luis@mail.com');

    // aplicamos el filtro sobre esa colección.
    const resultado = gestorFiltros.aplicarFiltro(
        'Seguimiento',
        entrada
    );

    // los tres correos cumplen inicialmente las condiciones.
    expect(resultado).toEqual([correo1, correo2, correo3]);

    // Marcamos el primer correo como leído para Luis.
    correo1.marcarComoLeido('luis@mail.com');

    // Volvemos a aplicar el mismo filtro.
    const resultadoActualizado = gestorFiltros.aplicarFiltro(
        'Seguimiento',
        entrada
    );

    // El primer correo ya no cumple la condición de no leído.
    // Por eso solamente deben quedar el segundo y el tercero.
    expect(resultadoActualizado).toEqual([correo2, correo3]);
});

// RF 06: Gestión de bandejas
it('RF 06: Permite eliminar y restaurar un correo en su bandeja original', () => {

    // creamos el gestor de correos.
    const gestor = new GestorCorreos();

    // Creamos los contactos.
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    // Creamos un correo enviado por Ana a Luis.
    const correo = new Correo(
        'Reunión',
        'Nos reunimos mañana',
        ana,
        [luis]
    );

    // Enviamos el correo.
    gestor.enviarCorreo(correo);

    // eliminamos el correo de la bandeja de entrada de Luis.
    gestor.eliminarCorreo(correo, 'luis@mail.com');

    // ASSERT: comprobamos que ya no esté en la entrada de Luis.
    expect(gestor.getEntrada('luis@mail.com')).toEqual([]);

    // Comprobamos que ahora esté en la bandeja de eliminados.
    expect(gestor.getEliminados('luis@mail.com')).toEqual([correo]);

    // restauramos el correo.
    gestor.restaurarCorreo(correo, 'luis@mail.com');

    // comprobamos que vuelva a la bandeja de entrada.
    expect(gestor.getEntrada('luis@mail.com')).toEqual([correo]);

    // Verificamos que ya no aparezca en eliminados.
    expect(gestor.getEliminados('luis@mail.com')).toEqual([]);
});

// RF 07: Gestión de borradores
it('RF 07: Permite guardar, editar y enviar un borrador', () => {

    // creamos el gestor y los contactos.
    const gestor = new GestorCorreos();

    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    // Creamos un correo incompleto:
    // no tiene asunto, contenido ni destinatarios.
    const borrador = new Correo('', '', ana, []);

    // guardamos el correo como borrador.
    gestor.guardarBorrador(borrador);

    // ASSERT: comprobamos que esté en los borradores de Ana.
    expect(gestor.getBorradores('ana@mail.com')).toEqual([borrador]);

    // completamos y editamos el borrador.
    gestor.editarBorrador(
        borrador,
        'Entrega AE4',
        'Adjunto el trabajo final',
        [luis]
    );

    // verificamos que el asunto se haya actualizado.
    expect(borrador.getAsunto()).toBe('Entrega AE4');

    // Comprobamos que el contenido también se haya actualizado.
    expect(borrador.getContenido()).toBe('Adjunto el trabajo final');

    // Verificamos que Luis sea el destinatario.
    expect(borrador.getDestinatarios()).toEqual([luis]);

    // enviamos el borrador ya completado.
    gestor.enviarCorreo(borrador);

    // comprobamos que haya desaparecido de los borradores.
    expect(gestor.getBorradores('ana@mail.com')).toEqual([]);

    // Verificamos que ahora esté en los enviados de Ana.
    expect(gestor.getEnviados('ana@mail.com')).toEqual([borrador]);

    // Comprobamos que haya llegado a la entrada de Luis.
    expect(gestor.getEntrada('luis@mail.com')).toEqual([borrador]);
});

// RF 08: Estado de lectura
it('RF 08: Permite modificar el estado de lectura y actualizar los resultados de los filtros', () => {

    // creamos el gestor y los contactos.
    const gestor = new GestorCorreos();

    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    // Creamos dos correos dirigidos a Luis.
    const correo1 = new Correo(
        'Entrega 1',
        'Primer trabajo',
        ana,
        [luis]
    );

    const correo2 = new Correo(
        'Entrega 2',
        'Segundo trabajo',
        ana,
        [luis]
    );

    // Enviamos ambos correos.
    gestor.enviarCorreo(correo1);
    gestor.enviarCorreo(correo2);

    // verificamos que inicialmente los dos estén sin leer.
    expect(gestor.getNoLeidosEntrada('luis@mail.com'))
        .toEqual([correo1, correo2]);

    // marcamos el primer correo como leído para Luis.
    correo1.marcarComoLeido('luis@mail.com');

    // ahora solamente el segundo debe estar sin leer.
    expect(gestor.getNoLeidosEntrada('luis@mail.com'))
        .toEqual([correo2]);

    // volvemos a marcar el primer correo como no leído.
    correo1.marcarComoNoLeido('luis@mail.com');

    // ahora ambos deben aparecer nuevamente como no leídos.
    expect(gestor.getNoLeidosEntrada('luis@mail.com'))
        .toEqual([correo1, correo2]);
});

// RF 09: Gestión de favoritos
it('RF 09: Permite consultar, filtrar y restaurar correos favoritos', () => {

    // creamos los gestores.
    const gestor = new GestorCorreos();
    const gestorFiltros = new GestorFiltros();

    // Creamos los contactos.
    const ana = new Contacto('Ana', 'ana@ucp.edu.ar');
    const luis = new Contacto('Luis', 'luis@mail.com');

    // Creamos dos correos enviados por Ana a Luis.
    const correo1 = new Correo(
        'Proyecto AE4',
        'Entrega del trabajo',
        ana,
        [luis]
    );

    const correo2 = new Correo(
        'Reunión',
        'Revisar el proyecto',
        ana,
        [luis]
    );

    // Enviamos ambos correos.
    gestor.enviarCorreo(correo1);
    gestor.enviarCorreo(correo2);

    // marcamos los dos correos como favoritos para Luis.
    gestor.marcarComoFavorito(correo1, 'luis@mail.com');
    gestor.marcarComoFavorito(correo2, 'luis@mail.com');

    // comprobamos que ambos aparezcan en favoritos.
    expect(gestor.getFavoritos('luis@mail.com'))
        .toEqual([correo1, correo2]);

    // Creamos un filtro que identifica correos cuyo remitente
    // tiene una dirección que termina en "@ucp.edu.ar".
    gestorFiltros.agregarFiltro(
        new FiltroCorreo(
            'Correos UCP',
            correo => correo.getRemitente().getEmail().endsWith('@ucp.edu.ar')
        )
    );

    // aplicamos el filtro sobre la colección de favoritos.
    const resultado = gestorFiltros.aplicarFiltro(
        'Correos UCP',
        gestor.getFavoritos('luis@mail.com')
    );

    // ambos correos cumplen la condición porque
    // fueron enviados por Ana, cuya dirección pertenece a UCP.
    expect(resultado).toEqual([correo1, correo2]);

    // eliminamos el primer correo de la bandeja de Luis.
    gestor.eliminarCorreo(correo1, 'luis@mail.com');

    // el correo eliminado ya no debe aparecer
    // en la consulta habitual de favoritos.
    expect(gestor.getFavoritos('luis@mail.com')).toEqual([correo2]);

    // restauramos el primer correo.
    gestor.restaurarCorreo(correo1, 'luis@mail.com');

    // comprobamos que conserve su condición de favorito.
    expect(correo1.getFavorito('luis@mail.com')).toBe(true);

    // Verificamos que ambos correos vuelvan a aparecer en favoritos,
    // independientemente del orden en el que se devuelvan.
    expect(gestor.getFavoritos('luis@mail.com'))
    .toHaveLength(2);

    expect(gestor.getFavoritos('luis@mail.com'))
    .toContain(correo1);

    expect(gestor.getFavoritos('luis@mail.com'))
    .toContain(correo2);
});

// RF 10: Procesamiento funcional y estadísticas
it('RF 10: Permite obtener asuntos, filtrar correos y calcular estadísticas', () => {

    // creamos el gestor de correos y el de estadísticas.
    const gestor = new GestorCorreos();
    const estadisticas = new Estadisticas();

    // Creamos los contactos.
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');

    // Creamos dos correos.
    const correo1 = new Correo(
        'Proyecto',
        'Entrega del trabajo',
        ana,
        [luis]
    );

    const correo2 = new Correo(
        'Examen',
        'Estudiar para el parcial',
        ana,
        [luis]
    );

    // Enviamos ambos correos.
    gestor.enviarCorreo(correo1);
    gestor.enviarCorreo(correo2);

    // Obtenemos la colección de correos recibidos por Luis.
    const entrada = gestor.getEntrada('luis@mail.com');

    // utilizamos map para obtener solamente los asuntos.
    expect(estadisticas.obtenerAsuntos(entrada))
        .toEqual(['Proyecto', 'Examen']);

    // Utilizamos filter para obtener los correos
    // cuyo asunto contiene la palabra "Proyecto".
    const proyectos = estadisticas.filtrarCorreos(
        entrada,
        correo => correo.getAsunto().includes('Proyecto')
    );

    // Comprobamos que solamente se haya seleccionado el primer correo.
    expect(proyectos).toEqual([correo1]);

    // Utilizamos reduce para contar los correos no leídos por Luis.
    expect(
        estadisticas.contarNoLeidos(entrada, 'luis@mail.com')
        ).toBe(2);
});







});