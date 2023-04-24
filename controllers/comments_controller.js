const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");
const queue = require("../config/kue");
const commentEmailWorker = require("../workers/comment_email_worker");
const Like = require("../models/like");

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
      comment = await comment.populate('user',{ name: 1 , email:1 });
      // commentsMailer.newComment(comment);
      let job = queue.create("emails",comment).save(function(error){
        if(error){
          console.log("error in creating a queue");
          return;
        }else{
          console.log("job enqueued: ",job.id);
        }
      });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Post created",
        });
      }
      req.flash("success", "Comment published!");
      res.redirect("/");
    } else {
      req.flash("error", "You cannot publish this comment!");
      return response.redirect("back");
    }
  } catch (error) {
    req.flash("error", error);
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

      // destroy the associated likes for this comment.
      await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
      
      req.flash("success", "Comment deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot delete this comment!");
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", error);
    return;
  }
};
