//var url = "https://8dc3-61-230-139-125.ngrok-free.app";
var url = "https://localhost:7264";
var fronturl = "https://alan-ddddd.github.io/Wiwynn/html";
var datalist;
var ddllist;
var curruntuser;
var curruntid;
var curruntlevel;
var ddlp;
var data;
var msg;
var dataid;
var db;
var dbMemo;
var turnPage;
var returnData;
var liffId = "2003018925-03bR6Jo3";
var h = new Headers({
  "ngrok-skip-browser-warning": "69420",
  //"authorization":""
});
var hcj = new Headers({
  "ngrok-skip-browser-warning": "69420",
  "Content-Type":"application/json",
  //"authorization":""
});


Number.prototype.numberFormat = function(c, d, t){
  var n = this, 
      c = isNaN(c = Math.abs(c)) ? 2 : c, 
      d = d == undefined ? "." : d, 
      t = t == undefined ? "," : t, 
      s = n < 0 ? "-" : "", 
      i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
      j = (j = i.length) > 3 ? j % 3 : 0;
     return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function uniqueArray( ar ) {
  var j = {};

  ar.forEach( function(v) {
    j[v+ '::' + typeof v] = v;
  });

  return Object.keys(j).map(function(v){
    return j[v];
  });
} 

function d(d){
  if(d.Status){
    data = d.Data;
    return true;
  }else{
    msg = d.Msg;
    return false;
  }
}
async function getA(c,a,p){
  let u = url + "/api/" + c + "/" + a;
  if(p){
    u = u + "?" + p;
  }
  var r = await fetch(u,{
    method :"GET",
    headers : h
  });
  var d = await r.json();
  if(d.Status){
    datalist = d.Data;
    return true;
  }else{
    msg = d.Msg;
    return false;
  }
}

async function getD(c,a,p,b,l){
  let u = url + "/api/" + c + "/" + a;
  if(p){
    u = u + "?" + p;
  }
  var r = await fetch(u,{
    method :"GET",
    headers : h
  });
  var d = await r.json();
  if(d.Status){
    data = d.Data;
    if(b){
      cdl(l);
    }
    return true;
  }else{
    msg = d.Msg;
    return false;
  }
}

async function postD(c,a,p,g,b,l){
  let u = url + "/api/" + c + "/" + a;
  if(g){
    u = u + "?" + g;
  }
  var r = await fetch(u,{
    method : "Post",
    headers : hcj,
    body : JSON.stringify(p)
  });
  var d = await r.json();
  if(d.Status){
    data = d.Data;
    if(b){
      cdl(l);
    }
    return true;
  }else{
    msg = d.Msg;
    return false;
  }
}

async function postFD(c,a,f,l){
  let u = url + "/api/" + c + "/" + a;
  var r = await fetch(u,{
    method : "Post",
    headers : new Headers({
      "ngrok-skip-browser-warning": "69420",
    }),
    body : f
  });
  var d = await r.json();
  if(d.Status){
    data = d.Data;
    cdl(l);
    return true;
  }else{
    msg = d.Msg;
    return false;
  }
}
async function pgD(c,a,p,g,b,l){
  let u = url + "/api/" + c + "/" + a ;
  if(g){
    u = u + "?" + g;
  }
  var r = await fetch(u,{
    method : "Post",
    headers : hcj,
    body : JSON.stringify(p)
  });
  var d = await r.json();
  if(d.Status){
    data = d.Data;
    if(b){
      cdl(l);
    }
    return true;
  }else{
    msg = d.Msg;
    return false;
  }
}

//修改datalist
function cdl(p){
  let c = true;
  $.each(datalist.datas,(i,d)=>{
    switch (p){
      case 'es':
        if(d.Elementid == data.Elementid && d.Cid == data.Cid){
          datalist.datas[i] = data;
          c = false;
        }
        break;
      case 'cust':
        if(d.cust.Custid == data.cust.Custid){
          datalist[i] = data;
          c = false;
        }
        break;
      default:
        if(d.Pdid == data.Pdid){
          datalist[i] = data;
          c = false;
        }
        break;
    }
  });
  if(c){
    switch (p){
      case "es":
        datalist.datas.push(data);
        break;
      default:
        datalist.push(data);
        break;
    }
  }
}

async function getddl(p){
  let u = url + "/api/Code/GetDDL";
    h.set("Content-Type","application/json");
  var r = await fetch(u,{
    method:"POST",
    headers:hcj,
    body : JSON.stringify(p)
  });
  var d = await r.json();
  if(d.Status){
    ddllist = d.Data;
    return true;
  }else{
    msg = d.Msg;
    return false;
  }
}

function bindDDL(p){
  $.each(p,(i,d)=>{
    let ddl = ddllist[d];
    let o = $(`.ddl`+d);
    o.empty();
    o.append(`<option value="">請選擇</option>`);
    $.each(ddl,(j,k)=>{
      o.append(`<option value="${k.Dataid}">${k.Data}</option>`)
    });
  });
};

async function Login(p){
  var r = await fetch(url+"/api/Login/login",{
    method : "POST",
    headers : hcj,
    body : JSON.stringify(p)
  })
  var d = await r.json();
  if(d.Status){
    return true;
  }else{
    msg = d.Msg;
    return false;
  }

}