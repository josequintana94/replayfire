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

app.post('/crear-partido', async function(req, res) {

    //const { camara, fecha } = req.body;
    var idCancha = req.body.idCancha;
    var nombreCancha = req.body.nombreCancha;
    var estado = req.body.estado;
    var emailUsuario = req.body.emailUsuario;
    var fechaInicio = req.body.fechaInicio;
    var fechaFinn = req.body.fechaFinn;
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

app.listen(PORT, function () {
console.log(`Demo project at: ${PORT}!`); });