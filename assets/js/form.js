function getElement(formschema,type){
    let e = `<div class="col-7" style="display:flex">`;
    e += `<label for="${formschema.Columnid}" class="col-2">${formschema.Columnname}</label>`;
    switch(formschema.Columntype){
        case "string":
            e += `<input style="margin:0 1rem" type="text" class="form-control col-3" data-id="${formschema.Id}" id="${formschema.Columnid}"/>`;
            break;
        case "float":
        case "int":
            e += `<input style="margin:0 1rem" type="number" class="form-control col-3" data-id="${formschema.Id}" id="${formschema.Columnid}"/>`;
            break;
        case "ddl":
            e += `<select style="margin:0 1rem" class="form-select modelselect col-3" data-id="${formschema.Id}" id="${formschema.Columnid}" aria-label="Default select example">
            </select>`
            getcurrentddl(formschema.Columnid,formschema.Columnddl);
            break;
        case "date":
            e += `<input style="margin:0 1rem" type="date" class="form-control col-3" data-id="${formschema.Id}" id="${formschema.Columnid}"/>`;
            break;
        case "datetime":
            e += `<input style="margin:0 1rem" type="datetime" class="form-control col-3" data-id="${formschema.Id}" id="${formschema.Columnid}"/>`;
            break;
        default:
            break;
    }
    e += type == "set" ? `<li class="btn btn-primary col-3 formupdate" data-bs-toggle="modal" data-bs-target="#verify">新增規則</li>`:"";
    e += `</div>`;
    return e;
}
function getcurrentddl(Columnid,ddlkey){
    getddl([ddlkey]).then(x=>{
        if(x){
            let o = $(`#${Columnid}`);
            o.empty();
            o.append(`<option value="">請選擇</option>`);
            $.each(ddllist[ddlkey],(i,d)=>{
                o.append(`<option value="${d.Dataid}">${d.Data}</option>`);
            });
            return o;
        }else{
            alert(msg);
        }
    });
}