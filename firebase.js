$(".navbar-container").load("./components/navbar.html");
$(".table-container").load("./components/table.html");
const inputGerman = document.querySelector("#german");
const inputTurkish = document.querySelector("#turkish");
const inputSentence = document.querySelector("#sentence");

let wordsArr;
let usersArr;
let cardNo = 1;
//const activeMenu="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";
//const passiveMenu="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"

//initialize firebase
const firebaseConfig = {  
  apiKey: "AIzaSyC-hmHvg3ei-nqf2-tUmG9UmbX04Raiwmk",
  authDomain: "mein-worterbuch-2a463.firebaseapp.com",
  projectId: "mein-worterbuch-2a463",
  storageBucket: "mein-worterbuch-2a463.appspot.com",
  messagingSenderId: "377846506913",
  appId: "1:377846506913:web:049e48cdc76b69f50757e0"
}
firebase.initializeApp(firebaseConfig);

//initialize variables
const cloudDB = firebase.firestore();

// const getUsers= new Promise((resolve,reject)=>{
//   usersArr=[]
//   cloudDB.collection("users").get()
//   .then(res=>{
//     res.docs.forEach(doc => {
//       const usersData = doc.data();
//       usersData["documentId"]=doc.ref.id;
//       usersArr.push(usersData);
//     })
//     //console.log('usersArr :>> ', usersArr);
//     resolve(usersArr)
//   })
//   .catch(err=>reject(err)) 
// }) 

// const checkUser=()=>{
//   getUsers
//   .then(res=>{
//     const email=document.querySelector("#email-address").value;
//     const password=document.querySelector("#password").value;
//     console.log('email :>> ', email);
//     console.log('password :>> ', password);
//   })
// }

// document.querySelector("#signin-button").addEventListener("click",()=>{
//     checkUser();
// })


//to get as JSON data
// const getData =()=>{
//   const docRef = cloudDB.collection("words").doc("0gjzJuGWbOHdVuxq8LF2")
//   docRef.get().then((doc) => {
//     const data = doc.data();
//     console.log('data :>> ', data);
//   })
//   .catch(err=>console.log('err :>> ', err))
// }
// getData();

const getWords = new Promise((resolve, reject) => {
  wordsArr = [];
  cloudDB.collection("words").get()
    .then(res => {
      res.docs.forEach(doc => {
        const data = doc.data();
        data["documentId"] = doc.ref.id;
        wordsArr.push(data);
        wordsArr.sort(GetSortOrder("german"));
      })
      resolve(wordsArr)
    })
    .catch(err => reject(err))
})

const saveWord = () => {
  if (inputGerman.value.length != 0 && inputTurkish.value.length != 0 && inputSentence.value.length != 0) {
    const data = {
      id: Date.now(),
      german: inputGerman.value,
      turkish: inputTurkish.value,
      sentence: inputSentence.value,
      rating: 0,
    }
    cloudDB.collection("words").add(data)
      .then((docRef) => {
        inputGerman.value = "";
        inputTurkish.value = "";
        inputSentence.value = "";
        data.documentId=docRef.id;
        wordsArr.push(data);
        setTable()
      }).catch((err) => {
        console.log('save err :>> ', err);
      });
  } else alert("Bitte füllen Sie alles");
}

const deleteWord = (data) => {
  cloudDB.collection("words").doc(data.documentId).delete()
  .then(()=>{
    getWords
  }) 
  .catch(err=>console.log('deleteWord err :>> ', err))
}

const addRow = (data) => {

  let starIcons="";
  for (let i = 0; i < data.rating; i++) {
    starIcons+=`<i class="text-yellow-500 fas fa-star"></i>`
  }
  const tableRow=
  `<tr id="table-row-${data.id}" class="table-row">
    <td class="px-6 py-4 whitespace-nowrap w-1/6">
      <div class="flex items-center">
        <div class="ml-4">
          <div id="german-word" class="german-word text-sm font-medium text-gray-900">
            ${data.german}
          </div>
        </div>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap w-1/6">
      <div id="turkish-word" class="turkish-word text-sm text-gray-900">${data.turkish}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap w-1/3">
      <span id="sentence-word" class="sentence-word text-sm text-gray-900">${data.sentence}</span>
    </td>
    <td id="rating-word" class="rating-word px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      ${starIcons}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button id="delete-word-${data.id}" class="text-indigo-600 hover:text-indigo-900">DELETE</button>
    </td>
  </tr>`
  document.querySelector("#table-body").innerHTML += tableRow;
}

const setTable = () => {
  document.getElementsByClassName("table-body")[0].innerHTML = "";
  wordsArr.forEach(word => {
    addRow(word)
  })
  //addeventlistener to delete buttons
  wordsArr.forEach(word=>{
      document.querySelector(`#delete-word-${word.id}`).addEventListener("click",()=>{
        wordsArr = wordsArr.filter(e=> e != word);
        deleteWord(word);
        setTable();
      })
  })
}

function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  }
}



// ------------------Check html------------------------------
const addStarToCard = () => {
  let ratingCard = document.getElementById("card-container-1").getElementsByClassName("rating-card")[0]
  let rating = document.createElement("i");
  rating.classList.add("text-yellow-500", "fas", "fa-star");
  ratingCard.appendChild(rating);
  rating = "";
}
const deleteStarFromCard = () => {
  const ratingCard = document.getElementById("card-container-1").getElementsByClassName("rating-card")[0]
  ratingCard.lastChild.remove();
}


const cardAlert=(id)=>{
  const myAlert= document.querySelector(id)
  myAlert.classList.remove("hidden");
  setTimeout(() => {
    myAlert.classList.add("hidden")
    document.querySelector("#turkish-card-word").classList.add("hidden");
    createCards()
  }, 4000);
}

const playAudio=(file)=>{
  const audio = new Audio(file);
  audio.play();
}
const compare = (inputValue) => {
  console.log('compare  wordsArr:>> ', wordsArr);
  document.querySelector("#turkish-card-word").classList.remove("hidden");
  if (wordsArr[cardNo].turkish == inputValue) {
    cardAlert("#rightAlert",true)
    playAudio("./music/positive.wav")
    if (wordsArr[cardNo].rating < 5) {
      wordsArr[cardNo].rating++
      setTimeout(()=>{
        addStarToCard() 
      },2000)
    }
  } else {
    cardAlert("#falseAlert",false);
    playAudio("./music/negative.wav")
    if (wordsArr[cardNo].rating > 0) {
      wordsArr[cardNo].rating--
      setTimeout(() => {
        deleteStarFromCard()
      }, 2000);
    }
  }
  cloudDB.collection("words").doc(wordsArr[cardNo].documentId).update(wordsArr[cardNo]);
}


const addCard = (cardDivId, no) => {
  const cardDiv=document.getElementById(cardDivId)
  const germanCardWord = cardDiv.getElementsByClassName("german-card-word")[0]
  germanCardWord.innerHTML = wordsArr[no].german

  const turkishCardWord = cardDiv.getElementsByClassName("turkish-card-word")[0]
  turkishCardWord.innerHTML = wordsArr[no].turkish

  const sentenceCardWord = cardDiv.getElementsByClassName("sentence-card-word")[0]
  sentenceCardWord.innerHTML = wordsArr[no].sentence
}
const createCards = () => {
  //created card1
  addCard("card-container-1", cardNo);
  const ratingCard = document.getElementById("card-container-1").getElementsByClassName("rating-card")[0]
  ratingCard.innerHTML = ""
  for (let i = 0; i < wordsArr[cardNo].rating; i++) {
    addStarToCard()
  }
  //created card2
  addCard("card-container-2", cardNo - 1);
  //created card3
  addCard("card-container-3", cardNo + 1);
}

//turkish-header listener
// console.log('document.querySelector("#turkish-header") :>> ', document.querySelector("#turkish-header"));
// document.querySelector("#turkish-header").addEventListener("click",()=>{
//   console.log('click :>> ');
// })

//listen the right card whether on clicked
document.getElementById("card-container-3").addEventListener("click", () => {
  if (cardNo + 1 < wordsArr.length) cardNo++;
  if (cardNo + 1 == wordsArr.length) document.getElementById("card-container-3").classList.add("hidden");
  document.getElementById("card-container-2").classList.remove("hidden");
  createCards();
})

//listen the left card whether on clicked
document.getElementById("card-container-2").addEventListener("click", () => {
  if (cardNo > 0) cardNo--;
  if (cardNo == 0) document.querySelector("#card-container-2").classList.add("hidden");
  document.querySelector("#card-container-3").classList.remove("hidden");
  createCards();
})

//listen the check button
const listenCheckButton = () => {
  let checkButton = document.getElementById("card-container-1").getElementsByClassName("check-button")[0];
  checkButton.addEventListener("click", () => {
    const inputElement=document.getElementById("card-container-1").getElementsByClassName("input-value")[0]
    const inputValue =inputElement.value
    inputElement.value=""
    compare(inputValue);
    console.log('wordsArr[cardNo] :>> ', wordsArr[cardNo]);
    //to delete the card temporarily from the card list
    wordsArr = wordsArr.filter(e=>e!=wordsArr[cardNo]);  
  })
}

//listen menu-item
const listenMenuItem=(id)=>{
  console.log('menu :>> ');
  const element=document.querySelector(id);
  element.addEventListener("click",()=>{
    element.classList="";
    element.classList.add(activeMenu);
  })
}



// console.log('firebase :>> ', firebase);
// let header = document.getElementsByClassName("test");
// let dbRef = firebase.database().ref().child("text");
// dbRef.on("value", snap=>header.innerText=snap.val())