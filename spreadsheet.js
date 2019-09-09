const GoogleSpreadsheet = require('google-spreadsheet')

const async = require('async');
const format = require('date-fns/format')

// Load client secrets from a local file.
module.exports.spreadsheet = (payload) => {
  let hasThisMonthSheet = false
  let thisMonthId = 0
  // spreadsheet key is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(process.env.sheet_key_id);
  async.series([
    function setAuth(step) {
      var creds_json = {
        client_email: process.env.sheet_client_email,
        private_key: process.env.sheet_private_key.replace(/\\n/g, '\n')
      }  
      doc.useServiceAccountAuth(creds_json, step);
    },
    function getInfoAndWorksheets(step) {
      doc.getInfo(function(err, info) {
        console.log('Loaded doc: '+info.title+' by '+info.author.email);
        info.worksheets.map((sheet, index) => {
          console.log(`sheet ${index + 1}: ${sheet.title} ${sheet.rowCount}x${sheet.colCount}`)
          if (sheet.title === format(new Date, 'yyyy/MM')) {
            console.log("Found this month sheet")
            hasThisMonthSheet = true
            thisMonthId = index + 1
          }
        })
        if (!hasThisMonthSheet) {
          console.log("Make this month sheet...")
          doc.addWorksheet({
            title: format(new Date, 'yyyy/MM'),
            rowCount: 1,
            colCount: 3,
            headers: ['時間', '名前', '出勤・退勤']
          }, function(err, newsheet) {
            thisMonthId = newsheet.id
            if (err) {
              console.log('Error making new sheet: ', err)
            } else {
              console.log('Success making new sheet!')
              step()
            }
          })
        } else {
          step()
        }
      })
    },
    function workingWithRows(step) {
      // google provides some query options
      doc.addRow(thisMonthId, payload, function( err, sheet ){
        if (err) {
          console.log('Error at add row: ', err);
        } else {
          console.log('Succes to add new row: at', sheet.時間);
        }
        step()
      });
    },
  ], function(err){
      if( err ) {
        console.log('Error: '+err);
      }
  });
}
