function bellmanFord(e,t){const n={},i={};n[t]=0,e.getAllVertices().forEach(e=>{i[e.getKey()]=null,e.getKey()!==t&&(n[e.getKey()]=1/0)});for(let t=0;t<e.getAllVertices().length-1;t+=1)Object.keys(n).forEach(t=>{const a=e.getVertexByKey(t);e.getNeighbors(a).forEach(t=>{const r=e.findEdge(a,t),s=n[a.getKey()]+r.weight;s<n[t.getKey()]&&(n[t.getKey()]=s,i[t.getKey()]=a)})});return{distances:n,previousVertices:i}}class Comparator{constructor(e){this.compare=e||Comparator.defaultCompareFunction}static defaultCompareFunction(e,t){return e===t?0:e<t?-1:1}equal(e,t){return 0===this.compare(e,t)}lessThan(e,t){return this.compare(e,t)<0}greaterThan(e,t){return this.compare(e,t)>0}lessThanOrEqual(e,t){return this.lessThan(e,t)||this.equal(e,t)}greaterThanOrEqual(e,t){return this.greaterThan(e,t)||this.equal(e,t)}reverse(){const e=this.compare;this.compare=(t,n)=>e(n,t)}}let initPos={lat:10.854175,lng:106.769469},currPosInImg={x:1,y:1},rate={x:4e-6,y:5e-6};function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:initPos,zoom:6}),navigator.geolocation?navigator.geolocation.getCurrentPosition((function(e){let t={y:Math.floor(currPosInImg.y+(initPos.lat-e.coords.latitude)/rate.y),x:Math.floor(currPosInImg.x+(e.coords.longitude-initPos.lng)/rate.x)};console.log(initPos.lat),console.log(e.coords.latitude),currPosInImg.x=t.x>0?t.x:0,currPosInImg.y=t.y>0?t.y:0,showCurrentLocation()}),(function(){handleLocationError()})):handleLocationError()}function handleLocationError(){console.log("Error: The Geolocation service failed. Your browser doesn't support geolocation.")}function showCurrentLocation(){let e=document.createElement("div");e.classList.add("currLocation"),document.getElementById("container").appendChild(e),e.style.left=currPosInImg.x-e.offsetWidth/2+"px",e.style.top=currPosInImg.y-e.offsetHeight+"px",e.id=""+(currPosInImg.y*dataPathDB.width+currPosInImg.x);let t=document.createElement("p");t.innerText="Vị trí của tôi",t.classList.add("showNameDest"),document.getElementById("container").appendChild(t),t.style.left=Number(e.style.left.substring(0,e.style.left.length-2))-20+"px",t.style.top=Number(e.style.top.substring(0,e.style.top.length-2))-20+"px",t.id="myLocation-name",document.getElementById("nameLocation").innerText="Vị trí của tôi",$("main").animate({scrollLeft:$("#"+e.id)[0].offsetLeft-window.screen.width/2+offsetLeft},700,"linear",()=>{$("main").animate({scrollTop:$("#"+e.id)[0].offsetTop-window.screen.height/2},700,"linear")})}class GraphEdge{constructor(e,t,n=0){this.startVertex=e,this.endVertex=t,this.weight=n}getKey(){return`${this.startVertex.getKey()}_${this.endVertex.getKey()}`}reverse(){const e=this.startVertex;return this.startVertex=this.endVertex,this.endVertex=e,this}toString(){return this.getKey()}}class GraphVertex{constructor(e){if(void 0===e)throw new Error("Graph vertex must have a value");this.value=e,this.edges=new LinkedList((e,t)=>e.getKey()===t.getKey()?0:e.getKey()<t.getKey()?-1:1)}addEdge(e){return this.edges.append(e),this}deleteEdge(e){this.edges.delete(e)}getNeighbors(){return this.edges.toArray().map(e=>e.value.startVertex===this?e.value.endVertex:e.value.startVertex)}getEdges(){return this.edges.toArray().map(e=>e.value)}getDegree(){return this.edges.toArray().length}hasEdge(e){return!!this.edges.find({callback:t=>t===e})}hasNeighbor(e){return!!this.edges.find({callback:t=>t.startVertex===e||t.endVertex===e})}findEdge(e){const t=this.edges.find({callback:t=>t.startVertex===e||t.endVertex===e});return t?t.value:null}getKey(){return this.value}deleteAllEdges(){return this.getEdges().forEach(e=>this.deleteEdge(e)),this}toString(e){return e?e(this.value):""+this.value}}class Graph{constructor(e=!1){this.vertices={},this.edges={},this.isDirected=e}addVertex(e){return this.vertices[e.getKey()]=e,this}getVertexByKey(e){return this.vertices[e]}getNeighbors(e){return e.getNeighbors()}getAllVertices(){return Object.values(this.vertices)}getAllEdges(){return Object.values(this.edges)}addEdge(e){let t=this.getVertexByKey(e.startVertex.getKey()),n=this.getVertexByKey(e.endVertex.getKey());if(t||(this.addVertex(e.startVertex),t=this.getVertexByKey(e.startVertex.getKey())),n||(this.addVertex(e.endVertex),n=this.getVertexByKey(e.endVertex.getKey())),this.edges[e.getKey()])throw new Error("Edge has already been added before");return this.edges[e.getKey()]=e,this.isDirected?t.addEdge(e):(t.addEdge(e),n.addEdge(e)),this}deleteEdge(e){if(!this.edges[e.getKey()])throw new Error("Edge not found in graph");delete this.edges[e.getKey()];const t=this.getVertexByKey(e.startVertex.getKey()),n=this.getVertexByKey(e.endVertex.getKey());t.deleteEdge(e),n.deleteEdge(e)}findEdge(e,t){const n=this.getVertexByKey(e.getKey());return n?n.findEdge(t):null}getWeight(){return this.getAllEdges().reduce((e,t)=>e+t.weight,0)}reverse(){return this.getAllEdges().forEach(e=>{this.deleteEdge(e),e.reverse(),this.addEdge(e)}),this}getVerticesIndices(){const e={};return this.getAllVertices().forEach((t,n)=>{e[t.getKey()]=n}),e}getAdjacencyMatrix(){const e=this.getAllVertices(),t=this.getVerticesIndices(),n=Array(e.length).fill(null).map(()=>Array(e.length).fill(1/0));return e.forEach((e,i)=>{e.getNeighbors().forEach(a=>{const r=t[a.getKey()];n[i][r]=this.findEdge(e,a).weight})}),n}toString(){return Object.keys(this.vertices).toString()}}class LinkedListNode{constructor(e,t=null){this.value=e,this.next=t}toString(e){return e?e(this.value):""+this.value}}class LinkedList{constructor(e){this.head=null,this.tail=null,this.compare=new Comparator(e)}prepend(e){const t=new LinkedListNode(e,this.head);return this.head=t,this.tail||(this.tail=t),this}append(e){const t=new LinkedListNode(e);return this.head?(this.tail.next=t,this.tail=t,this):(this.head=t,this.tail=t,this)}delete(e){if(!this.head)return null;let t=null;for(;this.head&&this.compare.equal(this.head.value,e);)t=this.head,this.head=this.head.next;let n=this.head;if(null!==n)for(;n.next;)this.compare.equal(n.next.value,e)?(t=n.next,n.next=n.next.next):n=n.next;return this.compare.equal(this.tail.value,e)&&(this.tail=n),t}find({value:e,callback:t}){if(!this.head)return null;let n=this.head;for(;n;){if(t&&t(n.value))return n;if(void 0!==e&&this.compare.equal(n.value,e))return n;n=n.next}return null}deleteTail(){const e=this.tail;if(this.head===this.tail)return this.head=null,this.tail=null,e;let t=this.head;for(;t.next;)t.next.next?t=t.next:t.next=null;return this.tail=t,e}deleteHead(){if(!this.head)return null;const e=this.head;return this.head.next?this.head=this.head.next:(this.head=null,this.tail=null),e}fromArray(e){return e.forEach(e=>this.append(e)),this}toArray(){const e=[];let t=this.head;for(;t;)e.push(t),t=t.next;return e}toString(e){return this.toArray().map(t=>t.toString(e)).toString()}reverse(){let e=this.head,t=null,n=null;for(;e;)n=e.next,e.next=t,t=e,e=n;return this.tail=this.head,this.head=t,this}}const graphInstance=new Graph;let loader={elementLoader:document.createElement("div"),layer:document.createElement("div"),switchLoading(e){e?(this.elementLoader.classList.add("loader"),document.getElementById("main").appendChild(this.elementLoader),this.layer.classList.add("layer"),document.getElementById("main").appendChild(this.layer)):(this.elementLoader.classList.remove("loader"),document.getElementById("main").removeChild(this.elementLoader),this.layer.classList.remove("layer"),document.getElementById("main").removeChild(this.layer))}},isMoveOver=!1,isEnterInput=!1,imgElement=document.getElementById("img"),mode={findPath:!1,findVertex:!1,turnOn(e){for(let e in this)"function"!=typeof this[e]&&(this[e]=!1);this[e]=!0,document.querySelectorAll(".btn-mode").forEach(e=>{e.classList.remove("btn-mode-active")}),document.querySelectorAll(".btn-mode").forEach(t=>{t.classList[1].toLowerCase().indexOf(e.toLowerCase())>-1&&t.classList.add("btn-mode-active")})}},dataPathDB={path:[],vertexs:[],width:imgElement.width,height:imgElement.height,information:[]},containerEle=document.getElementById("container"),countClick=0,start="",end="",resultBellmanFord={};function addEdgesIntoGraph(){let e=[];for(let t=0;t<dataPathDB.path.length;t++){let n=dataPathDB.path[t].name.split("_"),i=e.find(e=>e.getKey()===n[0]),a=e.find(e=>e.getKey()===n[1]);i||(i=new GraphVertex(n[0]),e.push(i)),a||(a=new GraphVertex(n[1]),e.push(a)),graphInstance.addEdge(new GraphEdge(i,a,dataPathDB.path[t].length))}}async function renderShortestPath(e){if(1==countClick){let t=document.querySelectorAll(".showNameDest.active");for(let e=0;e<t.length;e++)t[e].classList.remove("active"),t[e].classList.add("de-active");let n=document.querySelectorAll(".destChosen");for(let e=0;e<n.length;e++)n[e].classList.remove("destChosen"),n[e].classList.add("dest");let i=document.getElementsByClassName("point-path"),a=i.length;for(let e=0;e<a;e++)containerEle.removeChild(i[0]),delete i[0];e.target.classList.remove("dest"),e.target.classList.add("destChosen"),isEnterInput?(document.getElementById(e.target.id+"-name").innerText=document.getElementById("inputLocation").value,document.getElementById("nameLocation").innerText=document.getElementById("inputLocation").value):(document.getElementById("nameLocation").innerText=document.getElementById(e.target.id+"-name").innerText,document.getElementById("inputLocation").value=document.getElementById(e.target.id+"-name").innerText),isEnterInput=!1,document.getElementById(e.target.id+"-name").classList.remove("de-active"),document.getElementById(e.target.id+"-name").classList.add("active"),start=e.target.id,console.log(start)}else if(2==countClick){loader.switchLoading(!0),e.target.classList.remove("dest"),e.target.classList.add("destChosen");let t=document.getElementById("inputLocation");isEnterInput?(document.getElementById(e.target.id+"-name").innerText=t.value,document.getElementById("nameLocation").innerText+=" - "+t.value):(document.getElementById("nameLocation").innerText+=" - "+document.getElementById(e.target.id+"-name").innerText,t.value=document.getElementById(e.target.id+"-name").innerText),isEnterInput=!1,document.getElementById(e.target.id+"-name").classList.remove("de-active"),document.getElementById(e.target.id+"-name").classList.add("active"),end=e.target.id,console.log(end);let n=end;for(;null!=resultBellmanFord[""+start].previousVertices[""+n];){let e=resultBellmanFord[""+start].previousVertices[""+n].value;for(let t=0;t<dataPathDB.path.length;t++){let i=dataPathDB.path[t].name.split("_");if(i.includes(""+n)&&i.includes(""+e)){showPath(dataPathDB.path[t].marked);break}}n=e}loader.switchLoading(!1);try{await fetch("/inc-qty-care",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({vertex:start})}),await fetch("/inc-qty-care",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({vertex:end})});let e=await fetch("/preload");e=await e.json(),e.width&&0!=e.width&&(dataPathDB=e)}catch(e){console.log(e)}}}function showPath(e){let t=0;for(let n in e)t%15==0&&drawPointOfPath(e[n]),t++}function drawPointOfPath(e){let t=document.createElement("div");t.classList.add("point-path"),containerEle.appendChild(t);let n=Math.floor(Number(e)/4/dataPathDB.width),i=Number(e)/4%dataPathDB.width;t.style.left=i-t.offsetWidth/2+"px",t.style.top=n-t.offsetHeight/2+"px"}function showLocationByInput(e){let t,n,i,a,r=0,s=[];t=e.target,n=stringToASCII(t.value.toLowerCase()),i=document.getElementById("searchLocationContainer");try{i.removeChild(document.getElementById("listLocations"))}catch(e){}if(n){a=document.createElement("ul"),a.id="listLocations",a.classList.add("list-group");for(let e=0;e<dataPathDB.information.length&&r<=8;e++)for(let t=0;t<dataPathDB.information[e].name.length&&r<=8;t++)if(n.split(" ").find(n=>stringToASCII(dataPathDB.information[e].name[t].toLowerCase()).indexOf(n)>-1)){r++;let n=document.createElement("li");n.classList.add(""+dataPathDB.information[e].vertex),n.classList.add("list-group-item"),n.innerText=dataPathDB.information[e].name[t],n.addEventListener("mouseover",(function(){isMoveOver=!0})),n.addEventListener("mouseleave",(function(){isMoveOver=!1})),s.push({li:n,qty_care:dataPathDB.information[e].qty_care}),n.addEventListener("click",chooseALocationInList)}s.sort((e,t)=>t.qty_care-e.qty_care);for(let e=0;e<s.length;e++)a.appendChild(s[e].li);i.appendChild(a),li=document.querySelectorAll("li.list-group-item"),[40,38,13].includes(e.which)||(posLiSelected=-1)}}function stringToASCII(e){try{return e.replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g,"a").replace(/[èéẻẽẹêềếểễệ]/g,"e").replace(/[đ]/g,"d").replace(/[ìíỉĩị]/g,"i").replace(/[òóỏõọôồốổỗộơờớởỡợ]/g,"o").replace(/[ùúủũụưừứửữự]/g,"u").replace(/[ỳýỷỹỵ]/g,"y")}catch{return""}}function chooseALocationInList(e){e.target?(isEnterInput=!0,document.getElementById("inputLocation").value=e.target.innerText,document.getElementById(e.target.classList[0]).click()):(isEnterInput=!0,document.getElementById("inputLocation").value=e.innerText,document.getElementById(e.classList[0]).click()),divContainer=document.getElementById("searchLocationContainer");try{divContainer.removeChild(document.getElementById("listLocations"))}catch(e){}}function controlMode(e){mode.findVertex?countClick=1:mode.findPath&&countClick++,console.log(countClick),renderShortestPath(e),countClick>=2&&(countClick=0)}mode.turnOn("findVertex"),window.onload=async function(){loader.switchLoading(!0);let e=await fetch("/preload");e=await e.json(),e.width&&0!=e.width&&(dataPathDB=e),console.log(dataPathDB);for(let e=0;e<dataPathDB.vertexs.length;e++){let t=document.createElement("div");t.classList.add("dest"),containerEle.appendChild(t);let n=Math.floor(dataPathDB.vertexs[e]/4/dataPathDB.width),i=dataPathDB.vertexs[e]/4%dataPathDB.width;t.style.left=i-t.offsetWidth/2+"px",t.style.top=n-t.offsetHeight+"px",t.id=""+dataPathDB.vertexs[e];let a=document.createElement("p");a.innerText=dataPathDB.information[e].name[0],a.classList.add("showNameDest"),containerEle.appendChild(a),a.style.left=Number(t.style.left.substring(0,t.style.left.length-2))-20+"px",a.style.top=Number(t.style.top.substring(0,t.style.top.length-2))-20+"px",a.id=dataPathDB.vertexs[e]+"-name",a.classList.add("de-active"),t.addEventListener("click",(function(e){$("main").animate({scrollLeft:$("#"+e.target.id)[0].offsetLeft-window.screen.width/2+offsetLeft},700,"linear",()=>{$("main").animate({scrollTop:$("#"+e.target.id)[0].offsetTop-window.screen.height/2},700,"linear")}),controlMode(e)}))}addEdgesIntoGraph();for(let e=0;e<dataPathDB.vertexs.length;e++)resultBellmanFord[""+dataPathDB.vertexs[e]]=bellmanFord(graphInstance,""+dataPathDB.vertexs[e]);loader.switchLoading(!1)};let li=document.querySelectorAll("li.list-group-item"),posLiSelected=-1;window.addEventListener("keyup",(function(e){li.length>0&&(40===e.which&&posLiSelected>=li.length-1?posLiSelected=-1:38===e.which&&posLiSelected<=0&&(posLiSelected=li.length),40===e.which?posLiSelected++:38===e.which?posLiSelected--:13===e.which&&(isEnterInput=!0,li[posLiSelected]?chooseALocationInList(li[posLiSelected]):chooseALocationInList(li[0])),li.forEach(e=>{e.classList.contains("selected-li")&&e.classList.remove("selected-li")}),40!==e.which&&38!==e.which||li[posLiSelected].classList.add("selected-li"))})),document.getElementById("inputLocation").addEventListener("keyup",showLocationByInput),document.getElementById("inputLocation").addEventListener("focusin",showLocationByInput),document.getElementById("inputLocation").addEventListener("focusout",(function(e){if(!isMoveOver){divContainer=document.getElementById("searchLocationContainer");try{divContainer.removeChild(document.getElementById("listLocations"))}catch(e){}}})),document.getElementById("btnReset").addEventListener("click",(function(){document.getElementById("inputLocation").value=""})),document.getElementById("bthEnter").addEventListener("click",(function(e){li.length>0&&(isEnterInput=!0,li[posLiSelected]?chooseALocationInList(li[posLiSelected]):chooseALocationInList(li[0]))})),document.getElementById("findVertex").addEventListener("click",(function(e){mode.turnOn("findVertex")})),document.getElementById("findPath").addEventListener("click",(function(e){mode.turnOn("findPath")}));