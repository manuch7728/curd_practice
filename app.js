const express = require('express');
const path = require('path');
const userModel = require('./models/userschema');
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home Page
app.get('/', (req, res) => {
    res.render("index");
});

// Read All Users
app.get('/read', async (req, res) => {
    try {
        let users = await userModel.find();
        res.render("read", { users });
    } catch (err) {
        res.send(err);
    }
});

// Show Edit Form
app.get('/edit/:userid', async (req, res) => {
    try {
        let user = await userModel.findById(req.params.userid);
        if (!user) return res.send("User not found");
        res.render("edit", { user });
    } catch (err) {
        res.send(err);
    }
});

// Update User
app.post('/edit/:userid', async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userid, {
            name: req.body.name,
            email: req.body.email,
            image: req.body.image
        });
        res.redirect('/read');
    } catch (err) {
        res.send(err);
    }
});

// Create User
app.post('/create', async (req, res) => {
    try {
        await userModel.create({
            name: req.body.name,
            email: req.body.email,
            image: req.body.image
        });
        res.redirect("/read");
    } catch (err) {
        res.send(err);
    }
});

// Delete User
app.get('/delete/:id', async (req, res) => {
    try {
        await userModel.findOneAndDelete({ _id: req.params.id });
        res.redirect("/read"); 
    } catch (err) {
        res.send(err);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
