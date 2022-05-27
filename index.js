var express = require('express');
const { db } = require("./admin");

var app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.urlencoded({ extended: false}));

const PORT = process.env.PORT || 5050
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
    var date2 = new Date().addHours(1)

    //const { camara, fecha } = req.body;
    var idCancha = req.body.idCancha;
    var nombreCancha = req.body.nombreCancha;
    var estado = req.body.estado;
    var emailUsuario = req.body.emailUsuario;
    var fechaInicio = date;
    var fechaFinn = date2;
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
    

app.listen(PORT, function () {
console.log(`Demo project at: ${PORT}!`); });