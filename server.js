//configurando o servidor
const express = require('express')
const server = express()


//configurar o Servidor para arquivos estáticos
server.use(express.static("public"))


//habilitar o corpo do formulário
server.use(express.urlencoded({extended: true}))

//conffirgurando a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user:'postgres',
    password: '131418abc',
    host: 'localhost',
    port: 5432,
    database: 'blood_donators'
})


//configurando a tamplete engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true
})
//configurar a apresentação da página
server.get("/", function(req, res){
    
    db.query(`select * from donors`, function(err, result){
        if(err) return res.send('Erro no banco de dados.')

        const donors = result.rows
        return res.render('index.html', { donors })

    })
})

server
    .post("/"
    ,function(req, res){
    const name = req.body.name
    const email = req.body.email
    const bloodType = req.body.bloodType

    if(name == "" || email == "", bloodType == "") {
        return res.send('Todos os campos são obrigatórios.')
    }
    //gravando os dados dos doadores no postGres;
    const query = `
    INSERT INTO donors ("name", "email", "bloodType")
    VALUES ($1, $2, $3)`

    const values = [ name, email, bloodType ]

    db.query(query, values, function(err){
        if(err) return res.send('Erro no banco de dados.')

        return res.redirect("/")
    })

})

//ligar o servidor
server.listen(3000, function(){
    console.log('Server was initialized!')
})