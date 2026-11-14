import { describe, it, expect } from 'vitest';

import { Contacto } from '../src/Contacto';
import { Correo } from '../src/Correo';

import { GestorFiltros } from '../src/GestorFiltros';
import { FiltroCorreo } from '../src/FiltroCorreo';
import { ICorreo } from '../src/ICorreo';

// Funcion que crea un correo para utilizar en las pruebas
function crearCorreo( // llama al metodo para crear un correo y le pasa asunto, contenido y el email del remitente
    asunto: string,
    contenido: string,
    emailRemitente: string
): Correo { //el correo pone el remitente y el destinatario correspondientemente
    const remitente = new Contacto('Remitente', emailRemitente);
    const destinatario = new Contacto('Destinatario', 'destino@mail.com');

    return new Correo( // la funcion devuelve un nuevo correo con asunto, contenido, remitente y destinatario
        asunto,
        contenido,
        remitente,
        [destinatario]
    );
}

describe('RF5: Creación y aplicación de filtros personalizados', () => {

    // TEST 1: Registrar un filtro y aplicarlo.
    it('Rf5: Debe registrar un filtro y aplicarlo correctamente', () => {

        // Creamos un gestor de filtros nuevo
        const gestor = new GestorFiltros();

        // Creamos un filtro que busca correos que como asunto contenga "Examen"
        const filtro = new FiltroCorreo(
            'Examen',
            correo => correo.getAsunto().toLowerCase().includes('examen')
        );

        // Registramos el filtro en el gestor
        gestor.agregarFiltro(filtro);

        // Creamos dos correos: uno cumple la condición y otro no
        const correo1 = crearCorreo('Examen de Física', 'Contenido', 'ana@mail.com');
        const correo2 = crearCorreo('Reunión', 'Contenido', 'juan@mail.com');

        // Aplicamos el filtro sobre ambos correos
        const resultado = gestor.aplicarFiltro('Examen', [correo1, correo2]);

        // Comprobamos que solamente se haya devuelto el correo que cumple
        expect(resultado).toEqual([correo1]);
    });

    // TEST 2: No permitir más de cinco filtros
    it('RF5: No debe permitir registrar más de cinco filtros', () => {

        // Creamos un gestor nuevo.
        const gestor = new GestorFiltros();

        // Registramos cinco filtros diferentes
        for (let i = 1; i <= 5; i++) {
            gestor.agregarFiltro(
                new FiltroCorreo(`Filtro ${i}`, () => true)
            );
        }

        // Intentamos registrar un sexto filtro
        const sextoFiltro = new FiltroCorreo('Filtro 6', () => true);

        // Comprobamos que se produzca un error
        expect(() => gestor.agregarFiltro(sextoFiltro))
            .toThrow('No se pueden agregar más de cinco filtros.');
    });

     // TEST 3: No permitir filtros con nombres repetidos al crear filtros
    it('Rf5: No debe permitir registrar dos filtros con el mismo nombre', () => {

        // Creamos un gestor nuevo
        const gestor = new GestorFiltros();

        // Registramos el primer filtro
        const filtro1 = new FiltroCorreo('Examen', () => true);
        gestor.agregarFiltro(filtro1);

        // Creamos otro filtro con el mismo nombre
        const filtro2 = new FiltroCorreo('Examen', () => false);

        // Comprobamos que no se permita registrarlo
        expect(() => gestor.agregarFiltro(filtro2))
            .toThrow('Ya existe un filtro con ese nombre');
    });

     // TEST 4: No permitir registrar un filtro inexistente
    it('Rf5: Debe rechazar un filtro nulo', () => {

        // Creamos un gestor nuevo
        const gestor = new GestorFiltros();

        // Intentamos registrar null en lugar de un filtro y esperamos que arroje error
        expect(() => gestor.agregarFiltro(null as unknown as FiltroCorreo))
            .toThrow('El filtro es obligatorio.');
    });


    // TEST 5: Combinar condiciones mediante AND
    it('Rf 5: Debe combinar condiciones utilizando AND', () => {

        // Creamos un gestor nuevo
        const gestor = new GestorFiltros();

        // El correo debe cumplir las dos condiciones
        // 1 El remitente debe pertenecer a UCP
        // 2 El asunto debe contener la palabra "Examen"
        const filtro = new FiltroCorreo(
            'Examen UCP',
            correo =>
                correo.getRemitente().getEmail().endsWith('@ucp.edu.ar') &&
                correo.getAsunto().toLowerCase().includes('examen')
        );

        // Registramos el filtro
        gestor.agregarFiltro(filtro);

        // Creamos correos con distintas combinaciones de condiciones
        const correo1 = crearCorreo('Examen de Física', 'Contenido', 'ana@ucp.edu.ar');
        const correo2 = crearCorreo('Examen de Física', 'Contenido', 'juan@gmail.com');
        const correo3 = crearCorreo('Reunión', 'Contenido', 'maria@ucp.edu.ar');

        // Aplicamos el filtro
        const resultado = gestor.aplicarFiltro(
            'Examen UCP',
            [correo1, correo2, correo3]
        );

        // Solamente el primer correo cumple ambas condiciones asi que esperamos que devuelva el primer correo
        expect(resultado).toEqual([correo1]);
    });

    // TEST 6: Combinar condiciones mediante OR
    it('Rf5: Debe combinar condiciones utilizando OR', () => {

        const gestor = new GestorFiltros();// Creamos un gestor nuevo

        // El asunto debe contener "Proyecto" o "Reunion"
        // Con que se cumpla una de las dos condiciones es suficiente
        const filtro = new FiltroCorreo(
            'Seguimiento',
            correo =>
                correo.getAsunto().toLowerCase().includes('proyecto') ||
                correo.getAsunto().toLowerCase().includes('reunión')
        );

        gestor.agregarFiltro(filtro); // Registramos el filtro

        // Creamos tres correos con diferentes asuntos
        const correo1 = crearCorreo('Proyecto AE4', 'Contenido', 'ana@mail.com');
        const correo2 = crearCorreo('Reunión de equipo', 'Contenido', 'juan@mail.com');
        const correo3 = crearCorreo('Examen', 'Contenido', 'maria@mail.com');

        const resultado = gestor.aplicarFiltro( // Aplicamos el filtro
            'Seguimiento',
            [correo1, correo2, correo3]
        );

        // Los dos primeros cumplen al menos una condicion
        expect(resultado).toEqual([correo1, correo2]);
    });

    // TEST 7: Combinar condiciones mediante NOT y AND.
    it('Rf 5: Debe utilizar NOT para excluir correos leídos', () => {

        // Creamos un gestor nuevo
        const gestor = new GestorFiltros();

        // La condición exige que
        // 1 El correo NO esté leido
        // 2 Su contenido incluya la palabra "Entrega"
        const filtro = new FiltroCorreo(
            'Entregas pendientes',
            correo =>
                !correo.getLeido('destino@mail.com') &&
                correo.getContenido().toLowerCase().includes('entrega')
        );

        gestor.agregarFiltro(filtro);  // Registramos el filtro

         // Creamos dos correos
        const correo1 = crearCorreo(        
            'Actividad',
            'Entrega del trabajo práctico',
            'ana@mail.com'
        );

        const correo2 = crearCorreo(
            'Consulta',
            'Tengo una duda sobre la materia',
            'juan@mail.com'
        );

        // Aplicamos el filtro
        const resultado = gestor.aplicarFiltro(
            'Entregas pendientes',
            [correo1, correo2]
        );

        // Solamente el primero contiene "Entrega" y no esta leido
        expect(resultado).toEqual([correo1]); // se espera que se devuelva el primero
    });

     // TEST 8: Reutilizar una condicion en distintos filtros
    it('Rf5: Debe permitir reutilizar predicados para crear filtros', () => {

        // Creamos un gestor nuevo
        const gestor = new GestorFiltros();

        // Definimos una condición reutilizable:
        // comprueba si el remitente pertenece a UCP
        const esUCP = (correo: ICorreo): boolean =>
            correo.getRemitente().getEmail().endsWith('@ucp.edu.ar');

        // Creamos un filtro que utiliza directamente la condicion
        const filtroUCP = new FiltroCorreo(
            'Correos UCP',
            esUCP
        );

        // Creamos otro filtro que reutiliza la misma condicion
        // y agrega una segunda condición sobre el asunto
        const filtroExamen = new FiltroCorreo(
            'Examen UCP',
            correo =>
                esUCP(correo) &&
                correo.getAsunto().toLowerCase().includes('examen')
        );

        // Registramos ambos filtros
        gestor.agregarFiltro(filtroUCP);
        gestor.agregarFiltro(filtroExamen);

        // Creamos un correo que cumple ambas condiciones
        const correo = crearCorreo(
            'Examen de Física',
            'Contenido',
            'ana@ucp.edu.ar'
        );

        // Aplicamos el segundo filtro
        const resultado = gestor.aplicarFiltro('Examen UCP', [correo]);

        // Comprobamos que el correo sea devuelto
        expect(resultado).toEqual([correo]);
    });

    // TEST 9: Aplicar un mismo filtro sobre distintas colecciones
    it('Rf 5: Debe permitir aplicar el mismo filtro a diferentes colecciones', () => {

        const gestor = new GestorFiltros(); // Creamos un gestor nuevo

        // Creamos un filtro que busca correos de remitentes UCP
        const filtro = new FiltroCorreo(
            'Correos UCP',
            correo => correo.getRemitente().getEmail().endsWith('@ucp.edu.ar')
        );

        gestor.agregarFiltro(filtro); // Registramos el filtro una sola vez

        // Creamos correos para dos colecciones diferentes
        const correoEntrada = crearCorreo('Consulta', 'Contenido', 'ana@ucp.edu.ar');
        const correoEnviado = crearCorreo('Trabajo', 'Contenido', 'juan@gmail.com');

        // Aplicamos el mismo filtro sobre la primera coleccion
        const resultadoEntrada = gestor.aplicarFiltro(
            'Correos UCP',
            [correoEntrada]
        );

        // Aplicamos el mismo filtro sobre la segunda coleccion
        const resultadoEnviados = gestor.aplicarFiltro(
            'Correos UCP',
            [correoEnviado]
        );

        // Comprobamos los resultados de cada aplicacion
        expect(resultadoEntrada).toEqual([correoEntrada]);
        expect(resultadoEnviados).toEqual([]);
    });

    // TEST 10: No modificar la coleccion original
    it('Rf 5: No debe modificar el arreglo original al aplicar un filtro', () => {

        const gestor = new GestorFiltros();    // Creamos un gestor nuevo

        const filtro = new FiltroCorreo( // Creamos un filtro
            'Examen',
            correo => correo.getAsunto().toLowerCase().includes('examen')
        );

        gestor.agregarFiltro(filtro); // Registramos el filtro

        // Creamos dos correos y los guardamos en un arreglo
        const correo1 = crearCorreo('Examen', 'Contenido', 'ana@mail.com');
        const correo2 = crearCorreo('Reunión', 'Contenido', 'juan@mail.com');
        const correos = [correo1, correo2];

        // Guardamos una copia del arreglo antes de aplicar el filtro
        const copiaOriginal = [...correos];

        // Aplicamos el filtro
        const resultado = gestor.aplicarFiltro('Examen', correos);

        // Comprobamos que el arreglo original conserve sus elementos
        expect(correos).toEqual(copiaOriginal);

        // Comprobamos que el resultado sea un arreglo diferente
        expect(resultado).not.toBe(correos);

        // Comprobamos que el resultado contenga solamente un correo
        expect(resultado).toEqual([correo1]);
    });

    // TEST 11: Intentar aplicar un filtro que no existe
    it('Rf5: Debe generar un error si se aplica un filtro inexistente', () => {

        // Creamos un gestor nuevo sin filtros registrados
        const gestor = new GestorFiltros();

        // Intentamos aplicar un filtro que no existe
        expect(() => gestor.aplicarFiltro('Inexistente', []))
            .toThrow('No existe ese filtro.');
    });

    // TEST 12: Comprobar que cada gestor tenga sus propios filtros.
    it('Rf5: Cada instancia debe mantener sus propios filtros', () => {

        // Creamos dos gestores independientes
        const gestor1 = new GestorFiltros();
        const gestor2 = new GestorFiltros();

        const filtro = new FiltroCorreo('Examen', () => true); // Creamos un filtro

        // Registramos el filtro solamente en el primer gestor
        gestor1.agregarFiltro(filtro);

        // Comprobamos que el primer gestor tenga un filtro
        expect(gestor1.getFiltros()).toHaveLength(1);

        // Comprobamos que el segundo gestor no tenga filtros
        expect(gestor2.getFiltros()).toHaveLength(0);
    });

    it('Debe devolver un arreglo nuevo aunque todos los correos cumplan', () => {
    const gestor = new GestorFiltros();

    gestor.agregarFiltro(new FiltroCorreo('Todos', () => true));

    const correos = [
        crearCorreo('Examen', 'Contenido', 'ana@mail.com'),
        crearCorreo('Proyecto', 'Contenido', 'juan@mail.com')
    ];

    const resultado = gestor.aplicarFiltro('Todos', correos);

    expect(resultado).toEqual(correos);
    expect(resultado).not.toBe(correos);
});

it('No debe permitir modificar la colección interna mediante getFiltros', () => {
    const gestor = new GestorFiltros();

    gestor.agregarFiltro(new FiltroCorreo('Examen', () => true));

    const filtros = gestor.getFiltros();

    filtros.pop();

    expect(gestor.getFiltros()).toHaveLength(1);
});

it('No debe permitir nombres repetidos ignorando mayúsculas', () => {
    const gestor = new GestorFiltros();

    gestor.agregarFiltro(new FiltroCorreo('Examen', () => true));

    const filtro = new FiltroCorreo('EXAMEN', () => false);

    expect(() => gestor.agregarFiltro(filtro)).toThrow();
});

it('RF5: Los cambios en un correo se reflejan al volver a aplicar el filtro', () => {
    // un filtro de correos con "Proyecto" en el asunto y dos correos
    const gestor = new GestorFiltros();
    gestor.agregarFiltro(new FiltroCorreo('Proyectos', correo => correo.getAsunto().toLowerCase().includes('proyecto')));
    const correo1 = crearCorreo('Proyecto final', 'Contenido', 'ana@mail.com');
    const correo2 = crearCorreo('Consulta', 'Contenido', 'luis@mail.com');
    const bandeja = [correo1, correo2];

    // al principio solo cumple el primero
    expect(gestor.aplicarFiltro('Proyectos', bandeja)).toEqual([correo1]);

    // cambiamos el asunto del segundo correo
    correo2.cambiarAsunto('Proyecto nuevo');

    // comprobamos que el filtro lo encuentra sin volver a guardar nada, porque evalua el correo en el momento
    expect(gestor.aplicarFiltro('Proyectos', bandeja)).toEqual([correo1, correo2]);
    });

    it('RF5: No debe permitir crear un filtro sin nombre o sin condicion', () => {
    // el nombre no puede estar vacio
    expect(() => new FiltroCorreo('   ', () => true)).toThrow('El nombre del filtro es obligatorio.');

    // la condicion tiene que ser una funcion
    expect(() => new FiltroCorreo('Filtro', 'no es una funcion' as unknown as (correo: ICorreo) => boolean))
        .toThrow('La condición debe ser una función.');
    });
});