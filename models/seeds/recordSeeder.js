if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Category = require('../category')
const Record = require('../records')

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
  Promise.all(Array.from(SEED_RECORD, async (item) => {
    let { name, date, amount, category } = item
    await Category.findOne({ name: category })
      .lean()
      .then(async (item) => {
        await Record.create({
          name, date, amount, categoryId: item._id
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