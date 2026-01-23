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

    return coord;
};

function asignarCoordenadas(coords, nature, urban, commercial) {
    let zones = [];
    let zoness = [];
    let inds = 0;
    let zona = 0;
    [nature.zones, urban.zones, commercial.zones].forEach((I) => {
        let color = "";
        let zoneMaxSize = 0;
        let TotalMaxsize = 0;
        switch (zona) {
            case 0: { color = "green"; zoneMaxSize = nature.zoneMaxSize; TotalMaxsize = nature.TotalMaxsize }
                break;
            case 1: { color = "yellow"; zoneMaxSize = urban.zoneMaxSize; TotalMaxsize = urban.TotalMaxsize }
                break;
            case 2: { color = "orange"; zoneMaxSize = commercial.zoneMaxSize; TotalMaxsize = commercial.TotalMaxsize }
                break;
        }
        for (let index = inds; index < (I + inds); index++) {
            zones.push({ parcelas: [{ ...coords[index] }], id: I + index, "color": color, "ZoneMaxSize": zoneMaxSize, "totalMaxize": TotalMaxsize });
        }
        zoness.push(...zones);
        zones = [];
        inds = inds + I;
        zona++;
    });
    return zoness;

}

function ocupadoPor(zonas, parcelaNueva) {

    if (repetidos(zonas, parcelaNueva)) {
        return zona.id;
    }
    return null;
}

function countParcelas(tipe) {
    let total = 0;
    console.log(zonas);
    let parcelas = zonas.find((zona) => zona.color === tipe);
    parcelas.forEach((zona) => total += zona.TotalMaxsize);
    return total;
}

function countOcupiedarea(zonas,mapxParcel){
    let total=0;
    zonas.forEach((zona)=>{total+=zona.campos.length});
    return total>=mapxParcel;

}

function crecer(zonas, mapSize, natureMaxsize, urbanMaxsize, commecialMaxsize,totalMaxparcel) {
    let parcelNature = countParcelas("green");
    let parcelUrban = countParcelas("yellow");
    let parcelCommercial = countParcelas("orange");


    while (parcelNature < natureMaxsize || parcelUrban < urbanMaxsize || parcelCommercial < commecialMaxsize) {
        if(countOcupiedarea(zonas,totalMaxparcel)){break;};
        zonas.forEach((zona) => {
            let parcela = zona.parcelas[Math.floor(Math.random() * zona.parcelas.length)];
            let direcion = Math.floor(Math.random() * 4);
            let x = 0;
            let y = 0;
            if (direcion === 0) x = 1;
            if (direcion === 1) x = -1;
            if (direcion === 2) y = 1;
            if (direcion === 3) y = -1;
            let nuevaParcela = { "x": (parcela.x + x), "y": (parcela.y + y) }

            let idOcupado = ocupadoPor(zonas, nuevaParcela);
            while (nuevaParcela.x <= mapSize && nuevaParcela.y <= mapSize && zona.parcelas.length < zona.ZoneMaxSize) {
                console.log("hola" + nuevaParcela.x + " x" + x);
                if (idOcupado === null) {
                    zona.parcelas.push(nuevaParcela);
                    break;
                } else if (idOcupado !== zona.id) break;
                nuevaParcela.x += x;
                nuevaParcela.y += y;
            }
        });

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

    nature.zones = Math.round(Math.random() * (nature.maxZones - nature.minZones)) + nature.minZones;
    urban.zones = Math.round(Math.random() * (urban.maxZones - urban.minZones)) + urban.minZones;
    commercial.zones = Math.round(Math.random() * (commercial.maxZones - commercial.minZones)) + commercial.minZones;

    let mapSize = datos.get("CamposMapSize") === '' ? 65 : form.get("CamposMapSize");
    let Maxocupiedarea=datos.get("CamposMaxOcupedArea");
    
    canvas.width = mapSize;
    canvas.height = mapSize;
    render(canvas);
    mapa.appendChild(canvas);
    //console.log( zonesNature,zonesUrban, zonesCommercial);


    let coord = generarCoordenadas(mapSize, nature.zones, urban.zones, commercial.zones);

    let zones = asignarCoordenadas(coord, nature, urban, commercial)
    
    crecer(zones, mapSize, nature.TotalMaxsize, urban.TotalMaxsize, commercial.TotalMaxsize,((Maxocupiedarea/mapSize)*100));
    console.log(zones);



    //console.log(coords);



});



