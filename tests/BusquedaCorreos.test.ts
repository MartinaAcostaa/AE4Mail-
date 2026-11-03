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
    gestor.recibirCorreo(correo);

    // comprobar: esta en la Entrada y es el mismo objeto
    expect(gestor.getEntrada()).toHaveLength(1);
    expect(gestor.getEntrada()[0]).toBe(correo);

    // la Entrada devuelve una copia: modificarla no cambia la bandeja original
    gestor.getEntrada().pop();
    expect(gestor.getEntrada()).toHaveLength(1);
    });

    it('busca solo en los correos de la Bandeja de Entrada', () => {
    // un correo que llega a la Entrada y otro que se envia (va a Enviados)
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const recibido = new Correo('Proyecto final', 'Te paso el informe', ana, [luis]);
    const enviado = new Correo('Proyecto nuevo', 'Arrancamos el lunes', luis, [ana]);
    gestor.recibirCorreo(recibido);
    gestor.enviarCorreo(enviado);

    // buscamos un texto que esta en los dos correos
    const resultado = gestor.buscarEnEntrada('proyecto');

    // solo encuentra el de la Entrada, no el de Enviados
    expect(resultado).toEqual([recibido]);
    });
});