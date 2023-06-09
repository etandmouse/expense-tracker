const express = require('express')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/records')

router.get("/new", (req, res) => {
  Category.find()
    .sort({ _id: 'asc' })
    .lean()
    .then(category => {
      res.render("new", { category })
    })
    .catch(error => console.error(error))
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, amount, categoryId } = req.body
  Record.create({ name, date, amount, categoryId, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

router.get('/:_id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      record.date = record.date.toISOString().slice(0, 10)
      const categoryId = record.categoryId
      Category.find()
        .sort({ _id: 'asc' })
        .lean()
        .then(categories => {
          Category.findById(categoryId)
            .then(category => {
              categoryName = category.name
              res.render('edit', { record, categoryId, category: categories, categoryName })
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

router.put('/:_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  const { name, date, amount, categoryId } = req.body
  Record.findOne({ _id, userId })
    .then(record => {
      record.name = name
      record.date = date
      record.amount = amount
      record.categoryId = categoryId
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

router.delete('/:_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})


module.exports = router