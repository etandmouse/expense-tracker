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
          .then((data) => {
            record.categoryIcon = data.icon
            record.date = record.date.toISOString().slice(0, 10).replaceAll("-", "/")
            totalAmount += record.amount
            return record
          })
      }))
        .then(() => {
          res.render('index', { records, totalAmount })
        })
    })
    .catch(err => console.error(err))
})

module.exports = router