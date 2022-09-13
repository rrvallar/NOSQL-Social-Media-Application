const { model, Types, Schema } = require("mongoose");
// need to import utils/dateFormat
const dateFormat = require("../utils/dateFormat");

// create ReactionSchema Schema consisiting of reactionId, username, createdAt
const ReactionSchema = new Schema(
   {
      reactionId: {
         type: Schema.Types.ObjectId,
         default: () => new Types.ObjectId(),
      },
      reactionBody: {
         type: String,
         required: "You forgot to enter your reaction!",
         maxlength: 280,
      },
      username: {
         type: String,
         required: "You must enter a name!",
         trim: true,
      },
      createdAt: {
         type: Date,
         default: Date.now,
         // getter method to format the timestamp on query
         get: (createdAtVal) => dateFormat(createdAtVal),
      },
   },
   {
      toJSON: {
         getters: true,
      },
   }
);

// create ThoughtSchema Schema consisting of username, thoughtText, createdAt, reactions
const ThoughtSchema = new Schema(
   {
      username: {
         type: String,
         required: true,
         trim: true,
      },
      thoughtText: {
         type: String,
         required: "Please input your thought!",
         minlength: 1,
         maxlength: 280,
      },
      createdAt: {
         type: Date,
         default: Date.now,
         get: (createdAtVal) => dateFormat(createdAtVal),
      },
      reactions: [ReactionSchema],
   },
   {
      toJSON: {
         getters: true,
         virtuals: true,
      },
      id: false,
   }
);

// create virtual reactionCount to retrieve length of thought's reactions array field
ThoughtSchema.virtual("reactionCount").get(function () {
   return this.reactions.length;
});

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;
