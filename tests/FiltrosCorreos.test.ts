
import { Contacto } from '../src/Contacto';
import { Correo } from '../src/Correo';

// Funcion que crea un correo para utilizar en las pruebas
function crearCorreo( // llama al metodo para crear un correo y le pasa asunto, contenido y el email del remitente
    asunto: string,
    contenido: string,
    emailRemitente: string
): Correo { //el correo pone el remitente y el destinatario correspondientemente
    const remitente = new Contacto('Remitente', emailRemitente);
    const destinatario = new Contacto('Destinatario', 'destino@mail.com');

    return new Correo( // la funcion devuelve un nuevo correo con asunto, contenido, remitente y destinatario
        asunto,
        contenido,
        remitente,
        [destinatario]
    );
}