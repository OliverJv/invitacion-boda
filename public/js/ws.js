/*document.getElementById('submit-button').addEventListener('click', function() {
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
});*/