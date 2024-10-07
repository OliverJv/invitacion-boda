/*document.addEventListener('DOMContentLoaded', function () {
    // Elemento donde se mostrarán las fotos
    const photosContainer = document.getElementById('photos');
    
    // Función para traer las fotos del servidor y mostrarlas en la sección
    async function loadPhotos() {
      try {
        const response = await fetch('/photos');
        const photos = await response.json();
  
        // Limpiar el contenedor antes de añadir las fotos
        photosContainer.innerHTML = '';
  
        // Iterar sobre las fotos y crear un elemento <img> para cada una
        photos.forEach(photo => {
          const imgElement = document.createElement('img');
          imgElement.src = photo.baseUrl;  // URL de la foto
          imgElement.alt = 'Foto del álbum';
          imgElement.style.width = '200px'; // Ajustar el tamaño de las fotos
          imgElement.style.margin = '10px'; // Añadir espacio entre las fotos
          photosContainer.appendChild(imgElement);
        });
      } catch (error) {
        console.error('Error cargando fotos:', error);
      }
    }
  
    // Función para manejar la subida de fotos (puedes hacer más lógica aquí)
    document.getElementById('uploadButton').addEventListener('click', async function () {
      // Lógica para subir una foto - podrías redirigir a la página de subida de Google Photos o abrir un diálogo
      alert('Aquí va la lógica para subir fotos');
    });
  
    // Cargar las fotos al cargar la página
    loadPhotos();
  });
  
  document.getElementById('uploadButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
  });
  
  document.getElementById('fileInput').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    
    if (file) {
      // Aquí iría la lógica para enviar la foto al backend
      alert('Foto seleccionada: ' + file.name);
    }
  });
*/

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

function addPerson() {
  // Obtiene el contenedor de formularios
  const container = document.getElementById("form-container");

  // Crea un nuevo formulario
  const newForm = document.createElement("div");
  newForm.classList.add("section--asistencia", "section__input");

  newForm.innerHTML = `
<input type="text" placeholder="Nombre y Apellido" />
<select required>
<option value="" disabled selected hidden>¿Asistirás?</option>
<option value="si">Sí</option>
<option value="no">No podré ir</option>
</select>
<textarea name="mensaje" placeholder="Escribe tu mensaje" rows="2" cols="10"></textarea>
</div>
`;

  // Añade el nuevo formulario al contenedor
  container.insertBefore(
    newForm,
    container.lastElementChild.previousElementSibling
  ); // Inserta antes del botón "Añadir otra persona"
}

// Lógica para enviar datos
document.getElementById("submit-button").onclick = function () {
  const isSignedIn = gapi.client.getToken() !== null;

  if (!isSignedIn) {
    // Si no está autenticado, llama a la función de autenticación y luego envía los datos
    handleAuthClickAfterAuth();
  } else {
    // Si ya está autenticado, procede a enviar los datos directamente
    sendFormData();
  }
};

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
