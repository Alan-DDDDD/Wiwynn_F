var elelist;
var eledata;
$(function getVrSolution(){
    getA("VRSolution","getVRS").then(x=>{
      db=datalist;
      BindList()
      if(turnPage){
        $(`#add`).click();
        turnPage = null;
      }
      getD("EleData","getEleDs").then(x=>{
        if(x){
          let eletp = $(`#eleid`);
          eletp.empty();
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
          eledata = objs;
          let eles = [];
          eledata.filter((d,i)=>{
            let c = d[0];
            if(!eles.includes(c.Elementid))
              eles.push(c.Elementid);
            //table.append(`<tr data-id="${c.Did}" style="cursor:pointer"><td>${c.Elementid}</td><td>${c.Cval}</td></tr>`)
          });
          elelist = eles;
          elelist.filter((x,i)=>{
            eletp.append(`<option value="${x}">${x}</option>`)
            if(i==0){
              changeEle(x)
            }
          })
        }
      })
    })
})
//畫面初始化設定
$(`#eAreaedit`).attr("disabled",true);
$(`#eAreasave`).attr("disabled",true);
//操作設定
$(`#eArea`).on('click',`#eAreaedit`,function(){
    let ipt = $(`#eArea .universal`);
    $.each(ipt,(i,d)=>{
        let cipt = $(d);
        let clab = $(d).prev("label")
        cipt.val(clab.html());
        clab.attr("hidden",true);
        cipt.removeAttr("hidden");
    });
    $(`#eAreasave`).removeAttr("disabled");
    $(`#turnPage`).removeAttr('hidden');
});
$(`#eArea`).on('click',`#eAreasave`,function(){
    let ipt = $(`#eArea .universal`);
    $.each(ipt,(i,d)=>{
        let cipt = $(d);
        let clab = $(d).prev("label")
        clab.html(cipt.val());
        cipt.attr("hidden",true);
        clab.removeAttr("hidden");
    });
    Save("E");
    $(`#eAreasave`).attr("disabled",true);
});
$(`#eArea`).on(`change`,`#PowerRail`,function(){
  let PowerRailId = $(`#PowerRail option:selected`).val();
  let sf = db.sf.filter(x=>x.PowerRailId == PowerRailId)[0];
  console.log(sf);
  $(`#Effestimate`).val(sf["Effestimate"]);
  $(`#Fsw`).val(sf["Fsw"]);
  $(`#Fswn`).val(sf["Fswn"]);
  $(`#Ioutmax`).val(sf["Ioutmax"]);
  $(`#Ioutocp`).val(sf["Ioutocp"]);
  $(`#Iouttdc`).val(sf["Iouttdc"]);
  $(`#L`).val(sf["L"]);
  $(`#LoadStep`).val(sf["LoadStep"]);
  $(`#SlewrateAus`).val(sf["SlewrateAus"]);
  $(`#Vin`).val(sf["Vin"]);
  $(`#Vout`).val(sf["Vout"]);
  $(`#Voutovershoot`).val(sf["Voutovershoot"]);
  $(`#Voutripple`).val(sf["Voutripple"]);
  $(`#Voutundershoot`).val(sf["Voutundershoot"]);
});
$(`#add`).on('click',function(){
  BindEArea(null,null);
  $(`#eAreaedit`).click();
  $(`#turnPage`).removeAttr('hidden');
});
$(`#eArea`).on('click','#turnPage',function(){
  let page = $(this).data('page');
  turnPage = page;
  $(`#`+page).click();
});
//點擊列表
$(`#formlist`).on('click','tr',function(){
    let id = $($(this).find('td')[0]).text();
    let PR = $($(this).find('td')[1]).text();
    let vr = db.vr.filter(x=>x.Id == id)[0];
    let sf = db.sf.filter(x=>x.PowerRailId == PR)[0];
    BindEArea(vr,sf);
});
$(`#eleid`).on(`change`,function(){
  changeEle($(this).val()); 
});
$(`#EleAreaadd`).on(`click`,function(){
  let eleid = $(`#eleid option:selected`).val();
  let did = $(`#did option:selected`).val();
  let prid = $(`#PowerRail option:selected`).val();
  if(prid == "請選擇"){
    prid = $(`#PowerRail`).prev().html();
  }
  getD("EleData","getResult",`prid=${prid}&did=${did}`).then(x=>{
    if(x){
      let EA = $(`#ElementArea`);
      EA.append(`<hr class="my-2"/>
                    <div class="row">
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col" style="text-align: end;">
                        <button type="button" class="btn btn-danger">delete</button>
                      </div>
                    </div>`);
      let obj = ``;
      if(data.length % 4 != 0){
        for(let i = 0;i<4 - data.length % 4 + 1;i++){
          data.push(null);
        }
      }
      $.each(data,(i,d)=>{
        if(i%4 ==0){
          obj+=`<div class="row">`;
        }
        if(d){
          obj += `<div class="col">
          <label for="" class="form-label-sm">${d.Cid}</label><br/>
          <label for="" class="form-label">${d.Cval}</label><br/>
          </div>`;
        }else{
          obj += `<div class="col"></div>`;
        }
        if(i%4==3){
          obj+=`</div>`;
        }
      })
      EA.append(obj);
    }
  })

})

//function
function Save(Area){
  let c;
  let a;
  let p;
  switch(Area){
    case "E":
      let p ={
        Id:$(`#Id`).val() || 0 ,
        PowerRail:$(`#PowerRail option:selected`).val(),
        VrSolution1:$(`#VrSolution1`).val(),
        Qpn:$(`#Qpn`).val(),
        PowerStage:$(`#PowerStage`).val(),
        Phase:$(`#Phase`).val()
      };
      postD("VRSolution","IVR",p).then((x)=>{
        cngdb("vr",data);
        let vr = db.vr.filter(x=>x.Id == data.Id)[0];
        let sf = db.sf.filter(x=>x.PowerRailId == $(`#PowerRail option:selected`).val())[0];
        BindEArea(vr,sf);
        $(`#turnPage`).attr('hidden',true);
        BindList();
      });
      break;
  }
}

function BindList(){
  let list = $(`#formlist`);
  list.html("");
  $.each(db.vr,(i,d)=>{
      list.append(`<tr  style="cursor:pointer">
                      <td hidden>${d.Id}</td>
                      <td>${d.PowerRail}</td>
                      <td>${d.VrSolution1}</td>
                      <td>${d.Qpn}</td>
                      <td>${d.PowerStage}</td>
                  </tr>`);
  });
}

function BindEArea(vr,sf){
  $(`#eArea`).html(`<div class="card-body p-1">
    <div class="btn-group mb-2">
      <button type="button" class="btn btn-primary" id="eAreaedit">Edit</button>
      <button type="button" class="btn btn-primary" id="eAreasave">Save</button>
    </div>
  </div><div class="row">
                <input type="text" id="Id" class="form-control-sm insert" value="${!vr? "":vr.Id}" hidden/>
                <div class="col">
                  <label for="columnid" class="form-label-sm">PowerRail</label><br/>
                  <label for="columnid" class="form-label VAL">${!vr? "":vr.PowerRail}</label>
                  <select class="form-control-sm universal" id="PowerRail" hidden>
                  </select><i class='bx bx-plus-medical' id="turnPage" style="cursor:pointer" data-page="PRS" hidden></i>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VR_Solution</label><br/>
                  <label for="columnid" class="form-label VAL">${!vr? "":vr.VrSolution1}</label>
                  <input type="text" id="VrSolution1" class="form-control-sm universal" hidden/>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">QPN</label><br/>
                  <label for="columnid" class="form-label VAL">${!vr? "":vr.Qpn}</label>
                  <input type="text" id="Qpn" class="form-control-sm universal" hidden/>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Power Stage</label><br/>
                  <label for="columnid" class="form-label VAL">${!vr? "":vr.PowerStage}</label>
                  <input type="text" id="PowerStage" class="form-control-sm universal" hidden/>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">Phase</label><br/>
                  <label for="columnid" class="form-label VAL">${!vr? "":vr.Phase}</label>
                  <input type="text" id="Phase" class="form-control-sm universal" hidden/>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VIN</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Vin}</label>
                  <input type="text" id="Vin" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> V</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Vout}</label>
                  <input type="text" id="Vout" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> V</label>
                </div>
                <div class="col"></div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOUT_TDC</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Iouttdc}</label>
                  <input type="text" id="Iouttdc" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOUT_MAX</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Ioutmax}</label>
                  <input type="text" id="Ioutmax" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOUT_OCP</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Ioutocp}</label>
                  <input type="text" id="Ioutocp" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col"></div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">LOAD_STEP</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.LoadStep}</label>
                  <input type="text" id="LoadStep" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Slew_rate(A/us)</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.SlewrateAus}</label>
                  <input type="text" id="SlewrateAus" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">L</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.L}</label>
                  <input type="text" id="L" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> uH</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Fsw</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Fsw}</label>
                  <input type="text" id="Fsw" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> KHz</label>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">FSW*N</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Fswn}</label>
                  <input type="text" id="Fswn" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> KHz</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT_Ripple</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Voutripple}</label>
                  <input type="text" id="Voutripple" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> mV</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT_Overshoot</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Voutovershoot}</label>
                  <input type="text" id="Voutovershoot" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> mV</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT_Undershoot</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Voutundershoot}</label>
                  <input type="text" id="Voutundershoot" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> mV</label>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">EFF.estimate</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Effestimate}</label>
                  <input type="text" id="Effestimate" class="form-control-sm universal" hidden/>
                  <label for="columnid" class="form-label-sm"> %</label>
                </div>
                <div class="col"></div>
                <div class="col"></div>
                <div class="col"></div>
      </div>`);
  $(`#eArea2`).html(`<div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">Duty</label><br/>
                  <label for="columnid" class="form-label">${!vr? "":vr.Duty.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> %</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Output_ΔIL_total</label><br/>
                  <label for="columnid" class="form-label">${!vr? "":vr.OutputDeltaIlTotal.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Output_ΔIL_per_phase</label><br/>
                  <label for="columnid" class="form-label">${!vr? "":vr.OutputDeltaIlPerPhase.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">KIND</label><br/>
                  <label for="columnid" class="form-label">${!vr? "":vr.Kind.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> %</label>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">IMAX+</label><br/>
                  <label for="columnid" class="form-label">${!vr? "":vr.Imax.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOCP+</label><br/>
                  <label for="columnid" class="form-label">${!vr? "":vr.Iocp.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col"></div>
                <div class="col"></div>
      </div>`);
  $(`#eAreaedit`).removeAttr("disabled");
  $(`#eAreasave`).attr("disabled",true);
  let prs = $(`#PowerRail`);
  prs.append(`<option>請選擇</option>`)
  $.each(db.sf,(i,d)=>{
      prs.append(`<option value="${d.PowerRailId}">${d.PowerRailId}</option>`)
  });
  if(returnData || vr){
    $(`#PowerRail option`).removeAttr("selected").filter(`[value=${returnData}]`).attr('selected',true);
  }
}

function cngdb(item,data){
  switch(item){
    case "sf":
      $.each(db.sf,(i,d)=>{
        if(d.PowerRailId == data.PowerRailId){
          db.sf[i] = data;
        }
      });
      break;
    case "vr":
      let c = true;
      $.each(db.vr,(i,d)=>{
        if(d.Id == data.Id){
          db.vr[i] = data;
          c = false;
        }
      })
      if(c){
        db.vr.push(data);
      }
      break;
  }
}

function changeEle(eleid){
  let currentData = eledata.filter((d,i)=>{
    return d[0].Elementid == eleid
  });
  let elementid = $(`#did`);
  elementid.empty();
  currentData.filter((x,i)=>{
    elementid.append(`<option value="${x[0].Did}">${x[0].Cval}</option>`)
  })
}