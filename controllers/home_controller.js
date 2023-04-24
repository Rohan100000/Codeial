// module.exports.actionName = function(req,res){}
const Post = require("../models/post");
const User = require("../models/user");

// module.exports.home = function (request, response) {
//   console.log("Home controller action is working");

//   // Post.find({}, function (error, posts) {
//   //   if (error) {
//   //     return response.render("back");
//   //   }
//   //   return response.render("home", {
//   //     title: "Codeial | Home",
//   //     posts: posts,
//   //   });
//   // });

//   // Populate the user of each post.
//   Post.find({})
//     .populate("user")
//     .populate({
//       path: "comments",
//       populate: {
//         path: "user",
//       },
//     })
//     .exec(function (error, posts) {
//       User.find({}, function (error, users) {
//         if (error) {
//           return response.render("back");
//         }
//         return response.render("home", {
//           title: "Codeial | Home",
//           posts: posts,
//           all_users: users,
//         });
//       });
//     });
// };

module.exports.home = async function (request, response) {
  try {
    console.log("Home controller action is working");

    // Populate the user of each post.
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: "likes"
        }
      })
      .populate("likes");

    let users = await User.find({});

    return response.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (error) {
    console.log("Error: ",error);
  }
};

// using then
// Post.find({}).populate("comments").then(function());
// promise
// let posts = Post.find({}).populate("comments").exec();
// posts.then();