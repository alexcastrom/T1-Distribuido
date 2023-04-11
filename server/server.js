const express = require('express')
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const crearEsquema = require('./esquemachuck.js')

const url_1 = process.env.REDIS_URL_1
const port = process.env.PORT || 3000;

require('dotenv').config()


//---------------------------------- Acá empieza el código -------------------------------------------------------------

;(async function() {
  try {
    const esquemaChuck = await crearEsquema(url_1)
    app.use(cors())
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    const ruta_principal = path.join(__dirname, '../public', 'index.html')

// --------------------- Rutas ------------------------------------------

    app.get('/', function (req, res){res.sendFile(ruta_principal)})

    app.use('/buscar',  async function (req, res, next) {
      console.log(req.body.palabra)
      try {
        const buscarFrase = await esquemaChuck.fetch(req.body.palabra)
        res.send(buscarFrase)
        next()
      }
      catch (error) {
        console.log(error)
      }
    })

    app.post('/buscar', function (req, res) {
      console.log("Inicio, buscando o llamando a la API")
      console.log(req.body)
      res.json({ palabra: req.body.palabra })
    })




// ------------------------------------------ Estándar servidor -----------------------------------------------------------------
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
      console.log(process.env['REDIS_URL_1'])
      console.log(esquemaChuck)
    });
  } catch (error) {
    console.log(error)
  }
})();
