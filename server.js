const path = require('path');
const express = require('express');
const mongoose = require('mongoose');


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/message_board', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
   comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
   message: {
    type: String,
    required: true,
  },
  comments: [CommentSchema],
}, { timestamps: true });






const Message = mongoose.model('Message', MessageSchema);


app.get('/', (req, res) => {

  Message.find()
    .then(allMsg => res.render('index', { msgs: allMsg }))
    .catch(err => {
      console.log(err);

      res.render('index', { msgs: [] })
    });
});


app.post('/message', (req, res) => {

  Message.create(req.body)
    .catch(err => console.log(err))
    .finally(() => res.redirect('/'));
});

app.post('/comment/:id', (req, res) => {

  Message.findOneAndUpdate({ _id: req.params.id }, {$push: {comments: req.body}})
    .catch(err => console.log(err))
    .finally(() => res.redirect('/'));
});



app.listen(3000, () => console.log('listening on port 3000'));