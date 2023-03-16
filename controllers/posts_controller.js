const Post = require("../models/post");
const Comment = require("../models/comment");

// module.exports.create = function (req, res) {
//   Post.create(
//     {
//       content: req.body.content,
//       user: req.user._id,
//     },
//     function (error, post) {
//       if (error) {
//         console.log("Error in creating a post");
//         return;
//       }
//       return res.redirect('back');
//     }
//   );
// };

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: post,
        },
        message: "Post created!"
      }); 
    }

    req.flash("success", "Post published!");
    return res.redirect("back");
  } catch (error) {
    req.flash("error", error);
    return;
  }
};

// module.exports.destroy = function (request, response) {
//   Post.findById(request.params.id, function (error, post) {
//     if (post.user == request.user.id) {
//       // .id means converting the object id(._id) into string.
//       post.remove();
//       Comment.deleteMany({ post: request.params.id }, function (error) {
//         return response.redirect("back");
//       });
//     } else {
//       return response.redirect("back");
//     }
//   });
// };

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      // .id means converting the object id(._id) into string.
      post.remove();
      await Comment.deleteMany({ post: req.params.id });

      if(req.xhr){
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted",
          
        })
      }

      req.flash("success", "Post and associated comments deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot delete this post!");
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", error);
    return res.redirect("back");
  }
};
