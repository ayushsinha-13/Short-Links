require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()


/* 
        DATABASE CONNECTION
        use .env file for using your custom mongoDB database
*/
const mongoPort = process.env.MONGO_PORT
mongoose.connect(mongoPort,{useNewUrlParser: true,useUnifiedTopology:true},()=>{
    console.log("Database connected successfully")
})

app.use(express.static("public"));
app.set('view engine','ejs')
app.use(express.urlencoded({
    extended: false
}))

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server Started")
});

app.get('/', async (req,res)=>{
    const shortUrls = await ShortUrl.find();
    res.render('index', {shortUrls: shortUrls});
})

app.post('/shortUrl', async(req,res)=>{
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.post('/delete/:shortUrl', async(req,res)=>{
    const deleteShortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    await ShortUrl.deleteOne({short: deleteShortUrl.short})
    res.redirect('/')
})

app.get('/:shortUrl', async(req,res)=>{
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})