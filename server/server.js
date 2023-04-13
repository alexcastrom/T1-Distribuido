const express = require('express')
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const crearEsquema = require('./esquemachuck.js');
const axios = require('axios');

const url_1 = process.env.REDIS_URL_1
const url_2 = process.env.REDIS_URL_2
const url_3 = process.env.REDIS_URL_3

const port = process.env.PORT || 3001;

require('dotenv').config()


//---------------------------------- Acá empieza el código -------------------------------------------------------------
const mapear_query = (palabra) =>{
  let query = palabra.toLowerCase()
  let posicion = query[0].charCodeAt() - 97
  if(posicion <= 8){return 1}
  else if(posicion > 8 && posicion < 19){return 2}
  else{ return 3}
}

;(async function() {
  try {
    const esquemaChuck1 = await crearEsquema(url_1)
    const esquemaChuck2 = await crearEsquema(url_2)
    const esquemaChuck3 = await crearEsquema(url_3)

    app.use(cors())
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    const ruta_principal = path.join(__dirname, '../public', 'index.html')

// --------------------- Rutas ------------------------------------------

    app.get('/', function (req, res){res.sendFile(ruta_principal)})

    app.use('/buscar',  async function (req, res, next) {
      console.log(req.body.palabra)
      let esquemaChuck;
      let contenedorRedis = mapear_query(req.body.palabra);

      if(contenedorRedis == 1){esquemaChuck = esquemaChuck1}
      else if(contenedorRedis == 2){esquemaChuck = esquemaChuck2}
      else{esquemaChuck = esquemaChuck3}


      try{
        const buscarFrase = await esquemaChuck.search().where('query').equals(req.body.palabra).return.all()

        if ( buscarFrase.length > 0){ // Si el chiste está en caché
          console.log("Guardada",buscarFrase)
          res.send(buscarFrase[0].entityFields.value.value)
        }

        else {
          const request = await axios.get(`https://api.chucknorris.io/jokes/search?query=${req.body.palabra}`)
          console.log("No Guardada", request.data.total)

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
      console.log(process.env['REDIS_URL_2'])
      console.log(process.env['REDIS_URL_3'])
    });
  } catch (error) {
    console.log(error)
  }
})();
