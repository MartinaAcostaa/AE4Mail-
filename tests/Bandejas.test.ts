import { describe, it, expect } from 'vitest';
import { BandejaEntrada } from '../src/BandejaEntrada';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';
import { BandejaEnviados } from '../src/BandejaEnviados';
import { BandejaBorradores } from '../src/BandejaBorradores';
import { BandejaEliminados } from '../src/BandejaEliminados';
import { ICorreo } from '../src/ICorreo';

describe('RF-06: Bandejas', () => {
    it("agrega un correo a la bandeja de entrada y lo consulta", () => {
        //preparar: una bandeja de entrada vacia y un correo
        const entrada = new BandejaEntrada()
        const ana = new Contacto('Ana', 'ana@mail.com')
        const luis = new Contacto('Luis', 'luis@mail.com')
        const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);

        // agregamos el correo a la bandeja
        entrada.agregarCorreo(correo);

        // comprobamos que el correo esta en la bandeja
        expect(entrada.getCorreos()).toEqual([correo]);

        // getCorreos devuelve una copia, modificarla no cambia la bandeja original
        entrada.getCorreos().pop();
        expect(entrada.getCorreos()).toHaveLength(1);
    });

    it ("no permite agregar un correo que ya esta en la bandeja", () => {
        // una bandeja que ya tiene el correo 
        const entrada = new BandejaEntrada()
        const ana = new Contacto('Ana', 'ana@mail.com')
        const luis = new Contacto('Luis', 'luis@mail.com')
        const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);
        entrada.agregarCorreo(correo);

        // intentar agregar el mismo correo lanza un error
        expect(() => entrada.agregarCorreo(correo)).toThrow();

        // y la bandeja sigue teniendo solo un correo
        expect(entrada.getCorreos()).toHaveLength(1);
        expect(entrada.contieneCorreo(correo)).toBe(true);
    });

    it ("quita un correo de la bandeja" , () => {
        // una bandeja con dos correos 
        const entrada = new BandejaEntrada()
        const ana = new Contacto('Ana', 'ana@mail.com')
        const luis = new Contacto('Luis', 'luis@mail.com')
        const correo1 = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);
        const correo2 = new Correo('Proyecto', 'Te paso el informe', luis, [ana]);
        entrada.agregarCorreo(correo1);
        entrada.agregarCorreo(correo2);

        // quitamos el primer correo de la bandeja
        entrada.quitarCorreo(correo1);

        // comprobamos que solo quede el segundo correo
        expect(entrada.getCorreos()).toEqual([correo2]);
        expect(entrada.contieneCorreo(correo1)).toBe(false);
    });

    it ("no permite quitar un correo que no esta en la bandeja" , () => {
        // una bandeja con un correo , y otro correo que no esta en la bandeja
        const entrada = new BandejaEntrada()
        const ana = new Contacto('Ana', 'ana@mail.com')
        const luis = new Contacto('Luis', 'luis@mail.com')
        const guardado = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);
        const otro = new Correo('Proyecto', 'Te paso el informe', luis, [ana]);
        entrada.agregarCorreo(guardado);

        // intentar quitar el otro correo lanza un error
        expect(() => entrada.quitarCorreo(otro)).toThrow();

        // y la bandeja sigue teniendo solo el correo guardado
        expect(entrada.getCorreos()).toEqual([guardado]);
    });

    it ("la Bandeja de Enviados acepta correos completos y rechaza los incompletos" , () => {
        //bandeja de enviados y un correo completo 
        const enviados = new BandejaEnviados()
        const ana = new Contacto('Ana', 'ana@mail.com')
        const luis = new Contacto('Luis', 'luis@mail.com')
        const correoCompleto = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);

        //como correo no deja crear correos incompletos, armamos objetos de pruebas
        // que cumplen la interfaz ICorreo pero les falta el asunto o el destinatario
        const correoSinAsunto: ICorreo = {
            id: 1001,
            getAsunto: () => '',
            getContenido: () => 'Hola',
            getRemitente: () => ana,
            getDestinatarios: () => [luis],
            getLeido: () => false,
            getFavorito: () => false
        };

        const correoSinDestinatarios: ICorreo = {
            id: 1002,
            getAsunto: () => 'Reunion',
            getContenido: () => 'Hola',
            getRemitente: () => ana,
            getDestinatarios: () => [],
            getLeido: () => false,
            getFavorito: () => false
        };

        // el completo se agrega , los incompletos lanzan error
        enviados.agregarCorreo(correoCompleto);
        expect(enviados.getCorreos()).toEqual([correoCompleto]);
        expect(() => enviados.agregarCorreo(correoSinAsunto)).toThrow();
        expect(() => enviados.agregarCorreo(correoSinDestinatarios)).toThrow();
        expect(enviados.getCorreos()).toEqual([correoCompleto]);
    });

    it ("La Bandeja de Borradores acepta correos incompletos" , () => {
        // bandeja de borradores y un correo que le falta el asunto
        const borradores = new BandejaBorradores()
        const ana = new Contacto('Ana', 'ana@mail.com')
        const sinAsunto: ICorreo = {
        id: 2001,
        getAsunto: () => '',
        getContenido: () => 'Todavia lo estoy escribiendo',
        getRemitente: () => ana,
        getDestinatarios: () => [],
        getLeido: () => false,
        getFavorito: () => false,
    };

    // lo guardamos como borrador 
    borradores.agregarCorreo(sinAsunto);

    // y comprobamos que esta en la bandeja
    expect(borradores.getCorreos()).toEqual([sinAsunto]);
    });

    it ("Elimina un correo de su bandeja y lo pasa a Eliminados" , () => {
        // bandeja de entrada con un correo
        const entrada = new BandejaEntrada()
        const eliminados = new BandejaEliminados()
        const ana = new Contacto('Ana', 'ana@mail.com')
        const luis = new Contacto('Luis', 'luis@mail.com')
        const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);
        entrada.agregarCorreo(correo);

        // lo eliminamos indicando de que bandeja sale 
        eliminados.eliminarDesde(correo, entrada);

        // comprobamos que ya no esta en la bandeja original y si en Eliminados
        expect(entrada.contieneCorreo(correo)).toBe(false);
        expect(eliminados.getCorreos()).toEqual([correo]);
    });

    it ("restaura un correo de Eliminados a su bandeja original" , () => {
    // un correo de la Entrada y otro de Enviados, los dos eliminados
    const entrada = new BandejaEntrada();
    const enviados = new BandejaEnviados();
    const eliminados = new BandejaEliminados();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const recibido = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);
    const enviado = new Correo('Proyecto', 'Te paso el informe', luis, [ana]);
    entrada.agregarCorreo(recibido);
    enviados.agregarCorreo(enviado);
    eliminados.eliminarDesde(recibido, entrada);
    eliminados.eliminarDesde(enviado, enviados);

    // restauramos los dos 
    eliminados.restaurarCorreo(recibido);
    eliminados.restaurarCorreo(enviado);

    // comprobamos que ya no estan en Eliminados y si en sus bandejas originales
    expect(entrada.getCorreos()).toEqual([recibido]);
    expect(enviados.getCorreos()).toEqual([enviado]);
    expect(eliminados.getCorreos()).toEqual([]);
    });

    it('no permite restaurar un correo que no esta en Eliminados', () => {
    const eliminados = new BandejaEliminados();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);

    expect(() => eliminados.restaurarCorreo(correo)).toThrow();
    });

it('no permite modificar la bandeja Eliminados mediante getCorreos', () => {
    const entrada = new BandejaEntrada();
    const eliminados = new BandejaEliminados();

    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);

    entrada.agregarCorreo(correo);
    eliminados.eliminarDesde(correo, entrada);

    eliminados.getCorreos().pop();

    expect(eliminados.getCorreos()).toHaveLength(1);
});

it('no permite eliminar dos veces el mismo correo', () => {
    const entrada = new BandejaEntrada();
    const eliminados = new BandejaEliminados();

    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);

    entrada.agregarCorreo(correo);
    eliminados.eliminarDesde(correo, entrada);

    expect(() => eliminados.eliminarDesde(correo, entrada)).toThrow();

    expect(eliminados.getCorreos()).toEqual([correo]);
});

it('no permite modificar la bandeja Eliminados mediante getCorreos', () => {
    const entrada = new BandejaEntrada();
    const eliminados = new BandejaEliminados();

    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);

    entrada.agregarCorreo(correo);
    eliminados.eliminarDesde(correo, entrada);

    eliminados.getCorreos().pop();

    expect(eliminados.getCorreos()).toHaveLength(1);
});

it('getCorreos de Borradores devuelve una copia', () => {
    const borradores = new BandejaBorradores();
    const ana = new Contacto('Ana', 'ana@mail.com');

    const correo: ICorreo = {
        id: 2002,
        getAsunto: () => '',
        getContenido: () => 'Borrador',
        getRemitente: () => ana,
        getDestinatarios: () => [],
        getLeido: () => false,
        getFavorito: () => false
    };

    borradores.agregarCorreo(correo);

    const copia = borradores.getCorreos();
    copia.pop();

    expect(borradores.getCorreos()).toHaveLength(1);
});

it('restaura un correo eliminado desde Borradores', () => {
    const borradores = new BandejaBorradores();
    const eliminados = new BandejaEliminados();
    const ana = new Contacto('Ana', 'ana@mail.com');

    const correo: ICorreo = {
        id: 3001,
        getAsunto: () => '',
        getContenido: () => 'Borrador pendiente',
        getRemitente: () => ana,
        getDestinatarios: () => [],
        getLeido: () => false,
        getFavorito: () => false
    };

    borradores.agregarCorreo(correo);
    eliminados.eliminarDesde(correo, borradores);
    eliminados.restaurarCorreo(correo);

    expect(borradores.getCorreos()).toEqual([correo]);
    expect(eliminados.getCorreos()).toHaveLength(0);
});

});
