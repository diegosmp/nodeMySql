const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.render('home')
})

app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pageqtdy = req.body.qtdpages

    const querySQL = `INSERT INTO books (??, ??)
	                VALUES 
                    (?, ?)`
    const data = ['title', 'pageqty', title, pageqtdy]
    pool.query(querySQL,data, (err) => {
        if(err) {
            console.error(err)
            return
        }
    })

    res.redirect('/books')
})

app.get('/books', (req, res) => {
    const querySQL = `SELECT * FROM books`

    pool.query(querySQL, (err, data) => {
        if(err) {
            console.error(err)
            return
        }
        const books = data
        res.render('books', { books })
    })
})

app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const querySQL = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]
    pool.query(querySQL, data, (err, data) => {
        if(err) {
            console.error(err)
            return
        }

        const book = data[0]

        res.render('book', { book })
    })
})

app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id

    const querySql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]
    pool.query(querySql, data, (err, data) => {
        if(err) {
            console.error(err)
            return
        }

        const book = data[0]

        res.render('editbook', { book })
    })
})

app.post('/books/updatebook', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const pgqty = req.body.qtdpages

    const querySql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'pageqty', pgqty, 'id', id]
    pool.query(querySql, data, (err, data) => {
        if(err) {
            console.error(err)
            return
        }

        res.redirect('/books')
    })
})

app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const querySql = `DELETE FROM books WHERE ?? = ?`
    const data = ['id',id]

    pool.query(querySql, data, (err, data) => {
        if(err) {
            console.error(err)
            return
        }
        res.redirect('/books')
    })
})

app.listen(3000)