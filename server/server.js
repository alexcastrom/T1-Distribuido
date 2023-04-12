const express = require('express')
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const crearEsquema = require('./esquemachuck.js');
const axios = require('axios');

const url_1 = process.env.REDIS_URL_1
const port = process.env.PORT || 3001;

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
      // try {
      //   const buscarFrase = await esquemaChuck.fetch(req.body.palabra)
      //   // console.log("right here",req.body.palabra)
      //   // res.send(buscarFrase)
      //   console.log("buscar frase",buscarFrase.entityFields.query.value)
      //   next()
      // }
      // catch (error) {

      //   console.log("error",error)
      // }
      
      try{
        const buscarFrase = await esquemaChuck.search() //consulta a redis la palabra en el capo query
          .where('query').equals(req.body.palabra)
          .return.all()
        if ( buscarFrase.length > 0){ //si encuentra la palabra en el campo query
          console.log("Guardada",buscarFrase) //guia para la consola
          res.send(buscarFrase[0].entityFields.value.value) //muestra el chiste al html
        }
        else { //si no encuentra la palabra en el campo query
          const request = await axios.get(`https://api.chucknorris.io/jokes/search?query=${req.body.palabra}`) //consulta a la api la palabra
          console.log("No Guardada", request.data.total) // guia para la consola
          if (request.data.total !== 0){ //si existe el chiste
            res.send(request.data.result[0].value) //muestra el chiste al html
            const saveData = await esquemaChuck.createAndSave({ query: req.body.palabra, value: request.data.result[0].value }) //almacena el chiste en redis
          }
          else {
            res.send("") //pass si no existe el chiste
          }
        }
      }
      catch (error) {
        console.log("error",error)
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
