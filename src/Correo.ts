
import { IContacto } from './IContacto';
import { ICorreo } from './ICorreo';

export class Correo implements ICorreo {
  private static _siguienteId: number = 1; //para crear ids unicos a los correos, empieza en 1

  private readonly _id: number; //id unico del correo, readonly para que no se pueda modificar
  private _asunto: string; //sin readonly se puede editar mientras es borrador 
  private _contenido: string;
  private readonly _remitente: IContacto; //contacto que envia el correo
  private _destinatarios: IContacto[]; //lista de contactos a los que se les envia el correo
  //private readonly _fechaCreacion: Date;

  private _favoritos: Map<string, boolean> = new Map();

//private _leido: boolean; // mantiene compatibilidad con las operaciones anteriores
//private _lecturas: Map<string, boolean> = new Map();  
private _lecturas: Map<string, boolean> = new Map();

  
 constructor( //recibe asunt, contenido, remitente y destinatarios
    asunto: string,
    contenido: string,
    remitente: IContacto,
    destinatarios: IContacto[]
  ) 
  {
    // un correo puede crearse incompleto porque puede ser un borrador (RF-07)
    // lo unico obligatorio es el remitente, quien escribe el correo siemore existe
    // la validacion para enviar (asunto y destinatarios) la hace la Bandeja de Enviados
    if (!remitente) {throw new Error('El remitente es obligatorio.');} //valida si hay remitente

    if (!Array.isArray(destinatarios) || destinatarios.some(destinatario => destinatario == null)) {
      throw new Error('Los destinatarios deben ser contactos validos' ); 
    } // la lista puede estar vacia, pero si tiene destinatarios ninguno puede ser null o undefined

    this._id = Correo._siguienteId++; //asignamos el  id actual e incrementaos el contador
    this._asunto = asunto.trim(); //guarda el asuntio sin espacios al inicio ni al final
    this._contenido = contenido; //guarda el contenido tal cual
    this._remitente = remitente; //guarda la referencia al contacto que envia el correo
    this._destinatarios = [...destinatarios]; //creamos una copia del arreglo destinatarios para evitar que haya cabios en el arreglo original
    //this._fechaCreacion = new Date();  //registra la fecha 

    //this._leido = false; //todo correo nuevo esta no leido
    
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

  // Obtiene el estado de lectura de un usuario determinado
public getLeido(emailUsuario?: string): boolean {
    if (!emailUsuario) {
        return this._leido;
    }

    const email = emailUsuario.trim().toLowerCase();

    return this._lecturas.get(email) ?? this._leido;
  }
// Marca el correo como leído
public marcarComoLeido(emailUsuario?: string): void {
    if (!emailUsuario) {
        this._leido = true;
        return;
    }

    const email = emailUsuario.trim().toLowerCase();
    this._lecturas.set(email, true);
}

// Marca el correo como no leído
public marcarComoNoLeido(emailUsuario?: string): void {
    if (!emailUsuario) {
        this._leido = false;
        return;
    }

    const email = emailUsuario.trim().toLowerCase();
    this._lecturas.set(email, false);
}


  //metodos para editar un borrador (RF-07)
  public cambiarAsunto(nuevoAsunto: string): void {
    this._asunto = nuevoAsunto.trim(); //guarda el asunto sin espacios al inicio ni al final
  }
 
  public cambiarContenido(nuevoContenido: string): void {
    this._contenido = nuevoContenido; //guarda el contenido tal cual
  }

  public cambiarDestinatarios(nuevosDestinatarios: IContacto[]): void {
    if (!Array.isArray(nuevosDestinatarios) || nuevosDestinatarios.some(destinatario => destinatario == null)) {
      throw new Error('Los destinatarios deben ser contactos validos'); //misma regla que en el constructor
    }
    this._destinatarios = [...nuevosDestinatarios]; //guarda una copia, igual que el constructor
  }

  public getFavorito(emailUsuario: string): boolean {
    const email = emailUsuario.trim().toLowerCase();
    return this._favoritos.get(email) ?? false;
}

public marcarComoFavorito(emailUsuario: string): void {
    const email = emailUsuario.trim().toLowerCase();
    this._favoritos.set(email, true);
}

public quitarComoFavorito(emailUsuario: string): void {
    const email = emailUsuario.trim().toLowerCase();
    this._favoritos.set(email, false);
}
  


}
