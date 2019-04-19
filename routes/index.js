const express = require('express')
const router = express.Router()
const Datastore = require('nedb')

const db = new Datastore({
  autoload: true,
  filename: 'gifts.db'
})

/* GET home page. */
router.get('/', (req, res, next) => {
  db.find({}, (err, docs) => {
    res.send(docs)
  })
})

router.get('/:id', (req, res, next) => {
  db.findOne({ _id: req.params.id }, (err, docs) => {
    res.send(docs)
  })
})

router.post('/', (req, res, next) => {
  const { name, price } = req.body

  if (!name) return res.send(418, { error: 'No name' })
  if (!parseInt(price)) return res.send(418, { error: 'No price' })

  const doc = {
    name: name,
    price: parseInt(price)
  }

  db.insert(doc, (err, newDoc) => {   // Callback is optional
    res.send(newDoc)
  })
})

router.delete('/:id', (req, res, next) => {
  db.remove({ _id: req.params.id }, (err, numRemoved) => {
    res.send({
      numRemoved: numRemoved
    })
  })
})

module.exports = router
