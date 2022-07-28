var express = require('express');
var router = express.Router();

/* GET users listing. */

const r = require('rethinkdb');

const lib = require("../public/javascripts/toos");

let connection;

r.connect({host: 'localhost', port: 28015, db: 'csn'}).then(conn => {
    connection = conn; });


/* GET users listing. */
router.get('/',  async (req, res, next) => {

    var ini_fin = lib.get_inifin(req.query);

    contiene = lib.getconteiner(req.query);
    // perceived = lib.getperceived(req.query);
  
    // console.log('req.query', req.query);
   
    let ini = ini_fin[0];
    let fin = ini_fin[1];

    let perceived = lib.getperceived(req.query)

    // console.log(ini, fin, contiene, perceived);

    const hipocentros = await r.table('hipocentros')
    .filter(function(doc) { return r.expr(contiene).contains(doc("evaluation_status"))} )
    .filter( function(hipo) { return hipo('perceived').eq(perceived).or(hipo('perceived').eq(null)); })
    .filter(r.row('origin_time')
    .during(r.time(ini[0], ini[1], ini[2], ini[3], ini[4], ini[5], "Z"), r.time(fin[0], fin[1], fin[2], fin[3], fin[4], fin[5], "Z")))
    .orderBy(r.desc('ide'),r.desc('evaluation_status'),r.desc('creation_time')).run(connection);

    for (var hipo of hipocentros) { console.log(hipo.creation_time); };

    // lib.send().catch(console.error);

    res.json(hipocentros);
    
});

module.exports = router;