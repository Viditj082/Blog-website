
const  express=require('express')

const bodyparser=require('body-parser')

const ejs=require('ejs')

const mysql=require('mysql2')

const app=express()

app.set('view engine','ejs')

app.use(express.static('public'))

const { get } = require('express/lib/response')

app.use(bodyparser.urlencoded({extended:true}))




let posts=[]

let name=''

let ifrooted=false

let warning=''

let login_warning=''

const db=mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'vidit',
    database:'authentication'
})


// Connect
db.connect((err)=>{
    if(err)
    console.log(err)
    else
    console.log('Mysql connected..')
})



app.get('/',(req,res)=>{

    res.render('login',{login_warning:login_warning})
    warning=''
    login_warning=''
})

app.get('/signup',(req,res)=>{
    res.render('signup',{warning:warning})
})

// Login process

app.post('/',(req,res)=>{
 
    let emails=req.body.email

    let passwords=req.body.password

    let sql='SELECT * FROM  users WHERE email=? AND  password=? ;'

  

    db.query(sql,[emails,passwords],(err,rows)=>{
        if(err)
        console.log(err)
        else 
        {
            if(rows.length==0)
         {
            login_warning='Credentials dont match any account, Try again'
            res.redirect('/')
         }
         else {
             if(rows[0].email===emails && rows[0].password===passwords)
             {
             
            name=rows[0].username;
            ifrooted=true
             wait(res)
             
             }
             else 
             {
                 login_warning='Credentials dont match any account, Try again'
                 res.redirect('/')
             }
         }
        }
    })

   

})

//Signup process 

app.post('/signup',(req,res)=>{

   
    
    let username=req.body.username
    
    let emails=req.body.email

    let passwords=req.body.password

    // searching if an account with this email already exists

    let sql='SELECT * FROM users where email=?'
    

    db.query(sql,[emails],(err,rows)=>{
        if(rows.length!=0)
        {   
            let exists=false;

            for(let i=0;i<rows.length;i++)
            {
                let row=rows[i]

                if(row.email===emails)
                {
                     warning='An account with this email already exists !!'
                 res.redirect('/signup')
                 exists=true
                 break
             }
             
            }


 // create new account

            if(!exists)
            {
                
            sql='INSERT INTO users  (username,email,password) VALUES (?,?,?);'

            db.query(sql,[username,emails,passwords],(err)=>{
                if(err)
                console.log(err)
                else
                {
                    ifrooted=true
                name=username
               wait(res)

                }
            })
            }
           

        }
        
        else{
             
            // Register new user

            sql='INSERT INTO users  (username,email,password) VALUES (?,?,?);'

            db.query(sql,[username,emails,passwords],(err)=>{
                if(err)
                console.log(err)
                else
               setTimeout (wait(res),500)
            })
           

        }
        
    })
})
















// v1 code (get and post requests)










app.get('/clear',(req,res)=>{
    res.redirect('/home')
})


app.get('/home',(req,res)=>{
    
  getallposts(req,res)
  
   
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
    res.send('<h2>Login first !!</h2>')
})


app.post('/compose',(req,res)=>{

    const title=req.body.title 

    const post=req.body.post
    
    const by=name
   

    if(title!=''&&post!='')
{
    
    let sql='INSERT INTO posts(posttitle,postbody,postauthor) VALUES (?,?,?)'

    db.query(sql,[title,post,by],(err)=>{
        if(err)
        console.log(err)
    })

    setTimeout(wait(res),300)
}


})

app.listen(process.env.PORT||9000,()=>{

    console.log('Server started!!')
})

async function getallposts(req,res)
{
    text='This is the home page'

    heading='Home'
    
    let sql="SELECT * FROM POSTS"

  db.query(sql,(err,rows)=>{

        posts=rows
    })
    
    if(posts.length==0)
    res.render('home',{Home:heading,content:posts,text:'This is the home page'})
    else
    res.render('home',{Home:'Recent',content:posts,text:''})
}


function wait(res)
{
    res.redirect('/home')
  
}