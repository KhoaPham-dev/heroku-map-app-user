let zoomInBtn = document.getElementById("zoomIn");
let zoomOutBtn = document.getElementById("zoomOut");

zoomInBtn.addEventListener("click", function(){
  let currZoom = Number(document.getElementById("container").style.transform.substring(6, document.getElementById("container").style.transform.length - 1));
  let afterZoomIn = currZoom + 0.15;
  document.getElementById("container").style.transform = `scale(${afterZoomIn})`;
})

zoomOutBtn.addEventListener("click", function(){
  let currZoom = Number(document.getElementById("container").style.transform.substring(6, document.getElementById("container").style.transform.length - 1));
  let afterZoomOut = currZoom - 0.15;
  document.getElementById("container").style.transform = `scale(${afterZoomOut})`;
})