
$(function getVrSolution(){
    getA("PowerRail","GSF").then(x=>{
      if(x){
        db=datalist.datas;
        dbMemo = datalist.sc;
        BindList();
        BindTable(dbMemo);
        console.log(datalist.sc)
      }else{
        alert(msg);
      }
    })
})
$(function(){
  if(turnPage){
    $(`#add`).click();
    turnPage = "VR_Solution";
  }
})
//畫面初始化設定
$(`#edit`).attr("disabled",true);
$(`#save`).attr("disabled",true);
//操作設定
$(`#qSearch`).on(`keyup`,function(){
  let key = $(this).val();
  $("#formlist tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(key) > -1)
  });
});
$(`#edit`).on('click',function(){
    let ipt = $(`#eArea .universal`);
    $.each(ipt,(i,d)=>{
        let cipt = $(d);
        let clab = $(d).prev("label")
        cipt.val(clab.html());
        clab.attr("hidden",true);
        cipt.removeAttr("hidden");
    });
    $(`#save`).removeAttr("disabled");
    $(`#add`).attr(`disable`,true);
});
$(`#save`).on('click',function(){
    let ipt = $(`#eArea .universal`);
    $.each(ipt,(i,d)=>{
        let cipt = $(d);
        let clab = $(d).prev("label")
        clab.html(cipt.val());
        cipt.attr("hidden",true);
        clab.removeAttr("hidden");
    });
    Save("E");
    $(`#save`).attr("disabled",true);
});
$(`#add`).on('click',function(){
  BindEArea(null,null);
  $(`#edit`).click();
  $(`#edit`).attr("disabled",true);
  $(`#qBar`).click();
});
//點擊列表
$(`#formlist`).on('click','tr',function(){
    let PR = $($(this).find('td')[0]).text();
    //let vr = db.vr.filter(x=>x.PowerRail == PR)[0];
    let sf = db.filter(x=>x.PowerRailId == PR)[0];
    BindEArea(null,sf);
    $(`#edit`).removeAttr('disabled');
    $(`#save`).attr('disabled',true);
    $(`#qBar`).click();
});
//註解修改
$(`#send`).on(`click`,function(){
  p={
    PowerRailIdMemo:1,
    VinMemo:$(`#VinMemo`).val(),
    VoutMemo:$(`#VoutMemo`).val(),
    IouttdcMemo:$(`#IouttdcMemo`).val(),
    IoutmaxMemo:$(`#IoutmaxMemo`).val(),
    IoutocpMemo:$(`#IoutocpMemo`).val(),
    LoadStepMemo:$(`#LoadStepMemo`).val(),
    SlewrateAusMemo:$(`#SlewrateAusMemo`).val(),
    LMemo:$(`#LMemo`).val(),
    FswMemo:$(`#FswMemo`).val(),
    VoutrippleMemo:$(`#VoutrippleMemo`).val(),
    VoutovershootMemo:$(`#VoutovershootMemo`).val(),
    VoutundershootMemo:$(`#VoutundershootMemo`).val(),
    EffestimateMemo:$(`#EffestimateMemo`).val()
  }
  postD("PowerRail","USF",p).then((x)=>{
    //cngdb("sf",data);
    if(x){
      dbMemo = data;
      alert(x);
    }else{
      alert(msg);
    }
  }).catch(x=>alert(x))
});

//function
function Save(Area){
  let c;
  let a;
  let p;
  switch(Area){
    case "E":
      p={
        PowerRailId:$(`#PowerRailI`).val() || $(`#cPowerRail`).html(),
        Vin:$(`#Vin`).val(),
        Vout:$(`#Vout`).val(),
        Iouttdc:$(`#Iouttdc`).val(),
        Ioutmax:$(`#Ioutmax`).val(),
        Ioutocp:$(`#Ioutocp`).val(),
        LoadStep:$(`#LoadStep`).val(),
        SlewrateAus:$(`#SlewrateAus`).val(),
        L:$(`#L`).val(),
        Fsw:$(`#Fsw`).val(),
        Voutripple:$(`#Voutripple`).val(),
        Voutovershoot:$(`#Voutovershoot`).val(),
        Voutundershoot:$(`#Voutundershoot`).val(),
        Effestimate:$(`#Effestimate`).val()
      }
      c = "SF"
      a = "ISF"
      postD("PowerRail",$(`#PowerRailI`).val() ? "ISF":"USF",p).then((x)=>{
        cngdb("sf",data);
        let p ={
          Id:$(`#Id`).val(),
          PowerRail:$(`#PowerRail option:selected`).val(),
          VrSolution1:$(`#VrSolution1`).val(),
          Qpn:$(`#Qpn`).val(),
          PowerStage:$(`#PowerStage`).val(),
          Phase:$(`#Phase`).val()
        };
        BindList();
        if(turnPage){
          $(`#`+turnPage).click();
          returnData = data.PowerRailId;
        }
        // postD("VRSolution","IVR",p).then((x)=>{
        //   cngdb("vr",data);
        //   let vr = db.vr.filter(x=>x.PowerRail == $(`#PowerRail option:selected`).val())[0];
        //   let sf = db.sf.filter(x=>x.PowerRailId == $(`#PowerRail option:selected`).val())[0];
        //   BindEArea(vr,sf);
        // });
      })
      break;
  }
}

function BindList(){
  let list = $(`#formlist`);
  list.html("");
  $.each(db,(i,d)=>{
    list.append(`<tr  style="cursor:pointer">
                    <td>${d.PowerRailId}</td>
                </tr>`);
  });
}

function BindTable(data){
  $(`#VinMemo`).val(data.Vin)
  $(`#VoutMemo`).val(data.Vout)
  $(`#IouttdcMemo`).val(data.Iouttdc)
  $(`#IoutmaxMemo`).val(data.Ioutmax)
  $(`#IoutocpMemo`).val(data.Ioutocp)
  $(`#LoadStepMemo`).val(data.LoadStep)
  $(`#SlewrateAusMemo`).val(data.SlewrateAus)
  $(`#LMemo`).val(data.L)
  $(`#FswMemo`).val(data.Fsw)
  $(`#VoutrippleMemo`).val(data.Voutripple)
  $(`#VoutovershootMemo`).val(data.Voutovershoot)
  $(`#VoutundershootMemo`).val(data.Voutundershoot)
  $(`#EffestimateMemo`).val(data.Effestimate)
};

function BindEArea(vr,sf){
  $(`#eArea`).html(`
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">PowerRail</label><br/>
                  <label for="columnid" class="form-label VAL" id="cPowerRail">${!sf? "":sf.PowerRailId}</label>
                  ${sf?``:`
                  <input type="text" id="PowerRailI" class="form-control-sm insert"/>`}
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VIN <small style="color:red">${dbMemo.Vin ? ` (${dbMemo.Vin})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Vin}</label>
                  <input type="text" id="Vin" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> V</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT <small style="color:red">${dbMemo.Vout ? ` (${dbMemo.Vout})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Vout}</label>
                  <input type="text" id="Vout" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> V</label>
                </div>
                <div class="col"></div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOUT_TDC <small style="color:red">${dbMemo.Iouttdc ? ` (${dbMemo.Iouttdc})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Iouttdc}</label>
                  <input type="text" id="Iouttdc" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOUT_MAX <small style="color:red">${dbMemo.Ioutmax ? ` (${dbMemo.Ioutmax})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Ioutmax}</label>
                  <input type="text" id="Ioutmax" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOUT_OCP <small style="color:red">${dbMemo.Ioutocp ? ` (${dbMemo.Ioutocp})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Ioutocp}</label>
                  <input type="text" id="Ioutocp" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col"></div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">LOAD_STEP <small style="color:red">${dbMemo.LoadStep ? ` (${dbMemo.LoadStep})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.LoadStep}</label>
                  <input type="text" id="LoadStep" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Slew_rate(A/us) <small style="color:red">${dbMemo.SlewrateAus ? ` (${dbMemo.SlewrateAus})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.SlewrateAus}</label>
                  <input type="text" id="SlewrateAus" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">L <small style="color:red">${dbMemo.L ? ` (${dbMemo.L})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.L}</label>
                  <input type="text" id="L" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> uH</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Fsw <small style="color:red">${dbMemo.Fsw ? ` (${dbMemo.Fsw})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Fsw}</label>
                  <input type="text" id="Fsw" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> KHz</label>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT_Ripple <small style="color:red">${dbMemo.Voutripple ? ` (${dbMemo.Voutripple})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Voutripple}</label>
                  <input type="text" id="Voutripple" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> mV</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT_Overshoot <small style="color:red">${dbMemo.Voutovershoot ? ` (${dbMemo.Voutovershoot})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Voutovershoot}</label>
                  <input type="text" id="Voutovershoot" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> mV</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT_Undershoot <small style="color:red">${dbMemo.Voutundershoot ? ` (${dbMemo.Voutundershoot})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Voutundershoot}</label>
                  <input type="text" id="Voutundershoot" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> mV</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">EFF.estimate <small style="color:red">${dbMemo.Effestimate ? ` (${dbMemo.Effestimate})`:``}</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Effestimate}</label>
                  <input type="text" id="Effestimate" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> %</label>
                </div>
              </div>`);
  $(`#eAreaedit`).removeAttr("disabled");
  $(`#eAreasave`).attr("disabled",true);
  let prs = $(`#PowerRail`);
  prs.append(`<option>請選擇</option>`)
  $.each(db,(i,d)=>{
      prs.append(`<option value="${d.PowerRailId}">${d.PowerRailId}</option>`)
  });
  if(sf){
    $(`#PowerRail option`).removeAttr("selected").filter(`[value=${sf.PowerRailId}]`).attr('selected',true);
  }
}

function cngdb(item,data){
  switch(item){
    case "sf":
      let c = true;
      $.each(db,(i,d)=>{
        if(d.PowerRailId == data.PowerRailId){
          db[i] = data;
          c = false;
        }
      });
      if(c){
        db.push(data);
      }
      break;
    case "vr":
      $.each(db.vr,(i,d)=>{
        if(d.Id == data.Id){
          db.vr[i] = data;
        }
      })
      break;
  }
}