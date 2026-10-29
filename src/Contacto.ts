
import { IContacto } from './IContacto';

export class Contacto implements IContacto {
  private static _siguienteId: number = 1; //permite egenrar un id para cada contacto, comienza en 1

  private readonly _id: number; //id del contacto, readonly impide modificarlo
  private _nombre: string;
  private _email: string;

  constructor(nombre: string, email: string) { //recibe el nombre y el email
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El nombre es obligatorio.');
       //comprueba que el nombre exista y que no este vacio no que contenga solo espacios
    }

    const emailNormalizado = email.trim(); 
    // Elimina los espacios al principio y al final del email
    // Guardamos el resultado en una constante

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      throw new Error('El email no tiene un formato válido.');
    }

    this._id = Contacto._siguienteId++; //asigna el id actal a contacto y despues icrementa el contador para el proximo contacto
    this._nombre = nombre.trim(); //guarda el nombre sin espacios al inicio ni al final
    this._email = emailNormalizado.toLowerCase(); //guarda el email sin espacios y en minusculas
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



}
