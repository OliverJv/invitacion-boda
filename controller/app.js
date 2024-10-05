const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const OAuth2Data = require('./config/config.json'); // Cargar tus credenciales

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URI = 'http://localhost:8085/oauthcallback'; // Asegúrate que este URI esté configurado en Google Console

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Variables globales para el acceso al token
let authed = false;

app.get('/', (req, res) => {
    if (!authed) {
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/photoslibrary.readonly', 'https://www.googleapis.com/auth/photoslibrary.appendonly'],
        });
        res.send(`<h1>Conectar con Google</h1><a href="${url}">Conectar con Google</a>`);
    } else {
        res.send('<h1>Ya estás autenticado!</h1>');
    }
});

app.get('/oauthcallback', (req, res) => {
    const code = req.query.code;
    if (code) {
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error('Error obteniendo el token', err);
                res.send('Error autenticando');
                return;
            }
            oAuth2Client.setCredentials(token);
            authed = true;
            res.redirect('/');
        });
    }
});

// Iniciar el servidor
app.listen(8085, () => {
    console.log('App en el puerto 8085');
});


app.get('/photos', async (req, res) => {
  if (!authed) {
      res.status(401).send('No autenticado');
      return;
  }

  try {
      const photos = google.photoslibrary({ version: 'v1', auth: oAuth2Client });
      const response = await photos.mediaItems.list({});
      const items = response.data.mediaItems;

      // Verifica si hay fotos disponibles
      if (items && items.length > 0) {
          res.json(items); // Enviar las fotos al frontend
      } else {
          res.json([]); // Si no hay fotos, devolver un arreglo vacío
      }
  } catch (error) {
      console.error('Error obteniendo fotos:', error);
      res.status(500).send('Error al obtener las fotos');
  }
});


// Exporta la instancia de Express
module.exports = app;