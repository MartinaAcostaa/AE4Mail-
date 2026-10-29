
import { IContacto } from './IContacto';

export class Contacto implements IContacto {
  private static _siguienteId: number = 1;

  private readonly _id: number;
  private _nombre: string;
  private _email: string;

  constructor(nombre: string, email: string) {
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El nombre es obligatorio.');
    }

    const emailNormalizado = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      throw new Error('El email no tiene un formato válido.');
    }

    this._id = Contacto._siguienteId++;
    this._nombre = nombre.trim();
    this._email = emailNormalizado.toLowerCase();
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
