let initPos = {
    lat: 10.854175,  //y
    lng: 106.769469 //x
}
let currPosInImg = {
    x: 1,
    y: 1
};
let rate = {
    x: 0.000004,
    y: 0.000005
}
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: initPos,
      zoom: 6
    });
      // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let newCurrPosInImg = {
              y: Math.floor(currPosInImg.y + (initPos.lat - 10.850882) / rate.y),
              x: Math.floor(currPosInImg.x + (106.771668 - initPos.lng) / rate.x)
              // y: Math.floor(currPosInImg.y + (initPos.lat - position.coords.latitude) / rate.y),
              // x: Math.floor(currPosInImg.x + (position.coords.longitude - initPos.lng) / rate.x)
          };
          if(newCurrPosInImg.x > 0 && newCurrPosInImg.y > 0){
            currPosInImg = {...newCurrPosInImg};
            showCurrentLocation();
          }
        }, function() {
          handleLocationError();
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError();
      }
    }
function handleLocationError() {
    console.log('Error: The Geolocation service failed. Your browser doesn\'t support geolocation.');
}
function showCurrentLocation(){
  let dest = document.createElement("div");
  dest.classList.add("currLocation");
  containerElement.appendChild(dest);
  dest.style.left = `${currPosInImg.x - dest.offsetWidth / 2}px`;
  dest.style.top = `${currPosInImg.y - dest.offsetHeight}px`;
  dest.id = `${currPosInImg.y * dataPath.width + currPosInImg.x}`;

  //add "my location"
  let nameDestination = document.createElement("p");
  nameDestination.innerText = "Vị trí của tôi";
  nameDestination.classList.add("showNameDest");
  containerElement.appendChild(nameDestination);
  nameDestination.style.left = `${Number(dest.style.left.substring(0, dest.style.left.length - 2)) - 20}px`;
  nameDestination.style.top = `${Number(dest.style.top.substring(0, dest.style.top.length - 2)) - 20}px`;
  nameDestination.id = `myLocation-name`;

  document.getElementById("nameLocation").innerText = "Vị trí của tôi";
  //scroll to this location
  $("html, body").animate({
    scrollLeft: $(`#${dest.id}`).offset().left - window.screen.width / 2
  }, 700, 'linear', ()=>{$("html, body").animate({
    scrollTop: $(`#${dest.id}`).offset().top - window.screen.height / 2
  }, 700, 'linear');});
  
}