var express = require("express");
var app = express();
var port = 3000;
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/eosbemonitor");

var TestnetStatsSchema = new mongoose.Schema({
  node_id: String,
  status: String,
  head_block_producer: String,
  head_block_time: String,
  info_url: String,
  head_block_id: String,
  server_version: String,
  last_irreversible_block_num: Number,
  head_block_num: Number,
  timestamp: Number,
  organization: String
});
var arrowheadStats = mongoose.model("arrowhead_stats", TestnetStatsSchema);
var jungleStats = mongoose.model("jungle_stats", TestnetStatsSchema);

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

var NodeSchema = new mongoose.Schema({
  bp_name: String,
  organization: String,
  location: String,
  node_addr: String,
  port_http: String,
  port_ssl: String,
  port_p2p: String,
  pub_key: String,
  bp: Boolean,
  enabled: Boolean,
  comment: String
});
var arrowheadNodes = mongoose.model("nodes", NodeSchema);
var jungleNodes = mongoose.model("jungle_nodes", NodeSchema);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.get("/", (req, res) => {
  res.send("BP Stats Collecting Endpoint");
});

app.get("/arrowhead/nodes", (req, res) => {
  arrowheadNodes.find({}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/jungle/nodes", (req, res) => {
  jungleNodes.find({}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
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

app.get("/arrowhead/stats", (req, res) => {
  arrowheadStats.find({}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/arrowhead/stats/:nodeid", (req, res) => {
  arrowheadStats.find({node_id: nodeid}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/jungle/stats", (req, res) => {
  jungleStats.find({}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/jungle/stats/:nodeid", (req, res) => {
  arrowheadStats.find({node_id: nodeid}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});
 
app.listen(port, () => {
  console.log("Server listening on port " + port);
});

module.exports = app;
