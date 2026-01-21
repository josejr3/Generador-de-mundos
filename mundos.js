class zone {
    constructor(minZones, maxZones, zoneMaxSize, TotalMaxsize) {
        this.minZones = minZones[0] === '' ? minZones[1] : minZones[0];
        this.maxZones = maxZones[0] === '' ? maxZones[1] : maxZones[0];
        this.zoneMaxSize = zoneMaxSize[0] === '' ? zoneMaxSize[1] : zoneMaxSize[0];
        this.TotalMaxsize = TotalMaxsize[0] === '' ? TotalMaxsize[1] : TotalMaxsize[0];
    };
}

const repetidos = (coord, actualCoord) => {
    for (const coor of coord) {
        if (coor.x === actualCoord.x && coor.y === actualCoord.y) {
            return true
        }
    }
}

function render(canvas) {
    let contex = canvas.getContext('2d');
    contex.fillRect(0, 0, 300, 150);
}

function generarCoordenadas(mapSize, zonesNature, zonesUrban, zonesCommercial) {
    let totalZones = zonesNature + zonesUrban + zonesCommercial;
    let coord = [];
    const generar = () => ({
        "x": Math.floor(Math.random() * mapSize),
        "y": Math.floor(Math.random() * mapSize),
    });

    coord.push(generar());
    let actualCoord = generar();
    for (let i = 0; i < totalZones - 1; i++) {
        actualCoord = generar();

        while (repetidos(coord, actualCoord)) actualCoord = generar();

        coord.push(actualCoord);
    }

    return asignarCoordenadas(coord, zonesNature, zonesUrban, zonesCommercial);
};

function asignarCoordenadas(coords, zonesNature, zonesUrban, zonesCommercial) {
    let zones = [];
    let zoness = [];
    let inds = 0;
    let zona = 0;
    [zonesNature, zonesUrban, zonesCommercial].forEach((I) => {
        let color = "";
        switch (zona) {
            case 0: color = "green";
                break;
            case 1: color = "yellow";
                break;
            case 2: color = "orange";
                break;
        }
        for (let index = inds; index < (I + inds); index++) {
            zones.push({ parcelas: [{ ...coords[index] }], id: I + index, "color": color });
        }
        zoness.push(...zones);
        zones = [];
        inds = inds + I;
        zona++;
    });
    return zoness;

}

function comprobarBacio(zonas, parcelaNueva) {
    zonas.forEach((zona) => {
        zona.parcelas.forEach((parcela) => {
            if (repetidos(parcela, parcelaNueva)) {

                return { id: zona.id };
            }
        })
    });
    return true;
}
//nesito buscar primera parcela libre
function crecer(zonas, mapSize) {
    console.log(zonas);
    for (let index = 0; index < zonas.length; index++) {
        const zona = array[index];
        let parcela = zona.parcelas[Math.floor(Math.random() * zona.parcelas.length)];
        let direcion = Math.floor(Math.random() * 4);
        let parcelaNueva;
        let puedeCrecer = (zonas,parcelaNueva) => {
            let buscar = comprobarBacio(zonas, parcelaNueva);
            if (parcela.x + 1 > (mapSize - 1) || (buscar !== true && buscar.id !== zonas.id)) {
                return false;
            };
            return buscar;
        }



        if (direcion === 0) { //x+    
            parcelaNueva = { x: (parcela.x + 1), y: parcela.y };
            if (puedeCrecer(zonas,parcelaNueva)===false) continue;
            
 
        }
        if (direcion === 1) { //x-
            parcelaNueva = { x: (parcela.x - 1), y: parcela.y };
            if (puedeCrecer(zonas,parcelaNueva)===false) continue;
         
        }
        if (direcion === 2) { //y+
            parcelaNueva = { x: (parcela.x ), y: parcela.y +1};
            if (puedeCrecer(zonas,parcelaNueva)===false) continue;
      
        }
        if (direcion === 3) { //y-
            parcelaNueva = { x: (parcela.x + 1), y: parcela.y -1};
            if (puedeCrecer(zonas,parcelaNueva)===false) continue;        
        }

        zona.parcelas.push({ parcelaNueva });
    }
 



}


let canvas = document.createElement("canvas");
let form = document.getElementById("datos");
let container = document.getElementById("container");
let mapa = document.getElementById("mapa");
//console.log(Math.round(Math.random() *(3-2)+2));


form.addEventListener("submit", (event) => {
    event.preventDefault();
    let datos = new FormData(form);

    form.style = "display:none";

    let nature = new zone([datos.get("NatureMinZones"), 2], [datos.get("NatureMaxZones"), 8], [datos.get("NatureZoneMaxSize"), 500], [datos.get("NatureTotalMaxsize"), 800]);
    let urban = new zone([datos.get("UrbanMinZones"), 4], [datos.get("UrbanMaxZones"), 6], [datos.get("UrbanZoneMaxsize"), 100], [datos.get("UrbanTotalMaxsize"), 800]);
    let commercial = new zone([datos.get("commercialMinZones"), 2], [datos.get("commercialMaxZones"), 8], [datos.get("commercialZoneMaxsize"), 50], [datos.get("commercialTotalMaxsize"), 200]);



    let zonesNature = Math.round(Math.random() * (nature.maxZones - nature.minZones)) + nature.minZones;
    let zonesUrban = Math.round(Math.random() * (urban.maxZones - urban.minZones)) + urban.minZones;
    let zonesCommercial = Math.round(Math.random() * (commercial.maxZones - commercial.minZones)) + commercial.minZones;
    let mapSize = datos.get("CamposMapSize") === '' ? 65 : form.get("CamposMapSize");
    canvas.width = mapSize;
    canvas.height = mapSize;
    render(canvas);
    mapa.appendChild(canvas);
    //console.log( zonesNature,zonesUrban, zonesCommercial);


    let zonas = generarCoordenadas(mapSize, zonesNature, zonesUrban, zonesCommercial);
    //console.log(zonas);
    crecer(zonas, mapSize);



    //console.log(coords);



});



