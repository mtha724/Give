const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postController");
const commentsController = require("../controllers/commentController");

router.post("/", postsController.createPost);
router.get("/", postsController.getPosts);
router.post("/:postId/vote", postsController.votePoll);
router.get("/:postId/comments", commentsController.listForPost);
router.post("/:postId/comments", commentsController.createForPost);

module.exports = router;
