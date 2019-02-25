var urllib = require('./urllib')
var soup = require('./soup')

urllib.get('https://www.qq.com/?fromdefault', (err, response, body) => {
    var s = soup(body)
    console.log(s.find('a'))
})