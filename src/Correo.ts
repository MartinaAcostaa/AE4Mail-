
import { IContacto } from './IContacto';
import { ICorreo } from './ICorreo';

export class Correo implements ICorreo {
  private static _siguienteId: number = 1; //para crear ids unicos a los correos, empieza en 1

  private readonly _id: number; //id unico del correo, readonly para que no se pueda modificar
  private readonly _asunto: string; 
  private readonly _contenido: string;
  private readonly _remitente: IContacto; //contacto que envia el correo
  private readonly _destinatarios: IContacto[]; //lista de contactos a los que se les envia el correo
  private readonly _fechaCreacion: Date;

  private _leido: boolean; //estado de lectura
  private _favorito: boolean; //si se marco como favorito

  
 constructor( //recibe asunt, contenido, remitente y destinatarios
    asunto: string,
    contenido: string,
    remitente: IContacto,
    destinatarios: IContacto[]
  ) 
  {
    if (!asunto || asunto.trim().length === 0) {
      throw new Error('El asunto es obligatorio.');} //valida si el asunto existe

    if (!contenido || contenido.trim().length === 0) {
      throw new Error('El contenido es obligatorio.');} //valida si hay contenido

    if (!remitente) {throw new Error('El remitente es obligatorio.');} //valida si hay remitente

    if (
      !Array.isArray(destinatarios) ||
      destinatarios.length === 0 ||
      destinatarios.some(destinatario => destinatario == null)
    ) {
      throw new Error('Debe existir al menos un destinatario válido.');
    } // Verificamos que los destinatarios sean un arreglo,
    // que haya por lo menos uno y que ninguno sea null o undefined

    this._id = Correo._siguienteId++; //asignamos el  id actual e incrementaos el contador
    this._asunto = asunto.trim(); //guarda el asuntio sin espacios al inicio ni al final
    this._contenido = contenido; //guarda el contenido tal cual
    this._remitente = remitente; //guarda la referencia al contacto que envia el correo
    this._destinatarios = [...destinatarios]; //creamos una copia del arreglo destinatarios para evitar que haya cabios en el arreglo original
    this._fechaCreacion = new Date();  //registra la fecha 

    this._leido = false; //todo correo nuevo esta no leido
    this._favorito = false; //todo correo nuevo esta sin ser favorito
  }
  
  
  public get id(): number {
    return this._id;
  }

  public getAsunto(): string {
    return this._asunto;
  }

  public getContenido(): string {
    return this._contenido;
  }

  public getRemitente(): IContacto {
    return this._remitente;
  }

  public getDestinatarios(): IContacto[] {
    return [...this._destinatarios]; //devuelve una copia de la lista de destinatarios 
    //asi quien llama al metodo no puede modificarlo directamente
  }

  public getLeido(): boolean {
    return this._leido;
  }

  public getFavorito(): boolean {
    return this._favorito;
  }

  //public getFechaCreacion(): Date {
   // return new Date(this._fechaCreacion.getTime());
  //}


}
