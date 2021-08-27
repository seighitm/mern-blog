const router = require("express").Router();
const checkJwt = require("../middlewares/jwtCheck");
const upload = require("../middlewares/fileUpload");
const posts = require("../controllers/postController.js");

module.exports = app => {
    // Create a new Post
    router.post("/", [checkJwt, upload.single("img")], posts.create);

    // Retrieve all Posts
    router.get("/", posts.findAll);

    // Retrieve a single Post with id
    router.get("/:id", posts.findOne);

    // Update a Post with id
    router.put("/:id", [checkJwt, upload.single("img")], posts.update);

    // Delete a Post with id
    router.delete("/:id", checkJwt, posts.delete);

    // Delete all Posts
    router.delete("/", checkJwt, posts.deleteAll);

    // Like a Post
    router.patch('/:id/likePost', checkJwt, posts.likePost);

    app.use('/api/posts', router);
};