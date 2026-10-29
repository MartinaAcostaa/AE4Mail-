
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

}
