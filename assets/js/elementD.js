var detailList;
var eleData;
var tempddl=[];
ddlp = ["unit","CTYPE"];

getddl(ddlp).then(x=>{
  if(x){
    bindDDL(ddlp);
    //bindT("systbody","sys","m");
  }else{
    alert(msg);
  }
}).catch(x=>{
  alert(x)
})
$(function(){
  getA("Element","getEleList",`type=D`).then((x=>{
    if(x){
      detailList = datalist;
      // let table = $(`#formlist`);
      let eles = $(`#q_element`);
      let eleid = $(`#eleid`);
      // table.empty();
      eles.empty();
      eleid.empty();
      eles.append(`<option>All</option>`)
      eleid.append(`<option>Choose one</option>`)
      $.each(datalist.eles,function(i,d){
        // table.append(`<tr style="cursor:pointer"><td>${d.Elementid}</td><td>${d.Elementnm}</td></tr>`);
        eles.append(`<option value="${d.Elementid}">${d.Elementnm}</option>`)
        eleid.append(`<option value="${d.Elementid}">${d.Elementnm}</option>`)
      })
      eles.append(`<option value="test">test</option>`)
    }else{
      alert(msg);
    }
    getD("EleData","getEleDs").then(x=>{
      let table = $(`#formlist`);
      table.empty();
      let objs = [];
      let obj = [];
      let did = "";
      data.filter((x,i)=>{
        if(did != x.Did){
          obj.length > 0 ? objs.push(obj):null;
          obj = [];
        }
        obj.push(x);
        did = x.Did;
      })
      if(obj.length > 0)
        objs.push(obj);
      eleData = objs;
      eleData.filter((d,i)=>{
        let c = d[0];
        table.append(`<tr data-id="${c.Did}" style="cursor:pointer"><td>${c.Elementid}</td><td>${c.Cval}</td></tr>`)
      });
    })
  }))
  
})
function bindT(t,ddlnm,m){
  let table = $(`#`+t);
  table.empty();
  $.each(ddllist[ddlnm],(i,d)=>{
    let b = m=="m"?`<div class="dropdown">
               <button type="button" class="btn btn-primary btne"
                data-bs-toggle="modal"
                data-bs-target="#modalCenter" data-id="${d.Dataid}">Edit Detail</button>
             </div>`
             :`<small class="badge bg-label-warning dataedit" style="cursor:pointer;">Edit</small>
             <small class="badge bg-label-danger datadel" style="cursor:pointer;">Delete</small>`;
    table.append(`<tr>
                  <td>${d.Dataid}</td>
                  <td>${d.Data}</td>
                  <td>
                    ${b}
                  </td>
                </tr>`);
  });
}
$(`#qSearch`).on(`click`,function(){
  let key = $(`#q_key`).val();
  let ele = $(`#q_element option:selected`).val();
  $("#formlist tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1 && ele == "All" ? true:$($(this).find(`td`)[1]).html()==ele)
  });
})
$(`#systbody`).on(`click`,`.btne`,function(){
  let me = $(this);
  let id = me.data("id");
  $(`#sysid`).html(me.parent().parent().prev().prev().html());
  $(`#sysname`).html(me.parent().parent().prev().html());
  $(`#dataid`).removeAttr("disabled");
  $(`#dataid`).val("");
  $(`#data`).val("");
  getddl([id]).then(x=>{
    if(x){
      bindT('detailtbody',id,"S")
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x)
  });
})

//取得細節資料
async function getDetail(dg,pg){
  let tbody = $(`#ddatetable tbody`);
  tbody.empty();
  let parame = pg ? "&parentgroup=" + pg : "";
  let response = await fetch(url+"/api/Code?datagroup=" + dg +parame,{
    method : "get",
    headers : new Headers({
      "ngrok-skip-browser-warning": "69420",
    })
  })
  let datas = await response.json();
  if(datas.Status){
    $.each(datas.Data,(index,data)=>{
      tbody.append(`<tr>
      <td style="width:30%">${data.dataid}</td>
      <td style="width:40%">${data.data}</td>
      <td style="width:30%">
        <small class="badge bg-label-warning dataedit" style="cursor:pointer;">edit</small>
        <small class="badge bg-label-danger datadel" style="cursor:pointer;">delete</small>
      </td>
      </tr>`)
    });
  }
}

$(`#formlist`).on('click','tr',function(){
  let Did = $(this).data("id");
  let choose = eleData.filter(x=>x[0].Did == Did)[0];
  $(`#eleid option`).removeAttr("selected").filter(`[value="${choose[0].Elementid}"]`).attr("selected",true);
  $(`#eleid`).change();
  let universal = $(`.universal`);
  $.each(universal,(i,d)=>{
    let c = choose.filter(x=>x.Cid == $(d).data("id"))[0];
    if(c){
      let val = c.Cval;
      switch (d.tagName){
        case "INPUT":
          $(d).val(val);
          break;
        case "SELECT":
          tempddl.push({key:$(d).data("id"),value:val})
          break;
        case "BUTTON":
          break;
      }
    }
  });
  $(`#save`).data(`id`,Did);
});

function getOption(d){
  return $(`#${$(d).data("id")} option`).length == 0
}

$(`#dbtn`).on('click',()=>{
  let dataid = $(`#dataid`).val() || "";
  let data = $(`#data`).val() || "";
  $(`#parentgroup`).attr("disabled",true);
  if(dataid != "" && data != ""){
    let tbody = $(`#ddatetable tbody`);
    tbody.prepend(`<tr>
      <td style="width:30%">${dataid}</td>
      <td style="width:40%">${data}</td>
      <td style="width:30%">
        <small class="badge bg-label-warning dataedit" style="cursor:pointer;">edit</small>
        <small class="badge bg-label-danger datadel" style="cursor:pointer;">detele</small>
      </td>
      </tr>`);
    $(`#dataid`).removeAttr("disabled");
    $(`#dataid`).val("");
    $(`#data`).val("");
  }
})
$(`#ddatetable tbody`).on('click','.datadel',function(){
  $(this).parent().parent().remove();
});
$(`#ddatetable tbody`).on('click','.dataedit',function(){
  let thistd = $(this).parent();
  $(`#dataid`).val(thistd.prev().prev().html());
  $(`#dataid`).attr("disabled","disable");
  $(`#data`).val(thistd.prev().html());
  thistd.parent().remove();
});
//取得table資料
$(`#tableArea`).on(`click`,function(){
  let table = $(this).prev().find(`option:selected`);
  let id = table.val();
  let name = table.html();
  $(`#tableid`).val(id);
  $(`#tablename`).val(name);bindT('detailtbody',[id],"S");
  getD("Element","getEleT",`eleid=${$(`#ELEMENTID`).val()}&cid=${$(`#CID`).val()}&code=${id}`).then(x=>{
    if(x){
      console.log(data);
      let detail = $(`#detailtbody`);
      detail.empty();
      if(data.source=="td"){
        $.each(data.datas,(i,d)=>{
          detail.append(`<tr>
              <td style="width:30%">${d.Dataid}</td>
              <td style="width:40%">${d.Dataval || ""}</td>
              <td style="width:30%">
                <small class="badge bg-label-warning dataedit" style="cursor:pointer;">edit</small>
                <small class="badge bg-label-danger datadel" style="cursor:pointer;">detele</small>
              </td>
          </tr>`)
        })
      }else{
        $.each(data.datas,(i,d)=>{
          detail.append(`<tr>
              <td style="width:30%">${d.Dataid}</td>
              <td style="width:40%"></td>
              <td style="width:30%">
                <small class="badge bg-label-warning dataedit" style="cursor:pointer;">edit</small>
                <small class="badge bg-label-danger datadel" style="cursor:pointer;">detele</small>
              </td>
          </tr>`)
        })
      }
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
});
$(`#tablesend`).on(`click`,function(){
  save().then(x=>{
    if(x){
      $(`#save`).data(`id`,x);
      let table = {//組物件
        eleid : $(`#eleid option:selected`).val(),
        cid :$(`#tablesend`).data(`cid`),
        eledataid:$(`#save`).data(`id`) || x,
        list : []
      };
      //組資料
      $.each($(`#ddatetable tbody tr`),(index,data)=>{
        let item = {
          dataid : $($(data).children()[0]).html(),
          dataval : $($(data).children()[1]).html()
        }
        table.list.push(item);
      });
      postD("Element","saveEleT",table).then(x=>{
        if(x){
          alert(x)
        }else{
          alert(msg)
        }
      }).catch(x=>{
        alert(x);
      })
    }
  })
});

$(`#add`).on(`click`,function(){
  $(`#qArea`).hide(130);
  $(`#lArea`).hide(130);
  let eleid = $(`#eleid`)
  $(`#save`).data(`id`,``);
  $(`#generate input`).removeAttr(`disabled`)
})

$(`#eleid`).on(`change`,function(){
  let eleid = $(`#eleid option:selected`).val();
  let eles = datalist.datas.filter(x=>x.Elementid == eleid);
  let obj = "";
  let add = 4 - eles.length % 4;
  for(let i = 0;i<add;i++){
    eles.push(null);
  }
  let ddls = [];
  $.each(eles,(i,d)=>{
    if(i % 4 == 0)
      obj += `<div class="row">`;
    if(d == null){
      obj+=`<div class="col"></div>`;
    }else{
      obj+=`<div class="col">
              <label for="${d.Cid}" class="form-label-sm">${d.Cnm}</label><br/>
              ${getObj(d)}
            </div>`;
    }
    if(i % 4 == 3)
      obj += `</div>`;
    if(d && d.Ctype == "ddl")
      ddls.push(d.Cddl);
  })
  $(`#generate`).empty().append(obj);
  if(ddls.length)
    getddl(ddls).then(x=>{
      if(x){
        bindDDL(ddls);
        if(tempddl.length > 0){
          tempddl.filter((x,i)=>{
            $(`#${x.key} option`).removeAttr(`selected`).filter(`[value="${x.value}"]`).attr(`selected`,true);
          })
          tempddl = []
        }
      }
    });
})

function getObj(d){
  let result = "";
  switch(d.Ctype){
    case 'ddl':
      result = `<select class="form-control-sm ddl${d.Cddl} universal" 
                        data-ele="${d.Elementid}"
                        data-id="${d.Cid}"
                        id="${d.Cid}"></select>`
      break;
    case 'table':
      result = `<button type="button" 
                        class="btn btn-primary settable universal" 
                        data-ele="${d.Elementid}"
                        data-id="${d.Cid}" 
                        id="${d.Cid}"
                        data-table="${d.Cddl}" 
                        data-bs-toggle="offcanvas" 
                        data-bs-target="#offcanvasRight" 
                        aria-controls="offcanvasRight"
                        >
                        Setting Table
                        </button>`
      break;
    default:
      result = `<input type="text" 
                       data-ele="${d.Elementid}"
                        data-id="${d.Cid}" 
                        id="${d.Cid}" 
                       class="form-control-sm universal" ${d.Func == "" ? "":"disabled value='sysfunc'"}/>`
      break;
  }
  return result
}

$(`#generate`).on(`click`,'.settable',function(){
  let ref = $(this).data(`table`);
  let eleid = $(this).data(`ele`);
  let cid = $(this).data(`id`);
  $(`#tableid`).val(ref);
  $(`#tablesend`).data(`cid`,cid);
  getD("Element","getEleT",`eleid=${eleid}&cid=${cid}&code=${ref}&did=${$(`#save`).data('id')}`).then(x=>{
    if(x){
      let detail = $(`#detailtbody`);
      detail.empty();
      if(data.source=="td"){
        $.each(data.datas,(i,d)=>{
          detail.append(`<tr data-id="${d.Id}">
              <td style="width:30%">${d.Dataid}</td>
              <td style="width:40%">${d.Dataval || ""}</td>
              <td style="width:30%">
                <small class="badge bg-label-warning dataedit" style="cursor:pointer;">edit</small>
                <small class="badge bg-label-danger datadel" style="cursor:pointer;">detele</small>
              </td>
          </tr>`)
        })
      }else{
        $.each(data.datas,(i,d)=>{
          detail.append(`<tr>
              <td style="width:30%">${d.Dataid}</td>
              <td style="width:40%"></td>
              <td style="width:30%">
                <small class="badge bg-label-warning dataedit" style="cursor:pointer;">edit</small>
                <small class="badge bg-label-danger datadel" style="cursor:pointer;">detele</small>
              </td>
          </tr>`)
        })
      }
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
})

$(`#save`).on(`click`,function(){
  save();
});

async function save(){
  let eleid = $(`#eleid option:selected`).val();
  let universal = $(`.universal`);
  let did = $(`#save`).data('id');
  console.log(universal);
  let p =[];
  $.each(universal,(i,d)=>{
    p.push({
      Elementid : eleid,
      Cid : $(d).data("id"),
      Cval :  $(d).val() || $($(d).find(`option:selected`)[0]).val() || "systb",
      Did: `${did}`
    })
  });
  console.log(p)
  let result;
  await postD("EleData","saveEleDs",p).then(x=>{
    if(x){
      alert("success")
    }
    result = data
  })
  return result
}