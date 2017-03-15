var express = require('express')
var app = express()
const path = require('path')

app.use('/', express.static(path.join(__dirname, '/')))

app.listen(8000, function (err) {
  if (err) return (console.log('Oops. Even champions miss sometimes. Something went wrong'), process.exit(1))

  console.log('Server listening on port 8000!')
})
