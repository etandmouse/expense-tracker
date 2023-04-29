if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Category = require('../category')
const Record = require('../records')
const User = require('../users')
const bcrypt = require('bcryptjs')

const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

const SEED_RECORD = [{
  name: '午餐',
  date: '2019.04.23',
  amount: 60,
  category: '餐飲食品'
}, {
  name: '晚餐',
  date: '2019.04.23',
  amount: 60,
  category: '餐飲食品'
}, {
  name: '捷運',
  date: '2019.04.23',
  amount: 120,
  category: '交通出行'
}, {
  name: '電影：驚奇隊長',
  date: '2019.04.23',
  amount: 220,
  category: '休閒娛樂'
}, {
  name: '租金',
  date: '2015.04.01',
  amount: 25000,
  category: '家居物業'
}]

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then((user) => {
      Promise.all(Array.from(SEED_RECORD, (record) => {
        let { name, date, amount, category } = record
        return Category.findOne({ name: category })
          .lean()
          .then((category) => {
            return Record.create({
              name: name, date: date, amount: amount, categoryId: category._id, userId: user._id
            })
              .catch(error => console.error(error))
          })
          .catch(error => console.error(error))
      }))
        .then(() => {
          console.log('done')
          process.exit()
        })
    })
})
