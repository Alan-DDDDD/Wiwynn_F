var detailList;
ddlp = ["sys","unit"];

getddl(ddlp).then(x=>{
  if(x){
    //bindDDL(ddlp);
    bindT("systbody",ddlp,"m");
  }else{
    alert(msg);
  }
}).catch(x=>{
  alert(x)
})

function bindT(t,ddlnm,m){
  let table = $(`#`+t);
  table.empty();
  $.each(ddlnm,(a,c)=>{
    $.each(ddllist[c],(i,d)=>{
      let b = m=="m"?`<div class="dropdown">
                 <button type="button" class="btn btn-primary btne"
                  data-bs-toggle="modal"
                  data-bs-target="#modalCenter" data-id="${d.Dataid}">Edit Detail</button>
               </div>`
               :`<small class="badge bg-label-warning dataedit" style="cursor:pointer;">Edit</small>
               <small class="badge bg-label-danger datadel" style="cursor:pointer;">Delete</small>`;
      table.append(`<tr>
                    <td>${d.Datagp}</td>
                    <td>${d.Dataid}</td>
                    <td>${d.Data}</td>
                    <td>
                      ${b}
                    </td>
                  </tr>`);
    });
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
      bindT('detailtbody',[id],"S")
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
  let id = $(`#sysid`).html();
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

  postD("Code","Insert",codetable,false).then(x=>{
    if(x){
      alert(msg);
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
  $(`.btn-close`).click();
})
//新增主檔
$(`#syssend`).on('click',async function(){
  let dataid = $(`#sysdataid`).val();
  let value = $(`#sysvalue`).val();
  if(dataid != "" && value != ""){
    let data = {
      Id : 0,
      Comid : "wiwynn",
      Datagp : $(`#datagp`).val(),
      //Parentgp : $(`#syspg option:selected`).val() || null,
      Dataid : $(`#sysdataid`).val() || "",
      Data : $(`#sysvalue`).val() || "",
      Invaliddt : null,
    }
    let response = await fetch(url+"/api/Code/Create",{
      method : "post",
      headers : new Headers({
        "ngrok-skip-browser-warning": "69420",
        "Content-Type":"application/json"
      }),
      body : JSON.stringify(data)
    });
    let result = await response.json();
    if(result.status){
      getSelfData();
      $(`#sysdataid`).val("");
      $(`#sysvalue`).val("");
      $(`#syscode`).removeClass("show");
    }else{
      alert(result.error.errorMsg);
    }
  }else{
    alert("請輸入資料!!")
  }
})

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
        <small class="badge bg-label-warning dataedit" style="cursor:pointer;">編輯</small>
        <small class="badge bg-label-danger datadel" style="cursor:pointer;">刪除</small>
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
$(`#parentgroup`).on(`change`,async function(){
  let pg = $(`#parentgroup option:selected`).val();
  let dg = $(`#sysid`).html();
  getDetail(dg,pg);
});
