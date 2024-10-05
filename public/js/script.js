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
    // options
    itemSelector: ".grid-item",
    columnWidth: 300,
  });


