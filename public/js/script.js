var elem = document.querySelector(".grid-container");
var msnry = new Masonry(elem, {
  itemSelector: ".grid-items",
  columnWidth: 160,
  gutter: 20,
  isFitWidth: true,
});

// Seleccionamos el audio o video que queremos controlar
const mediaElement = document.getElementById("musica"); // O puede ser miVideo

function PlayAudio() {
  document.getElementById("musica").play();
}

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
