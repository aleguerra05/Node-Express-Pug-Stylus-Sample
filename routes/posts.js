var express = require('express');
var router = express.Router();
var fs = require('fs');

var Client = require('node-rest-client').Client;
var client = new Client();

client.registerMethod("getPosts", "http://localhost:3001/posts/${id}", "GET");
client.registerMethod("deletePost", "http://localhost:3001/posts/${id}", "DELETE");
client.registerMethod("editPost", "http://localhost:3001/posts/${id}", "PUT");
client.registerMethod("createPosts", "http://localhost:3001/posts/", "POST");
client.registerMethod("getImages", "http://localhost:3001/posts/${id}/images", "GET");
//client.registerMethod("getAllPosts", "http://localhost:3001/posts/", "GET");

router.get('/', function (req, res, next) {

    client.get("http://localhost:3001/posts/", function (data, response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            res.render('post_list', { title: 'Nuevo Contenido'});
        }
        else {
            res.render('message', { title: 'Error', message: 'Cantidad de Contenidos: ' + response.statusMessage });
        }
    });

});

router.post('/', function (req, res, next) {
    var dateTime = new Date();
    if (req.body != null 
        && req.body.code != null 
        && req.body.title != null 
        && req.body.title_en != null 
        && req.body.type != null 
        && req.body.description != null
        && req.body.description_en != null
        && req.body.startDate != null
        && req.body.endDate != null
        && req.body.dateMask != null
        ) {
        var args = {
            data: { 
                code: req.body.code, 
                title: req.body.title, 
                title_en: req.body.title_en, 
                type: req.body.type, 
                description: req.body.description,
                description_en: req.body.description_en,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                updatedDate: dateTime, //"2019-01-12 12:00:00",
                dateMask: req.body.dateMask
            },
            headers: { "Content-Type": "application/json" }
        };

        client.methods.createPosts(args, function (data, response) {

            if (response.statusCode == 201) {
                client.get("http://localhost:3001/posts/", function (data, response) {
                    console.log(response.statusCode);
                    if (response.statusCode == 200) {
                        res.render('post_list', { title: 'Contenido adicionado satisfactoriamente', posts: data });
                    }
                    else {
                        res.render('message', { title: 'Error', message: 'Cantidad de Contenidos: ' + response.statusMessage });
                    }
                });
            }
            else
                res.render('message', { title: 'Error', message: 'Error adicionando Contenido!' + response.statusMessage });
        });
    }
    else
        res.render('message', { title: 'Error', message: 'Error adicionando Contenido! Faltan campos por llenar'});        
});

router.get('/:postId(\\d+)', function (req, res, next) {
    var args = {
        path: { "id": req.params.postId }
    }
    console.log(req.params.postId);

    client.methods.getPosts(args, function (data, response) {
        console.log(data);
        console.log(response.statusCode);
        if (response.statusCode == 200) {

            var args = { path: { "id": req.params.postId } };

            client.methods.getImages(args, function (images, imagesResponse) {
                console.log(images);
                console.log(imagesResponse.statusCode);

                res.render('post', { title: 'Contenido ' + req.params.postId, post: data, images: images });
            });
            
        }
        else {
            res.render('message', { title: 'Error', message: 'Contenido ' + req.params.postId + ' detalles: ' + response.statusMessage });
        }
    });
});

router.post('/edit/:postId(\\d+)', function (req, res, next) {
    var dateTime = new Date();
    if (req.body != null 
        && req.body.id !=null
        && req.body.code != null 
        && req.body.title != null 
        && req.body.title_en != null 
        && req.body.type != null 
        && req.body.description != null
        && req.body.description_en != null
        && req.body.startDate != null
        && req.body.endDate != null
        && req.body.dateMask != null) {
        var args = {
            data: { 
                id: req.body.id,
                code: req.body.code, 
                title: req.body.title, 
                title_en: req.body.title_en, 
                type: req.body.type, 
                description: req.body.description,
                description_en: req.body.description_en,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                updatedDate: dateTime, //"2019-01-12 12:00:00",
                dateMask: req.body.dateMask
            },
            path:{
              id: req.body.id  
            },
            headers: { "Content-Type": "application/json" }
        };
        client.methods.editPost(args, function (data, response) {
            console.log(response.statusCode);
            if (response.statusCode == 200) {
                //res.render('post', { title: 'Contenido actualizado satisfactoriamente!', posts: data });
                res.redirect('back');
            }
            else {
                res.render('message', { title: 'Error', message: 'Cantidad de Contenidos: ' + response.statusMessage });
            }
        });
    }
    else
        res.render('message', { title: 'Error', message: 'Error actualizando Contenido! Faltan campos por llenar'});        
});

router.post('/del/:postId',function (req, res, next) {
    var args = {
        path: { "id": req.params.postId }
    }
    console.log(req.params.postId);
        
    client.methods.deletePost(args, function (data, response) {
        if (response.statusCode == 200) {
            res.render('message', { title: 'Contenido Eliminado', message: 'Contenido ' + req.params.postId + ' eliminado!' });
        }
        else
        {
            res.render('message', { title: 'Error', message: 'Error eliminando Contenido: ' +args.id + '\n' + response.statusMessage });
        }
    });
});

router.get('/count', function (req, res, next) {
    client.get("http://localhost:3001/posts/", function (data, response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            res.render('message', { title: 'Cantidad de Contenidos', message: 'Cantidad de Contenidos: ' + data.length });
        }
        else {
            res.render('message', { title: 'Error', message: 'Cantidad de Contenidos: ' + response.statusMessage });
        }
    });
});


module.exports = router;