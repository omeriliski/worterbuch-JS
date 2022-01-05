// $(".table-body").load("tr.html");
// document.querySelector(".navbar-container").load("navbar.html");
$(".navbar-container").load("navbar.html");
$(".table-container").load("table.html");
const inputGerman = document.getElementById("german");
const inputTurkish = document.getElementById("turkish");
const inputSentence = document.getElementById("sentence");


let wordsArr;
let usersArr;
let cardNo=1;

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



const saveWord = () => {
  if(inputGerman.value.length !=0 && inputTurkish.value.length !=0 && inputSentence.value.length !=0){
    const data={
      id:Date.now(),
      german: inputGerman.value,
      turkish: inputTurkish.value,
      sentence: inputSentence.value,
      rating:0,
    }
    cloudDB.collection("words").add(data)
    .then((result) => {
      inputGerman.value="";
      inputTurkish.value="";
      inputSentence.value="";
      addRow(data);
      document.location.reload(true)
    }).catch((err) => {
      console.log('save err :>> ', err);
    });
  }
  else alert("Bitte füllen Sie alles");
}

const deleteWord=(data)=>{
  cloudDB.collection("words").doc(data.documentId).delete().
  then(()=>document.location.reload(true))
  
}

const addRow=(data)=>{
  const tableRow = document.getElementById("table-row");
  const clone = tableRow.cloneNode(true);
  
  clone.setAttribute("id",`table-row-${data.id}`);
  
  clone.getElementsByClassName("german-word")[0].innerHTML = data.german;
  clone.getElementsByClassName("turkish-word")[0].innerHTML = data.turkish;
  clone.getElementsByClassName("sentence-word")[0].innerHTML = data.sentence;
  clone.getElementsByClassName("delete-word-button")[0].innerHTML="DELETE"
  clone.getElementsByClassName("rating-word")[0].innerHTML = "";
  
  //delete Item
  clone.getElementsByClassName("delete-word-button")[0].addEventListener("click",()=>{
    deleteWord(data)
  })
  
  const ratingWord = clone.getElementsByClassName("rating-word")[0];
  for (let i = 0; i < data.rating; i++) {
    const rating = document.createElement("i");
    rating.classList.add("text-yellow-500","fas","fa-star");
    ratingWord.appendChild(rating);
  }
  document.getElementsByClassName("table-body")[0].appendChild(clone);
  
}

function GetSortOrder(prop) {    
  return function(a, b) {    
      if (a[prop] > b[prop]) {    
          return 1;    
      } else if (a[prop] < b[prop]) {    
          return -1;    
      }    
      return 0;    
  }    
} 


const getWords=new Promise((resolve,reject)=>{
  wordsArr=[];
  cloudDB.collection("words").get()
  .then(res=>{
    res.docs.forEach(doc => {
      const data=doc.data();
      data["documentId"]=doc.ref.id;
      wordsArr.push(data);
      wordsArr.sort(GetSortOrder("german"));
    })
    resolve(wordsArr)
  })
  .catch(err=>reject(err))  
})

const setTable = ()=>{
    getWords
    .then(res=>{
      res.forEach(e=>{
        addRow(e)
      })
      const row = document.getElementById("table-row").classList.add("hidden");
    })
}
const addStarToCard=()=>{
  let ratingCard=document.getElementById("card-container-1").getElementsByClassName("rating-card")[0]
  let rating = document.createElement("i");
  rating.classList.add("text-yellow-500","fas","fa-star");
  ratingCard.appendChild(rating);
  // console.log('ratingCard :>> ', ratingCard);  
  console.log('rating :>> ', rating);
  rating="";
}
const deleteStartFromCard=()=>{
  const ratingCard=document.getElementById("card-container-1").getElementsByClassName("rating-card")[0]
  ratingCard.lastChild.remove();
}


const compare=(inputValue)=>{
  console.log('compare  wordsArr:>> ', wordsArr);
  if(wordsArr[cardNo].turkish==inputValue){
    console.log('bravo :>> ')
    if(wordsArr[cardNo].rating<5){
      wordsArr[cardNo].rating++
      addStarToCard()
    }
  }
  else {
    console.log('leider :>> ');
    if(wordsArr[cardNo].rating>0){
      wordsArr[cardNo].rating--
      deleteStartFromCard();
    }
  }
  cloudDB.collection("words").doc(wordsArr[cardNo].documentId).update(wordsArr[cardNo]);
  // const checkButton = document.getElementById("card-container-1").getElementsByClassName("check-button")[0].classList.add("hidden")
}



const addToCard=()=>{
  getWords
  .then(res=>{
    let germanCardWord=document.getElementById("card-container-1").getElementsByClassName("german-card-word")[0]
    germanCardWord.innerHTML=res[cardNo].german

    let turkishCardWord=document.getElementById("card-container-1").getElementsByClassName("turkish-card-word")[0]
    turkishCardWord.innerHTML=res[cardNo].turkish

    let sentenceCardWord=document.getElementById("card-container-1").getElementsByClassName("sentence-card-word")[0]
    sentenceCardWord.innerHTML=res[cardNo].sentence

    const ratingCard=document.getElementById("card-container-1").getElementsByClassName("rating-card")[0]
    ratingCard.innerHTML=""
    
    // checkButton.classList.remove("hidden")

    

    for (let i = 0; i < res[cardNo].rating; i++) {
      addStarToCard()
    }
    //ratingCard=null;

    germanCardWord=document.getElementById("card-container-2").getElementsByClassName("german-card-word")[0]
    germanCardWord.innerHTML=res[cardNo-1].german

    turkishCardWord=document.getElementById("card-container-2").getElementsByClassName("turkish-card-word")[0]
    turkishCardWord.innerHTML=res[cardNo-1].turkish

    sentenceCardWord=document.getElementById("card-container-2").getElementsByClassName("sentence-card-word")[0]
    sentenceCardWord.innerHTML=res[cardNo-1].sentence


    germanCardWord=document.getElementById("card-container-3").getElementsByClassName("german-card-word")[0]
    germanCardWord.innerHTML=res[cardNo+1].german

    turkishCardWord=document.getElementById("card-container-3").getElementsByClassName("turkish-card-word")[0]
    turkishCardWord.innerHTML=res[cardNo+1].turkish

    sentenceCardWord=document.getElementById("card-container-3").getElementsByClassName("sentence-card-word")[0]
    sentenceCardWord.innerHTML=res[cardNo+1].sentence
    // console.log('wordsArr[0].german :>> ', wordsArr);
    // console.log('word :>> ', word);
  })
  // getElementsByClassName("german-card-word")[0].innerHTML="a"
}

  //listen the cards whether on clicked
document.getElementById("card-container-3").addEventListener("click",()=>{
  getWords
  .then(res=>{
    if(cardNo+1<res.length){
      cardNo++;
      // console.log('res.length :>> ', res.length);
    }
    if(cardNo+1==res.length) document.getElementById("card-container-3").classList.add("hidden");
    document.getElementById("card-container-2").classList.remove("hidden");
    addToCard();
  })
  console.log('cardNo 3:>> ', cardNo);
})

document.getElementById("card-container-2").addEventListener("click",()=>{
  if(cardNo>0) cardNo--;
  if(cardNo==0) document.getElementById("card-container-2").classList.add("hidden");
  document.getElementById("card-container-3").classList.remove("hidden");
  console.log('cardNo 2:>> ', cardNo);
  addToCard();
})

//listen the check button
const listenCheckButton=()=>{
  console.log('listening :>> ');
  let checkButton = document.getElementById("card-container-1").getElementsByClassName("check-button")[0]
  console.log('checkButton :>> ',checkButton);
  checkButton.addEventListener("click",()=>{
  // getWords
  //   .then(res=>{
  const inputValue = document.getElementById("card-container-1").getElementsByClassName("input-value")[0].value
  console.log('checkButton :>> ', checkButton); 
  compare(inputValue);
  console.log('called compare :>> ');
  // })
  })
}

// console.log('firebase :>> ', firebase);
        // let header = document.getElementsByClassName("test");
        // let dbRef = firebase.database().ref().child("text");
        // dbRef.on("value", snap=>header.innerText=snap.val())