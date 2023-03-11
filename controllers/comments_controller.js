const Comment = require("../models/comment");
const Post = require("../models/post");

// module.exports.create = function (req, res) {
//   Post.findById(req.body.post, function (error, post) {
//     if (post) {
//       Comment.create(
//         {
//           content: req.body.content,
//           post: req.body.post,
//           user: req.user._id,
//         },
//         function (error, comment) {
//           // handle error
//           post.comments.push(comment);
//           post.save();

//           res.redirect("/");
//         }
//       );
//     }
//   });
// };

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      post.save();
      req.flash("success","Comment published!");
      res.redirect("/");
    }
    else {
      req.flash("error","You cannot publish this comment!");
      return response.redirect("back");
    }
  } catch (error) {
    req.flash("error",error);
    return;
  }
};

// module.exports.destroy = function (request, response) {
//   Comment.findById(request.params.id, function (error, comment) {
//     if (comment.user == request.user.id) {
//       let postId = comment.post;
//       comment.remove();
//       Post.findByIdAndUpdate(
//         postId,
//         { $pull: { comments: request.params.id } },
//         function (error, post) {
//           return response.redirect("back");
//         }
//       );
//     } else {
//       return response.redirect("back");
//     }
//   });
// };

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      req.flash("success","Comment deleted!");
      return res.redirect("back");
    } else {
      req.flash("error","You cannot delete this comment!");
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error",error);
    return;
  }
};
