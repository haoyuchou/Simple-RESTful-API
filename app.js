const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

/// Target all article

app.route('/articles')
  .get((req, res) => {
    Article.find((err, result) => {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    //  console.log(req.body.title);
    //console.log(req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err, result) => {
      if (!err) {
        res.send("successfully add a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("successfully delete all articles");
      } else {
        res.send(err);
      }
    });
  });


/// Target specific article
app.route('/articles/:getArticle')
  .get((req, res) => {
    const titleName = req.params.getArticle;
    Article.findOne({
      title: titleName
    }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found");
      }
    });
  })
  .put((req, res) => {
    Article.update({
      title: req.params.getArticle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, (err) => {
      res.send("successfully update article");
    });
  })
  .patch((req, res) => {
    Article.update({
      title: req.params.getArticle
    }, {
      $set: req.body
    }, (err) => {
      if(!err){
        res.send("successfully update artilce, patch!")
      }else{
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteOne({title: req.params.getArticle}, (err) => {
      if(!err){
        res.send("successfully delete");
      }
      else{
        res.send(err);
      }
    });
  });





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
