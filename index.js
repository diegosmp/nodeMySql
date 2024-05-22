const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

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

    const querySQL = `INSERT INTO books (title, pageqty)
	                VALUES 
                    ('${title}', ${pageqtdy})`
    conn.query(querySQL, (err) => {
        if(err) {
            console.error(err)
            return
        }
        console.log('Query inserida com sucesso')
        
    })

    res.redirect('/books')
})

app.get('/books', (req, res) => {
    const querySQL = `SELECT * FROM books`

    conn.query(querySQL, (err, data) => {
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

    const querySQL = `SELECT * FROM books WHERE id = ${id}`

    conn.query(querySQL , (err, data) => {
        if(err) {
            console.error(err)
        }

        const book = data[0]

        res.render('book', { book })
    })
})

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
})

conn.connect((err) => {
    try {
        console.log('MySQL conectado')
    } catch (error) {
        console.error(err)
    }
})

app.listen(3000, () => {
    console.log('Servidor iniciado')
})