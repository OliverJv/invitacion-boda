var elem = document.querySelector(".grid-container");
var msnry = new Masonry(elem, {
  itemSelector: ".grid-items",
  columnWidth: 160,
  gutter: 20,
  isFitWidth: true,
});

function PlayAudio() {
  document.getElementById("musica").play();
}

// Seleccionamos el audio o video que queremos controlar
const mediaElement = document.getElementById("musica"); // O puede ser miVideo

// Función para hacer el fade in (aumentar volumen)
function fadeIn(mediaElement) {
  mediaElement.play(); // Reproducimos el audio/video
}

// Escuchamos los cambios en la visibilidad de la página
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // Si la página está oculta, hacemos fade out
    mediaElement.pause();
    console.log(
      "El audio se ha pausado porque el usuario cambió de pestaña o minimizó la ventana"
    );
  } else {
    // Si la página vuelve a estar visible, hacemos fade in
    mediaElement.play();
    console.log("El audio se está reproduciendo de nuevo");
  }
});


function addPerson() {
  // Crear un nuevo formulario para otra persona
  const nuevoFormulario = document.createElement("div");
  nuevoFormulario.classList.add("formulario-persona");

  nuevoFormulario.innerHTML = `
      <div class="section__input">
          <label for="nombre">Nombre Completo</label>
          <input class="nombre" type="text" placeholder="Nombre y Apellido" required />
          <label for="asistencia">¿Asistirás?</label>
          <select class="asistencia" required>
              <option value="" disabled selected hidden>¿Asistirás?</option>
              <option value="Sí">Sí</option>
              <option value="No puedo">No podré ir</option>
          </select>
          <label for="mensaje">¿Quieres decirnos algo?</label>
          <textarea class="mensaje" placeholder="Escribe tu mensaje" rows="2" cols="10"></textarea>
      </div>
  `;

  document
    .getElementById("contenedor-formularios")
    .appendChild(nuevoFormulario);
}

// Función para enviar los datos
async function sendFormData() {
  const forms = document.querySelectorAll(".formulario-persona");
  const valuesToAppend = []; // Arreglo para almacenar los valores a enviar
  
  forms.forEach((form, index) => {
    const nombre = form.querySelector('input[type="text"]').value; // Nombre y Apellido
    const asistencia = form.querySelector("select").value; // Confirmación
    const mensaje = form.querySelector("textarea").value; // Mensaje

    // Agrega los valores al arreglo si los campos están llenos
    if (nombre && asistencia) {
      valuesToAppend.push([nombre, asistencia, mensaje]);
    }
  });

  try {
    // Llamada asincrónica a appendValues para enviar los datos a la hoja de cálculo
    await appendValues(
      "1pt8Lw2fP3_SX11WiXUxO4vFrBRuwX6HqdcQ11zCEBpk", // ID de la hoja de cálculo
      "Confirmacion!A:D", // Rango
      "RAW", // Opción de entrada
      valuesToAppend, // Datos a enviar
      (response) => {
        if (response.result.error) {
          console.error(
            "Error al agregar valores:",
            response.result.error.message
          );
        } else {
          console.log("Valores agregados exitosamente:", response);
        }
      }
    );

    // Una vez que los datos se envían a Google Sheets, envía el mensaje a WhatsApp
    // Enviar el mensaje a Telegram después de enviar a Google Sheets
    await sendToTelegram();
    // mensajeWhatsApp();

     // Mostrar el pop-up de agradecimiento con SweetAlert2
     Swal.fire({
      title: '¡Gracias por confirmarnos su asistencia!',
      text: 'Tu confirmación nos llegó correctamente.',
      icon: 'success',
      confirmButtonText: 'Cerrar'});

      clearForm();

  } catch (error) {
    console.error("Error en el envío de datos:", error);
  }
}


// Función para agregar valores a la hoja de cálculo
function appendValues(
  spreadsheetId,
  range,
  valueInputOption,
  values,
  callback
) {
  const body = { values: values };

  return gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: valueInputOption,
      resource: body,
    })
    .then((response) => {
      const result = response.result;
      console.log(`${result.updates.updatedCells} celdas agregadas.`);
      if (callback) callback(response);
    })
    .catch((err) => {
      console.error(err.message);
      throw err; // Lanza el error para manejarlo en la función llamante
    });
}

document.getElementById("submit-button").onclick = function () {
  const isSignedIn = gapi.client.getToken() !== null;
  if (!isSignedIn) {
    // Si no está autenticado, llama a la función de autenticación y luego envía los datos
    handleAuthClick()
  } else {
    // Si ya está autenticado, procede a enviar los datos directamente
    sendFormData();
  }
};



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
