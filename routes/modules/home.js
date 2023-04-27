const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  let totalAmount = 0
  Record.find()
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
      }))
        .then(() => {
          Category.find()
            .sort({ _id: 'asc' })
            .lean()
            .then(category => {
              res.render('index', { records, totalAmount, category })

            })
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
})

router.post('/filter', (req, res) => {
  const categoryId = req.body.categoryId
  if (categoryId === 'all') {
    return res.redirect('/')
  }
  let totalAmount = 0
  let categoryName = ''
  Record.find({ categoryId })
    .lean()
    .then(records => {
      Promise.all(records.map(record => {
        return Category.findById({ _id: record.categoryId })
          .lean()
          .then((category) => {
            record.categoryIcon = category.icon
            record.date = record.date.toISOString().slice(0, 10).replaceAll("-", "/")
            categoryName = category.name
            totalAmount += record.amount
            return record
          })
      }))
        .then(() => {
          Category.find()
            .sort({ _id: 'asc' })
            .lean()
            .then(category => {
              res.render('index', { records, totalAmount, category, categoryId, categoryName })
            })
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
})

module.exports = router