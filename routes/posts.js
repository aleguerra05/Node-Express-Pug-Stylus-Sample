var express = require('express');
var router = express.Router();
var fs = require('fs');

var Client = require('node-rest-client').Client;
var client = new Client();

client.registerMethod("getPosts", "http://localhost:3001/posts/${id}", "GET");
client.registerMethod("createPosts", "http://localhost:3001/posts/", "POST");
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

router.post('/', function (req, res, next) {
    console.log(req.body);

    if (req.body != null&&req.body.title != null && req.body.text != null && req.body.author != null) {
        var args = {
            data: { title: req.body.title, author: req.body.author, text: req.body.text },
            headers: { "Content-Type": "application/json" }
        };

        client.methods.createPosts(args, function (data, response) {

            if (response.statusCode == 201) {
                client.get("http://localhost:3001/posts/", function (data, response) {
                    console.log(response.statusCode);
                    if (response.statusCode == 200) {
                        res.render('post_list', { title: 'Added post!', posts: data });
                    }
                    else {
                        res.render('message', { title: 'Error', message: 'Post count: ' + response.statusMessage });
                    }
                });
            }
            else
                res.render('message', { title: 'Error', message: 'Error ading post!' + response.statusMessage });
        });
    }
    else
        res.render('message', { title: 'Error', message: 'Error ading post! ParamsRequired'});        
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

            client.methods.getComments(args, function (comments, commentsResponse) {
                console.log(comments);
                console.log(commentsResponse.statusCode);

                client.methods.getImages(args, function (images, imagesResponse) {
                    console.log(images);
                    console.log(imagesResponse.statusCode);

                    res.render('post', { title: 'Post ' + req.params.postId, post: data, comments: comments, images: images });
                });
            });
        }
        else {
            res.render('message', { title: 'Error', message: 'PostId ' + req.params.postId + ' ' + response.statusMessage });
        }
    });
});

router.get('/count', function (req, res, next) {
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