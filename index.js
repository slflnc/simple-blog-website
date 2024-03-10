import express from "express";
import methodOverride from 'method-override';
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

let blogEntries = [];

let customers = []

let nextId = 0;
let contactID = 0;

app.get("/", (req, res) => {
    res.redirect("/home");
})

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.post("/contact/customers/", (req, res) => {
    const custData = req.body;
    custData.id = contactID++;
    customers.push(custData)
    console.log("Recieved customer data: ", custData);
    res.redirect("/home");
})

app.get("/blogs", (req, res) => {
    res.render("blogs.ejs", { id: nextId }); //JS Object to pass over to EJS for use.
});
app.post("/blogs", (req, res) => {
    const blogData = req.body; 
    blogData.id = nextId++;
    blogEntries.push(blogData);
    console.log("Received blog data:", blogData);
    console.log(blogEntries); 
    res.redirect("/home");
});

app.get("/blogs/blogposts/:id", (req, res) => {
    const id = Number(req.params.id)
    const blogposts = blogEntries.find(blogpost => blogpost.id === id)

    if (blogposts) {
        res.json(blogposts)
    } else {
        res.status(404).end()
    }
})

app.delete("/deleteitems/:id", (req, res) => {
    const idToDelete = Number(req.params.id)
    blogEntries = blogEntries.filter(blogpost => blogpost.id !== idToDelete)
    res.redirect("/home");
    console.log(blogEntries)
})

app.get("/edititems/:id", (req, res) => {
    const idToEdit = Number(req.params.id)
    const blogEntry = blogEntries.find(blogpost => blogpost.id === idToEdit)
    res.render("edit.ejs", { blogEntry: blogEntry })
})

app.post("/updateitem/:id", (req, res) => {
    const idToUpdate = Number(req.params.id);
    const newEntry = req.body;

    // Find the index of the blog entry with the given id
    const index = blogEntries.findIndex(blogpost => blogpost.id === idToUpdate);

    if (index !== -1) {
        // Preserve the original id and update the rest of the entry
        blogEntries[index] = { ...newEntry, id: idToUpdate }; // Explicitly set `id` to `idToUpdate`
        res.redirect("/home");
    } else {
        // Handle the case where no entry is found
        res.status(404).send("Blog entry not found.");
    }
    console.log(blogEntries)
});


app.get("/home", (req, res) => {
    res.render("home.ejs", {blogEntries: blogEntries, id : nextId}); //passing over the array to display, and also the id to select.
});



app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})