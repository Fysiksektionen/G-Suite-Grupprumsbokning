// Bokning av grupprummet via formuläret på hemsidan
// Kodat av Jonas Nylund GK 2019 & Teo Elmfeldt FUL 2019


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

  var main_calendar = CalendarApp.getCalendarById("fysiksektionen.se_3936363138313338363039@resource.calendar.google.com");

  var data = getData();

  //var resources = data[RESOURCES];
  var date = data[DATE];
  var start = data[STARTTIME];
  var end = data[ENDTIME];

  start = getStartDateTime(date, start);
  end = getEndDateTime(date, start, end);


  var title = createTitle(data, "kons");
  var desc = createDescription(data, "kons");

  var subject = "Bokning misslyckades";
  var message = "Din bokning av grupprummet krockar med en tidigare bokning, och har därför nekats.\n";
  message += "Om detta verkar fel, kontakta FRum genom att svara på detta mejl.\n\n//FRum genom en robot";


  if(collisionDetection(main_calendar, start, end, data)){
    var event = main_calendar.createEvent(title, start, end, {description: desc});
    subject = "Bokningsbekräftelse grupprummet";
    message = "Du har bokat grupprummet mellan ";
    message += start.getHours() + ":" + start.getMinutes();
    message += " och ";
    message += end.getHours() + ":" + end.getMinutes();
    message += " den ";
    message += start.getDate() + "/" + (start.getMonth()+1).toString();
    message += ".\n\nOm du inte kommer nyttja din bokning, kontakta GK genom att svara på detta mejl.";
    message += "\n\n//FRum genom en robot";

  }

  sendMail(data[EMAIL], subject, message);

}



function main(){




  return 0;
}


function collisionDetection(calendar, start, end, data){


  events = calendar.getEvents(start, end);
  if(events.length > 0){
    return false;
  }

  return true;

}

function createTitle(data, calendar){

  var string = data[DESCRIPTION];

  return string;

}

function createDescription(data, calendar){

  var string = "";
  string += "Grupprummet är bokat av ";
  string += data[NAME];
  string += " (";
  string += data[BRANCH];
  string += ") för ";
  string += data[DESCRIPTION];

  return string;

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


function sendMail(address, subject, message){

  MailApp.sendEmail(address, "gk@f.kth.se", subject, message);

}

function send_error(description){
}
