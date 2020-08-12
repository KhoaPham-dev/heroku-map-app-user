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
              // y: Math.floor(currPosInImg.y + (initPos.lat - 10.850882) / rate.y),
              // x: Math.floor(currPosInImg.x + (106.771668 - initPos.lng) / rate.x)
              y: Math.floor(currPosInImg.y + (initPos.lat - position.coords.latitude) / rate.y),
              x: Math.floor(currPosInImg.x + (position.coords.longitude - initPos.lng) / rate.x)
          };
          console.log(initPos.lat)
          console.log(position.coords.latitude);
          if(newCurrPosInImg.x > 0)
            currPosInImg.x = newCurrPosInImg.x;
          else currPosInImg.x = 0;

          if(newCurrPosInImg.y > 0)
            currPosInImg.y = newCurrPosInImg.y;
          else currPosInImg.y = 0;


            showCurrentLocation();
          
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
  document.getElementById("container").appendChild(dest);
  dest.style.left = `${currPosInImg.x - dest.offsetWidth / 2}px`;
  dest.style.top = `${currPosInImg.y - dest.offsetHeight}px`;
  dest.id = `${currPosInImg.y * dataPathDB.width + currPosInImg.x}`;

  //add "my location"
  let nameDestination = document.createElement("p");
  nameDestination.innerText = "Vị trí của tôi";
  nameDestination.classList.add("showNameDest");
  document.getElementById("container").appendChild(nameDestination);
  nameDestination.style.left = `${Number(dest.style.left.substring(0, dest.style.left.length - 2)) - 20}px`;
  nameDestination.style.top = `${Number(dest.style.top.substring(0, dest.style.top.length - 2)) - 20}px`;
  nameDestination.id = `myLocation-name`;

  document.getElementById("nameLocation").innerText = "Vị trí của tôi";
  //scroll to this location
  $("main").animate({
    scrollLeft: $(`#${dest.id}`)[0].offsetLeft - window.screen.width / 2 + offsetLeft
  }, 700, 'linear', ()=>{$("main").animate({
    scrollTop: $(`#${dest.id}`)[0].offsetTop - window.screen.height / 2
  }, 700, 'linear');});
}