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
                new FiltroCorreo(`Filtro ${i}`, correo => true)
            );
        }

        // Intentamos registrar un sexto filtro
        const sextoFiltro = new FiltroCorreo('Filtro 6', correo => true);

        // Comprobamos que se produzca un error
        expect(() => gestor.agregarFiltro(sextoFiltro))
            .toThrow('No se pueden agregar más de cinco filtros.');
    });
});