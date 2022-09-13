const { Schema, model } = require("mongoose");

// UserSchema - username, email, thoughts, friends
const UserSchema = new Schema(
   {
      username: {
         type: String,
         trim: true,
         unique: true,
         required: "First Name is Required",
      },

      email: {
         type: String,
         required: "You must enter a valid email!",
         unique: true,
         // need to add validators
         match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
      },

      userCreated: {
         type: Date,
         default: Date.now,
      },
      // need to add thoughts array of _id values references the Thought model
      thoughts: [
         {
            type: Schema.Types.ObjectId,
            ref: "Thought",
         },
      ],

      // need to add friends array of _id values references the User model (self referenced)
      friends: [
         {
            type: Schema.Types.ObjectId,
            ref: "User",
         },
      ],
   },

   {
      toJSON: {
         getters: true,
         virtuals: true,
      },
      id: false,
   }
);

// create virtual friendCount that retrieves the length of the user's friends array field on query
UserSchema.virtual("friendCount").get(function () {
   return this.friends.length;
});

const User = model("User", UserSchema);

module.exports = User;
