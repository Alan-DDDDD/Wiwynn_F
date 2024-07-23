let i = $(`#ch`);
let js = i.val();
console.log(js);

if(js == 0){
    let page = "VR_Solution";
    reList(page);
    reView(page);
    i.val("OK");
}

$(`#pageList li`).on(`click`,function(event){
    event.preventDefault();
    let me = $(this);
    let id = me.attr("id");
    reList(id);
    reView(id);
})

function reList(page){
    let lis = $(`#pageList li`);
    $.each(lis,(i,d)=>{
        $(d).removeClass("active");
    });
    $(`#`+page).addClass("active")
}

async function reView(page){
    let view = $(`#view`);
    //var r = await fetch("https://alan-ddddd.github.io/AG_F/html/"+page+".html");
    var r = await fetch("../html/"+page+".html");
    var t = await r.text();
    view.html(t);
    reJs(page);
}

function reJs(page){
    let js = $(`.myjs`);
    $.each(js,function(i,d){
        $(d).remove();
    });
    let script = document.createElement('script');
    script.src = "../assets/js/"+page+".js";
    script.classList.add("myjs");
    document.body.appendChild(script);
}

$(`#view`).on(`click`,`#qBar`,function(){
    $(`#qArea`).toggle(130);
});
$(`#view`).on(`click`,`#lBar`,function(){
    $(`#lArea`).toggle(130);
});
$(`#view`).on(`click`,`#eBar`,function(){
    $(`#eArea`).toggle(130);
});
$(`#view`).on(`click`,`#eBar2`,function(){
    $(`#eArea2`).toggle(130);
});
$(`#view`).on(`click`,`#ElementBar`,function(){
    $(`#ElementArea`).toggle(130);
});
$(`#view`).on(`click`,`#MainSchemaBar`,function(){
    $(`#MainSchemaArea`).toggle(130);
});