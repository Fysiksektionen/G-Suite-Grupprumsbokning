
var TIMESTAMP = 0;
var NAME = 1;
var EMAIL = 2;
var BRANCH = 3;
var RESOURCES = 4;
var DATE = 5;
var STARTTIME = 6;
var ENDTIME = 7;
var DESCRIPTION = 8;
var EXTRA = 9;

var car_id = "bilen";



function myFunction() {

  var main_calendar = CalendarApp.getCalendarById("fysiksektionen.se_1adpg5v95b63rtq4mqbr80ffe4@group.calendar.google.com");

  var data = getData();

  var resources = data[RESOURCES];
  var date = data[DATE];
  var start = data[STARTTIME];
  var end = data[ENDTIME];

  start = getStartDateTime(date, start);
  end = getEndDateTime(date, start, end);


  var title = createTitle(data, "kons");
  var desc = createDescription(data, "kons");

  var event = main_calendar.createEvent(title, start, end, {description: desc});

  var calendars = resources.split(", ");
  for(i=0; i<calendars.length; i++){

    var cal = getCalendar(calendars[i]);
    cal.Events.insert(event, cal.getId());

  }



  //sendMail(data[1], data[0]);

}



function main(){




  return 0;
}





function createResourceIdentifyer(string_resources, calendar){

  var resources = string_resources.split(", ");

  if(calendar == car_id){
    return "Bilen";
  }

  if(resources.indexOf(car_id) > -1){
    resources.splice(resources.indexOf(car_id), 1);
  }

  if(resources.length == 4){
    return "Hela Konsulatet";
  }

  return resources.map(function(element){
    return element.charAt(0).toUpperCase() + element.slice(1);
  }).join(", ");

}

function createTitle(data, calendar){

  var string = "[";
  string += createResourceIdentifyer(data[RESOURCES], calendar);
  string += "] ";
  string += data[DESCRIPTION];

  return string;

}

function createDescription(data, calendar){

  var string = "";
  string += createResourceIdentifyer(data[RESOURCES], calendar);
  string += " är bokad av ";
  string += data[NAME];
  string += " (";
  string += data[BRANCH];
  string += ") för ";
  string += data[DESCRIPTION];

  return string;

}


function getCalendar(resource){

  if(resource == "allmänutrymmet"){
    return CalendarApp.getCalendarById("fysiksektionen.se_3130353639323131393437@resource.calendar.google.com");
  }
  if(resource == "grupprummet"){
    return CalendarApp.getCalendarById("fysiksektionen.se_3936363138313338363039@resource.calendar.google.com");
  }
  if(resource == "konssoffan"){
    return CalendarApp.getCalendarById("fysiksektionen.se_3233323937373330373233@resource.calendar.google.com");
  }
  if(resource == "köket"){
    return CalendarApp.getCalendarById("fysiksektionen.se_3637373133313135383039@resource.calendar.google.com");
  }
  if(resource == car_id){
    //return CalendarApp.getCalendarById("fysiksektionen.se_3637373133313135383039@resource.calendar.google.com");
  }

  return null;

}


function getData(){

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var index  = sheet.getLastRow();
  var numberofcolums = sheet.getLastColumn();
  var rng = sheet.getRange(index, 1, 1, numberofcolums)
  var data = rng.getValues();

  // Row 0 is the only row
  return data[0];
}


function getStartDateTime(date, starttime){

  var datetime = new Date(date);
  var t = new Date(starttime);

  datetime.setHours(t.getHours());
  datetime.setMinutes(t.getMinutes());

  return datetime;

}

function getEndDateTime(date, starttime, endtime){

  var start = getStartDateTime(date, starttime);
  var end = getStartDateTime(date, endtime);

  // If end time before starttime, add one day to end time
  if(end.getTime() <= start.getTime()){
    // plus one day in ms;
    end.setTime(end.getTime() + 1000*3600*24);
  }

  return end;

}


function sendMail(address, message){

  MailApp.sendEmail(address, "Bokningsbekräftelse konsulatet", message);

}

function send_error(description){
}
