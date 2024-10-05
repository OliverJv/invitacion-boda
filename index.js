const express = require('express');
const app = require('./controller/app'); // Importa tu servidor Express

const port = process.env.PORT || 8085;

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
