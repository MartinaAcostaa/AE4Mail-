import { IContacto } from './IContacto';

// representa la agenda, se encarga de administrar la coleccion de contactos 
export class GestorContactos {
    private readonly _contactos: IContacto[] = []; //lista de contactos, empiezan vacia
    //private: solo se modifica desde los metodos de esta clase
    //readonly: siempre es el mismo arreglo, aunque se le puedan agregar elementos

    public agregarContacto(contacto: IContacto): void { //recibe un contacto y no devuelve nada
        if (this.buscarContactoPorEmail (contacto.getEmail())) { //si ya existe un contacto con ese email
            throw new Error('Ya existe un contacto con ese email.'); //lo rechaza y no lo agrega
        }
        this._contactos.push(contacto); //agrega el contacto al final de la lista
    }

    public buscarContactoPorEmail(email: string): IContacto | undefined { //recibe un email y devuelve un contacto o undefined si no existe 
               const emailNormalizado = email.trim().toLowerCase(); //saca los espacios y lo pasa a minusculas, igual que hace Contacto
        return this._contactos.find(contacto => contacto.getEmail() === emailNormalizado);
        // find es una funcion de orden superior, recibe otra funcion como parametro
        // la lambda devuelve true o false para cada contacto
        // find devuelve el primer contacto cuyo email coincida con el email recibido, o undefined si no hay ninguno
    }

    public modificarContacto(emailActual: string, nuevoNombre: string, nuevoEmail: string): void { //recibe el mail actual para encontrarlo y los datos nuevos
        const contacto = this.buscarContactoPorEmail(emailActual); //busca el contacto que se quiere modificar
        if (!contacto) { //si no existe, buscar devolvio undefined
            throw new Error('No existe un contacto con ese email.');
        }
        contacto.cambiarNombre(nuevoNombre); //Contacto valida que el nombre no este vacio
        contacto.cambiarEmail(nuevoEmail); //Contacto valida el formato del mail
    }
}

