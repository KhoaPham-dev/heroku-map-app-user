let userId = localStorage.getItem("userInfor");
if(!userId){
    $('#modalAddUsername').modal({backdrop: 'static', keyboard: false});
    $('#modalAddUsername').modal('show');
    document.getElementById("addUsername").addEventListener('click',async function(){
        let usernameEle = document.getElementById("username");
        if(usernameEle.value){
            let ranId = GenerateRandomId();
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let dateTime = date+' '+time;
            let userInfor = {
                activeShare: false,
                id: ranId,
                name: usernameEle.value,
                createdDate: dateTime,
                pendingRequestToFollow: [],
                pendingToFollowMe: [],
                pendingShare: [],
                relationships: []
            }
            await db.ref('users/' + ranId).set(userInfor);
            localStorage.setItem('userInfor', ranId);
            $("#modalAddUsername").modal("hide");
        }
    })

}
else{
    db.ref('users/' + userId).on('value', (snapshot)=>{
        
    })
}
function GenerateRandomId(){
    let max = 99999;
    let min = 10000;
    return `${Date.now()}${Math.floor(Math.random()*(max-min)+min)}`;
}