const mongoose = require('mongoose');

const passageSchema = new mongoose.Schema({
  Date: {type: String, required: true},
  "100041114": Number, "100002880": Number, "100003032": Number,
  "100003034": Number, "100003039": Number, "100003040": Number,
  "100003041": Number, "100003042": Number, "100004575": Number,
  "100007390": Number, "100011747": Number, "100011748": Number,
  "100011783": Number, "100012217": Number, "100012218": Number,
  "100017441": Number, "100017523": Number, "100025474": Number,
  "100034805": Number, "100035408": Number, "100035409": Number,
  "100041101": Number, "100047030": Number, "100052600": Number,
  "100052601": Number, "100052602": Number, "100052603": Number,
  "100052604": Number, "100052605": Number, "100052606": Number,
  "100053055": Number, "100053057": Number, "100053058": Number,
  "100053059": Number, "100053209": Number, "100053210": Number,
  "100054073": Number, "100054241": Number, "100054585": Number,
  "100055268": Number, "100056188": Number, "100057050": Number,
  "100057051": Number, "100057052": Number, "100057053": Number,
  "100057500": Number, "300014916": Number, "300014985": Number,
  "300014986": Number, "300014993": Number, "300014994": Number,
  "300014995": Number, "300014996": Number, "300020478": Number
}, {
  timestamps: false,
  collection: 'ComptageVelo'
});

const Passage = mongoose.model('Passage', passageSchema);

module.exports = Passage;
