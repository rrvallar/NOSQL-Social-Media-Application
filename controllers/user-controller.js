const { User, Thought } = require("../models");

const userController = {
   // get all Users
   getAllUsers(req, res) {
      User.find({})
         .populate({
            path: "thoughts",
            select: "-__v",
         })
         .select("-__v")
         .sort({ _id: -1 })
         .then((dbUserData) => res.json(dbUserData))
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
   },

   // get one user by id
   getUserById({ params }, res) {
      User.findOne({ _id: params.id })
         .populate({
            path: "thoughts",
            select: "-__v",
         })
         .select("-__v")
         .then((dbUserData) => res.json(dbUserData))
         .catch((err) => {
            console.log(err);
            res.status(400);
         });
   },

   // create user
   createUser({ body }, res) {
      User.create(body)
         .then((dbUserData) => res.json(dbUserData))
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
   },

   // update user by id
   updateUser({ params, body }, res) {
      User.findOneAndUpdate({ _id: params.id }, body, {
         new: true,
         runValidators: true,
      })
         .then((dbUserData) => {
            if (!dbUserData) {
               res.status(404).json({
                  message: "This user id is invalid.",
               });
               return;
            }
            res.json(dbUserData);
         })
         .catch((err) => res.json(err));
   },

   // add friend
   addFriend({ params }, res) {
      User.findByIdAndUpdate(
         { _id: params.id },
         { $push: { friends: params.friendId } },
         { new: true }
      )
         .populate({ path: "friends", select: "-__v" })
         .select("-__v")
         .then((dbUserData) => {
            if (!dbUserData) {
               res.status(400).json({
                  message: "This user id is invalid.",
               });
               return;
            }
            res.json(dbUserData);
         })
         .catch((err) => res.json(err));
   },

   // delete user
   deleteUser({ params }, res) {
      User.findOneAndDelete({ _id: params.id })
         .then((dbUserData) => {
            if (!dbUserData) {
               res.status(400).json({
                  message: "This user id is invalid.",
               });
               return;
            }
            User.updateMany(
               // $in aggregation to indicate if specified value is in
               { _id: { $in: dbUserData.friends } },
               { $pull: { friends: params.id } }
            )
               .then(() => {
                  Thought.deleteMany({ username: dbUserData.username }).then(
                     () => {
                        res.json({ messsage: "User Deleted" });
                     }
                  );
               })
               .catch((err) => res.json(err));
         })
         .catch((err) => res.json(err));
   },

   // delete friend
   deleteFriend({ params }, res) {
      User.findByIdAndUpdate(
         { _id: params.id },
         { $pull: { friends: params.freindsId } },
         // include runValidators: true setting to assure new information gets validated
         { new: true, runValidators: true }
      )
         .select("-__v")
         .then((dbUserData) => {
            if (!dbUserData) {
               res.status(400).json({
                  message: "This user id is invalid.",
               });
               return;
            }
            res.json(dbUserData);
         })
         .catch((err) => res.status(400).json(err));
   },
};

module.exports = userController;
