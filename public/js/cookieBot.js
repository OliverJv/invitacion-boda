// Token que obtuviste de BotFather
const token = "7835890560:AAEGBMNnaRUppiao2nf8usuAxCeBNChwxdU";
const chat_id = "6738540551"; // Tu ID de chat personal o el grupo donde deseas recibir los mensajes

//Función para enviar el mensaje a Telegram
async function sendToTelegram(event) {
  event.preventDefault();

  // Obtener todos los formularios
  const formularios = document.querySelectorAll(".formulario-persona");
  let textoCompleto = "";

  try {
    formularios.forEach((formulario, index) => {
      // Obtener los valores de cada formulario
      const nombre = formulario.querySelector(".nombre").value;
      const asistencia = formulario.querySelector(".asistencia").value;
      const mensaje = formulario.querySelector(".mensaje").value;

       // Validación básica (asegurarse de que el nombre y la asistencia estén llenos)
       if (!nombre || !asistencia) {
        throw new Error("Por favor, llena todos los campos obligatorios.");
      }

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
      `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=¡Hola!, quiero confirmar:%0A${mensajeCompleto}`
    );
    console.log("Valores agregados exitosamente:", response);
    Swal.fire({
      title: "¡Gracias por confirmarnos su asistencia!",
      text: "Tu confirmación nos llegó correctamente.",
      icon: "success",
      confirmButtonText: "Cerrar",
    });
    clearForm();

  } catch (error) {
    Swal.fire({
      title: "¡Lo sentimos!",
      text: "Por favor revisa los datos ingresados e intentalo nuevamente o comunicate al: 7151-3239 " + error,
      icon: "error",
      confirmButtonText: "Cerrar",
    });
    console.error("Error al enviar mensaje a Telegram:", error);
  }
}

function clearForm() {
  // Obtener todos los formularios y eliminar los adicionales
  const formularios = document.querySelectorAll(".formulario-persona");
  formularios.forEach((formulario, index) => {
    if (index > 0) {
      formulario.remove(); // Eliminar formularios adicionales
    } else {
      // Limpiar el primer formulario
      formulario.querySelector(".nombre").value = "";
      formulario.querySelector(".asistencia").selectedIndex = 0; // Reiniciar el select
      formulario.querySelector(".mensaje").value = ""; // Limpiar el textarea
    }
  });
}

// Asignar la función al botón de enviar
document.getElementById("submit-button").addEventListener("click", sendToTelegram);