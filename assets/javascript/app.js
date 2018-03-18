        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyBujkiz995urKQHvDC42hrsUKNzV9OdcEM",
            authDomain: "johnny-demo.firebaseapp.com",
            databaseURL: "https://johnny-demo.firebaseio.com",
            projectId: "johnny-demo",
            storageBucket: "johnny-demo.appspot.com",
            messagingSenderId: "1079768860694"
            };
    
            firebase.initializeApp(config);
            
            var train 
            var name
            var destination
            var frequency
            var nextOne
            var minsAway
            var diffTime
            var firstTimeConverted
            var firstTrain
            var database = firebase.database()
            var trainNumber
            var dbName
            var dbDest
            var dbFirstTrain
            var dbFreq
            var dbTrainNumber = 0
            var timer
            var dbSnapshot
    
            // event listener to push data to the table when a change is made to the database
            timer = setInterval(updateTable, 60000)  
            function updateTable() {
                $("#tablebody").empty()
                database.ref().on("child_added", function(snapshot){
     
                    if (typeof snapshot != "undefined") {
                        dbSnapshot = snapshot
                    }    
                    dbName = dbSnapshot.val().name;
                    dbDest = dbSnapshot.val().destination;
                    dbFirstTrain = moment(dbSnapshot.val().firstTrain, "HH:mm");
                    dbFreq = dbSnapshot.val().frequency;
                    dbTrainNumber = dbSnapshot.val().trainNumber;
                    
                    frequency = parseInt(dbFreq)
                    console.log("frequency: " + frequency)
    
                    firstTimeConverted = moment(dbFirstTrain, "HH:mm").subtract(1, "days")
                    console.log("firstTimeConverted: " + firstTimeConverted)
    
                    diffTime = moment().diff(moment(firstTimeConverted), "minutes")
                    console.log("diffTime: " + diffTime)
    
                    minsAway = diffTime % frequency
                    console.log("minsAway: " + minsAway)
    
                    minsAway = frequency - minsAway 
    
                    nextOne = moment().add(minsAway, "minutes")
                    console.log("nextOne: " + nextOne)
    
                    //adding the new records to the table
                    $("#tablebody").append(`<tr><td>${dbTrainNumber}</td><td>${dbName}</td><td>${dbDest}</td><td>${dbFreq}</td><td>${nextOne}</td><td>${minsAway}</td></tr>`);
                    
                    // timer = setInterval(updateTable, 5000)
                })
            }
            updateTable()
            timer = setInterval(updateTable, 60000)
            // timer = setInterval(updateTable, 60000)    
    
            // event listener to take user input data and push it to the database
            $("#submit").on("click", function(){
                train = {
                    destination: $("#destination").val(),
                    firstTrain: $("#firsttraintime").val(),
                    frequency: $("#frequency").val(),
                    name: $("#trainname").val(),
                    trainNumber: dbTrainNumber + 1,
                }
                
                $("#trainname").val("")
                $("#destination").val("")
                $("#firsttraintime").val("")
                $("#frequency").val("")
    
                //passing the trains array to firebase
                database.ref().push(train)
            })