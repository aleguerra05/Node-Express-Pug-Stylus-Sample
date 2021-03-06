var express = require('express');
var router = express.Router();
var fs = require('fs');
var path=require('path');
var multer = require("multer");
var Client = require('node-rest-client').Client;
var client = new Client();
client.registerMethod("createImage", "http://localhost:3001/images/", "POST");
client.registerMethod("deleteImage", "http://localhost:3001/images/${id}", "DELETE");
client.registerMethod("editImage", "http://localhost:3001/images/${id}", "PUT");
client.registerMethod("editPost", "http://localhost:3001/posts/${id}", "PUT");

const upload = multer({
    dest: "/public"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });

router.post('/del/:imaId',function (req, res, next) {
        console.log("delete "+req.params.imaId);

        var args = {
            path: { id:req.params.imaId}
        };

        client.methods.deleteImage(args, function (data, response) {
            console.log(response.statusCode);
            if (response.statusCode == 200) {
                
                console.log("redirect back")
                var dateTime = new Date()
                console.log("postId:" + req.body.postId)
                
                var postArgs = {
                    data: { 
                        id: req.body.postId,
                        updatedDate: dateTime,
                        code:req.body.code,
                        title:req.body.title,
                        title_en:req.body.title_en,
                        type:req.body.type,
                        description:req.body.description,
                        description_en:req.body.description_en,
                        startDate:req.body.startDate,
                        endDate:req.body.endDate,
                        dateMask:req.body.dateMask
                    },
                    path:{
                        id: req.body.postId
                    },
                    headers: { 
                        "Content-Type": "application/json" 
                    }
                };

                client.methods.editPost(postArgs, function (data, response) {
                    console.log(response.statusCode);
                    if (response.statusCode == 200) {
                        res.redirect('back');
                    }
                });

            }
            if (response.statusCode == 404) {
                console.log("render message imagen no encontrada")
                res.render('message', { title: 'Imagen no encontrada!', message: '404 - Imagen no encontrada!' });
            }
        });
    }
);

router.post('/', 
    upload.single("filetoupload" /* name attribute of <file> element in your form */),
    (req, res) => {
        if(req.file){
            const tempPath = req.file.path;
            const targetPath = path.join(__dirname, "../public/images/",req.file.originalname);
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);

                var args = {
                    data: { 
                        path:'images/'+req.file.originalname, 
                        postId:req.body.postId,
                        footNote:req.body.footNote,
                        footNote_en:req.body.footNote_en
                    },
                    headers: { "Content-Type": "application/json" }
                };

                client.methods.createImage(args, function (data, response) {
                    
                    if (response.statusCode == 201) {
                        client.get("http://localhost:3001/images/", function (data, response) {
                            console.log(response.statusCode);
                            if (response.statusCode == 200) {
                                
                                console.log("redirect back")
                                var dateTime = new Date()
                                console.log("postId:" + req.body.postId)
                                
                                var postArgs = {
                                    data: { 
                                        id: req.body.postId,
                                        updatedDate: dateTime,
                                        code:req.body.code,
                                        title:req.body.title,
                                        title_en:req.body.title_en,
                                        type:req.body.type,
                                        description:req.body.description,
                                        description_en:req.body.description_en,
                                        startDate:req.body.startDate,
                                        endDate:req.body.endDate,
                                        dateMask:req.body.dateMask
                                    },
                                    path:{
                                        id: req.body.postId
                                    },
                                    headers: { 
                                        "Content-Type": "application/json" 
                                    }
                                };

                                client.methods.editPost(postArgs, function (data, response) {
                                    console.log(response.statusCode);
                                    if (response.statusCode == 200) {
                                        res.redirect('back');
                                    }
                                });

                            }
                            else {
                                res.render('message', { title: 'Error', message: 'Error: ' + response.statusMessage });
                            }
                        });
                    }
                    else
                        res.render('message', { title: 'Error', message: 'Error agregando Imagen!' + response.statusMessage });
                });
            });
        }
        else{
            res.render('message', { title: 'No ha seleccionado ninguna Imagen!', message: 'Sin Imagen!' });
        }
    }
);

router.post('/edit/:imaId(\\d+)', function (req, res, next) {
    var args = {
        data: { 
            id: req.body.id,
            path:req.body.path, 
            postId:req.body.postId,
            footNote:req.body.footNote,
            footNote_en:req.body.footNote_en
        },
        path:{
            id: req.params.imaId  
          },
        headers: { "Content-Type": "application/json" }
    };

    client.methods.editImage(args, function (data, response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            console.log("redirect back")
            var dateTime = new Date()
            console.log("postId:" + req.body.postId)
            
            var postArgs = {
                data: { 
                    id: req.body.postId,
                    updatedDate: dateTime,
                    code:req.body.code,
                    title:req.body.title,
                    title_en:req.body.title_en,
                    type:req.body.type,
                    description:req.body.description,
                    description_en:req.body.description_en,
                    startDate:req.body.startDate,
                    endDate:req.body.endDate,
                    dateMask:req.body.dateMask
                },
                path:{
                    id: req.body.postId
                },
                headers: { 
                    "Content-Type": "application/json" 
                }
            };

            client.methods.editPost(postArgs, function (data, response) {
                console.log(response.statusCode);
                if (response.statusCode == 200) {
                    res.redirect('back');
                }
            });
            //res.redirect('back');
        }
        else {
            res.render('message', { title: 'Error', message: 'Error actualizado descripción de la Imagen: ' + response.statusMessage });
        }
    });
});

module.exports = router;