const express = require('express')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/records')

router.get("/new", (req, res) => {
  Category.find()
    .sort({ _id: 'asc' })
    .lean()
    .then(category => {
      console.log(category)
      res.render("new", { category })
    })
    .catch(error => console.error(error))
})

router.post('/', (req, res) => {
  const { name, date, amount, categoryId } = req.body
  console.log(req.body)
  console.log(name, date, amount, categoryId)
  Record.create({ name, date, amount, categoryId })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router