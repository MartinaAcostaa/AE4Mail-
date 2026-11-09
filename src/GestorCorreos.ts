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

    private readonly _enviados = new BandejaEnviados();
    private readonly _entrada = new BandejaEntrada(); //Bandeja de Entrada: correos que llegan
    private readonly _borradores = new BandejaBorradores();
    private readonly _eliminados = new BandejaEliminados();
    private readonly _buscador = new Buscador(); //la logica de busqueda esta en su propia clase


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

        // Verificamos que el correo no haya sido enviado anteriormente
        const yaEnviado = this._enviados.contieneCorreo(correo);

        if (yaEnviado) { // Si ya fue enviado lanza error
            throw new Error('Este correo ya fue enviado.');}

         // Registramos el correo en la Bandeja de Enviados
        this._enviados.agregarCorreo(correo);

        // Si estaba guardado como borrador, lo quitamos al enviarlo.
        if (this._borradores.contieneCorreo(correo)) {
            this._borradores.quitarCorreo(correo);
        }


    }

    public getEnviados(): ICorreo[] {
        return this._enviados.getCorreos();
    }

    public guardarBorrador(correo: ICorreo): void {
        this._borradores.agregarCorreo(correo);
    }

    public editarBorrador(borrador: Correo, asunto: string, contenido: string, destinatarios: IContacto[]): void { //edita un correo que esta en Borradores
        if (!this._borradores.contieneCorreo(borrador)) { //solo se pueden editar los borradores
            throw new Error('Solo se pueden editar correos que están en Borradores.');
        }
        borrador.cambiarAsunto(asunto); //el gestor le pide al correo que se modifique
        borrador.cambiarContenido(contenido);
        borrador.cambiarDestinatarios(destinatarios);
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



