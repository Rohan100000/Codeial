const nodeMailer = require("../config/nodemailer");

// module.exports = newComment;
// this is another way of exporting a method
exports.newComment = async function (comment) {
  let htmlString = await nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

  nodeMailer.transporter.sendMail(
    {
      from: "xerobhau@gmail.com",
      to: comment.user.email,
      subject: "New comment published",
      // html: "<h1>Yup, your comment is now published</h1>",
      html: htmlString
    },
    function (error, info) {
      if (error) {
        console.log("error in sending mail: ", error);
        return;
      }
      console.log("message sent: ", info);
      return;
    }
  );
};
