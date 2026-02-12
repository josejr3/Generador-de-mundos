class zone{
    constructor(minZones,maxZones,zoneMaxSize,TotalMaxsize){
        this.minZones=minZones[0]==='' ? minZones[1]:minZones[0];
        this.maxZones=maxZones[0]==='' ? maxZones[1]:maxZones[0];
        this.zoneMaxSize=zoneMaxSize[0]==='' ? zoneMaxSize[1]:zoneMaxSize[0];
        this.TotalMaxsize=TotalMaxsize[0]==='' ? TotalMaxsize[1]:TotalMaxsize[0];
    }
}


let form =document.getElementById("datos");
let container=document.getElementById("container");

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    let datos=new FormData(form); 
    
    form.style="display:none";

    let nature=new zone([datos.get("NatureMinZones"),2],[datos.get("NatureMaxZones"),8],[datos.get("NatureZoneMaxSize"),500],[datos.get("NatureTotalMaxsize"),800]);
    let urban = new zone([datos.get("UrbanMinZones"),4],[datos.get("UrbanMaxZones"),6],[ datos.get("UrbanZoneMaxsize"),100],[ datos.get("UrbanTotalMaxsize") ,800]);
    let commercial = new zone([datos.get("commercialMinZones"),2],[datos.get("commercialMaxZones"),8],[datos.get("commercialZoneMaxsize"),50],[ datos.get("commercialTotalMaxsize") ,200]);


    

    //setTimeout(()=>{
    //    console.log("adios");
    //      form.style="display:flex";
    //     
    // },2300);
   //let canvas=document.createElement("canvas");
   //canvas.width=datos.get("CamposMapSize");
   //canvas.height=datos.get("CamposMapSize");
   //container.appendChild(canvas);
   //canvas.getContext("2d");

   let zonesNature=  Math.round(Math.random() * (nature.minZones - nature.maxZones) + 1) + nature.minZones;
   let zonesUrban=  Math.round(Math.random() * (urban.minZones - urban.maxZones + 1)) + urban.minZones;
   let zonesCommercial=  Math.round(Math.random() * (commercial.minZones - commercial.maxZones + 1)) + commercial.maxZones;

   let mapSize=datos.get("CamposMapSize")===''? 65:form.get("CamposMapSize");
   console.log(mapSize);

   const generar=()=>   ({
    "x":Math.floor(Math.random()*mapSize),
    "y":Math.floor(Math.random()*mapSize),
   });

   const iguales=(a,b)=> a.x===b.x && a.y===b.y;

   let coordNature=generar();
   let coordUrban=generar();

   while(iguales(coordNature,coordUrban))coordUrban=generar();

   let coordCommercial=generar();

   while(iguales(coordNature,coordCommercial)||iguales(coordUrban,coordCommercial)) coordCommercial=generar();
   

   //console.log(aar);
   //console.log());
   //console.log(set1.add([1,1]));
   //console.log(set1);
   


   //console.log("nature "+zonesNature) 
   //console.log("urban "+zonesUrban) 
   //console.log("commecial "+zonesCommercial) 

});



