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
  $(`#Effestimate`).val(sf["Effestimate"]).prev('.VAL').html(sf["Effestimate"]);
  $(`#Fsw`).val(sf["Fsw"]).prev('.VAL').html(sf["Fsw"]);
  $(`#Ioutmax`).val(sf["Ioutmax"]).prev('.VAL').html(sf["Ioutmax"]);
  $(`#Ioutocp`).val(sf["Ioutocp"]).prev('.VAL').html(sf["Ioutocp"]);
  $(`#Iouttdc`).val(sf["Iouttdc"]).prev('.VAL').html(sf["Iouttdc"]);
  $(`#L`).val(sf["L"]).prev('.VAL').html(sf["L"]);
  $(`#LoadStep`).val(sf["LoadStep"]).prev('.VAL').html(sf["LoadStep"]);
  $(`#SlewrateAus`).val(sf["SlewrateAus"]).prev('.VAL').html(sf["SlewrateAus"]);
  $(`#Vin`).val(sf["Vin"]).prev('.VAL').html(sf["Vin"]);
  $(`#Vout`).val(sf["Vout"]).prev('.VAL').html(sf["Vout"]);
  $(`#Voutovershoot`).val(sf["Voutovershoot"]).prev('.VAL').html(sf["Voutovershoot"]);
  $(`#Voutripple`).val(sf["Voutripple"]).prev('.VAL').html(sf["Voutripple"]);
  $(`#Voutundershoot`).val(sf["Voutundershoot"]).prev('.VAL').html(sf["Voutundershoot"]);
});
//驗證Phase如果是1的動作
$(`#eArea`).on(`change`,`#VrSolution1,#PowerStage,#Phase`,function(){
  let vs = $(`#VrSolution1`);
  let ps = $(`#PowerStage`);
  let phase = $(`#Phase`);
  if(phase.val()){
    if(phase.val() == 1){
      ps.val(vs.val());
    }else if(vs.val()==ps.val()){
      ps.val("");
    }
  }
  if(vs.val()==ps.val()){
    phase.val(1);
  }
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
  let PR = $($(this).find('td')[0]).text();
  BindDetailList(db.vr.filter(x=>x.PowerRailId == PR));
});
$(`#formDetaillist`).on('click','tr',function(){
  let id = $($(this).find('td')[0]).text();
  let PR = $($(this).find('td')[1]).text();
  let mfr = $($(this).find('td')[2]).text();
  let ps = $($(this).find('td')[3]).text();
  let phase = $($(this).find('td')[4]).text();
  let vr = db.vr.filter(x=>x.Id == id)[0];
  let sf = db.sf.filter(x=>x.PowerRailId == PR)[0];
  let cp = db.cp.filter(x=>x.Vrsolution == id)[0];
  BindEArea(vr,sf,cp);
  document.getElementById("toeBar").click();
});

$(`#eleid`).on(`change`,function(){
  changeEle($(this).val()); 
});

//Element Area
$(`#EleAreaadd`).on(`click`,function(){
  let eleid = $(`#eleid option:selected`).val();
  let did = $(`#did option:selected`).val();
  let prid = $(`#PowerRail option:selected`).val();
  let id = $(`#Id`).val();
  if(prid == "請選擇"){
    prid = $(`#PowerRail`).prev().html();
  }
  getD("EleData","getResult",`prid=${prid}&did=${did}&id=${id}`).then(x=>{
    if(x){
      let EA = $(`#ElementArea`);
      let obj = `<div class="rtneleData"><hr class="my-2"/>
                    <div class="row">
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col"></div>
                      <div class="col" style="text-align: end;">
                        <button type="button" class="btn btn-danger deleleData">delete</button>
                      </div>
                    </div>`;
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
      EA.append(obj+`</div>`);
    }
  })

})

$(`#ElementArea`).on(`click`,`.deleleData`,function(){
  let parent = $(this).parents(`.rtneleData`);
  console.log(parent);
  parent.remove();
});

//function
function Save(Area){
  let c;
  let a;
  let p;
  switch(Area){
    case "E":
      let p ={
        PowerRailId : $("#PowerRail option:selected").val(),
        MfrPn:$(`#VrSolution1`).val(),
        PowerStage:$(`#PowerStage`).val(),
        Phase:$(`#Phase`).val()
      };
      if(p.PowerRailId && p.MfrPn && p.PowerStage && p.Phase){
        let id = $(`#Id`).val();
        if(id){
          let vr = db.vr.filter(x=>x.Id == db.cp.filter(x=>x.Id == id)[0].Vrsolution)[0]
          if(!(vr.PowerRailId == p.PowerRailId && vr.MfrPn ==p.MfrPn && vr.PowerStage == p.PowerStage && vr.Phase == p.Phase)){
            id = 0;
          }
        }
        postD("VRSolution","IVR",p,`Id=${id || 0}`).then((x)=>{
          cngdb("vr",data);
          let vr = db.vr.filter(x=>x.PowerRailId == data.vr.PowerRailId);
          let sf = db.sf.filter(x=>x.PowerRailId == $(`#PowerRail option:selected`).val())[0];
          BindEArea(data.vr,sf,data.cp);
          $(`#turnPage`).attr('hidden',true);
          BindList();
          BindDetailList(vr);
        });
      }
      break;
  }
}

function BindList(){
  let list = $(`#formlist`);
  list.html("");
  let vr = uniqueArray(db.vr.map(x=>x.PowerRailId));
  if(vr.length == 0){
    alert("No Datas");
  }else{
    $.each(vr,(i,d)=>{
      list.append(`<tr style="cursor:pointer">
        <td>${d}</td>
        </tr>`);
      });
  }
}
function BindDetailList(vrList){
  let detailList = $(`#formDetaillist`);
  detailList.empty();
  $.each(vrList,(i,d)=>{
    detailList.append(`<tr style="cursor:pointer">
                          <td hidden>${d.Id}</td>
                          <td>${d.PowerRailId}</td>
                          <td>${d.MfrPn}</td>
                          <td>${d.PowerStage}</td>
                          <td>${d.Phase}</td>
                      </tr>`);
  });
}

function BindEArea(vr,sf,cp){
  $(`#eArea`).html(`<div class="card-body p-1">
    <div class="btn-group mb-2">
      <button type="button" class="btn btn-primary" id="eAreaedit">Edit</button>
      <button type="button" class="btn btn-primary" id="eAreasave">Save</button>
    </div>
  </div><div class="row">
                <input type="text" id="Id" class="form-control-sm insert" value="${!cp? "":cp.Id}" hidden/>
                <div class="col">
                  <label for="columnid" class="form-label-sm">PowerRail</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.PowerRailId}</label>
                  <select class="form-control-sm universal" id="PowerRail" hidden>
                  </select><i class='bx bx-plus-medical' id="turnPage" style="cursor:pointer" data-page="PRS" hidden></i>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VR_Solution</label><br/>
                  <label for="columnid" class="form-label VAL">${!vr? "":vr.MfrPn}</label>
                  <input type="text" id="VrSolution1" class="form-control-sm universal" hidden/>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Power Stage</label><br/>
                  <label for="columnid" class="form-label VAL">${!vr? "":vr.PowerStage}</label>
                  <input type="text" id="PowerStage" class="form-control-sm universal" hidden/>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Phase</label><br/>
                  <label for="columnid" class="form-label VAL">${!vr? "":vr.Phase}</label>
                  <input type="text" id="Phase" class="form-control-sm universal" hidden/>
                </div>
              </div>
              <hr/>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">VIN <small style="color:red"> (VOUT*50%VOUT*50%VOUT*50%)</small></label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Vin}</label>
                  <input type="text" id="Vin" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> V</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Vout}</label>
                  <input type="text" id="Vout" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> V</label>
                </div>
                <div class="col"></div>
                <div class="col"></div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOUT_TDC</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Iouttdc}</label>
                  <input type="text" id="Iouttdc" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOUT_MAX</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Ioutmax}</label>
                  <input type="text" id="Ioutmax" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOUT_OCP</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Ioutocp}</label>
                  <input type="text" id="Ioutocp" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col"></div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">LOAD_STEP</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.LoadStep}</label>
                  <input type="text" id="LoadStep" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Slew_rate(A/us)</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.SlewrateAus}</label>
                  <input type="text" id="SlewrateAus" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">L</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.L}</label>
                  <input type="text" id="L" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> uH</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Fsw</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Fsw}</label>
                  <input type="text" id="Fsw" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> KHz</label>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT_Ripple</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Voutripple}</label>
                  <input type="text" id="Voutripple" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> mV</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT_Overshoot</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Voutovershoot}</label>
                  <input type="text" id="Voutovershoot" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> mV</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">VOUT_Undershoot</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Voutundershoot}</label>
                  <input type="text" id="Voutundershoot" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> mV</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">EFF.estimate</label><br/>
                  <label for="columnid" class="form-label VAL">${!sf? "":sf.Effestimate}</label>
                  <input type="text" id="Effestimate" class="form-control-sm" hidden/>
                  <label for="columnid" class="form-label-sm"> %</label>
                </div>
      </div>`);
  $(`#eArea2`).html(`<div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">Duty</label><br/>
                  <label for="columnid" class="form-label">${!cp? "":cp.Duty.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> %</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Output_ΔIL_total</label><br/>
                  <label for="columnid" class="form-label">${!cp? "":cp.OutputDeltaIlTotal.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Output_ΔIL_per_phase</label><br/>
                  <label for="columnid" class="form-label">${!cp? "":cp.OutputDeltaIlPerPhase.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">KIND</label><br/>
                  <label for="columnid" class="form-label">${!cp? "":cp.Kind.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> %</label>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <label for="columnid" class="form-label-sm">IMAX+</label><br/>
                  <label for="columnid" class="form-label">${!cp? "":cp.Imax.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">IOCP+</label><br/>
                  <label for="columnid" class="form-label">${!cp? "":cp.Iocp.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> A</label>
                </div>
                <div class="col">
                  <label for="columnid" class="form-label-sm">Fsw*N</label><br/>
                  <label for="columnid" class="form-label">${!cp? "":cp.Fswn.numberFormat(2,".",",")}</label>
                  <label for="columnid" class="form-label-sm"> kHz</label>
                </div>
                <div class="col"></div>
      </div>`);
  $(`#eAreaedit`).removeAttr("disabled");
  $(`#eAreasave`).attr("disabled",true);
  let prs = $(`#PowerRail`);
  prs.append(`<option>請選擇</option>`)
  $.each(db.sf,(i,d)=>{
      prs.append(`<option value="${d.PowerRailId}">${d.PowerRailId}</option>`)
  });
  if(returnData || cp){
    $(`#PowerRail option`).removeAttr("selected").filter(`[value=${returnData || cp.PowerRailId}]`).attr('selected',true);
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
        if(d.Id == data.vr.Id){
          db.vr[i] = data.vr;
          c = false;
        }
      })
      if(c){
        db.vr.push(data.vr);
        c = true;
      }
      $.each(db.cp,(i,d)=>{
        if(d.Id == data.cp.Id){
          db.cp[i] = data.cp;
          c = false;
        }
      })
      if(c){
        db.cp.push(data.cp);
        c = true;
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