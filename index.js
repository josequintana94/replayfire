var express = require('express');
const { db } = require("./admin");
const path = require('path')
const ejs = require('ejs');

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token: "APP_USR-1511729438549592-053119-b113cdd4269adc4e1b84933a9d0504ee-243216906",
});

var app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, 'views')); 

const PORT = process.env.PORT || 5050;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});// to get access to the server from any domain like postman.

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
  //res.send('This is my demo project')
})

const { partidos } = require('./handlers/partidos')
app.get('/partidos', partidos);

app.post('/create', async function (req, res) {
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
  }

  var date = new Date();

  //sumarle una hora
  //var date2 = new Date().addHours(1)

  var now = new Date();
  now.setSeconds(now.getSeconds() + 30); // timestamp
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
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });

  res.send('partido creado');
})

app.post('/setActivo', async function (req, res) {
  const id = req.body.id;
  var estado = 'activo';

  await db.collection('partidos').doc(id).update({
    estado: estado
  })

  res.json({ message: 'Partido activado' })
})

app.post('/updateUrl', async function (req, res) {
  const id = req.body.id;
  const url = req.body.url;
  const status = req.body.estado;

  await db.collection('partidos').doc(id).update({
    urlVideo: url,
    estado: status,
  })


  res.send('url actualizado');
})

app.get('/getById', async function (req, res) {
  const id = req.body.id;
  const url = req.body.url;

  const partido = await db.collection('partidos').doc(id).get();

  res.json(partido.data());
})

app.post('/create2', function (req, res) {
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
  }

  var date = new Date();

  //sumarle una hora
  //var date2 = new Date().addHours(1)

  var now = new Date();
  now.setSeconds(now.getSeconds() + 30); // timestamp
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
  }).then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);

    // Crea un objeto de preferencia
    let preference = {
      items: [
        {
          title: "Mi producto",
          unit_price: 10,
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
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
})


app.post('/create3', function (req, res) {
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
  }

  var date = new Date();

  //sumarle una hora
  //var date2 = new Date().addHours(1)

  var now = new Date();
  now.setSeconds(now.getSeconds() + 30); // timestamp
  now = new Date(now); // Date object

  var idCancha = 666;
  var nombreCancha = 'huracan';
  var estado = 'inactivo';
  var emailUsuario = 'test@gmail.com';
  var fechaInicio = date;
  var fechaFinn = now;
  var idCamara = 247;
  var urlVideo = 'dropbox.com';
  var hashMercadopago = 'rasdasd123123wasd';

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
  }).then(function (docRef) {
    
    console.log("Document written with ID: ", docRef.id);

    // Crea un objeto de preferencia
    let preference = {
      items: [
        {
          title: "Mi producto",
          unit_price: 10,
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
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
})

app.post('/delete', function (req, res) {
  const id = req.body.id;

  db.collection('partidos').doc(id).delete();

  res.send('partido eliminado');
}
)

app.post('/deleteAll', function (req, res) {
  db.collection('partidos').get().then((data) => {
    data.forEach((doc) => {
      db.collection('partidos').doc(doc.id).delete();
    })
  })

  res.send('partidos eliminados');
})

app.get('/ipn', (req, res) => {
  console.log(req.body);

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
  }
})


app.get('/checkout', async function (req, res) {
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

app.get("/:id", (req, res) => {
  const uniqueId = req.params.id;
  res.render('form', { id: uniqueId });
});

app.listen(PORT, function () {
  console.log(`Demo project at: ${PORT}!`);
});