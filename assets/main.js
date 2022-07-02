let playerList = [

];

let winnerIndexGl = null;

createPlayersHTML(); // привремено

let odd = 3;


function addNewPlayer() {
    let val = document.getElementById("new-player-input").value;
    if (val == "") {
      alert("Name must be filled out");

      var myModal = new bootstrap.Modal(document.getElementById("addPlayer"), {});
      myModal.show();
    } else {
        let playerObj = {
            name : val,
            credits: 500
        };
    
        playerList.push(playerObj);
    
        createPlayersHTML();
    
        document.getElementById("new-player-input").value = "";
    }
}

function createPlayersHTML() {
    let playersHolder = document.getElementById("players-holder");
    playersHolder.innerHTML = "";

    playerList.forEach((player, index) => {
        playersHolder.innerHTML += 
        `<div class="player-card" id="card${index}">
            <p id="player-name">${player.name}</p>
            <p class="card-credits">Credits: <span id="player-credits">${player.credits}</span></p>
            <input type="radio" value="0" name="card-selected-p${index}" onclick="validateStart()">
            <img class="car-option" src="assets/images/red.png">
            <br>
            <input type="radio" value="1" name="card-selected-p${index}" onclick="validateStart()">
            <img class="car-option" src="assets/images/yellow.png">
            <br>
            <input type="radio" value="2" name="card-selected-p${index}" onclick="validateStart()">
            <img class="car-option" src="assets/images/green.png">
            <br><br>
            <input id="car-bet${index}" onkeyup="validateStart()" type="number" min="20" value="20" >
        </div> `;
    });

    if (winnerIndexGl != -1 && winnerIndexGl != null) {
        let card = document.getElementById("card" + winnerIndexGl);
        if (card != undefined && card != null) {
            card.style.border = "2px solid #b2dda1a3";
            winnerIndexGl = null;
        }
    }

    
}


function startRace() {

    let audio = document.getElementById("car-sound");
    audio.play();

    // Generate 3 random unique numbers ( transition duration )
    let carDurations = [];
    while(carDurations.length < 3){
        let r = (Math.random() * 3) + 0.5;
        if(carDurations.indexOf(r) === -1) carDurations.push(r);
    };

    // transition effect 
    let carOne = document.getElementById("car-0");
    let carTwo = document.getElementById("car-1");
    let carThree = document.getElementById("car-2");

    carOne.style.transitionDuration = carDurations[0] + "s";
    carOne.style.left = "calc(100% - 200px)";

    carTwo.style.transitionDuration = carDurations[1] + "s";
    carTwo.style.left = "calc(100% - 200px)";

    carThree.style.transitionDuration = carDurations[2] + "s";
    carThree.style.left = "calc(100% - 200px)";

    // find lowest number (duration - winner )
    let winner = Math.min(...carDurations);
    let winnerIndex = carDurations.indexOf(winner);

    // find highest number (timeout duration)
    let loser = Math.max(...carDurations);

    // show winner car
    let winnerCar = document.getElementById("winner-car");
    let winnerLabel = document.getElementById("winner-label");

    if (winnerIndex == 0) {
        winnerCar.src = "assets/images/red.png";
    } else
    if (winnerIndex == 1) {
        winnerCar.src = "assets/images/yellow.png";
    } else {
        winnerCar.src = "assets/images/green.png";
    }

    setTimeout(() => {
        winnerCar.style.display = "block";
        winnerLabel.style.display = "block";

        playerList.forEach((player, index) => {
            let radioButtons = document.getElementsByName("card-selected-p" + index);
            let selectedCar;
            
            // Bets calculation
            for(let i = 0; i < 3; i++) {
               if(radioButtons[i].checked)
               {
                selectedCar = radioButtons[i].value;
    
                if (selectedCar == winnerIndex) {
                    let playerBet = document.getElementById("car-bet" + index).value;
                    player.credits -= playerBet;
                    player.credits += playerBet * odd;
                    winnerIndexGl = index;
                } else {
                    let playerBet = document.getElementById("car-bet" + index).value;
                    player.credits -= playerBet;
                }
               }
            }
        });
    
        createPlayersHTML();

        document.getElementById("start-race-button").style.display = "none";
        document.getElementById("restart-race-button").style.display = "block";

        let video = document.getElementById("video-bg");
        if (video != null && video != undefined) {
            video.style.opacity = "1";
        }
    }, loser * 1000);

} 

function reStartRace() {
    document.getElementById("start-race-button").style.display = "block";
    document.getElementById("restart-race-button").style.display = "none";

    document.getElementById("car-0").style.left = "0px";
    document.getElementById("car-1").style.left = "0px";
    document.getElementById("car-2").style.left = "0px";
    
    document.getElementById("winner-label").style.display = "none";
    document.getElementById("winner-car").style.display = "none";

    setTimeout(() => {
        let video = document.getElementById("video-bg");
        if (video != null && video != undefined) {
            video.style.opacity = "0";
        }
    }, 4000)

}

function validateStart() {
    let selectedOptionsCounter = 0;
    let validateInputsCounter = 0;

    playerList.forEach((player, index) => {
        let radioButtons = document.getElementsByName("card-selected-p" + index);

        let betValue = document.getElementById("car-bet" + index);
        betValue = Number(betValue.value)

        // Bets calculation
        for(let i = 0; i < 3; i++) {
           if(radioButtons[i].checked)
           {
            selectedOptionsCounter ++;
           }
        };

        if ((betValue == '') || (betValue < 20) || (betValue > player.credits )) {
            validateInputsCounter --;
        } else {
            validateInputsCounter ++;
        }
    });

    if ((selectedOptionsCounter == playerList.length) && (validateInputsCounter == playerList.length)) {
        document.getElementById("start-race-button").style.display = "block";
    } else {
        document.getElementById("start-race-button").style.display = "none";
    }
}

// Sound effects
function playSound() {
    let backgroundSound;
    backgroundSound = document.getElementById("bg-sound");
    backgroundSound.volume = 0.1;
    backgroundSound.play();

    document.getElementById("sound-on").style.display = "block";
    document.getElementById("sound-off").style.display = "none";
}

function stopSound() {
    let backgroundSound;
    backgroundSound = document.getElementById("bg-sound");
    backgroundSound.pause();

    document.getElementById("sound-on").style.display = "none";
    document.getElementById("sound-off").style.display = "block";
}