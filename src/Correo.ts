
import { IContacto } from './IContacto';
import { ICorreo } from './ICorreo';

export class Correo implements ICorreo {
  private static _siguienteId: number = 1;

  private readonly _id: number;
  private readonly _asunto: string;
  private readonly _contenido: string;
  private readonly _remitente: IContacto;
  private readonly _destinatarios: IContacto[];
  private readonly _fechaCreacion: Date;

  private _leido: boolean;
  private _favorito: boolean;

  
 constructor(
    asunto: string,
    contenido: string,
    remitente: IContacto,
    destinatarios: IContacto[]
  ) 
  {
    if (!asunto || asunto.trim().length === 0) {
      throw new Error('El asunto es obligatorio.');}

    if (!contenido || contenido.trim().length === 0) {
      throw new Error('El contenido es obligatorio.');}

    if (!remitente) {throw new Error('El remitente es obligatorio.');}

    if (
      !Array.isArray(destinatarios) ||
      destinatarios.length === 0 ||
      destinatarios.some(destinatario => destinatario == null)
    ) {
      throw new Error('Debe existir al menos un destinatario válido.');
    }

    this._id = Correo._siguienteId++;
    this._asunto = asunto.trim();
    this._contenido = contenido;
    this._remitente = remitente;
    this._destinatarios = [...destinatarios];
    this._fechaCreacion = new Date();

    this._leido = false;
    this._favorito = false;
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
    return [...this._destinatarios];
  }

  public getLeido(): boolean {
    return this._leido;
  }

  public getFavorito(): boolean {
    return this._favorito;
  }

  public getFechaCreacion(): Date {
    return new Date(this._fechaCreacion.getTime());
  }


}
