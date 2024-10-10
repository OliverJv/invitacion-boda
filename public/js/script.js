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

let fadeInterval;

// Función para hacer el fade in (aumentar volumen)
function fadeIn(mediaElement) {
  let volume = 0; // Inicia en 0
  mediaElement.volume = volume; // Aseguramos que el volumen esté en 0
  mediaElement.play(); // Reproducimos el audio/video

  fadeInterval = setInterval(() => {
    if (volume < 1) {
      volume += 0.05; // Aumentamos el volumen gradualmente
      mediaElement.volume = volume.toFixed(2); // Ajustamos el volumen
    } else {
      clearInterval(fadeInterval); // Detenemos el intervalo cuando el volumen llega a 1
    }
  }, 100); // Cada 100ms aumentamos el volumen
}

// Función para hacer el fade out (disminuir volumen)
function fadeOut(mediaElement) {
  let volume = mediaElement.volume; // Tomamos el volumen actual
  fadeInterval = setInterval(() => {
    if (volume > 0) {
      volume -= 0.05; // Disminuimos el volumen gradualmente
      mediaElement.volume = volume.toFixed(2); // Ajustamos el volumen
    } else {
      clearInterval(fadeInterval); // Detenemos el intervalo cuando el volumen llega a 0
      mediaElement.pause(); // Pausamos el audio/video cuando el volumen es 0
    }
  }, 100); // Cada 100ms disminuimos el volumen
}

// Escuchamos los cambios en la visibilidad de la página
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // Si la página está oculta, hacemos fade out
    fadeOut(mediaElement);
    console.log(
      "El audio se ha pausado con fade out porque el usuario cambió de pestaña o minimizó la ventana"
    );
  } else {
    // Si la página vuelve a estar visible, hacemos fade in
    fadeIn(mediaElement);
    console.log("El audio se está reproduciendo de nuevo con fade in");
  }
});

async function listMajors() {
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1pt8Lw2fP3_SX11WiXUxO4vFrBRuwX6HqdcQ11zCEBpk",
      range: "Confirmacion!A2:D",
    });
  } catch (err) {
    console.log("Error: " + err);
    return;
  }

  const range = response.result;

  if (!range || !range.values || range.values.length == 0) {
    console.warn("No values found.");
    return;
  }

  console.log(range.values);

  // Flatten to string to display
  const output = range.values.reduce(
    (str, row) => `${str}${row[0]}, ${row[1]}, ${row[2]}\n`,
    "Name, Confirmation, Messages:\n"
  );
  document.getElementById("content").innerText = output;
}

/*function addPerson() {
  // Obtiene el contenedor de formularios
  const container = document.getElementById("form-container");

  // Crea un nuevo formulario
  const newForm = document.createElement("div");
  newForm.classList.add("section--asistencia", "section__input");

  newForm.innerHTML = `
    <label >Nombre Completo</label>
    <input type="text" placeholder="Nombre y Apellido" />
 
    <label for="asis">¿Asistirás?</label>
    <select required>
    <option value="" disabled selected hidden>¿Asistirás?</option>
<option value="si">Sí</option>
<option value="no">No podré ir</option>
</select>

   <label for="mens">¿Quieres decirnos algo?</label>
<textarea name="mensaje" placeholder="Escribe tu mensaje" rows="2" cols="10"></textarea>
</div>
`;

  // Añade el nuevo formulario al contenedor
  container.insertBefore(
    newForm,
    container.lastElementChild.previousElementSibling
  ); // Inserta antes del botón "Añadir otra persona"
}
*/
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

document.getElementById("submit-button").onclick = function () {
  const isSignedIn = gapi.client.getToken() !== null;

  if (!isSignedIn) {
    // Si no está autenticado, llama a la función de autenticación y luego envía los datos
    handleAuthClickAfterAuth();
  } else {
    // Si ya está autenticado, procede a enviar los datos directamente
    sendFormData();
  }

  mensajeWhatsApp();
};

/*
// Lógica para enviar datos
document.getElementById("submit-button").onclick = function () {
  const isSignedIn = gapi.client.getToken() !== null;

  if (!isSignedIn) {
    // Si no está autenticado, llama a la función de autenticación y luego envía los datos
    handleAuthClickAfterAuth();

     // Obtener todos los formularios
     const formularios = document.querySelectorAll('.formulario-persona');
     let textoCompleto = '';
 
     formularios.forEach((formulario, index) => {
         // Obtener los valores de cada formulario
         const nombre = formulario.querySelector('.nombre').value;
         const asistencia = formulario.querySelector('.asistencia').value;
         const mensaje = formulario.querySelector('.mensaje').value;
 
         // Construir el texto para cada persona
         textoCompleto += `Persona ${index + 1}:\n`;
         textoCompleto += `Nombre: ${nombre}\n`;
         textoCompleto += `Asistirá: ${asistencia}\n`;
         if (mensaje) {
             textoCompleto += `Mensaje especial: ${mensaje}\n`;
         }
         textoCompleto += `\n`; // Separador entre personas
     });
 
     // Definir el número de teléfono de WhatsApp al que se enviará el mensaje
     const telefono = '50671513239'; // Cambia este número por tu número de WhatsApp
 
     // Codificar el mensaje para que sea compatible con URL
     const mensajeWhatsApp = encodeURIComponent(textoCompleto);
 
     // Crear la URL de WhatsApp con el mensaje
     const url = `https://wa.me/${telefono}?text=${mensajeWhatsApp}`;
 
     // Redirigir a la URL para abrir WhatsApp
     window.open(url);
  } else {
    // Si ya está autenticado, procede a enviar los datos directamente
    sendFormData();
  }
};
*/

// Función para manejar la autenticación y luego enviar los datos
function handleAuthClickAfterAuth() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    // Una vez autenticado, procede a enviar los datos
    sendFormData();

  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

// Función para enviar los datos
function sendFormData() {
  mensajeWhatsApp(); 
  const forms = document.querySelectorAll(".section--asistencia");
  const valuesToAppend = []; // Arreglo para almacenar los valores a enviar

  forms.forEach((form, index) => {
    const nombre = form.querySelector('input[type="text"]').value; // Nombre y Apellido
    const asistencia = form.querySelector("select").value; // Confirmación
    const mensaje = form.querySelector("textarea").value; // Mensaje

    // Agrega los valores al arreglo
    valuesToAppend.push([nombre, asistencia, mensaje]);
  });

  // Llamada a appendValues para enviar los datos a la hoja de cálculo
  appendValues(
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
        listMajors();
        console.log("Valores agregados exitosamente:", response);
      }
    }
  );
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

  try {
    gapi.client.sheets.spreadsheets.values
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
      });
  } catch (err) {
    console.error(err.message);
  }
}
