import { describe, it, expect } from 'vitest';
import { BandejaEntrada } from '../src/BandejaEntrada';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';

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
});
