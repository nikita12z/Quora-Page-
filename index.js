//######## Unique ID bana sakte using: npm i uuid
// package downloaded as: npm i method-override

const express = require("express");
const app = express();
const port = 8080; 

//to acces UUID package we require first 
const { v4: uuidv4 } = require('uuid');
//to access method override
const methodOverride = require('method-override');
//****************************************************************************************************

//for apis to understand data incoming from client we parse it as:
app.use(express.urlencoded({extended : true}));
//for apis to know method override is being used:
app.use(methodOverride("_method")); 
app.use(express.json());
//****************************************************************************************************


//to use views, public folders we require path
const path = require("path");
//VIEWS FOLDER
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//PUBLIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

//****************************************************************************************************
//------------------------------------------APIS------------------------------------------------------

//1. GET: get data for all posts with API name as "/posts"
let posts = [
    {
        id: uuidv4(),
        username: "Jennie",
        content: "In NYC!",
    },
    {
        id: uuidv4(),
        username: "Lisa",
        content: "In Paris!",
    },
    {
        id: uuidv4(),
        username: "Rose",
        content: "In Korea!",
    },
];
//CREATING PATH (A ROUTE)
//index.ejs
app.get("/posts", (req, res)=>{
    res.render("index.ejs", {posts});  
    //file render ki and idhar ka array data index.ejs ko bheja
});

//--------------------------------------------------------------------------------------------------------

// 2. POST : to add new post with API name as "/posts". TO do: a) to create a form & get info & send to BE; b) accepting a post req from form and add it to DB
app.get("/posts/new", (req, res)=>{
    //form: new.ejs
    res.render("new.ejs");  
});
app.post("/posts", (req, res)=>{
    //to add this post to original array we do:
    let {username , content} = req.body;
    let id = uuidv4();               //new post ko new post id!
    posts.push({id, username, content});
    res.redirect("/posts");  //redirecting to original page. Connecting 1 & 2 page
    //res.send("post request working");  //this is creating new page to open up so we use redirect!!!
});

//--------------------------------------------------------------------------------------------------------

// 3. GET : to get one post(using ID) API name as "/posts/:id"
//show.ejs
app.get("/posts/:id", (req, res)=>{
    let {id} = req.params;
    //to get posts now->
    let post = posts.find((p)=> id === p.id); //finds the post related to given id
    res.render("show.ejs", {post});
    //console.log(post); //on terminal
});

//--------------------------------------------------------------------------------------------------------

// 4. PATCH: to update specific post API name as "/posts/:id"
app.patch("/posts/:id", (req, res)=>{
    let { id } = req.params;
    let newContent = req.body.content;
    //1st find that post
    let post = posts.find((p)=> id === p.id); 
    //reset content
    post.content = newContent;
    console.log(post);    
    res.send("patch req working.");
});

// GET : To create edit form for the post API name as "/posts/:id/edit"
app.get("/posts/:id/edit", (req, res)=>{
    let { id } = req.params;
    let post = posts.find((p)=> id === p.id); 
    //form : edit.ejs
    res.render("edit.ejs", {post});
});

//--------------------------------------------------------------------------------------------------------

// 4. DELETE : to delete specific post API name as "/posts/:id", jis bhi post ko delete karna cahte, uske id pr request bhejenge. 
//DESTROY ROUTE
app.delete("/posts/:id", (req, res)=>{
    let { id } = req.params;
    posts = posts.filter((p)=> id !== p.id);  //filters all of those posts whose id is not equal to post.id & stores it in posts array
    //ab purana array update hoga wt vals jo filter hue & wo print hoga, baki ka sab DELETE!!!
    res.redirect("/posts");  //redirecting to original page after deletion
    //form in: index.ejs
});

//--------------------------------------------------------------------------------------------------------
//********************************************************************************************************

app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
});
