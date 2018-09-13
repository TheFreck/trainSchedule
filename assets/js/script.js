// Initialize Firebase
var config = {
apiKey: "AIzaSyCLT-HGxxGNpoiuCCMTHqFZUGoieNOsv6k",
authDomain: "freck-s-mad-stache.firebaseapp.com",
databaseURL: "https://freck-s-mad-stache.firebaseio.com",
projectId: "freck-s-mad-stache",
storageBucket: "freck-s-mad-stache.appspot.com",
messagingSenderId: "204337525766"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destination = "";
var firstRun = "00:00";
var frequency = 0;


// *************************************************************************************************************
// SUBMIT BUTTON
// adds the train object to the DB
// *************************************************************************************************************

$("#submit").on("click", function(event) {
    event.preventDefault();

    trainName = $("#route").val().trim();
    destination = $("#dest").val().trim();
    var hours = $("#hours").val();
    var minutes = $("#minutes").val();
    firstRun = hours + ":" + minutes;
    frequency = $("#freq").val().trim();
    database.ref("homework/").push({
        trainName: trainName,
        destination: destination,
        firstRun: firstRun,
        frequency: frequency,
    });
    $("#route").val("");
    $("#dest").val("");
    $("#hours").val("");
    $("#minutes").val("");
    $("#freq").val("");
});


// *************************************************************************************************************
// CLEAR BUTTON
// removes all highlighted trains
// I left off the preventDefault() because it clears the board before deleting the entry and reloading only active entries
// it seemed to work better than trying to empty the contents of the div.
// *************************************************************************************************************

$("#clear").on("click", function(){
    var ref = database.ref("homework/");
    ref.on("value", function (data){
        var trains = data.val();
        var keys = Object.keys(trains);
        for(i=0; i<keys.length; i++){
            var k = keys[i];
            var name = trains[k].trainName;
            // if the name is in the removeArray then remove it from the DB
            if($.inArray(name, removeArray)>=0){
                database.ref("homework/" + k).remove();
            }
        }
    }, errData);
    removeArray = [];
});



// reusable error function
function errData(error){
    console.log("error",error);
}





var removeArray = [];

$(document).on("click", ".tableRow", function(event){
    event.preventDefault();
    var $this = $(this);
    $(this).attr("data-highlight",true);
    $this.removeClass("routStination");
    $this.addClass("glow");
    removeArray.push($this.attr("data-name"));
})
    

database.ref("homework/").on("child_added", DBchanges, errData);
database.ref("homework/").on("child_removed", DBchanges, errData);
database.ref("homework/").on("value", DBchanges, errData);


function DBchanges(snapshot){
    var snap = snapshot.val();
    console.log("snap",snap);
    var tFrequency = snap.frequency;
    var firstTime = firstRun;
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var ETA = tFrequency - tRemainder;
    var nextTrain = currentTime.add(ETA, "minutes");
    var upNext = moment(nextTrain).format("HH:mm");

    var tableRow = $("<tr>");
    tableRow.addClass("tableRow");
    tableRow.addClass("routStination");
    tableRow.attr("data-highlight",false);
    

    // **********************************************************************
    // train name
    // **********************************************************************
    var trainName = $("<td>").text(snap.trainName);
    trainName.addClass("routeName");
    tableRow.attr("data-name",snap.trainName);
    
    // **********************************************************************
    // destination
    // **********************************************************************
    var destination = $("<td>").text(snap.destination);
    destination.addClass("destination");

    // **********************************************************************
    // next train
    //
    // I wanted the display to look like the old train station arrival departure boards so each letter, including the colons have been looped into its own div; the min is its own div as well. That turned out to be a pain in the bum but the end result was worth it!
    //
    // **********************************************************************
    var timeSlot = $("<div>");
    for(i=0; i<upNext.length; i++){
        var a = $("<div>");
        a.addClass("numberTiles");
        a.text(upNext[i]);
        timeSlot.append(a);
    }
    var nextOne = $("<td>").html(timeSlot);
    nextOne.addClass("runTime");
    
    // **********************************************************************
    // ETA
    // **********************************************************************
    timeSlot = $("<div>");
    for(i=0; i<String(ETA).length; i++){
        var a = $("<div>");
        a.addClass("numberTiles");
        a.text(String(ETA)[i]);
        timeSlot.append(a);
    }
    var a = $("<div>");
    a.addClass("numberTiles");
    a.text("min");
    timeSlot.append(a);

    var timeLeft =  $("<td>").html(timeSlot);
    timeLeft.addClass("minutes");

    // **********************************************************************
    // first run
    // **********************************************************************
    timeSlot = $("<div>");
    for(i=0; i<snap.firstRun.length; i++){
        var a = $("<div>");
        a.addClass("numberTiles");
        a.text(snap.firstRun[i]);
        timeSlot.append(a);
    }
    var beginning = $("<td>").html(timeSlot);
    beginning.addClass("runTime");
    
    // **********************************************************************
    // frequency
    // **********************************************************************
    timeSlot = $("<div>");
    for(i=0; i<String(snap.frequency).length; i++){
        var a = $("<div>");
        a.addClass("numberTiles");
        a.text(String(snap.frequency)[i]);
        timeSlot.append(a);
    }
    var a = $("<div>");
    a.addClass("numberTiles");
    a.text("min");
    timeSlot.append(a);

    var frequency =  $("<td>").html(timeSlot);
    frequency.addClass("minutes");

    // **********************************************************************
    // append everything into a row
    // **********************************************************************
    tableRow.append(trainName);
    tableRow.append(destination);
    tableRow.append(nextOne)
    tableRow.append(timeLeft);
    tableRow.append(beginning);
    tableRow.append(frequency);
    
    $("tbody").append(tableRow);
}