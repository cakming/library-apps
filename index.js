const express = require('express')
const app = express()
const port = 3000

const mysql = require('mysql')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'kiostix_mirza',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock' // Enable if we use MAMP
})

const path = require('path')
const { Remarkable } = require('remarkable')
const md = new Remarkable()

const bodyParser = require('body-parser')
app.use(bodyParser.json())


/**
 * #1 temukan nilai max dari [1, 5, 8, 0, 9, 7, 4, 3, 2]
 * @param Array input - Array of integers
 * @return integer
 */
function findMax (input) {
  let maxVal = 0

  input.forEach(val => {
    if (Number.isInteger(val)) {
        maxVal = (val > maxVal) ? val : maxVal
    }
  })

  return maxVal
}

/**
 * #2 0 - 100
 * Setiap kelipatan 25 akan mencetak string “KI”
 * Setiap keliaptan 40 akan mencetak string “OS”
 * Setiap kelipatan 60 akan mencetak string “TIK”
 * Dan setiap kelipatan 99 akan mencetak string “KIOSTIX”
 * @param integer loopStart - start loop from
 * @param integer loopEnd - end loop at
 * @return string
 */
function printString (loopStart = 0, loopEnd = 100)
{
  let output = ''
  for (loopStart; loopStart <= loopEnd; loopStart++) {
    let plusOne = loopStart + 1
    if (plusOne % 25 === 0) {
      output += 'KI'
    }
    if (plusOne % 40 === 0) {
      output += 'OS'
    }
    if (plusOne % 60 === 0) {
      output += 'TIK'
    }
    if (plusOne % 99 === 0) {
      output += 'KIOSTIX'
    }
  }
  return output
}

/**
 * #3 deteksi sebuah kata Palindrom
 * @param String input
 * @return boolean
 */
function isPalindrom(input = '') {
  const length = input.length
  input = input.toLowerCase()

  for (let x = 0; x < length / 2; x++) {
    if (input[x] !== input[length - 1 - x]) {
      return false;
    }
  }

  return true;
}

/**
 * #4 struktur desain tabel BUKU, PENULIS, KATEGORI
 * @return void
 */
function createTable () {
  pool.getConnection(function(err, con) {
    if (err) throw err
    console.log('Connected!')
    const sqlBuku = `CREATE TABLE buku (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nama_buku VARCHAR(200) NOT NULL,
        kategori_id INT NOT NULL,
        penulis_id INT NOT NULL,
        jumlah_halaman INT DEFAULT NULL,
        url_sampul TEXT DEFAULT NULL,
        tahun_terbit INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`

    const sqlPenulis = `CREATE TABLE penulis (
         id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
         nama_penulis VARCHAR(200) NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`

    const sqlKategori = `CREATE TABLE kategori (
         id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
         nama_kategori VARCHAR(200) NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`

    con.query(sqlBuku, function (err, result) {
      if (err) throw err
      console.log('Table buku created')
    })

    con.query(sqlPenulis, function (err, result) {
      if (err) throw err
      console.log('Table penulis created')
    })

    con.query(sqlKategori, function (err, result) {
      if (err) throw err
      console.log('Table kategori created')
    })

    con.release()
  })
}

/**
 * #5 query untuk menampilkan data semua buku berdasarkan nama penulis
 * @return Array
 */
function findBookByAuthorName (namaPenulis, callback) {
  if (!namaPenulis) throw 'Membutuhkan nama penulis'

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT buku.* FROM buku
      INNER JOIN penulis
      ON buku.penulis_id = penulis.id
      WHERE penulis.nama_penulis = '${namaPenulis}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      // console.log(result)
      con.release();
      return callback(result)
    })
  })
}

/**
 * #6 query untuk menampilkan data buku dan nama penulis berdasarkan kategori
 * @return Array
 */
function findBookByCategory (kategori, callback) {
  if (!kategori) throw 'Membutuhkan kategori'

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT buku.*, penulis.nama_penulis FROM buku
      INNER JOIN penulis
      ON buku.penulis_id = penulis.id
      INNER JOIN kategori
      ON buku.kategori_id = kategori.id
      WHERE kategori.nama_kategori = '${kategori}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      // console.log(result)
      con.release();
      return callback(result)
    })
  })
}

/**
 * #7 dokumentasi API untuk menampilkan daftar buku berdasarkan judul buku
 * @return String
 */
function getDocFindBookByBookTitle () {
  return `# Find Books by Book Title
### Endpoint
\`\`\`
GET /api/buku/by-title/{judul}
\`\`\`
### Params
| Parameter | Is Required | Description |
| ----------- | ----------- | ----------- |
| judul      | yes       | Judul buku
### Response
\`\`\`
{
    [
        {
            "id":1,
            "nama_buku":"Membuat Paludarium",
            "kategori_id":1,
            "penulis_id":1,
            "jumlah_halaman":76,
            "url_sampul":null,
            "tahun_terbit":2005,
            "created_at":"2021-08-01T16:17:47.000Z",
            "updated_at":"2021-08-01T16:17:47.000Z"
        },
        ...
    ]
}
\`\`\``
}

/**
 * #8 dokumentasi API untuk menampilkan daftar buku berdasarkan nama penulis
 * @return String
 */
function getDocFindBookByBookAuthorName () {
  return `# Find Books by Author Name
### Endpoint
\`\`\`
GET /api/buku/by-author/{nama}
\`\`\`
### Params
| Parameter | Is Required | Description |
| ----------- | ----------- | ----------- |
| nama      | yes       | Nama penulis
### Response
\`\`\`
{
    [
        {
            "id":1,
            "nama_buku":"Membuat Paludarium",
            "kategori_id":1,
            "penulis_id":1,
            "jumlah_halaman":76,
            "url_sampul":null,
            "tahun_terbit":2005,
            "created_at":"2021-08-01T16:17:47.000Z",
            "updated_at":"2021-08-01T16:17:47.000Z"
        },
        ...
    ]
}
\`\`\``
}

/**
 * #9 dokumentasi API untuk menampilkan daftar buku dan nama penulis berdasarkan nama kategori
 * @return String
 */
function getDocFindBookByBookCategory () {
  return `# Find Books by Category
### Endpoint
\`\`\`
GET /api/buku/by-category/{kategori}
\`\`\`
### Params
| Parameter | Is Required | Description |
| ----------- | ----------- | ----------- |
| kategori      | yes       | Nama kategori
### Response
\`\`\`
{
    [
        {
            "id":1,
            "nama_buku":"Membuat Paludarium",
            "kategori_id":1,
            "penulis_id":1,
            "jumlah_halaman":76,
            "url_sampul":null,
            "tahun_terbit":2005,
            "created_at":"2021-08-01T16:17:47.000Z",
            "updated_at":"2021-08-01T16:17:47.000Z",
            "nama_penulis":"Irwansyah"
        },
        ...
    ]
}
\`\`\``
}

app.get('/docs', (req, res) => {
  let text = getDocFindBookByBookTitle() + '\r\n'
  text += getDocFindBookByBookAuthorName() + '\r\n'
  text += getDocFindBookByBookCategory()
  let html = md.render(text)
  html += `<style>body {font-family: monospace;} table {border-collapse: collapse;} th, td {padding: 10px;border: 1px solid #dedede;text-align: center;} pre {border-radius:4px; border:1px solid #dedede; background: #fdfdfd; padding:10px;}</style>`
  res.send(html)
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/index.html'))
})

// views
app.get('/buku', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/buku.html'))
})

app.get('/buku/new', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/buku-form.html'))
})

app.get('/buku/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/buku-form.html'))
})

app.get('/penulis', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/penulis.html'))
})

app.get('/penulis/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/penulis-form.html'))
})

app.get('/penulis/new', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/penulis-form.html'))
})

app.get('/kategori', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/kategori.html'))
})

app.get('/kategori/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/kategori-form.html'))
})

app.get('/kategori/new', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/kategori-form.html'))
})


// APIs
app.get('/api/createtable', (req, res) => {
  createTable()

  res.send('Table Created')
})
// --------- PENULIS ----------
app.get('/api/penulis', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT * FROM penulis`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json(result)
    })
  })
})

app.get('/api/penulis/:id', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT * FROM penulis WHERE id = '${req.params.id}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json(result)
    })
  })
})

app.put('/api/penulis/:id', (req, res) => {
  const params = req.body

  if (! params.nama_penulis) {
    return res.json({
      code: 1,
      message: 'error'
    })
  }

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `UPDATE penulis SET nama_penulis = '${params.nama_penulis}' WHERE id = '${req.params.id}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json({
        code: 0,
        message: 'success'
      })
    })
  })
})

app.delete('/api/penulis/:id', (req, res) => {
  if (! req.params.id) {
    return res.json({
      code: 1,
      message: 'error'
    })
  }

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `DELETE FROM penulis WHERE id = '${req.params.id}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json({
        code: 0,
        message: 'success'
      })
    })
  })
})

app.post('/api/penulis', (req, res) => {
  const params = req.body

  if (! params.nama_penulis) {
    return res.json({
      code: 1,
      message: 'error'
    })
  }

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `INSERT INTO penulis (nama_penulis) VALUES('${params.nama_penulis}')`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json({
        code: 0,
        message: 'success'
      })
    })
  })
})

// --------- KATEGORI ----------
app.get('/api/kategori', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT * FROM kategori`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json(result)
    })
  })
})

app.get('/api/kategori/:id', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT * FROM kategori WHERE id = '${req.params.id}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json(result)
    })
  })
})

app.put('/api/kategori/:id', (req, res) => {
  const params = req.body

  if (! params.nama_kategori) {
    return res.json({
      code: 1,
      message: 'error'
    })
  }

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `UPDATE kategori SET nama_kategori = '${params.nama_kategori}' WHERE id = '${req.params.id}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json({
        code: 0,
        message: 'success'
      })
    })
  })
})

app.delete('/api/kategori/:id', (req, res) => {
  if (! req.params.id) {
    return res.json({
      code: 1,
      message: 'error'
    })
  }

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `DELETE FROM kategori WHERE id = '${req.params.id}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json({
        code: 0,
        message: 'success'
      })
    })
  })
})

app.post('/api/kategori', (req, res) => {
  const params = req.body

  if (! params.nama_kategori) {
    return res.json({
      code: 1,
      message: 'error'
    })
  }

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `INSERT INTO kategori (nama_kategori) VALUES('${params.nama_kategori}')`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json({
        code: 0,
        message: 'success'
      })
    })
  })
})

// --------- BUKU ----------
app.get('/api/buku', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT buku.*, penulis.nama_penulis FROM buku
      INNER JOIN penulis
      ON buku.penulis_id = penulis.id`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json(result)
    })
  })
})

app.get('/api/buku/by-title/:judul', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT * FROM buku WHERE nama_buku = '${req.params.judul}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json(result)
    })
  })
})

app.get('/api/buku/by-author/:nama', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT buku.*, penulis.nama_penulis FROM buku
      INNER JOIN penulis
      ON buku.penulis_id = penulis.id
      WHERE penulis.nama_penulis = '${req.params.nama}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json(result)
    })
  })
})

app.get('/api/buku/by-category/:kategori', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT buku.*, penulis.nama_penulis FROM buku
      INNER JOIN penulis
      ON buku.penulis_id = penulis.id
      INNER JOIN kategori
      ON buku.kategori_id = kategori.id
      WHERE kategori.nama_kategori = '${req.params.kategori}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json(result)
    })
  })
})

app.get('/api/buku/:id', (req, res) => {
  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `SELECT * FROM buku WHERE id = '${req.params.id}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json(result)
    })
  })
})

app.put('/api/buku/:id', (req, res) => {
  const params = req.body

  if (! params.nama_buku) {
    return res.json({
      code: 1,
      message: 'error'
    })
  }

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `UPDATE buku SET
      nama_buku = '${params.nama_buku}',
      kategori_id = '${params.kategori_id}',
      penulis_id = '${params.penulis_id}',
      jumlah_halaman = '${params.jumlah_halaman}',
      url_sampul = '${params.url_sampul}',
      tahun_terbit = '${params.tahun_terbit}'
      WHERE id = '${req.params.id}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json({
        code: 0,
        message: 'success'
      })
    })
  })
})

app.delete('/api/buku/:id', (req, res) => {
  if (! req.params.id) {
    return res.json({
      code: 1,
      message: 'error'
    })
  }

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `DELETE FROM buku WHERE id = '${req.params.id}'`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json({
        code: 0,
        message: 'success'
      })
    })
  })
})

app.post('/api/buku', (req, res) => {
  const params = req.body

  if (! params.nama_buku) {
    return res.json({
      code: 1,
      message: 'error'
    })
  }

  pool.getConnection(function(err, con) {
    if (err) throw err
    const sql = `INSERT INTO buku (
        nama_buku,
        kategori_id,
        penulis_id,
        jumlah_halaman,
        url_sampul,
        tahun_terbit
      ) VALUES(
        '${params.nama_buku}',
        '${params.kategori_id}',
        '${params.penulis_id}',
        '${params.jumlah_halaman}',
        '${params.url_sampul}',
        '${params.tahun_terbit}'
      )`

    con.query(sql, function (err, result) {
      if (err) throw err
      con.release();
      return res.json({
        code: 0,
        message: 'success'
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
