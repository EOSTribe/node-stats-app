var express = require("express");
var app = express();
var port = 3000;
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/eosbemonitor");

var BPStatsSchema = new mongoose.Schema({
  producer: String,
  node_status: String,
  os_name: String,
  hostname: String,
  external_ip: String,
  internal_ip: String,
  server_uptime: String,
  cpu_info: String,
  cpu_speed: String,
  cpu_count: String,
  cpu_load: String,
  ram_total: String,
  ram_used: String,
  ram_free: String,
  ram_cache: String,
  ram_available: String,
  timestamp: String
});
var BPStats = mongoose.model("BPStats", BPStatsSchema);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.get("/", (req, res) => {
  res.send("BP Stats Collecting Endpoint");
});

app.get("/bpstats", (req, res) => {
  BPStats.find({}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/bpstats/:name", (req, res) => {
  var name = req.params.name;
  BPStats.find({producer: name}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/bpstats", (req, res) => {
  var stats = new BPStats(req.body);
  stats.save()
    .then(item => {
      res.send("BP stats saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save stats to database");
    }); 
});
 
app.listen(port, () => {
  console.log("Server listening on port " + port);
});

module.exports = app;
