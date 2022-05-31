
const  express=require('express')

const bodyparser=require('body-parser')

const ejs=require('ejs')

const app=express()

app.set('view engine','ejs')

app.use(express.static('public'))


app.use(bodyparser.urlencoded({extended:true}))


let posts=[]

let username=''

let ifrooted=false

app.get('/clear',(req,res)=>{

    posts=[]
    res.redirect('/home')
})

app.get('/fill',(req,res)=>{

    posts=[
        {
            posttitle:'a',
            postbody:'a',
            postby:'-'
        },
        {
            posttitle:'b',
            postbody:'b',
            postby:'-'
        },
        {
            posttitle:'c',
            postbody:'c',
            postby:'-'
        },
        {
            posttitle:'d',
            postbody:'d',
            postby:'-'
        },
        {
            posttitle:'e',
            postbody:'e',
            postby:'-'
        }
    ]

    res.redirect('/home')
})


app.get('/',(req,res)=>{

    res.sendFile(__dirname+'/public/initial.html')

})

app.post('/',(req,res)=>{
    let name=req.body.name
    if(name!='')
   {
        username=name
        ifrooted=true
        res.redirect('/home')
   }
})

app.get('/home',(req,res)=>{
    
    let text=''
    let heading='Recent activity'
    if(posts.length==0)
    { text='This is the home page'
    heading='Home'}

    if(ifrooted)
    res.render('home',{Home:heading,content:posts,text:text})
    else
    res.send('<h2>Enter your name first !!</h2>')
})

app.get('/contact',(req,res)=>{
    if(ifrooted)
    res.render('home',{Home:'Contact',content:[],text:'This is the contact page'})
    else
    res.send('<h2>Enter your name first !!</h2>')
})

app.get('/about',(req,res)=>{
    
    if(ifrooted)
    res.render('home',{Home:'About Us',content:[],text:'This is the about us page'})
    else
    res.send('<h2>Enter your name first !!</h2>')
})

app.get('/compose',(req,res)=>{

    if(ifrooted)
    res.render('compose')
    else
    res.send('<h2>Enter your name first !!</h2>')
})


app.post('/compose',(req,res)=>{

    const title=req.body.title 

    const post=req.body.post

    const by=username

    const postobj={
        posttitle:title,
        postbody:post,
        postby:by
    }
    if(title!=''&&post!='')
{
    posts.push(postobj)
    console.log(posts)
    res.redirect('/home')
}


})

app.listen(process.env.PORT||9000,()=>{

    console.log('Server started!!')
})