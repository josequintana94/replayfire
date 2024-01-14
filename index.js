const { Resend } = require('resend');
const express = require('express');
const { db } = require("./admin");
const path = require('path');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const apiKey = '3128fahsf9ah142941h2jk14h124812h9412lkdnsa90932141';
const resend = new Resend('re_TPY59hxt_3GhbC97WRNQqoHA8TgXcM7oo');
const mercadopago = require("mercadopago");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 5050;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

mercadopago.configure({
  access_token: "APP_USR-1511729438549592-053119-b113cdd4269adc4e1b84933a9d0504ee-243216906",
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

const { partidos } = require('./handlers/partidos');
app.get('/partidos', partidos);

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

app.post('/crearGrabacion', function (req, res) {
  const id = req.body.id;
  const email = req.body.email;
  const recordingDate = req.body.recordingDate;

  console.log("id: " + id);
  console.log("email: " + email);
  console.log("recordingDate: " + recordingDate);

  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
  }

  var endDate = new Date(recordingDate);
  endDate.setMinutes(endDate.getMinutes() + 2);
  endDate = new Date(endDate);

  var idCancha = id;
  var nombreCancha = id;
  var estado = 'inactivo';
  var emailUsuario = email;
  var fechaInicio = new Date(recordingDate);
  var fechaFinn = endDate;
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
    io.emit('match_record_created', docRef.id);

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

app.post('/crearUsuario', function (req, res) {
  const providedApiKey = req.headers['api-key'];

  // Check if the provided API key matches the expected API key
  if (providedApiKey !== apiKey) {
    res.status(401).send('Unauthorized');
    return;
  }

  const email = req.body.email;
  const password = req.body.password;
  const usuario = req.body.usuario;

  // Hash the password using bcrypt before storing it in the database
  bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.error("Error hashing password: ", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    db.collection('usuarios').add({
      email,
      password: hashedPassword, // Store the hashed password in the database
      usuario
    }).then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      res.send('usuario creado');
    }).catch(function (error) {
      console.error("Error adding document: ", error);
      res.status(500).send("Internal Server Error");
    });
  });
});

app.post('/login', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Retrieve the user document from the database based on the provided email
  db.collection('usuarios').where('email', '==', email).get()
    .then(snapshot => {
      if (snapshot.empty) {
        // User not found
        res.status(401).send('Invalid email or password');
        return;
      }

      // Check if the provided password matches the hashed password in the database
      snapshot.forEach(doc => {
        const hashedPassword = doc.data().password;

        bcrypt.compare(password, hashedPassword, function (err, result) {
          if (err || !result) {
            // Incorrect password
            res.status(401).send('Invalid email or password');
          } else {
            // Passwords match, user is authenticated
            res.json(doc.data());
          }
        });
      });
    })
    .catch(error => {
      console.error("Error getting user document: ", error);
      res.status(500).send("Internal Server Error");
    });
});

app.post('/partidosusuario', async function (req, res) {
  const { usuario } = req.body;
  const partidosRef = db.collection('partidos');
  const queryRef = partidosRef.where('estado', '!=', 'finalizado').where('nombreCancha', '==', usuario);

  try {
    queryRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(data);
      return res.status(201).json(data);
    })
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
});

app.post('/setMatchFinished', async function (req, res) {
  try {
    const id = req.body.id;
    const estado = req.body.estado;
    const urlVideo = req.body.urlVideo;

    console.log('Updating document with id:', id);
    console.log('New estado:', estado);
    console.log('New urlVideo:', urlVideo);

    // Check if the document exists before attempting to update
    const partidoRef = db.collection('partidos').doc(id);
    const partidoSnapshot = await partidoRef.get();

    if (!partidoSnapshot.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Update the document
    await partidoRef.update({
      estado: estado,
      urlVideo: urlVideo
    });

    const partido = partidoSnapshot.data();

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [partido.emailUsuario],
      subject: 'Hello World',
      html: '<strong>It works!</strong><br><br>Check out your video here: ' + urlVideo,
    });

    if (error) {
      console.error('Email sending error:', error);
      return res.status(500).json({ error: 'Error sending email' });
    }

    console.log('Email sent successfully:', data);

    res.json({ message: 'Partido finalizado' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/crearCamara', function (req, res) {
  const ip = req.body.ip;
  const username = req.body.username;
  const password = req.body.password;
  const usuario = req.body.usuario;
  const camStatus = 'free'

  db.collection('camaras').add({
    ip,
    password,
    username,
    usuario,
    camStatus
  }).then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
    db.collection('camaras').doc(docRef.id).update({
      id: docRef.id
    })
    res.send('camera creado');
  }).catch(function (error) {
    console.error("Error adding document: ", error);
    res.status(500).send("Internal Server Error");
  });
});

app.post('/actualizarCamara', function (req, res) {
  const id = req.body.id;
  const ip = req.body.ip;
  const username = req.body.username;
  const password = req.body.password;
  const camStatus = req.body.camStatus;

  db.collection('camaras').doc(id).update({
    ip,
    password,
    username,
    camStatus
  })

  res.send('camera actualizado');
});

app.post('/eliminarCamara', function (req, res) {
  const id = req.body.id;

  db.collection('camaras').doc(id).delete();

  res.send('camera eliminado');
});

app.post('/camarasusuario', async function (req, res) {
  const { usuario } = req.body;
  const camarasRef = db.collection('camaras');
  const queryRef = camarasRef.where('usuario', '==', usuario);

  try {
    queryRef.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(data);
      return res.status(201).json(data);
    })
  } catch (error) {
    return res
      .status(500)
      .json({ general: "Something went wrong, please try again" });
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Handle other socket events here
  socket.on("match_record_created", (data) => {
    console.log("Match record created:", data);
  });
});

server.listen(PORT, function () {
  console.log(`Demo project at: ${PORT}!`);
});