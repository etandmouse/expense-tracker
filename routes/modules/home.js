const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  let totalAmount = 0
  Record.find({ userId })
    .lean()
    .then(records => {
      Promise.all(records.map(record => {
        return Category.findById({ _id: record.categoryId })
          .lean()
          .then((category) => {
            record.categoryIcon = category.icon
            record.date = record.date.toISOString().slice(0, 10).replaceAll("-", "/")
            totalAmount += record.amount
            return record
          })
          .catch(err => console.error(err))
      }))
        .then(() => {
          Category.find()
            .sort({ _id: 'asc' })
            .lean()
            .then(category => res.render('index', { records, totalAmount, category }))
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
})

router.post('/filter', (req, res) => {
  const userId = req.user._id
  const categoryId = req.body.categoryId
  if (categoryId === 'all') {
    return res.redirect('/')
  }
  let totalAmount = 0
  let categoryName = ''

  //find filter category name
  Category.findById({ _id: categoryId })
    .lean()
    .then(category => categoryName = category.name)
    .catch(err => console.error(err))

  //list items and calculate total amount
  Record.find({ categoryId, userId })
    .lean()
    .then(records => {
      Promise.all(records.map(record => {
        return Category.findById({ _id: record.categoryId })
          .lean()
          .then((category) => {
            record.categoryIcon = category.icon
            record.date = record.date.toISOString().slice(0, 10).replaceAll("-", "/")
            totalAmount += record.amount
            return record
          })
          .catch(err => console.error(err))
      }))
        .then(() => {
          Category.find()
            .sort({ _id: 'asc' })
            .lean()
            .then(category => res.render('index', { records, totalAmount, category, categoryId, categoryName }))
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
})

module.exports = router