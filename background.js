var first_time = true; // if this is the first time loading this script
var allowed;

function is_first_time(){
	return first_time;
}
function set_first_time_false(){
	first_time = false;
}

function show(message){
	var notification = window.webkitNotifications.createNotification(
		"yoda.png",
		"Star Wars To-do List",
		message
	);
	notification.show();
}

function start_notification(){
	// Test for notification support.
	if (window.webkitNotifications) {
		  // While activated, show notifications at the display frequency.
		//show("Hola");

		  setTimeout(function() {
			console.log("timer! "+get_format_time_());
			if(allowed){ //global variable as indication of the checkbox control
		    	send_out_notification();
		    }
		    //recursion
		    start_notification();
		  }, 55000); //55 sec
	}else{
		console.log("Notification not support.");
	}
}

function send_out_notification(){
	var date = get_format_date();
	chrome.storage.sync.get(date, function(items){
		if(items[date] == undefined){	
			return;
		}
		//retrieve all items for the day
		var obj = items[date];
		var i;
		console.log("begin search event (for loop) at "+get_format_time_()); //log down system time
		for(i=0; i<Object.keys(obj).length; i++){
			console.log(obj[i]["item"]+" "+obj[i]["venue"]);
			if(obj[i]['done'] == false){
				
				if(get_format_time() == obj[i]['hour']+":"+obj[i]['minute']){
					//show the notification(s) only at the moment
					show("Task due: "+obj[i]['item']+" at "+obj[i]['hour']+":"+obj[i]['minute']);
				}
			}
		}
	});
}
// chrome.browserAction.onClicked.addListener(function() {
// 	alert("Hola");
//   	start_notification();
// });

//get mm/dd/yyyy
function get_format_date(){
	//get current date
	 var curDate = new Date();
	 var dd = curDate.getDate();
	 var mm = curDate.getMonth()+1;
	 var yyyy = curDate.getFullYear();
	 if(dd<10) dd = '0'+dd;
 	 if(mm<10) mm = '0'+mm;
 	 format_date = mm+"/"+dd+"/"+yyyy;
 	 return format_date;
}
//get hh:mm
function get_format_time(){
	var curDate = new Date();
	var hh = curDate.getHours()
	var mm = curDate.getMinutes();
	if(hh<10) hh='0'+hh;
	if(mm<10) mm='0'+mm;
	format_time = hh+":"+mm;
	return format_time;
	//return "00:44";  //testing
}
//get hh:mm:ss
function get_format_time_(){
	var curDate = new Date();
	var hh = curDate.getHours()
	var mm = curDate.getMinutes();
	var ss = curDate.getSeconds();
	if(hh<10) hh='0'+hh;
	if(mm<10) mm='0'+mm;
	if(ss<10) ss='0'+ss;
	format_time = hh+":"+mm+":"+ss;
	return format_time;
}
//notification allowed? set global variable
function set_allowed(allow){
	allowed = allow;
}

//first time load this js, run
chrome.storage.sync.get("notification", function(res){
	 	console.log("loading background.js for the first time: notification(allow/disallow): "+res["notification"]);
	 	if(res["notification"] != "allowed"){
	 		set_allowed(false);
	 	}else{
	 		set_allowed(true);
	 	}
});

start_notification();
