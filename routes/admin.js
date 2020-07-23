const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router .get('/', (req, res)=>{
    res.render('admin/index')
})

router.get('/posts', (req, res)=>{
    res.send('Página de posts')
})

router.get('/categorias', (req, res)=>{
    Categoria.find().sort({date: 'desc'}).lean().then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res)=>{
    // Validação do formulário
        var errorList = []

        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            errorList.push({texto: 'Nome inválido!'})
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            errorList.push({texto: 'Slug inválido!'})    
        }

        if(errorList.length > 0){
            res.render('admin/addcategorias', {erros: errorList})
        } else {
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }
        
            new Categoria(novaCategoria).save().then(()=>{
                req.flash('success_msg', 'Categoria criada com sucesso!')
                res.redirect('/admin/categorias')
            }).catch((err)=>{
                req.flash('error_msg', 'Houve um error ao cadatrar a categoria')
                res.redirect('/admin/categorias')
            })
        }  
})

router.get('/categorias/edit/:id', (req, res)=>{
    Categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err)=>{
        req.flash('error_msg', 'A categoria não pôde ser encontrada')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req, res)=>{
    Categoria.findById({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno ao editar a categoria...')
            res.redirect('/admin/categorias')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Houve uma falha ao tentar editar a categoria... ')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/delete', (req, res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg', 'Não foi possível deletar essa categoria...')
    })
})

module.exports = router