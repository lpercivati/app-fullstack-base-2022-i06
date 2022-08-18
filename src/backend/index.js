//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

var  devices = [
    { 
        'id': 1, 
        'name': 'Lampara 1', 
        'description': 'Luz living', 
        'intensity': 100, 
        'type': "Luz", 
    },
    { 
        'id': 2, 
        'name': 'Ventilador 1', 
        'description': 'Ventilador Habitacion', 
        'intensity': 50, 
        'type': "Ventilador", 
    },
];
//=======[ Main module code ]==================================================
app.put("/actualizar",function(req,res){
    let error = validarBody(req.body)

    console.log(req.body)
    if(error){
        res.status(400).send(error)
    }else{
        res.send(req.body.id);
    }
});

app.post("/crear",function(req,res){
    let error = validarBody(req.body)
    
    if(error){
        res.status(400).send(error)
        return
    }
    console.log(req.body)

    utils.query("INSERT INTO Devices VALUES (?, ?, ?, ?, ?)", [req.body.id, req.body.name, req.body.description, req.body.intensity, req.body.type], function(err, resp){
        if(err){
            res.status(400).send(err)
        }else{
            res.send(req.body.id);
        }
    })
});

app.get('/devices/', function(req, res) {
    debugger;
    utils.query("SELECT * FROM Devices", function(err, respuesta){
        
        if (err) {
            res.send(err).status(400)
            return;
        }

        res.send(respuesta);
    })
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

app.delete("/borrar/:id", function(req, res){
    console.log(req)
    let id = req.params.id;

    utils.query("DELETE FROM Devices WHERE id = ?", id, function(err, resp){
        if(err){
            res.status(400).send(err)
        }else{
            res.send(req.body.id);
        }
    })
})

function validarBody(body) {
    let error = ""
    let intensity = parseInt(body.intensity)

    if (!intensity || intensity < 0 || intensity > 100) {
        error += "Intensidad debe ser entre 0 y 100. " 
    }

    if (body.id == '') {
        error += "Id obligatorio. " 
    }

    if (body.name == '') {
        error += "Nombre obligatorio. " 
    }

    if (body.description == '') {
        error += "Descripción obligatoria. " 
    }

    return error
}

//=======[ End of file ]=======================================================
