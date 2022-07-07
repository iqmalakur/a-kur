const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')

require('./utils/db')
const Users = require('./models/user')

const app = express()
const port = 3000

app.set('trust proxy', 1)
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(
    session({
        secret: 'akur',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
    })
)
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    res.render('home', {
        title: 'AKUR Shortener Link',
        active: 'home',
        user: req.session.login ? req.session.user : false,
    })
})

app.get('/login', async (req, res) => {
    const user = req.session.login ? await Users.findOne(req.session.user) : false

    if (req.session.login && user) res.redirect('/')
    else {
        res.render('login', {
            title: 'Login | AKUR Shortener Link',
            active: 'login',
            user: false,
        })
    }
})

app.get('/register', async (req, res) => {
    const user = req.session.login ? await Users.findOne(req.session.user) : false

    if (req.session.login && user) res.redirect('/')
    else {
        res.render('register', {
            title: 'Register | AKUR Shortener Link',
            active: 'register',
            user: false,
        })
    }
})

app.post('/login', async (req, res) => {
    const user = await Users.findOne({ ...req.body })
    if (user) {
        req.session.regenerate(() => {
            req.session.login = true
            req.session.user = user

            req.session.save(() => {
                res.redirect('/')
            })
        })
    } else {
        res.redirect('/login')
    }
})

app.post('/register', async (req, res) => {
    await Users.insertMany({
        ...req.body,
        links: [],
    })
    res.redirect('/login')
})

app.delete('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`)
})
