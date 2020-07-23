// Carregando módulos
    const express = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    const admin = require('./routes/admin')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    const { nextTick } = require('process')
    
// Configurações
    // Session
        app.use(session({
            secret:'p@uloRic92',
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    // Middleware
        app.use(function(req, res, next){
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
            console.log('Conectado ao MongoDB')
        }).catch(function(err){
            console.log('Ocorreu um erro ao conectar: '+err)
        })
    // Public
        app.use(express.static(path.join(__dirname, 'public')))

// Rotas
    app.use('/admin', admin)

// Outros
    const PORT = 8081;
    app.listen(PORT, function() {
        console.log('Servidor rodando!')
    })