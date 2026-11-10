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

        // Verificamos que exista el correo
        if (!correo) {
            throw new Error('El correo es obligatorio.');
        }

        // Verificamos que tenga remitente
        if (!correo.getRemitente()) {
            throw new Error('El remitente es obligatorio.');
        }

        // Verificamos que tenga asunto
        if (!correo.getAsunto() || correo.getAsunto().trim().length === 0) {
            throw new Error('El asunto es obligatorio.');
        }

        
        // Verificamos que tenga al menos un destinatario valido
        const destinatarios = correo.getDestinatarios();
        if (
            !Array.isArray(destinatarios) || //comprueba si la variable destinatarios es un arreglo
            destinatarios.length === 0 || // /comprueba si la lista de destinatarios no tiene ningun elemento, si la lista esta vacia no tiene  ningun elemento
            destinatarios.some(destinatario => destinatario == null) //recorre los elementos del arreglo  comprueba si al menos uno es null o undefined
            //si al menos uno cumple la conducion devuelve true
        ) {
            throw new Error('Debe existir al menos un destinatario válido.'); //si la condicion se cumple (devuelve true) se genera el error
        }

        
        // Ahora sí: "remitente" existe y podemos llamar a getEmail()
        const emailRemitente = remitente.getEmail();
        const enviadosRemitente = this.getBandejaEnviadosUsuario(emailRemitente);


        if (enviadosRemitente.contieneCorreo(correo)) {
            throw new Error('Este correo ya fue enviado.');
        }

        enviadosRemitente.agregarCorreo(correo);

        // Si estaba en borradores del remitente, se quita
        const borradoresRemitente = this.getBandejaBorradoresUsuario(emailRemitente);
        if (borradoresRemitente.contieneCorreo(correo)) {
            borradoresRemitente.quitarCorreo(correo);
        }

        // Deposita el correo en la Bandeja de Entrada de cada destinatario
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



    public getEnviados(): ICorreo[] {
        return this._enviados.getCorreos();
    }

    public getBorradores(): ICorreo[] {
        return this._borradores.getCorreos();
    }

    public getEliminados(): ICorreo[] {
        return this._eliminados.getCorreos();
    }

    public eliminarCorreo(correo: ICorreo): void {
        if (this._entrada.contieneCorreo(correo)) {
            this._eliminados.eliminarDesde(correo, this._entrada);
            return;
        }

        if (this._enviados.contieneCorreo(correo)) {
            this._eliminados.eliminarDesde(correo, this._enviados);
            return;
        }

        if (this._borradores.contieneCorreo(correo)) {
            this._eliminados.eliminarDesde(correo, this._borradores);
            return;
        }

        throw new Error('El correo no pertenece a ninguna bandeja activa.');
    }

    public restaurarCorreo(correo: ICorreo): void {
        this._eliminados.restaurarCorreo(correo);
    }
 
    public recibirCorreo(correo: ICorreo): void { //simula que llega un correo (no hay servidor real)
        this._entrada.agregarCorreo(correo); //lo guarda en la Bandeja de Entrada
    }

    public getEntrada(): ICorreo[] { //devuelve una copia para que no se modifique la bandeja desde afuera
        return this._entrada.getCorreos();
    }
    public buscarEnEntrada(texto: string): ICorreo[] { //busca solo en la Bandeja de Entrada, como pide RF-04
        return this._buscador.buscarEnEntrada(this._entrada, texto); //le delega la busqueda al Buscador
    }

    public buscarCorreos(correos: ICorreo[], texto: string): ICorreo[] { //busca en cualquier coleccion
        return this._buscador.buscarCorreos(correos, texto); //le delega la busqueda al Buscador
    }
}



