// Token que obtuviste de BotFather
const token = "7835890560:AAEGBMNnaRUppiao2nf8usuAxCeBNChwxdU";
const chat_id = "6738540551"; // Tu ID de chat personal o el grupo donde deseas recibir los mensajes

//Función para enviar el mensaje a Telegram
async function sendToTelegram() {
    // Obtener todos los formularios
    const formularios = document.querySelectorAll('.formulario-persona');
    let textoCompleto = '';
    
    try {
  formularios.forEach((formulario, index) => {

    // Obtener los valores de cada formulario
      const nombre = formulario.querySelector('.nombre').value;
      const asistencia = formulario.querySelector('.asistencia').value;
      const mensaje = formulario.querySelector('.mensaje').value;

      // Construir el texto para cada persona
      textoCompleto += `Nombre: ${nombre}\n`;
      textoCompleto += `Asistirá: ${asistencia}\n`;
      if (mensaje) {
          textoCompleto += `Mensaje especial: ${mensaje}\n`;
      }
      textoCompleto += `\n`; // Separador entre personas

    });


   // Codificar el mensaje para que sea compatible con URL
   const mensajeCompleto = encodeURIComponent(textoCompleto);
  
      console.log("Enviado a Telegram:", mensajeCompleto); // Imprime el payload
  
      const response = await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${mensajeCompleto}`
        
      );
      console.log("Mensaje enviado a Telegram", response.data);
    } catch (error) {
      console.error("Error al enviar mensaje a Telegram:", error);
    }
}
 
