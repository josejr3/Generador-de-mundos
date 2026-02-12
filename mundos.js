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
            return true;
        }
    }
    return false;
}

function autoResize(canvas) {
    const scale = Math.min(
        window.innerWidth / canvas.width,
        window.innerHeight / canvas.height
    );
    canvas.style.width = (canvas.width * scale) + "px";
    canvas.style.height = (canvas.height * scale) + "px";
    canvas.style.imageRendering = "pixelated";
}

function render(canvas, zones, scale) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    zones.forEach((zona) => {
        ctx.fillStyle = zona.color;
        zona.parcelas.forEach((parcela) => {
            ctx.fillRect(parcela.x * scale, parcela.y * scale, scale + 0.5, scale + 0.5);
        });

        ctx.fillStyle = "black";
        let fontSize = Math.max(8, Math.floor(scale * 0.6));
        ctx.font = `bold ${fontSize}px Arial`;

        zona.parcelas.forEach((parcela) => {
            let cx = (parcela.x * scale) + (scale / 2);
            let cy = (parcela.y * scale) + (scale / 2);
            ctx.fillText(zona.id, cx, cy);
        });
    });
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
            zones.push({ parcelas: [{ ...coords[index] }], id: I + index, "color": color, "ZoneMaxSize": zoneMaxSize, "TotalMaxsize": TotalMaxsize });
        }
        zoness.push(...zones);
        zones = [];
        inds = inds + I;
        zona++;
    });
    return zoness;
}

function ocupadoPor(zonas, parcelaNueva) {
    for (let zona of zonas) {
        if (repetidos(zona.parcelas, parcelaNueva)) {
            return zona.id;
        }
    }
    return null;
}

function countParcelas(zonas, tipe) {
    let total = 0;
    let parcelas = zonas.filter((zona) => zona.color === tipe);
    parcelas.forEach((zona) => total += zona.parcelas.length);
    return total;
}

function countOcupiedarea(zonas, mapxParcel) {
    let total = 0;
    zonas.forEach((zona) => { total += zona.parcelas.length });
    return total >= mapxParcel;
}
function obtenerHuecosLibres(zona, zonas, mapSize) {
    let huecos = [];
    const dirs = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];

    for (let parcela of zona.parcelas) {
        for (let dir of dirs) {
            let candidata = { x: parcela.x + dir.x, y: parcela.y + dir.y };

            if (candidata.x >= 0 && candidata.x < mapSize && candidata.y >= 0 && candidata.y < mapSize) {
                if (ocupadoPor(zonas, candidata) === null) {
                    if (!repetidos(huecos, candidata)) {
                        huecos.push(candidata);
                    }
                }
            }
        }
    }
    return huecos;
}

function crecer(zonas, mapSize, natureMaxsize, urbanMaxsize, commecialMaxsize, totalMaxparcel) {
    let parcelNature = countParcelas(zonas, "green");
    let parcelUrban = countParcelas(zonas, "yellow");
    let parcelCommercial = countParcelas(zonas, "orange");

    let zonasActivas = zonas.filter(z => z.parcelas.length < z.ZoneMaxSize);

    while (parcelNature < natureMaxsize || parcelUrban < urbanMaxsize || parcelCommercial < commecialMaxsize) {
    
        if (countOcupiedarea(zonas, totalMaxparcel)) { break; }

        if (zonasActivas.length === 0) {
            console.log("Mapa completado: No quedan huecos posibles.");
            break; 
        }

        let indexAleatorio = Math.floor(Math.random() * zonasActivas.length);
        let zonaActual = zonasActivas[indexAleatorio];

  
        let huecos = obtenerHuecosLibres(zonaActual, zonas, mapSize);

        if (huecos.length > 0) {
    
            let nuevoHueco = huecos[Math.floor(Math.random() * huecos.length)];
            zonaActual.parcelas.push(nuevoHueco);

            if (zonaActual.parcelas.length >= zonaActual.ZoneMaxSize) {
                zonasActivas.splice(indexAleatorio, 1);
            }

        } else {
            zonasActivas.splice(indexAleatorio, 1);
        }

        parcelNature = countParcelas(zonas, "green");
        parcelUrban = countParcelas(zonas, "yellow");
        parcelCommercial = countParcelas(zonas, "orange");

        if (parcelNature >= natureMaxsize) zonasActivas = zonasActivas.filter(z => z.color !== "green");
        if (parcelUrban >= urbanMaxsize) zonasActivas = zonasActivas.filter(z => z.color !== "yellow");
        if (parcelCommercial >= commecialMaxsize) zonasActivas = zonasActivas.filter(z => z.color !== "orange");
    }
}

let canvas = document.createElement("canvas");
let form = document.getElementById("datos");
let container = document.getElementById("container");
let mapa = document.getElementById("mapa");

let btnRegenerar = document.createElement("button");
btnRegenerar.innerText = "Regenerar Mapa";
btnRegenerar.className = "btn btn-primary mt-3"; 
btnRegenerar.type = "button"; 
btnRegenerar.onclick = () => {
    form.dispatchEvent(new Event("submit")); 
};

form.addEventListener("submit", (event) => {
    event.preventDefault();
    let datos = new FormData(form);
    form.style = "display:none";
    document.querySelector(".container").style.display = "none";

    let mapSize = datos.get("CamposMapSize") === '' ? 65 : parseInt(datos.get("CamposMapSize"));

    let nature = new zone([datos.get("NatureMinZones"), 2], [datos.get("NatureMaxZones"), 8], [datos.get("NatureZoneMaxSize"), 500], [datos.get("NatureTotalMaxsize"), 800]);
    let urban = new zone([datos.get("UrbanMinZones"), 4], [datos.get("UrbanMaxZones"), 6], [datos.get("UrbanZoneMaxsize"), 100], [datos.get("UrbanTotalMaxsize"), 800]);
    let commercial = new zone([datos.get("commercialMinZones"), 2], [datos.get("commercialMaxZones"), 8], [datos.get("commercialZoneMaxsize"), 50], [datos.get("commercialTotalMaxsize"), 200]);

    nature.zones = Math.round(Math.random() * (nature.maxZones - nature.minZones)) + parseInt(nature.minZones);
    urban.zones = Math.round(Math.random() * (urban.maxZones - urban.minZones)) + parseInt(urban.minZones);
    commercial.zones = Math.round(Math.random() * (commercial.maxZones - commercial.minZones)) + parseInt(commercial.minZones);
    let Maxocupiedarea = Math.floor((mapSize * mapSize) * ( (datos.get("CamposMaxOcupedArea")|| 80) / 100));

    let scale = Math.floor(Math.min(mapa.clientWidth, window.innerHeight * 0.75) / mapSize) || 1;

    canvas.width = mapSize * scale;
    canvas.height = mapSize * scale;
    
    mapa.innerHTML = ''; 
    mapa.appendChild(canvas);
    
    btnRegenerar.className = "btn btn-primary mb-3";
    if (btnRegenerar.parentElement !== mapa.parentElement) {
         mapa.parentElement.insertBefore(btnRegenerar, mapa); 
    }

    let coord = generarCoordenadas(mapSize, nature.zones, urban.zones, commercial.zones);
    let zones = asignarCoordenadas(coord, nature, urban, commercial);

    crecer(zones, mapSize, nature.TotalMaxsize, urban.TotalMaxsize, commercial.TotalMaxsize, Maxocupiedarea);

    mapa.className = "d-flex flex-column align-items-center justify-content-center";
    mapa.innerHTML = "";

    btnRegenerar.className = "btn btn-primary mb-2"; 
    mapa.appendChild(btnRegenerar);
    mapa.appendChild(canvas);
    const ajustar = () => {
        let lado = Math.min(mapa.clientWidth, window.innerHeight * 0.85); 
        let scale = Math.floor(lado / mapSize) || 1;
        
        canvas.width = mapSize * scale;
        canvas.height = mapSize * scale;
        
        render(canvas, zones, scale);
    };

    ajustar();
    window.onresize = ajustar;

    console.log(zones);
});


