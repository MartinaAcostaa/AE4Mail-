import { ICorreo } from './ICorreo';
import { BandejaEntrada } from './BandejaEntrada';
import { BandejaEnviados } from './BandejaEnviados';
import { BandejaBorradores } from './BandejaBorradores';
import { Buscador } from './Buscador';
import { BandejaEliminados } from './BandejaEliminados';
import { Correo } from './Correo';
import { IContacto } from './IContacto';


// Administra los correos enviados
export class GestorCorreos {

    private readonly _entradas = new Map<string, BandejaEntrada>();
    private readonly _enviados = new Map<string, BandejaEnviados>();
    private readonly _borradores = new Map<string, BandejaBorradores>();
    private readonly _eliminados = new Map<string, BandejaEliminados>();

    private readonly _buscador = new Buscador();

    private getBandejaEntradaUsuario(email: string): BandejaEntrada {
        const emailNorm = email.trim().toLowerCase();
        if (!this._entradas.has(emailNorm)) {
            this._entradas.set(emailNorm, new BandejaEntrada());
        }
        return this._entradas.get(emailNorm)!;
    }

    private getBandejaEnviadosUsuario(email: string): BandejaEnviados {
        const emailNorm = email.trim().toLowerCase();
        if (!this._enviados.has(emailNorm)) {
            this._enviados.set(emailNorm, new BandejaEnviados());
        }
        return this._enviados.get(emailNorm)!;
    }

    private getBandejaBorradoresUsuario(email: string): BandejaBorradores {
        const emailNorm = email.trim().toLowerCase();
        if (!this._borradores.has(emailNorm)) {
            this._borradores.set(emailNorm, new BandejaBorradores());
        }
        return this._borradores.get(emailNorm)!;
    }

    private getBandejaEliminadosUsuario(email: string): BandejaEliminados {
        const emailNorm = email.trim().toLowerCase();
        if (!this._eliminados.has(emailNorm)) {
            this._eliminados.set(emailNorm, new BandejaEliminados());
        }
        return this._eliminados.get(emailNorm)!;
    }


    public enviarCorreo(correo: ICorreo): void {
        // 1. Verificamos que exista el correo
        if (!correo) {
            throw new Error('El correo es obligatorio.');
        }

        // 2. Guardamos el remitente en la variable "remitente"
        const remitente = correo.getRemitente();
        if (!remitente) {
            throw new Error('El remitente es obligatorio.');
        }

        // 3. Verificamos que tenga asunto
        if (!correo.getAsunto() || correo.getAsunto().trim().length === 0) {
            throw new Error('El asunto es obligatorio.');
        }

        // 4. Verificamos que tenga destinatarios válidos
        const destinatarios = correo.getDestinatarios();
        if (
            !Array.isArray(destinatarios) ||
            destinatarios.length === 0 ||
            destinatarios.some(destinatario => destinatario == null)
        ) {
            throw new Error('Debe existir al menos un destinatario válido.');
        }

        // 5. Ahora sí podemos acceder a remitente.getEmail()
        const emailRemitente = remitente.getEmail();
        const enviadosRemitente = this.getBandejaEnviadosUsuario(emailRemitente);

        if (enviadosRemitente.contieneCorreo(correo)) {
            throw new Error('Este correo ya fue enviado.');
        }

        // Registramos en Enviados del remitente
        enviadosRemitente.agregarCorreo(correo);

        // Si estaba en borradores del remitente, se remueve
        const borradoresRemitente = this.getBandejaBorradoresUsuario(emailRemitente);
        if (borradoresRemitente.contieneCorreo(correo)) {
            borradoresRemitente.quitarCorreo(correo);
        }

        // Entregamos en la Entrada de cada destinatario
        for (const dest of destinatarios) {
            const entradaDestinatario = this.getBandejaEntradaUsuario(dest.getEmail());
            if (!entradaDestinatario.contieneCorreo(correo)) {
                entradaDestinatario.agregarCorreo(correo);
            }
        }
    }

    public recibirCorreo(correo: ICorreo, emailUsuario?: string): void {
        const email = emailUsuario ?? correo.getDestinatarios()[0]?.getEmail();
        if (!email) {
            throw new Error('Se requiere un destinatario para recibir el correo.');
        }
        this.getBandejaEntradaUsuario(email).agregarCorreo(correo);
    }

    // ------------------------------------------------------------------------
    // Gestión de Borradores
    // ------------------------------------------------------------------------
    public guardarBorrador(correo: ICorreo): void {
        const emailRemitente = correo.getRemitente().getEmail();
        this.getBandejaBorradoresUsuario(emailRemitente).agregarCorreo(correo);
    }

    public editarBorrador(borrador: Correo, asunto: string, contenido: string, destinatarios: IContacto[]): void {
        const emailRemitente = borrador.getRemitente().getEmail();
        const borradores = this.getBandejaBorradoresUsuario(emailRemitente);

        if (!borradores.contieneCorreo(borrador)) {
            throw new Error('Solo se pueden editar correos que están en Borradores.');
        }
        borrador.cambiarAsunto(asunto);
        borrador.cambiarContenido(contenido);
        borrador.cambiarDestinatarios(destinatarios);
    }

    // ------------------------------------------------------------------------
    // Consultas de Bandejas por Usuario
    // ------------------------------------------------------------------------
    public getEntrada(emailUsuario: string): ICorreo[] {
        return this.getBandejaEntradaUsuario(emailUsuario).getCorreos();
    }

    public getNoLeidosEntrada(emailUsuario: string): ICorreo[] {
    return this.getBandejaEntradaUsuario(emailUsuario)
        .getNoLeidos(emailUsuario);
    }

    public getEnviados(emailUsuario: string): ICorreo[] {
        return this.getBandejaEnviadosUsuario(emailUsuario).getCorreos();
    }

    public getBorradores(emailUsuario: string): ICorreo[] {
        return this.getBandejaBorradoresUsuario(emailUsuario).getCorreos();
    }

    public getEliminados(emailUsuario: string): ICorreo[] {
        return this.getBandejaEliminadosUsuario(emailUsuario).getCorreos();
    }

    // ------------------------------------------------------------------------
    // Eliminación y Restauración por Usuario
    // ------------------------------------------------------------------------
    public eliminarCorreo(correo: ICorreo, emailUsuario: string): void {
        const entrada = this.getBandejaEntradaUsuario(emailUsuario);
        const enviados = this.getBandejaEnviadosUsuario(emailUsuario);
        const borradores = this.getBandejaBorradoresUsuario(emailUsuario);
        const eliminados = this.getBandejaEliminadosUsuario(emailUsuario);

        if (entrada.contieneCorreo(correo)) {
            eliminados.eliminarDesde(correo, entrada);
            return;
        }

        if (enviados.contieneCorreo(correo)) {
            eliminados.eliminarDesde(correo, enviados);
            return;
        }

        if (borradores.contieneCorreo(correo)) {
            eliminados.eliminarDesde(correo, borradores);
            return;
        }

        throw new Error('El correo no pertenece a ninguna bandeja activa.');
    }

    public restaurarCorreo(correo: ICorreo, emailUsuario: string): void {
        const eliminados = this.getBandejaEliminadosUsuario(emailUsuario);
        eliminados.restaurarCorreo(correo);
    }

    // ------------------------------------------------------------------------
    // Búsquedas
    // ------------------------------------------------------------------------
    public buscarEnEntrada(emailUsuario: string, texto: string): ICorreo[] {
        const entrada = this.getBandejaEntradaUsuario(emailUsuario);
        return this._buscador.buscarEnEntrada(entrada, texto);
    }

    public buscarCorreos(correos: ICorreo[], texto: string): ICorreo[] {
        return this._buscador.buscarCorreos(correos, texto);
    }
 

}



