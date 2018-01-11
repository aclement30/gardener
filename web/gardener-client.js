const express = require('express');
const path = require('path');

const port = 4000;

// -------------------------------------------------------------------------
// EXPRESS SETUP
// -------------------------------------------------------------------------

// Create an express instance
const app = express();

// Disable etag headers on responses
app.disable('etag');

// Set /public as our static content dir
app.use(express.static(__dirname + '/public'));

//app.use(bodyParser.urlencoded({'extended': 'true'}));           // parse application/x-www-form-urlencoded
//app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// -------------------------------------------------------------------------

const dashbordController = require('./dashboard.controller')(app);

// -------------------------------------------------------------------------
// EXPRESS ROUTING
// -------------------------------------------------------------------------

// Fire it up (start our server)
app.listen(port, (error) => {
  if (error) {
    process.stderr.write(`\x1b[31mExpress error: ${error.message}\x1b[0m`);
    process.exit(1);
    return;
  }

  process.stdout.write(`\x1b[32mExpress server listening on port ${port}\x1b[0m`);
});

app.get('/vendors/chart.bundle.min.js', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../node_modules/chart.js/dist/Chart.bundle.min.js'));
});