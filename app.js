// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./models/Post');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/basic-blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => console.error(err));

// Routes
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: 'desc' });
        res.render('index', { posts: posts });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    try {
        await post.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/new');
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('edit', { post: post });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

app.post('/edit/:id', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

app.post('/delete/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});
