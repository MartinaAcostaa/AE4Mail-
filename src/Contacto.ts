
import { IContacto } from './IContacto';

export class Contacto implements IContacto {
  private static _siguienteId: number = 1; //permite egenrar un id para cada contacto, comienza en 1

  private readonly _id: number; //id del contacto, readonly impide modificarlo
  private _nombre: string;
  private _email: string;

  constructor(nombre: string, email: string) { //recibe el nombre y el email
    this._nombre = Contacto.validarNombre(nombre); //valida el nombre y lo guarda sin espacios
    this._email = Contacto.validarEmail(email); //valida el email y lo guarda sin espacios y en minusculas
    this._id = Contacto._siguienteId++; //asigna el id actual al contacto y despues incrementa el contador para el proximo
  }
  
  public get id(): number {
    return this._id;
  }

  public getNombre(): string {
    return this._nombre;
  }

  public getEmail(): string {
    return this._email;
  }

  public cambiarNombre(nuevoNombre: string): void { //recibe el nombre nuevo y no devuelve nada
       this._nombre = Contacto.validarNombre(nuevoNombre); //usa la misma validacion que el constructor
  }

  private static validarNombre(nombre: string): string { //valida el nombre y lo devuelve listo para guardar 
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El nombre es obligatorio.'); //no puede estar vacio ni contener solo espacios
    }
    return nombre.trim(); //devuelve el nombre sin espacios al inicio ni al final
  }

  private static validarEmail(email: string): string { //valida el email y lo devuelve listo para guardar
    const emailNormalizado = email.trim().toLowerCase(); //saca los espacios y lo pasa a minusculas
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      throw new Error('El email no tiene un formato válido.'); //texto@texto.texto, sin espacios
    }
    return emailNormalizado;
  }

}
