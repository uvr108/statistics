
"use strict";
const nodemailer = require("nodemailer");

function getdate(fecha) {

    const yr = parseInt(fecha.substring(0,4));
    const mo = parseInt(fecha.substring(5,7));
    const da = parseInt(fecha.substring(8,10));
    const hr = parseInt(fecha.substring(11,13));
    const mi = parseInt(fecha.substring(14,16));
    const se = parseInt(fecha.substring(17,19));
  
    const lista = [yr,mo,da,hr,mi,se];
  
    return(lista);
  
  }


function getconteiner(q) {

  const preliminary = q.preliminary;
  const confirmed = q.confirmed;
  const reviewed = q.reviewed;
  const final = q.final;
  const perceived = q.perceived;
  let   contiene = [];

  if (preliminary == 'true') { contiene.push("preliminary"); }
  if (confirmed == 'true') { contiene.push("confirmed"); }
  if (reviewed == 'true') { contiene.push("reviewed"); }
  if (final == 'true') { contiene.push("final"); }
  if (perceived == 'true') { contiene.push("perceived"); }

  return contiene;

}

function get_inifin(q) {

    var ini;
    var fin;

    if ( q.per_ini == 'null' ) { 
      ini = [1970,1,1,0,0,0] 
    } 
    else { 
    per_ini = q.per_ini + 'T00:00:00';
    ini = lib.getdate(per_ini);
    }
    
    if ( q.per_fin == 'null' ) { 
    
    fin = [2032,1,1,0,0,0]; 
    } 
    else { 
    per_fin = q.per_fin + 'T23:59:59';
    fin = lib.getdate(per_fin);
    }  
    return [ini,fin]
}

  module.exports = { getdate, getconteiner, get_inifin };