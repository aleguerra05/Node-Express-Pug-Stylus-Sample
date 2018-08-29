var express = require('express');
var router = express.Router();
var fs = require('fs');

var Client = require('node-rest-client').Client;
var client = new Client();

client.registerMethod("getPosts", "http://localhost:3001/posts/${id}", "GET");
client.registerMethod("getComments", "http://localhost:3001/posts/${id}/comments", "GET");
client.registerMethod("getImages", "http://localhost:3001/posts/${id}/images", "GET");
//client.registerMethod("getAllPosts", "http://localhost:3001/posts/", "GET");

router.get('/', function (req, res, next) {
    
    client.get("http://localhost:3001/posts/", function (data, response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            res.render('post_list', { title: 'Posts List ', posts: data });
        }
        else {
            res.render('message', { title: 'Error', message: 'Post count: ' + response.statusMessage });
        }
    });
    
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

            var args ={path:{"id":req.params.postId}};

            client.methods.getComments(args,function (comments, commentsResponse) {
                console.log(comments);
                console.log(commentsResponse.statusCode);

                client.methods.getImages(args, function (images, imagesResponse) {
                    console.log(images);
                    console.log(imagesResponse.statusCode);

                    res.render('post', { title: 'Post ' + req.params.postId, post: data, comments: comments, images:images });
                });
            });
        }
        else {
            res.render('message', { title: 'Error', message: 'PostId ' + req.params.postId + ' ' + response.statusMessage });
        }
    });
});

router.get('/count', function (req, res, next) {

    // var args = null;

    // client.methods.getAllPosts(args, function (data, response) {
    //     //console.log(data);
    //     console.log(response.statusCode);
    //     if (response.statusCode == 200) {
    //         res.render('message', { title: 'Posts Count ', message: 'PostCount: ' + response.lenght });
    //     }
    //     else {
    //         res.render('message', { title: 'Error', message: 'Post count: ' + response.statusMessage });
    //     }
    // });

    client.get("http://localhost:3001/posts/", function (data, response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            res.render('message', { title: 'Posts Count ', message: 'PostCount: ' + data.length });
        }
        else {
            res.render('message', { title: 'Error', message: 'Post count: ' + response.statusMessage });
        }
    });

});

module.exports = router;