module.exports.getInfoAndWorksheets = async (doc) => {
  const hasThisMonthSheet = false
  const thisMonthId = 0
  await doc.getInfo(function(err, info) {
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
        }
      })
    }
  })
}
