var express =require("express");
var methodOverride =require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();


// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restfull_blog_app",{useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


// MONGOOSE CONFIG
var blogSchema = mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"First Blog",
//     image:"https://images.pexels.com/photos/3278768/pexels-photo-3278768.jpeg?cs=srgb&dl=flat-lay-photography-of-an-open-book-beside-coffee-mug-3278768.jpg&fm=jpg",
//     body:"Hello this is a blog post!!"
// })

// RESTFULL ROUTES

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});
//index rout
app.get("/blogs",function(req,res){
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

// New page rout
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//create rout
app.post("/blogs",function(req,res){
    // create blog
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
            res.render("new");
        }else{
            // next Redirect to the index
            res.redirect("/blogs");
        }
    })
});

// show roout
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    })
})

// edit rout
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.render("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    })
})

// Update raut

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

// delete Rout
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})


app.listen(8080,function(){
    console.log("Server is started....");
})
