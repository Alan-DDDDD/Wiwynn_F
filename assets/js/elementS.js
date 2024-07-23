var detailList;
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
$(getall())
async function getall(){
  getA("Element","getEleList").then((x=>{
    if(x){
      let table = $(`#formlist`);
      table.empty();
      $.each(datalist.eles,function(i,d){
        table.append(`<tr style="cursor:pointer"><td hidden>${d.Elementid}</td><td>${d.Elementnm}</td></tr>`)
      })
    }else{
      alert(msg);
    }
  }))
}
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



//確認送出
$(`#send`).on(`click`,async ()=>{
  let ele = {//組物件
    Id : $(`#send`).data('id') || 0,
    Elementid : $(`#ELEMENTID`).val(),
    Elementnm : $(`#ELEMENTNM`).val(),
    Cid : $(`#CID`).val(),
    Cnm : $(`#CNM`).val(),
    Ctype : $(`#CTYPE option:selected`).val(),
    Cddl : $(`#CDDL option:selected`).val(),
    Refvaltype : $(`#REFVALTYPE option:selected`).val(),
    Func :$(`#CFUNC`).val(),
    Invaliddt : $(`#InvalidDt`).val() || null,
  };
  if(!ele.Elementid || !ele.Elementnm){
    alert("Please input Element Name and Id,Thanks!!")
  }else if(ele.Cddl && !ele.Refvaltype) {
    alert("Please choose Return value type,Thanks!!")
  }else{
    postD("Element","insertEleS",ele,true,"es").then(x=>{
      if(x){
        //alert(msg);
        udetaillist(data.Elementid);
      }else{
        alert(msg);
      }
    }).catch(x=>{
      alert(x);
    })
    $(`.btn-close`).click();
  }
})

$(`#CTYPE`).on(`change`,function(){
  let val = $(`#CTYPE option:selected`).val();
  if(val=="ddl" || val =="table"){
    $(`#CDDL`).parent().parent().parent().removeAttr('hidden');
    $(`#REFVALTYPE`).parent().parent().removeAttr('hidden');
    if(val == "ddl"){
      $(`#CDDL`).prev().html("Column data source");
    }
    else{
      $(`#CDDL`).prev().html("Reference table of column")
    }
  }else{
    $(`#CDDL`).parent().parent().parent().attr('hidden',true);
    $(`#REFVALTYPE`).parent().parent().attr('hidden',true);
  }
});
$(`#CDDL`).on('change',function(){
  let CDDL = $(`#CDDL option:selected`).val();
  let CTYPE = $(`#CTYPE option:selected`).val();
  if(CDDL && CTYPE == "table"){
    
  }
});

$(`#schema`).on(`click`,function(){
  $(`#ELEMENTID`).val($(`#elementId`).val());
  $(`#ELEMENTNM`).val($(`#elementName`).val());
  $(`#CID`).val("");
  $(`#CNM`).val("");
  $(`#InvalidDt`).val(null);
  $(`#CTYPE option`).removeAttr("selected").filter(`[value=""]`).attr('selected',true);
  $(`#CDDL option`).removeAttr("selected").filter(`[value=""]`).attr('selected',true);
  $(`#REFVALTYPE option`).removeAttr("selected").filter(`[value=""]`).attr('selected',true);
});

$(`#formlist`).on('click','tr',function(){
  let eleid = $($(this).find(`td`)[0]).html();
  let elenm = $($(this).find(`td`)[1]).html();
  $(`#elementId`).val(eleid);
  $(`#elementName`).val(elenm);
  udetaillist(eleid);
});

function udetaillist(eleid){
  let t = $(`#DetailList`);
  t.empty();
  $.each(datalist.datas,function(i,d){
    if(d.Elementid == eleid){
      t.append(`
        <tr  style="cursor:pointer;"data-bs-toggle="modal"
                  data-bs-target="#modalCenter" >
          <td>${d.Cid}</td>
          <td>${d.Cnm}</td>
          <td>${d.Ctype}</td>
          <td>${d.Cddl || ""}</td>
          <td>${d.Refvaltype || ""}</td>
          <td>${d.Func || ""}</td>
          <td>${d.Invaliddt || ""}</td>
        </tr>
        `)
      }
    });
}
$(`#DetailList`).on(`click`,'tr',function(){
  $(`#CDDL`).parent().parent().parent().attr('hidden',true);
  $(`#REFVALTYPE`).parent().parent().attr('hidden',true);
  $(`#ELEMENTID`).val($(`#elementId`).val());
  $(`#ELEMENTNM`).val($(`#elementName`).val());
  let tr = $(this);
  let tds = tr.find("td")
  $(`#CID`).val(tds[0].innerHTML);
  $(`#CNM`).val(tds[1].innerHTML);
  !tds[2].innerHTML ? "":$(`#CTYPE option`).removeAttr("selected").filter(`[value=${tds[2].innerHTML}]`).attr("selected",true);
  !tds[3].innerHTML ? "":$(`#CDDL option`).removeAttr("selected").filter(`[value=${tds[3].innerHTML}]`).attr("selected",true);
  !tds[4].innerHTML ? "":$(`#REFVALTYPE option`).removeAttr("selected").filter(`[value=${tds[4].innerHTML || ""}]`).attr("selected",true);
  $(`#CFUNC`).val(tds[5].innerHTML);
  $(`#InvalidDt`).val(tds[6].innerHTML.substring(0,10));
  $(`#CTYPE`).change();
});

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
//確認送出
$(`#tablesend`).on(`click`,async ()=>{
  let id = $(`#tableid`).val();
  let codetable = {//組物件
    datagroup : id,
    datas : []
  };
  //組資料
  $.each($(`#ddatetable tbody tr`),(index,data)=>{
    let item = {
      dataid : $($(data).children()[0]).html(),
      data : $($(data).children()[1]).html()
    }
    codetable.datas.push(item);
  });
console.log(codetable);
  postD("Code","Insert",codetable,false).then(x=>{
    if(x){
      alert(msg);
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
  // $(`.btn-close`).click();
})
//取得table資料
$(`#tableArea`).on(`click`,function(){
  let table = $(this).prev().find(`option:selected`);
  let id = table.val();
  let name = table.html();
  $(`#tableid`).val(id);
  $(`#tablename`).val(name);bindT('detailtbody',[id],"S");
  postD("Code","GetDDL",[id]).then(x=>{
    if(x){
      let detail = $(`#detailtbody`);
      detail.empty();
      $.each(data[id],(i,d)=>{
        detail.append(`<tr>
            <td style="width:30%">${d.Dataid}</td>
            <td style="width:40%">${d.Data || ""}</td>
            <td style="width:30%">
              <small class="badge bg-label-warning dataedit" style="cursor:pointer;">edit</small>
              <small class="badge bg-label-danger datadel" style="cursor:pointer;">detele</small>
            </td>
        </tr>`)
      })
      getD("Element","getEleBindP",`eleid=${$(`#ELEMENTID`).val()}&cid=${$(`#CID`).val()}`).then(x=>{
        if(x){
          $(`#PDCCID option`).removeAttr('selected').filter((i,x)=>$(x).val() == data[0].BindPcid).attr("selected",true)
        }
      })
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
});
// $(`#tablesend`).on(`click`,function(){
//   let table = {//組物件
//     eleid : $(`#ELEMENTID`).val(),
//     cid :$(`#CID`).val(),
//     list : []
//   };
//   //組資料
//   $.each($(`#ddatetable tbody tr`),(index,data)=>{
//     let item = {
//       dataid : $($(data).children()[0]).html(),
//       dataval : $($(data).children()[1]).html()
//     }
//     table.list.push(item);
//   });
//   //要重寫這裡是給ElementD使用
//   // postD("Element","saveEleT",table).then(x=>{
//   //   if(x){
//   //     alert(x)
//   //   }else{
//   //     alert(msg)
//   //   }
//   // }).catch(x=>{
//   //   alert(x);
//   // })
// });

$(`.nav-item`).on(`click`,function(){
  let page = $(this).data('page');
  $(`.nav-item a`).removeClass(`active`);
  $(this).find(`a`).addClass("active");
  let tab = $(`.tab`);
  tab.attr(`hidden`,true);
  $.each(tab,(i,d)=>{
    if($(d).data(`id`)==page){
      $(d).removeAttr("hidden");
    }
  });
});

$(`#bindsend`).on(`click`,function(){
  let p = {
    Elementid : $(`#ELEMENTID`).val(),
    Columnid : $(`#CID`).val(),
    BindPid : $(`#PDCID option:selected`).val(),
    BindPcid : $(`#PDCCID option:selected`).val(),
    Function : $(`#FUNC`).val()
  }
  postD("Element","bindEletoP",p).then(x=>{
    console.log();
  }).catch(x=>alert(x));
});

$(`#addNew`).on(`click`,function(){
  $(`#elementId`).val("");
  $(`#elementName`).val("");
  $(`#DetailList`).empty()
});