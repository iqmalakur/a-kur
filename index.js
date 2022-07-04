const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home', {
        title: 'AKUR Shortener Link',
        active: 'home'
    })
})

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login | AKUR Shortener Link',
        active: 'login'
    })
})

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register | AKUR Shortener Link',
        active: 'register'
    })
})

app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`)
})
