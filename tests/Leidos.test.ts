import { describe, it, expect } from 'vitest';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';
import { GestorCorreos } from '../src/GestorCorreos';

describe("RF-08: Marcar correos como leidos o no leidos", () => {

    it("Permite marcar un correo como leido y despues como no leido", () => {
        // un correo nuevo empieza como no leido
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);
        expect(correo.getLeido()).toBe(false);

        // lo marcamos como leido y despues otravez como no leido 
        correo.marcarComoLeido();
        expect(correo.getLeido()).toBe(true);
        correo.marcarComoNoLeido();
        expect(correo.getLeido()).toBe(false);
    });

    it("El estado de leido se mantiene al consultar la bandeja", () => {
        const gestor = new GestorCorreos();
        const ana = new Contacto('Ana', 'ana@mail.com');
        const luis = new Contacto('Luis', 'luis@mail.com');
        const correo = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);
        gestor.enviarCorreo(correo);
        
        // luis lo lee 
        correo.marcarComoLeido();

        // cuando luis consulta su bandeja de entrada, el correo sigue marcado como leido
        expect(gestor.getEntrada('luis@mail.com')[0].getLeido()).toBe(true);    
    });

    it("obtiene los correos no leidos de la Bandeja de Entrada de un usuario", () => {
    // Ana le envia tres correos a Luis
    const gestor = new GestorCorreos();
    const ana = new Contacto('Ana', 'ana@mail.com');
    const luis = new Contacto('Luis', 'luis@mail.com');
    const correo1 = new Correo('Reunion', 'Nos vemos el lunes', ana, [luis]);
    const correo2 = new Correo('Proyecto', 'Te paso el informe', ana, [luis]);
    const correo3 = new Correo('Examen', 'Estudiar el tema 3', ana, [luis]);
    gestor.enviarCorreo(correo1);
    gestor.enviarCorreo(correo2);
    gestor.enviarCorreo(correo3);

    // Luis lee solo el segundo
    correo2.marcarComoLeido();

    // Comprobamos que los no leidos son el primero y el tercero
    expect(gestor.getNoLeidosEntrada('luis@mail.com')).toEqual([correo1, correo3]);
    // la bandeja completa sigue teniendo los tres (no se modifico)
    expect(gestor.getEntrada('luis@mail.com')).toHaveLength(3);
    });
});