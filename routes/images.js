var express = require('express');
var router = express.Router();
var fs = require('fs');
var path=require('path');
var multer = require("multer");
var Client = require('node-rest-client').Client;
var client = new Client();
client.registerMethod("createImage", "http://localhost:3001/images/", "POST");
client.registerMethod("deleteImage", "http://localhost:3001/images/${id}", "DELETE");

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
                res.redirect('back');
            }
            if (response.statusCode == 404) {
                res.render('message', { title: 'Image no found!', message: '404 - Image no found!' });
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
                    data: { path:'images/'+req.file.originalname, postId:req.body.postId},
                    headers: { "Content-Type": "application/json" }
                };

                client.methods.createImage(args, function (data, response) {
                    
                    if (response.statusCode == 201) {
                        client.get("http://localhost:3001/images/", function (data, response) {
                            console.log(response.statusCode);
                            if (response.statusCode == 200) {
                                res.redirect('back');
                            }
                            else {
                                res.render('message', { title: 'Error', message: 'Error: ' + response.statusMessage });
                            }
                        });
                    }
                    else
                        res.render('message', { title: 'Error', message: 'Error ading image!' + response.statusMessage });
                });
            });
        }
        else{
            res.render('message', { title: 'No image selected image!', message: 'No image!' });
        }
    }
);

module.exports = router;