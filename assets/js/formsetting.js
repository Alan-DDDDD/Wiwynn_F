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
  let table = $(`#formlist`);
  table.empty();
  $.each(datas,(index,data)=>{
    table.append(`<tr>
                    <td class="formid">${data.formid}</td>
                    <td class="formname">${data.formname}</td>
                    <td>${data.$Invaliddt || ""}</td>
                  </tr>`)
  });
};
function bindE(){
  let list = $(`#columnList`);
      list.empty();
      $.each(datalist,(i,d)=>{
        list.append(getElement(d,"set"));
      });
}
$(`#ePanel`).hide(130);
$(`#formlist`).on('click','tr',function(){
  let me = $(this);
  let formid = me.find('.formid').html();
  let formname = me.find('.formname').html();
  $(`#eTital`).html(`表單名稱 : ${formname} / ${formid}`);
  $(`#formid`).val(formid);
  $(`#formname`).val(formname);
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
  if(!datalist[0].Columnid){
    datalist=[];
  }
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

$(`#addform`).on('click',function(){
  $(`#ePanel`).show(130);
  $(`#eTital`).html(`表單名稱 : `);
  $(`#columnList`).empty();
  $(`#addformArea`).removeAttr("hidden");
});

$(`#saveform`).on('click',function(){
  let formid = $(`#formid`).val();
  let formname = $(`#formname`).val();
  $(`#eTital`).html(`表單名稱 : ${formname} / ${formid}`);
  $(`#addformArea`).attr("hidden",true);
});

$(`#columnList`).on('click','.formupdate',function(){
  let me = $(this).prev().data('id');
  console.log(me)
  $(`#sendV`).data('id',me);
  getD("Verify","GetVerify",`fsid=${me}`).then(x=>{
    if(x){
      console.log(data);
      let vlist = $(`#vlist`);
      vlist.empty();
      $.each(data,(i,d)=>{
        vlist.append(verifyelement());
        let areas = vlist.find('.vitem');
        console.log(areas[i])
        $(areas[i]).find('.verifytype').val(d.Verifytype);
        $(areas[i]).find('.parameter').val(d.Parameter);
        $(areas[i]).find('.returnvalue').val(d.Returnvalue);
        $(areas[i]).find('.invaliddt').val(d.Invaliddt);
      })
    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  })
})

$(`#addV`).on('click',function(){
  $(`#vlist`).append(verifyelement());
});

$(`#sendV`).on(`click`,function(){
  let list = $(`.vitem`);
  console.log(list);
  let datas = [];
  $.each(list,(i,d)=>{
    datas.push({
      vid : 0,
      fsid : $(`#sendV`).data('id'),
      verifytype : $(d).find('.verifytype option:selected').val(),
      parameter : $(d).find(`.parameter`).val(),
      parametertype : "",
      returnvalue : $(d).find(`.returnvalue`).val(),
      Invaliddt : $(d).find('.invaliddt').val()
    });
  });
  console.log(datas);
  postD("Verify","Insert",datas).then(x=>{
    if(x){

    }else{
      alert(msg);
    }
  }).catch(x=>{
    alert(x);
  });
});

function verifyelement(){
  return `<div class="vitem" style="border-bottom:  0.125rem solid gray;">
  <div class="d-flex">
    <div class="col-3" style="margin: 0.25rem 0.25rem;max-width: 5rem;">
      <label for="verifytype" class="form-label">判斷邏輯</label>
      <select class="form-select verifytype">
        <option value=">" selected>大於</option>
        <option value="<">小於</option>
        <option value=">=">大於等於</option>
        <option value="<=">小於等於</option>
        <option value="=">等於</option>
        <option value="!=">不等於</option>
      </select>
    </div>
    <div class="col-3" style="margin: 0.25rem 0.25rem;">
      <label for="parameter" class="form-label">判斷值</label>
      <input type="text" class=" form-control parameter"/>
    </div>
    <div class="col-3" style="margin: 0.25rem 0.25rem;">
      <label for="returnvalue" class="form-label">回傳結果</label>
      <input type="text" class=" form-control returnvalue"/>
    </div>
    <div class="col-3" style="margin: 0.25rem 0.25rem;">
      <label for="invaliddt" class="form-label">失效日期</label>
      <input type="date" class=" form-control" id="invaliddt"/>
    </div>
  </div>
</div>`;
}