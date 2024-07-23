$(function getList(){
  getA("Form","GetFormList",null).then(x=>{
    if(x){
      bindT();
    }else{
      alert(msg);
    }
  });
});
$(function(){
  let ddl = ["CTP","DB"];
  getddl(ddl).then(x=>{
    if(x){
      bindDDL(ddl);
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
});

function bindT(){
  let datas = datalist;
  let select = $(`#qform`);
  select.empty();
  select.append(`<option value="">請選擇</option>`)
  $.each(datas,(index,data)=>{
    select.append(`<option value="${data.formid}">${data.formname}</option>`)
  });
};
function bindE(){
  let list = $(`#columnList`);
      list.empty();
      $.each(datalist,(i,d)=>{
        list.append(getElement(d,"user"));
      });
}
$(`#ePanel`).hide(130);
$(`#qform`).on('change',function(){
  let me = $(`#qform option:selected`);
  let formid = me.val();
  let formname = me.html();
  $(`#qform1`).empty();
  $(`#eTital`).html(`表單名稱 : ${formname} / ${formid}`);
  $(`#formid`).val(formid);
  $(`#formname`).val(formname);
  getD("FromData","GetDataid",`formid=${formid}`).then(x=>{
    if(x){
      let select = $(`#qform1`)
      select.append(`<option value="">請選擇</option>`)
      $.each(data,(i,d)=>{
        select.append(`<option value="${d}">${d}</option>`)
      });
    }
  })
  getA("Form","GetFormSchema",`formid=${formid}`,false,"").then(x=>{
    if(x){
      bindE();
    }else{
      alert(msg);
    }
  })
  $(`#ePanel`).show(130);
})

$(`#send`).on('click',function(){
  let me = $(this);
  let p = {
    Id:me.data('columnid') || 0,
    Formid:$(`#formid`).val(),
    Formname:$(`#formname`).val(),
    Columnid:$(`#columnid`).val(),
    Columnname:$(`#columnname`).val(),
    Columntype:$(`#columntype option:selected`).val(),
    Columnddl:$(`#columnddl option:selected`).val() || null,
    Invaliddt:$(`#invaliddt`).val() || null
  };
  postD("Form","ChangeData",p,true,"formsetting").then(x=>{
    if(x){
      bindE();
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
})

$(`#add`).on('click',function(){
  $(`#ePanel`).show(130);
  let formid = $(`#qform option:selected`).val();
  if(!formid){
    alert("請選擇表單類別")
  }else{
    let columnList = $(`#columnList`);
    $(`#qform1`).empty();
    columnList.find('input').val("");
    columnList.find(`select option`).removeAttr("selected");
    bindE()
  }
});

$(`#save`).on('click',function(){
  let formid = $(`#formid`).val();
  let formname = $(`#formname`).val();
  let p=[];
  let input = $(`#columnList`).find(`input`);
  let select = $(`#columnList`).find(`select`);
  console.log(input);
  console.log(select);
  $.each(input,(i,d)=>{
    p.push({
      dataid : $(`#qform1 option:selected`).val() || "",
      formid : formid,
      fsid : $(d).data('id'),
      columnid : $(d).attr('id'),
      columnvalue : $(d).val()
    });
  });
  $.each(select,(i,d)=>{
    p.push({
      dataid : $(`#qform1 option:selected`).val() || "",
      formid : formid,
      fsid : $(d).data('id'),
      columnid : $(d).attr('id'),
      columnvalue : $(d).find('option:selected').val()
    });
  });
  console.log(p);
  postD("FromData","Insert",p).then(x=>{
    if(x){
      alert("儲存成功");
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
});

$(`#qform1`).on("change",function(){
  let me = $(this).find(`option:selected`).val();
  getD("FromData","GetData",`dataid=${me}`).then(x=>{
    if(x){
      let cd = data;
      $.each(cd,(i,d)=>{
        dataid = d.Dataid;
        $(`#`+d.Columnid).val(d.Columnvalue)
      });
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
});

$(`#report`).on('click',async function(){
  var r = await fetch(url+`/api/Report/GetReport?dataid=${$(`#qform1 option:selected`).val()}`);
  var d = await r.json();
  console.log(d)
})