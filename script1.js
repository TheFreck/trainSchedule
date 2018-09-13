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
    
    
    $("#submit").on("click", function(event) {
        event.preventDefault();
    
        trainName = $("#route").val().trim();
        destination = $("#dest").val().trim();
        var hours = $("#hours").val();
        var minutes = $("#minutes").val();
        firstRun = hours + ":" + minutes;
        frequency = $("#freq").val().trim();
        database.ref().push({
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
    
    $("#clear").on("click",function(event){
        event.preventDefault();
        console.log("clear");
        //clear the route names that are highlighted
        // database.ref("homework7/" + trainName).remove();
    })
    
    $(document).on("click", ".tableRow", function(event){
        event.preventDefault();
        var $this = $(this);
        console.log("got me!",$this);
        console.log("highlight",$this.attr("data-highlight"));
        console.log("highlight",$this.attr("class"));
        if($this.attr("data-highlight")===false){
            console.log("is false");
            $this.attr("data-highlight",true);
        }else{
            console.log("is true");
            $this.attr("data-highlight",false);
        }
        $this.removeClass("routStination");
        $this.addClass("glow");
        $(this).attr("data-highlight",true);
    
    })
    
    
    
    var nextArrival;
    var ID = 0;
    
    database.ref().on("child_added", function(snapshot) {
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
        var upNext = moment(nextTrain).format("kk:mm");
    
        var tableRow = $("<tr>");
        tableRow.addClass("tableRow");
        tableRow.addClass("routStination");
        tableRow.attr("data-highlight",false);
        
    
        // **********************************************************************
        // train name
        // **********************************************************************
        var trainName = $("<td>").text(snap.trainName);
        trainName.addClass("routeName");
        
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
    
    
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
    });
    
    