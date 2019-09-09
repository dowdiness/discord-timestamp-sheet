const setAuth = require('./setAuth')
const GoogleSpreadsheet = require('google-spreadsheet')

module.exports.getInfo = () => {
  const doc = new GoogleSpreadsheet(process.env.sheet_key_id);
  setAuth(doc)
  const res = await doc.getInfo()
  console.log(res)
}