// require express
const router = require("express").Router();

// declare each of the routes
const {
   getAllThoughts,
   getThoughtById,
   createThought,
   removeThought,
   updateThought,
   addReaction,
   removeReaction,
} = require("../../controllers/thought-controller");

// /api/thoughts
router.route("/").get(getAllThoughts);

// /api/user/:id
router.route("/:userId").post(createThought);

// /api/thoughtId
router.route("/:thoughtId").get(getThoughtById).put(updateThought)
   .delete(removeThought);

// api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reaction").post(addReaction);
// api/thoughts/:thoughtId/reactions/:reactionId
router.route("/:thoughtId/reaction/:reactionId").delete(removeReaction);

module.exports = router;
