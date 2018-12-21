var express = require('express');
var router = express.Router();
var fs = require('fs');

var Client = require('node-rest-client').Client;
var client = new Client();

client.registerMethod("getPosts", "http://localhost:3001/posts/${id}", "GET");
client.registerMethod("deletePost", "http://localhost:3001/posts/${id}", "DELETE");
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

    if (req.body != null 
        && req.body.code != null 
        && req.body.title != null 
        && req.body.description != null
        && req.body.startDate != null
        && req.body.endDate != null
        && req.body.dateMask != null
        ) {
        var args = {
            data: { 
                code: req.body.code, 
                title: req.body.title, 
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                dateMask: req.body.dateMask
            },
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

//router.delete('/:postId(\\d+)', function (req, res, next) {
router.post('/del/:postId',function (req, res, next) {
    var args = {
        path: { "id": req.params.postId }
    }
    console.log(req.params.postId);
        
    client.methods.deletePost(args, function (data, response) {
        if (response.statusCode == 200) {
            res.render('message', { title: 'Post Deleted', message: 'Post ' + req.params.postId + ' deleted!' });
        }
        else
        {
            res.render('message', { title: 'Error', message: 'Error deleting post: ' +args.id + '\n' + response.statusMessage });
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