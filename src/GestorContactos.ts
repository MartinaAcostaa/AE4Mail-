import { IContacto } from './IContacto';

// representa la agenda, se encarga de administrar la coleccion de contactos 
export class GestorContactos {
    private readonly _contactos: IContacto[] = []; //lista de contactos, empiezan vacia
    //private: solo se modifica desde los metodos de esta clase
    //readonly: siempre es el mismo arreglo, aunque se le puedan agregar elementos

    public agregarContacto(contacto: IContacto): void { //recibe un contacto y no devuelve nada
        this._contactos.push(contacto); //agrega el contacto al final de la lista
    }

    public buscarContactoPorEmail(email: string): IContacto | undefined { //recibe un email y devuelve un contacto o undefined si no existe 
               const emailNormalizado = email.trim().toLowerCase(); //saca los espacios y lo pasa a minusculas, igual que hace Contacto
        return this._contactos.find(contacto => contacto.getEmail() === emailNormalizado);
        // find es una funcion de orden superior, recibe otra funcion como parametro
        // la lambda devuelve true o false para cada contacto
        // find devuelve el primer contacto cuyo email coincida con el email recibido, o undefined si no hay ninguno
    }
}

