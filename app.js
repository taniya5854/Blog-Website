const express= require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')


const app = express();
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/articleDB", {useNewUrlParser: true, useUnifiedTopology:true});

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required :true
    },
    description:{
        type:String,
    
    }, 
    createdAt:{
        type:Date,
        default : Date.now
    }
})


const Article = mongoose.model('Article' , articleSchema)

app.get('/' ,(req,res) =>
{
    Article.find({}, function(err, articles){
        res.render("index", {
            items : articles
          });
});
});
    
//     const articles = [{
//         title : "test Article 1",
//         createdAt : new Date(),
//         description : "Test description 1"
//     },
//     {
//         title : "test Article 2",
//         createdAt : new Date(),
//         description : "Test description 2"
//     },
//     {
//         title : "test Article 3",
//         createdAt : new Date(),
//         description : "Test description 3"
//     }];
//     res.render('index' , {
//         items : articles
//     })
//     console.log(articles)
// });

app.get('/posts' , (req,res)=>{
    res.render('posts')
})


app.post('/posts' , (req,res)=>{
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
       })

       article.save(function(err){
           if(!err)
           {
               res.redirect('/')
           }
       })
})

app.post('/delete', (req,res) =>
{
    const clickedItem = req.body.delete;
    console.log(clickedItem)
    Article.findByIdAndRemove( clickedItem, (err)=>
    {
        if(!err)
        {
            console.log("Deleted successfully")
            res.redirect('/')
        }
    })
})

app.get("/new/:id", function(req, res){

    const requestedId = req.params.id;
    
      Article.findOne({_id: requestedId}, function(err, post){
        res.render("new", {
          title: post.title,
          content: post.description
        });
      });
    
    });
    



app.get('/about' ,(req,res)=>
{
    res.render('about')
})


app.listen('3000' ,()=>{
    console.log("server is on port 3000")
})