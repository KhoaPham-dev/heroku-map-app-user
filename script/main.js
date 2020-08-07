const graph = new Graph();
let loader = {
  elementLoader: document.createElement('div'),
  layer: document.createElement('div'),
  switchLoading(isLoading){
    if(isLoading){
      this.elementLoader.classList.add("loader");
      document.getElementById("main").appendChild(this.elementLoader);
      this.layer.classList.add('layer');
      document.getElementById("main").appendChild(this.layer);
    }
    else{
      this.elementLoader.classList.remove("loader");
      document.getElementById("main").removeChild(this.elementLoader);
      this.layer.classList.remove('layer');
      document.getElementById("main").removeChild(this.layer);
    }
  }
}
let isMoveOn = false;
let isEnterInput = false;
let imgTag = document.getElementById("img");
let mode = {
  findPath: false,
  findVertex: false,
  turnOn(modeName){
    for (let i in this)
      if(typeof this[i] != "function") this[i] = false;
    this[modeName] = true;
    //remove all btn-mode-active class element
    document.querySelectorAll(".btn-mode").forEach(e=>{e.classList.remove("btn-mode-active")});
    //add new class element to curr btn-mode
    document.querySelectorAll(".btn-mode").forEach(e=>{if(e.classList[1].toLowerCase().indexOf(modeName.toLowerCase()) > -1)e.classList.add("btn-mode-active")});

  }
}
//This dataPath will get from database
let dataPath = {
  path: [
      //{
      //name: 12345_472, //example: from 12345 vertex to 472 => name: 12345_472
      //length: 100, //length of the path 100 pixels
      //marked:{ //mark paths in array pixel
      //   //12345: 12346,
      //   //12346: 12347,
      //    ...
      // }   
      //},
  ],
  //vertexs:[337280, 103408, 1764892, 1834652, 1225040, 57748, 797004]      //saved vertexs
  //vertexs:[6362224, 6410292, 5618632]  //spkt
  vertexs:[],
  width: imgTag.width,
  height: imgTag.height,
  information: []
};
let containerElement = document.getElementById("container");
let count = 0;
let start = '';
let end = '';
let resultBellmanFord = {};
//Turn on find vertex at first
mode.turnOn("findVertex");
window.onload = async function(){
  loader.switchLoading(true);
  let res = await fetch('/preload');
  res = await res.json();
  if(res.width && res.width != 0)dataPath = res;
  console.log(dataPath); // parses JSON response into native JavaScript objects
  for(let i = 0; i < dataPath.vertexs.length; i++){
    //add vertex
    let dest = document.createElement("div");
    dest.classList.add("dest");
    containerElement.appendChild(dest);
    let y = Math.floor((dataPath.vertexs[i] / 4) / dataPath.width);  //row
    let x = (dataPath.vertexs[i] / 4) % dataPath.width;              //col
    dest.style.left = `${x - dest.offsetWidth / 2}px`;
    dest.style.top = `${y - dest.offsetHeight}px`;
    dest.id = `${dataPath.vertexs[i]}`;
    //add name vertex
    let nameDestination = document.createElement("p");
    nameDestination.innerText = dataPath.information[i].name[0];
    nameDestination.classList.add("showNameDest");
    containerElement.appendChild(nameDestination);
    nameDestination.style.left = `${Number(dest.style.left.substring(0, dest.style.left.length - 2)) - 20}px`;
    nameDestination.style.top = `${Number(dest.style.top.substring(0, dest.style.top.length - 2)) - 20}px`;
    nameDestination.id = `${dataPath.vertexs[i]}-name`;
    nameDestination.classList.add("de-active");

    dest.addEventListener("click", function(event){
      //scroll to this location
      $("main").animate({
        scrollLeft: $(`#${event.target.id}`)[0].offsetLeft - window.screen.width / 2 + offsetLeft
      }, 700, 'linear', ()=>{$("main").animate({
        scrollTop: $(`#${event.target.id}`)[0].offsetTop - window.screen.height / 2
      }, 700, 'linear');});
      controlMode(event);
    })
  }
  addEdgesIntoGraph();
   //Bellmanford => init paths from all vertexs  
  for(let i = 0; i < dataPath.vertexs.length; i++)
    resultBellmanFord[`${dataPath.vertexs[i]}`] = bellmanFord(graph, `${dataPath.vertexs[i]}`);
  loader.switchLoading(false);
}

function addEdgesIntoGraph(){
  let vertexInstances = [];
  for(let i = 0; i < dataPath.path.length; i++){
    let pathName = dataPath.path[i]["name"].split("_");
    let vertex1 = vertexInstances.find(vertex => vertex.getKey() === pathName[0]);
    let vertex2 = vertexInstances.find(vertex => vertex.getKey() === pathName[1]);
    if(!vertex1){
      vertex1 = new GraphVertex(pathName[0]);
      vertexInstances.push(vertex1);
    }
    if(!vertex2){
      vertex2 = new GraphVertex(pathName[1]);
      vertexInstances.push(vertex2);
    }
    graph.addEdge(new GraphEdge(vertex1, vertex2, dataPath.path[i]["length"]));
  }
}
async function renderShortestPath(event){
  if(count == 1){
    //detete prev shown name of destination
    let shownNameDest = document.querySelectorAll(".showNameDest.active");
    for(let i = 0; i < shownNameDest.length; i++){
      shownNameDest[i].classList.remove("active");
      shownNameDest[i].classList.add("de-active");
    }
    //delete prev chosen vertexs
    let destsChosen = document.querySelectorAll(".destChosen");
    for(let i = 0; i < destsChosen.length; i++){
      destsChosen[i].classList.remove("destChosen");
      destsChosen[i].classList.add("dest");
    }
    //delete points of path
    let pointsPath = document.getElementsByClassName("point-path");
    let len = pointsPath.length;
    for(let i = 0; i < len; i++){
      containerElement.removeChild(pointsPath[0]);
      delete pointsPath[0];
    }
    
    event.target.classList.remove("dest");
    event.target.classList.add("destChosen");
    //show name of destination
    if(isEnterInput){
      document.getElementById(`${event.target.id}-name`).innerText = document.getElementById("inputLocation").value;
      document.getElementById("nameLocation").innerText = document.getElementById("inputLocation").value
    }
    else{
      document.getElementById("nameLocation").innerText = document.getElementById(`${event.target.id}-name`).innerText;
      document.getElementById("inputLocation").value = document.getElementById(`${event.target.id}-name`).innerText;
    }
    isEnterInput = false;
    document.getElementById(`${event.target.id}-name`).classList.remove("de-active");
    document.getElementById(`${event.target.id}-name`).classList.add("active");

    start = event.target.id;
    console.log(start);
  }
  else if(count == 2){
    loader.switchLoading(true);
    //Remove olders
    event.target.classList.remove("dest");
    event.target.classList.add("destChosen");
    
    //add newers
    //show name of destination
    let the2ndVertexName = document.getElementById("inputLocation");
    if(isEnterInput){
      document.getElementById(`${event.target.id}-name`).innerText = the2ndVertexName.value;
      document.getElementById("nameLocation").innerText += " - " + the2ndVertexName.value;
    }
    else{
      document.getElementById("nameLocation").innerText += " - " + document.getElementById(`${event.target.id}-name`).innerText;
      the2ndVertexName.value = document.getElementById(`${event.target.id}-name`).innerText;
    }
    isEnterInput = false;
    document.getElementById(`${event.target.id}-name`).classList.remove("de-active");
    document.getElementById(`${event.target.id}-name`).classList.add("active");

    end = event.target.id;
    console.log(end);
    
    let pixelInArr = end;
    while(resultBellmanFord[`${start}`].previousVertices[`${pixelInArr}`] != null){
      let prevOfPixelInArr = resultBellmanFord[`${start}`].previousVertices[`${pixelInArr}`].value;
      for(let i = 0; i < dataPath.path.length; i++){
        let pathName = dataPath.path[i]["name"].split("_");
        if(pathName.includes(`${pixelInArr}`) && pathName.includes(`${prevOfPixelInArr}`)){
          showPath(dataPath.path[i].marked);
          break;
        }
      }
      pixelInArr = prevOfPixelInArr;
    }
    loader.switchLoading(false);
    
    //Increment quantity of user cares of the chosen locations
    try{
      await fetch('/inc-qty-care', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({vertex: start}) // body data type must match "Content-Type" header
      });
      await fetch('/inc-qty-care', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({vertex: end}) // body data type must match "Content-Type" header
      });
      //update dataPath on client
      let res = await fetch('/preload');
      res = await res.json();
      if(res.width && res.width != 0)dataPath = res;
    } catch (error) {
      console.log(error)
    }
  }
}
function showPath(pathMarks){
  let dem = 0;
  for(let i in pathMarks){
    if(dem % 15 == 0)
      drawPointOfPath(pathMarks[i]);
    dem++;
  }

}
function drawPointOfPath(pixelInArray){
  let destPoint = document.createElement("div");
  destPoint.classList.add("point-path");
  containerElement.appendChild(destPoint);
  let y = Math.floor((Number(pixelInArray) / 4) / dataPath.width);  //row
  let x = (Number(pixelInArray) / 4) % dataPath.width;              //col
  destPoint.style.left = `${x - destPoint.offsetWidth / 2}px`;
  destPoint.style.top = `${y - destPoint.offsetHeight / 2}px`;
}
function showLocationByInput(event){
  let input, filter, divContainer, ul;
  let count = 0;
  let list = [];
  input = event.target;
  filter = stringToASCII(input.value.toLowerCase());
  divContainer = document.getElementById("searchLocationContainer");
  try {
    divContainer.removeChild(document.getElementById("listLocations"));
  } catch (error) {}
  if(filter){
    ul = document.createElement('ul');
    ul.id = "listLocations";
    ul.classList.add("list-group");
    for (let i = 0; i < dataPath.information.length && count <= 8; i++) {
      for(let j = 0; j < dataPath.information[i]["name"].length && count <= 8; j++){
        if (filter.split(" ").find(e =>{return stringToASCII(dataPath.information[i]["name"][j].toLowerCase()).indexOf(e) > -1})) {
          count++;
          let li = document.createElement("li");
          li.classList.add(`${dataPath.information[i]["vertex"]}`);
          li.classList.add("list-group-item");
          li.innerText = dataPath.information[i]["name"][j];
          li.addEventListener("mouseover", function(){isMoveOn = true});
          li.addEventListener("mouseleave", function(){isMoveOn = false});
          list.push({li, qty_care: dataPath.information[i].qty_care});

          li.addEventListener("click", chooseALocationInList);
        }
      }
    }
    list.sort((a, b)=>{return b.qty_care - a.qty_care});
    for(let i = 0; i < list.length; i++){
      ul.appendChild(list[i].li);
    }
    divContainer.appendChild(ul);
    li = document.querySelectorAll("li.list-group-item");
    if(![40, 38, 13].includes(event.which)){
      posLiSelected = -1;
    }
  }
}
function stringToASCII(str) {
  try {
    return str.replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g, 'a')
      .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
      .replace(/[đ]/g, 'd')
      .replace(/[ìíỉĩị]/g, 'i')
      .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
      .replace(/[ùúủũụưừứửữự]/g, 'u')
      .replace(/[ỳýỷỹỵ]/g, 'y')
  } catch {
    return ''
  }
}
function chooseALocationInList(event){
  if(event.target){
    isEnterInput = true;
    document.getElementById("inputLocation").value = event.target.innerText;
    document.getElementById(event.target.classList[0]).click();
  }
  else{
    isEnterInput = true;
    document.getElementById("inputLocation").value = event.innerText;
    document.getElementById(event.classList[0]).click();
  }
  divContainer = document.getElementById("searchLocationContainer");
  try {
    divContainer.removeChild(document.getElementById("listLocations"));
  } catch (error) {}
}
function controlMode(event){
  if(mode.findVertex) count = 1;
  else if(mode.findPath) count++;
  console.log(count);
  renderShortestPath(event);
  if(count >= 2) count = 0;
}

//Choose list of locations by using narrow key
let li = document.querySelectorAll("li.list-group-item");
let posLiSelected = -1;
window.addEventListener("keyup", function(e){
  if(li.length > 0){
    if(e.which === 40 && posLiSelected >= li.length - 1) posLiSelected = -1;
    else if(e.which === 38 && posLiSelected <= 0) posLiSelected = li.length;
  
    if(e.which === 40) posLiSelected++;
    else if(e.which === 38) posLiSelected--;
    else if(e.which === 13){
      isEnterInput = true;
      if(li[posLiSelected]) chooseALocationInList(li[posLiSelected]);
      else chooseALocationInList(li[0]);
    }
    li.forEach((e)=>{if(e.classList.contains("selected-li"))e.classList.remove("selected-li")});
    if(e.which === 40 || e.which === 38)
      li[posLiSelected].classList.add("selected-li");
  }
})
document.getElementById("inputLocation").addEventListener("keyup", showLocationByInput);
document.getElementById("inputLocation").addEventListener("focusin", showLocationByInput);
document.getElementById("inputLocation").addEventListener("focusout", function(e){
  if(!isMoveOn){
    divContainer = document.getElementById("searchLocationContainer");
      try {
        divContainer.removeChild(document.getElementById("listLocations"));
      } catch (error) {}
  }
})
document.getElementById("btnReset").addEventListener("click", function(){
  document.getElementById("inputLocation").value = '';
})
document.getElementById("bthEnter").addEventListener("click", function(e){
  if(li.length > 0){
    isEnterInput = true;
    if(li[posLiSelected]) chooseALocationInList(li[posLiSelected]);
    else chooseALocationInList(li[0]);
  }
})
document.getElementById("findVertex").addEventListener("click", function(e){
  mode.turnOn("findVertex");
})
document.getElementById("findPath").addEventListener("click", function(e){
  mode.turnOn("findPath");
})