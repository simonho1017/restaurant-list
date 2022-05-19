

const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./models/rest')

const bodyParser = require('body-parser')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))


// routes setting
app.get('/', (req, res) => {
  restaurantList.find()
    .lean()
    .then(lists => res.render('index', { lists }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return restaurantList.findOne({ id: `${id}` })
    .lean()
    .then(showlists => res.render('show', { showlists }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id/detail', (req, res) => {
  const id = req.params.restaurant_id
  return restaurantList.findOne({ id: `${id}` })
    .lean()
    .then(showlists => res.render('detail', { showlists }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return restaurantList.findOne({ id: `${id}` })
    .lean()
    .then(edits => res.render('edit', { edits }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  const name = req.body.name
  return restaurantList.findOne({ id: `${id}` })
    .then(List => {
      List.name = name
      return List.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/restaurants/:restaurant_id/delete', (req, res) => {
  const id = req.params.restaurant_id
  return restaurantList.findOne({ id: `${id}` })
    .then(List => List.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   const lists = restaurantList.filter(list => {
//     return list.name.includes(keyword)
//   })
//   res.render('index', { list: lists })
// })


// app.get('/search/catagory', (req, res) => {
//   const name = req.query.sampleName
//   const lists = restaurantList.filter(list => {
//     return list.category.includes(name)
//   })
//   res.render('index', { list: lists })
// })





// start and listen on the Express server
app.listen(port, () => {
  console.log(`Restaurant is listening on localhost:${port}`)
})