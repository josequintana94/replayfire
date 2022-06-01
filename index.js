var express = require('express');
const { db } = require("./admin");

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token: "APP_USR-1511729438549592-053119-b113cdd4269adc4e1b84933a9d0504ee-243216906",
});

    

var app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.urlencoded({ extended: false}));

const PORT = process.env.PORT || 5050


app.use((req, res, next) => {    
    res.setHeader('Access-Control-Allow-Origin', '*');    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');    
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');    
    next();
    });// to get access to the server from any domain like postman.

    app.use(bodyParser.json());

app.get('/', (req, res) => {
res.send('This is my demo project')
})

const { partidos } = require('./handlers/partidos')
app.get('/partidos', partidos);

app.post('/create', async function(req, res) {

    Date.prototype.addHours = function(h) {
        this.setTime(this.getTime() + (h*60*60*1000));
        return this;
      }

    var date = new Date();
    
    //sumarle una hora
    //var date2 = new Date().addHours(1)

    var now = new Date();
    now.setMinutes(now.getMinutes() + 10); // timestamp
    now = new Date(now); // Date object

    var idCancha = req.body.idCancha;
    console.log("idcanchaa " + idCancha);
    var nombreCancha = req.body.nombreCancha;
    var estado = req.body.estado;
    var emailUsuario = req.body.emailUsuario;
    var fechaInicio = date;
    var fechaFinn = now;
    var idCamara = req.body.idCamara;
    var urlVideo = req.body.urlVideo;
    var hashMercadopago = req.body.hashMercadopago;


    await db.collection('partidos').add({
        idCancha,
        nombreCancha,
        estado,
        emailUsuario,
        fechaInicio,
        fechaFinn,
        idCamara,
        urlVideo,
        hashMercadopago
    })

    // Add a new document with a generated id.
    db.collection("partidos").add({
        idCancha,
        nombreCancha,
        estado,
        emailUsuario,
        fechaInicio,
        fechaFinn,
        idCamara,
        urlVideo,
        hashMercadopago
        })
    .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);



    
    })
    .catch(function(error) {
    console.error("Error adding document: ", error);
    });

    res.send('partido creado');
})

app.post('/setActivo', async function(req, res) {

    const id = req.body.id;
    var estado = 'activo';
  
    await db.collection('partidos').doc(id).update({
        estado: estado
    })

    res.send('partido activado');
})

app.post('/updateUrl', async function(req, res) {

    const id = req.body.id;
    const url = req.body.url;

    await db.collection('partidos').doc(id).update({
        urlVideo: url
    })

    res.send('url actualizado');
})

app.get('/getById', async function(req, res) {

    const id = req.body.id;
    const url = req.body.url;

    const partido = await db.collection('partidos').doc(id).get();

    res.json(partido.data());
})
    
app.post('/create2', function(req, res) {

  Date.prototype.addHours = function(h) {
      this.setTime(this.getTime() + (h*60*60*1000));
      return this;
    }

  var date = new Date();
  
  //sumarle una hora
  //var date2 = new Date().addHours(1)

  var now = new Date();
  now.setMinutes(now.getMinutes() + 10); // timestamp
  now = new Date(now); // Date object

  var idCancha = req.body.idCancha;
  var nombreCancha = req.body.nombreCancha;
  var estado = req.body.estado;
  var emailUsuario = req.body.emailUsuario;
  var fechaInicio = date;
  var fechaFinn = now;
  var idCamara = req.body.idCamara;
  var urlVideo = req.body.urlVideo;
  var hashMercadopago = req.body.hashMercadopago;


  db.collection('partidos').add({
      idCancha,
      nombreCancha,
      estado,
      emailUsuario,
      fechaInicio,
      fechaFinn,
      idCamara,
      urlVideo,
      hashMercadopago
  }).then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);

  // Crea un objeto de preferencia
  let preference = {
    items: [
      {
        title: "Mi producto",
        unit_price: 100,
        quantity: 1,
      },
    ],
    external_reference: docRef.id
  };

    mercadopago.preferences
    .create(preference)
    .then(function (response) {


      console.log(response);
    //res.redirect(response.body.init_point);
    res.send(response.body.init_point);

    })
    .catch(function (error) {
      console.log(error);
    });


  


  
  })
  .catch(function(error) {
  console.error("Error adding document: ", error);
  });



})

app.get('/ipn', (req, res) => {
  res.send('This is my demo project')


  exports.run = function (req, res) {
    mercadopago.ipn.manage(req).then(function (data) {
      res.render('jsonOutput', {
        result: data
      });
    }).catch(function (error) {
      res.render('500', {
        error: error
      });
    });

    var idCancha = 'puto';
  
  
    db.collection('partidos').add({
        idCancha,

    })

  };

})


app.get('/checkout', async function(req, res) {

// Crea un objeto de preferencia
let preference = {
    items: [
      {
        title: "Mi producto",
        unit_price: 1,
        quantity: 1,
      },
    ],
  };
  
  mercadopago.preferences
    .create(preference)
    .then(function (response) {
    res.redirect(response.body.init_point);
    })
    .catch(function (error) {
      console.log(error);
    });
})

app.listen(PORT, function () {
console.log(`Demo project at: ${PORT}!`); });