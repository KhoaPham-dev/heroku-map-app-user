let initPos = {
    lat: 10.853834,  //y
    lng: 106.769088 //x
}
let currPosInImg = {
    x: 1,
    y: 1
};
let rate = {
    x: 0.0000026595,
    y: 0.0000026595
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
              y: Math.floor(currPosInImg.y + (initPos.lat - 10.850970) / rate.y),
              x: Math.floor(currPosInImg.x + (106.771283 - initPos.lng) / rate.x)
              //y: Math.floor(currPosInImg.y + (initPos.lat - position.coords.latitude) / rate.y),
              //x: Math.floor(currPosInImg.x + (position.coords.longitude - initPos.lng) / rate.x)
          };
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
          if(newCurrPosInImg.x > 0 && newCurrPosInImg.x <= dataPathDB.width && newCurrPosInImg.y > 0 && newCurrPosInImg.y <= dataPathDB.height)
          {
            currPosInImg = {...newCurrPosInImg};
            showCurrentLocation();
          }
          else{
            console.log("Nằm ngoài trường");
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
    scrollLeft: $(`#${dest.id}`)[0].offsetLeft - window.screen.width / 2 + offsetLeft + $(`#${dest.id}`)[0].offsetLeft * (Number(containerEle.style.transform.substring(6, document.getElementById("container").style.transform.length - 1)) - 1)
  }, 700, 'linear', ()=>{$("main").animate({
    scrollTop: $(`#${dest.id}`)[0].offsetTop - window.screen.height / 2 + $(`#${dest.id}`)[0].offsetTop * (Number(containerEle.style.transform.substring(6, document.getElementById("container").style.transform.length - 1)) - 1)
  }, 700, 'linear');});
}