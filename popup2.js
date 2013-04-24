//var first_time_loaded = true;
var format_date;
var allow_notification = false; //default false and checkbox uncheck
var bg_images = {0:"bg1.jpg", 1:"bg2.jpg", 2:"bg3.jpg", 3:"bg4.jpg", 4:"bg5.jpg"};

var validator = {
	checkbox_: function(){
		if (document.getElementById('checkbox_1').checked){
				document.body.appendChild(document.createTextNode("yes"));
		         //alert("checked") ;
		}else{
			document.body.appendChild(document.createTextNode("no"));
			// alert("You didn't check it! Let me check it for you.")
		}
	},

	checkbox2_: function(){
		if ($('#checkbox_1').is(':checked')){

		}else{
  			document.body.appendChild(document.createTextNode("not checked"));
		}
	}
}

function click(e){
	chrome.tabs.executeScript(null,
	      {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
	document.body.appendChild(document.createTextNode("clicked"));
	  //window.close();
}

function validate(e){
	if (document.getElementById('checkbox_1').checked){
			document.body.appendChild(document.createTextNode(" yes"));
	          //alert("checked") ;
	}else{
		document.body.appendChild(document.createTextNode(" no"));
	}
}

//handle checkbox
function handleClick(){
		//if it is the notification checkbox
		if(this.id == "notification_cb"){
			if(this.checked) {
				allow_notification = true;
				//set in storage
				chrome.storage.sync.set({"notification":"allowed"}, function(result){console.log("notification allowed in storage.")});
			}
			else {
				allow_notification = false;
				chrome.storage.sync.set({"notification":"disallowed"}, function(result){console.log("notification disallowed in storage.")});
			}
			//start allowed in background.js
	 		chrome.runtime.getBackgroundPage(function(bg){bg.set_allowed(allow_notification)});
	
			return;
		}

		//document.body.appendChild(document.createTextNode(" ("+this.checked+") "));
		var index = this.parentNode.parentNode.childNodes[3].innerHTML - 1; //index in store
		//var theDate = document.getElementById("current_date").value;
		var theDate = this.parentNode.parentNode.childNodes[5].innerHTML  //using the date in hidden cell of the table
		var obj;
		
		if(this.checked){
			//go up to <tr> level to set css class
			this.parentNode.parentNode.setAttribute("class", "strikethrough");
			//retrieve data from store
			chrome.storage.sync.get(theDate, function(items){
				console.log(items[theDate][index]["done"]); //log down
				obj = items;
				obj[theDate][index]["done"] = true;
				//update the "done" (boolean) value to store
				chrome.storage.sync.set(obj, function(result){console.log("Updated: "+result)});
			});
		}
		else{
			this.parentNode.parentNode.setAttribute("class", "");
			chrome.storage.sync.get(theDate, function(items){
				console.log(items[theDate][index]["done"]); 
				obj = items;
				obj[theDate][index]["done"] = false;
				//update the "done" (boolean) value to store
				chrome.storage.sync.set(obj, function(result){console.log("Updated: "+result)});
			});
		}
		
		
}

//handle "+" button click
function handleButton(e){
 		//document.body.appendChild(document.createTextNode("-button-"));
 		addInput("add_button_div");
 		//handle am/pm change right after adding the button here
 		document.getElementById('am_pm').addEventListener('click', handle_am_pm);
 		//remove button from UI
 		var btn = document.getElementById("add_item");
 		var div = document.getElementById("btn_p");
 		div.removeChild(btn);
 		//start date picker
 		$( "#datepicker" ).datepicker({
		    onSelect: handleDateChange
		});
 		var currentDate = $( "#datepicker" ).datepicker( "getDate" );
 		//$( "#datepicker" ).datepicker( "hide" );
 		//alert(currentDate.getDate());
 		var dd = currentDate.getDate();
 		var mm = currentDate.getMonth()+1;
 		var yyyy = currentDate.getFullYear();
 		if(dd<10) dd = '0'+dd;
 		if(mm<10) mm = '0'+mm;
 		document.getElementById("date").value = mm + "/" + dd + "/" + yyyy;
 		//add a confirmation button
 		addSetButton("add_button_div");
 		//clear date label and to-do list(table)
 		document.getElementById('table_div').innerHTML = "";
 		document.getElementById('date_label').innerHTML = "";
 		document.getElementById('datepicker_set').innerHTML = "";
 		document.getElementById('notification_checkbox_div').innerHTML = "";
 		document.getElementById('toggle_bg_div').innerHTML = "";
}
//handle AM/PM button click
function handle_am_pm(){
	if(this.innerHTML == "AM"){
		this.innerHTML = "PM"
	}else{
		this.innerHTML = "AM";
	}
}
//handle calendar button
function showCalendar(e){
	$( "#datepicker_set" ).datepicker({
		    onSelect: handleDateChange2
	});
}
//handle bg image toggle
function handle_toggle_bg(e){
	chrome.storage.sync.get("bg_img", function(result){
		var img_num = result["bg_img"];
		console.log("old image count = " + img_num);
		var new_img_num;
		new_img_num = (parseInt(img_num)+1) % 5;
		chrome.storage.sync.set({"bg_img" : new_img_num}, function(result){console.log("Image count updated! ")});
		//update background image in UI
		console.log("new image count=" + new_img_num);
		console.log("url('bg/"+bg_images[new_img_num]+"')");
		document.body.style.backgroundImage = "url('bg/"+bg_images[new_img_num]+"')";
	});
}

//add new item 
function addInput(divName){
	var newDiv = document.createElement('div');
	newDiv.setAttribute("class", "input-prepend");
	// newDiv.innerHTML = "<span class='add-on'><i class='icon-list-alt'></i></span><input class='span4' id='item' type='text' placeholder='What'>"
	// 				+"<br><span class='add-on'><i class='icon-home'></i></span><input class='span4' id='venue' type='text' placeholder='Where'>"
	// 				+"<br><span class='add-on'><i class='icon-time'></i></span><input class='span1' id='hour' type='text' placeholder='hh' maxLength=2>"
	// 				+"<span class='add-on'>:</span><input class='span1' id='minute' type='text' placeholder='mm' maxLength=2>"
	// 				+"<span class='add-on'><i class='icon-th'></i></span><input class='span2' id='date' type='text' placeholder='Today' disabled='disabled'>";
	// newDiv.innerHTML = "<span class='add-on'><i class='icon-list-alt'></i></span><input class='span4' id='item' type='text' placeholder='What'>"
	// 				+"<br><span class='add-on'><i class='icon-home'></i></span><input class='span4' id='venue' type='text' placeholder='Where'>"
	// 				+"<br><span class='add-on'><i class='icon-time'></i></span><input class='span1' id='hour' type='text' placeholder='hh' maxLength=2>"
	// 				+"<span class='add-on'>:</span><input class='span1' id='minute' type='text' placeholder='mm' maxLength=2>"
	// 				+"<span class='add-on'><select id='am_pm'><option value='AM'>AM</option><option value='PM'>PM</option></select></span><input class='span2' id='date' type='text' placeholder='Today' disabled='disabled'>";
	newDiv.innerHTML = "<span class='add-on'><i class='icon-list-alt'></i></span><input class='span4' id='item' type='text' placeholder='What'>"
					+"<br><span class='add-on'><i class='icon-home'></i></span><input class='span4' id='venue' type='text' placeholder='Where'>"
					+"<br><span class='add-on'><i class='icon-time'></i></span><input class='span1' id='hour' type='text' placeholder='hh' maxLength=2>"
					+"<span class='add-on'>:</span><input class='span1' id='minute' type='text' placeholder='mm' maxLength=2>"
					+"<button id='am_pm' class='btn btn-info'>AM</button><input class='span2' id='date' type='text' placeholder='Today' disabled='disabled'>";
		
	//append elelments
    document.getElementById(divName).appendChild(newDiv);
    //validate the hh and minute input
	document.getElementById('hour').onkeypress = function(){if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;}
	document.getElementById('minute').onkeypress = function(){if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;}
}
//add a confirm button
function addSetButton(divName){
	var newDiv = document.createElement('div');
	newDiv.innerHTML = "<div><button id='confirm_button' class='btn btn-success btn-block'>Confirm</button></div>";
    document.getElementById(divName).appendChild(newDiv);
    //add click handler for confirm_button
    document.getElementById("confirm_button").addEventListener('click', saveData);
}
//handle date change when new date selected on the UI
function handleDateChange(e){
	//alert("hola");
	var currentDate = $( "#datepicker" ).datepicker( "getDate" );
 	var dd = currentDate.getDate();
 	var mm = currentDate.getMonth()+1;
 	var yyyy = currentDate.getFullYear();
 	if(dd<10) dd = '0'+dd;
 	if(mm<10) mm = '0'+mm;
 	document.getElementById("date").value = mm + "/" + dd + "/" + yyyy;
}
function handleDateChange2(e){
	var currentDate = $( "#datepicker_set" ).datepicker( "getDate" );
 	var dd = currentDate.getDate();
 	var mm = currentDate.getMonth()+1;
 	var yyyy = currentDate.getFullYear();
 	if(dd<10) dd = '0'+dd;
 	if(mm<10) mm = '0'+mm;
 	document.getElementById("current_date").value = mm + "/" + dd + "/" + yyyy;
 	$( "#datepicker_set" ).datepicker( "destroy" );
 	//clear table and load new row for the selected day
 	document.getElementById('table').innerHTML = "";
 	populate_table(document.getElementById("current_date").value, -1);
}
//save new data
function saveData(e){
	//alert("save");
	var item = document.getElementById("item").value;
	var venue = document.getElementById("venue").value;
	var hh = document.getElementById("hour").value;
	var mm = document.getElementById("minute").value;
	var date = document.getElementById("date").value;
	if(hh>12 || mm>59 || hh<0 || mm<0 ||!mm || !hh){
		//document.body.appendChild(document.createTextNode("Invalid time input!"));
		document.getElementById('warning').innerHTML = "Invalid time input!";
		return;
	}
	if(!item){
		//document.body.appendChild(document.createTextNode("You didn't input anything!"));
		document.getElementById('warning').innerHTML = "You didn't input anything!";
		return;
	}
	//construct the object for store: dataObj{index{obj{}}}
	var count; //number of items for the day
	//calculate count
	chrome.storage.sync.get(date, function(result){
		if(result[date] == undefined){ //no item for the day
			count = 0;
			//begin insert
			var dataObj={};
			var index={};
			var obj = {};
			obj["done"] = false;
			obj["item"] = item;
			obj["venue"] = venue;
			hh = convert_24(hh, document.getElementById("am_pm").innerHTML);
			if(hh<10 && hh.length == 1) hh = '0'+hh;
 			if(mm<10 && mm.length == 1) mm = '0'+mm; //
			obj["hour"] = hh;
			obj["minute"] = mm;
			index[count]=obj;
			dataObj[date] = index;

			chrome.storage.sync.set(dataObj, function(){
				console.log("saved."+item+" "+venue);
				location.reload();
			});
		}
		else{
			chrome.storage.sync.get(date, function(items){
				//get the new count value
				count = Object.keys(items[date]).length;
				//get the stored object
				chrome.storage.sync.get(date, function(result){
					var dataObj;
					dataObj = result;
					//begin insert
					var index={};
					var obj = {};
					obj["done"] = false;
					obj["item"] = item;
					obj["venue"] = venue;
					hh = convert_24(hh, document.getElementById("am_pm").innerHTML);
					if(hh<10 && hh.length == 1) hh = '0'+hh;
 					if(mm<10 && mm.length == 1) mm = '0'+mm;
					obj["hour"] = hh;
					obj["minute"] = mm;
					//index[count]=obj;
					dataObj[date][count] = obj;

					chrome.storage.sync.set(dataObj, function(){
						console.log("saved."+item+" "+venue);
						location.reload();
					});
				});
				
			});
		}
	});
	
}
//add item to the UI; Parameter: date "mm/dd/yyyy", n=0 => today, n=1 => tomorrow, n=-1 => single day
function populate_table(date, n_days_later){
	console.log("date = "+ date);
	chrome.storage.sync.get(date, function(items){
		if(items[date] == undefined){
			//document.getElementById("table").innerHTML = "<h3>Nice! You've got no schedule for the day!</h3>";
			return;
		}
		console.log(items[date]); //log down
		var obj = items[date];
		var which_day;
		var i=0; 
		var html_text = "";
		if(n_days_later == 0 || n_days_later == -1){ //need table header
			html_text = "<tr><th>Item</th><th>Venue</th><th>Time</th><th>#</th><th>Date</th></tr>";
			if(n_days_later == 0){
				which_day = "Today"
			}else{
				which_day = date;
			}
		}else{
			if(n_days_later == 1){
				which_day = "Tomorrow";
			}
			else if(n_days_later == 2){
				which_day = "The Day after Tomorrow";
			}
			else{
				which_day = date;
			}

		}
		console.log("begin fill up the table");
		for(i=0; i<Object.keys(obj).length; i++){
			console.log(obj[i]["item"]+" "+obj[i]["venue"]);
			if(obj[i]['done'] == true){
				html_text += "<tr><td><input type='checkbox' checked='checked'>"+obj[i]['item']
						+"</input></td><td>"+obj[i]['venue']+"</td><td>"
						+obj[i]['hour']+":"+obj[i]['minute']+"</td><td>"+(i+1)+"</td><td>"+which_day+"</td><td style='display:none;'>"+date+"</td></tr>"
			}else{
				html_text += "<tr><td><input type='checkbox'>"+obj[i]['item']
						+"</input></td><td>"+obj[i]['venue']+"</td><td>"
						+obj[i]['hour']+":"+obj[i]['minute']+"</td><td>"+(i+1)+"</td><td>"+which_day+"</td><td style='display:none;'>"+date+"</td></tr>"
			}
		}
		document.getElementById("table").innerHTML += html_text;
		//add handler for checkbox click
		var cbs = document.getElementsByTagName("input");
		console.log("number of checkboxes: "+cbs.length);
		for(var i=0; i<cbs.length; i++){
		 	if(cbs[i].type == 'checkbox'){
		  		cbs[i].addEventListener('click', handleClick);
		  		//check checkbox for the first time manually
		  		if(cbs[i].checked && cbs[i].id!='notification_cb')
					cbs[i].parentNode.parentNode.setAttribute("class", "strikethrough");
		  	}
		}
	});
}
//function to calculate the date (mm/dd/yyyy) for N day(s) after
function future_date(n){
	var today = new Date();
	var future_day = new Date(today.getTime() + n*(24 * 60 * 60 * 1000));
	var dd = future_day.getDate();
	var mm = future_day.getMonth() + 1;
	var yyyy = future_day.getFullYear();
	if(dd<10) dd = '0'+dd;
 	if(mm<10) mm = '0'+mm;
 	format_future_day = mm+"/"+dd+"/"+yyyy;
 	return format_future_day;
}
//convert 12 hr to 24 hr
function convert_24(hh, am_pm){
	if(am_pm == "AM"){
		if(hh == 12)
			return "0";
		return hh;
	}else{
		if(hh == 12)
			return hh;
		return parseInt(hh) + 12;
	}
}

document.addEventListener('DOMContentLoaded', function () {
	  //document.body.appendChild(document.createTextNode("good"));
	  //validator.checkbox2_();

	  // var divs = document.querySelectorAll('div');
	  // for (var i = 0; i < divs.length; i++) {
		 //    divs[i].addEventListener('click', click);
	  // }

	 document.getElementById("add_item").addEventListener('click', handleButton);
	 document.getElementById("cal_btn").addEventListener('click', showCalendar);
	 //toggle bg image
	 document.getElementById("bg_toggle").addEventListener('click', handle_toggle_bg);

	 //get current date
	 var curDate = new Date();
	 var dd = curDate.getDate();
	 var mm = curDate.getMonth()+1;
	 var yyyy = curDate.getFullYear();
	 if(dd<10) dd = '0'+dd;
 	 if(mm<10) mm = '0'+mm;
 	 format_date = mm+"/"+dd+"/"+yyyy;
 	 //set date label in the UI
 	 document.getElementById("current_date").value = format_date;

	 populate_table(format_date, 0);
	 populate_table(future_date(1), 1);
	 populate_table(future_date(2), 2);
	 populate_table(future_date(3), 3);
	 populate_table(future_date(4), 4);
	 populate_table(future_date(5), 5);
	 populate_table(future_date(6), 6);

	 //start timer 
	 // if(!content_loaded){
	 // 	content_loaded = true;
	 // 	chrome.runtime.getBackgroundPage(function(bg){bg.start_notification()});
	 // }
	 chrome.runtime.getBackgroundPage(function(bg){
	 	if(bg.is_first_time()){
	 		//bg.start_notification(); //no need any more, now bg js start itself
	 		bg.set_first_time_false(); //negate the first_time boolean variable
	 		//set up image count for the first time
	 		chrome.storage.sync.set({"bg_img": "0"}, function(res){
	 			console.log("Image count set!");
	 			chrome.storage.sync.get("bg_img", function(result){
					var img_num = result["bg_img"];
					document.body.style.backgroundImage = "url('bg/"+bg_images[img_num]+"')";
				});
	 		});
	 	}else{
	 		//set up bg image according to storage data
			chrome.storage.sync.get("bg_img", function(result){
				var img_num = result["bg_img"];
				document.body.style.backgroundImage = "url('bg/"+bg_images[img_num]+"')";
			});
	 	}
	 });

	 

	 //set notification checkbox
	 chrome.storage.sync.get("notification", function(res){
	 	console.log("notification checkbox = "+res["notification"]);
	 	if(res["notification"] != "allowed"){
	 		document.getElementById('notification_cb').checked = false;
	 		allow_notification = false
	 		chrome.runtime.getBackgroundPage(function(bg){bg.set_allowed(allow_notification)});
	 	}else{
	 		document.getElementById('notification_cb').checked = true;
	 		allow_notification = true;
	 		chrome.runtime.getBackgroundPage(function(bg){bg.set_allowed(allow_notification)});
	 	}
	 });

});

