import { ICorreo } from './ICorreo';
import { BandejaEntrada } from './BandejaEntrada';
import { BandejaEnviados } from './BandejaEnviados';
import { BandejaBorradores } from './BandejaBorradores';
import { BandejaEliminados } from './BandejaEliminados';


// Administra los correos enviados
export class GestorCorreos {

    private readonly _enviados = new BandejaEnviados();
    private readonly _entrada = new BandejaEntrada(); //Bandeja de Entrada: correos que llegan
    private readonly _borradores = new BandejaBorradores();
    private readonly _eliminados = new BandejaEliminados();


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
        return this.buscarCorreos(this._entrada.getCorreos(), texto); //reutiliza la busqueda pasandole la Entrada
    }

   public buscarCorreos(correos: ICorreo[], texto: string): ICorreo[] {

    const busqueda = texto.trim().toLowerCase();

    
    if (!busqueda || !correos || correos.length === 0) {
        return [];
    }

    return correos.filter(correo => {

        const remitente = correo.getRemitente();
        const destinatarios = correo.getDestinatarios();

        // Buscamos en el asunto y contenido.
        const coincideAsunto =
            correo.getAsunto().toLowerCase().includes(busqueda);

        const coincideContenido =
            correo.getContenido().toLowerCase().includes(busqueda);

        // Buscamos en el nombre y email del remitente.
        const coincideRemitente =
            remitente.getNombre().toLowerCase().includes(busqueda) ||
            remitente.getEmail().toLowerCase().includes(busqueda);

        // Buscamos en el nombre y email de los destinatarios.
        const coincideDestinatario = destinatarios.some(destinatario =>
            destinatario.getNombre().toLowerCase().includes(busqueda) ||
            destinatario.getEmail().toLowerCase().includes(busqueda)
        );

        // Si coincide en al menos uno de los campos, incluimos el correo.
        return coincideAsunto ||
               coincideContenido ||
               coincideRemitente ||
               coincideDestinatario;
    });
   }

   
}


