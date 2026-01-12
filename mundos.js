
let form =document.getElementById("datos");
let container=document.getElementById("container");
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    let datos=new FormData(form);
    console.log(datos.get("CamposMapSize"));   
    form.style="display:none";
    console.log("hola");
    //setTimeout(()=>{
    //    console.log("adios");
          form.style="display:flex";
   //     
   // },2300);
   let canvas=document.createElement("canvas");
   container.appendChild(canvas);
   
});


