const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')

require('./utils/db')
const Users = require('./models/user')
const Links = require('./models/link')

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
    const User = req.session.login ? await Users.findOne({ username: req.session.user.username, password: req.session.user.password }) : false
    let UserLinks = await Links.find()
    UserLinks = User ? UserLinks.filter((Link) => User.links.includes(Link._id.toString())) : []

    res.render('home', {
        title: 'AKUR Shortener Link',
        active: 'home',
        user: User,
        links: UserLinks,
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

app.get('/:link', async (req, res) => {
    const link = await Links.findOne({ short: req.params.link })
    if (link) res.redirect(link.original)
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
    const User = await Users.findOne({ username: req.body.username })
    if (User) {
        res.redirect('/register')
    } else {
        await Users.insertMany({
            ...req.body,
            links: [],
        })
        res.redirect('/login')
    }
})

app.post('/addLink', async (req, res) => {
    let { short } = req.body
    short = short.replace(/htt(p|ps):\/\//, '')

    const LinkExist = await Links.findOne({ short })

    if (!LinkExist && short !== 'login' && short !== 'register') {
        const Link = new Links({ ...req.body, short })
        const User = req.session.user

        Link.save()
        await Users.updateOne(User, { links: [...User.links, Link._id] })
    }

    res.redirect('/')
})

app.delete('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.delete('/deleteLink', async (req, res) => {
    const Link = await Links.findOneAndDelete({ original: req.body.link })
    const UserLinks = req.session.user.links.filter((l) => l != Link._id.toString())
    const User = await Users.findOneAndUpdate({ username: req.session.user.username, password: req.session.user.password }, { links: UserLinks })

    req.session.user = User

    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Server berjalan pada http://a-kur.herokuapp.com${port}`)
})
