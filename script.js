const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");


const typeSound = new Audio("./audio/typing-sound.mp3")
const wrongSound = new Audio("./audio/wrong.mp3")
const correctSound = new Audio("./audio/correct.mp3")

// inputテキスト入力。合っているかどうかの判定
typeInput.addEventListener("input",() => {

  // タイプ音をつける
  typeSound.play();
  typeSound.currentTime=0;


  // 分解した表示している文字を取得する
  const sentenceArray = typeDisplay.querySelectorAll("span");
  // console.log(sentenceArray);
  const arrayValue = typeInput.value.split("");
  // console.log(arrayValue);

  let correct = true;

  // 入力した文字が一致しているか判定
  sentenceArray.forEach((characterSpan,index) => {
    if((arrayValue[index] == null)){
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct=false;
    }
    else if (characterSpan.innerText == arrayValue[index]){
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");

      wrongSound.volume = 0.3;
      wrongSound.play();
      wrongSound.currentTime=0;
      correct=false;
    }
  })
  if(correct == true){
    correctSound.play();
    correctSound.currentTime=0;
    RenderNextSentence();
  }
})



// 非同期処理でランダムな文字を取得する
function GetRandomSentence(){
  return fetch(RANDOM_SENTENCE_URL_API).then((response) => response.json())
  .then((data) => data.content)
}

// ランダムな文章を取得して表示する
async function RenderNextSentence(){
  const sentence = await GetRandomSentence();
  
  typeDisplay.innerText = ""
  // 文章を１文字づつ分解してspanタグで表示する
  let oneText = sentence.split("")
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    // console.log(characterSpan);
    typeDisplay.appendChild(characterSpan)
    // characterSpan.classList.add("correct")
  });

  // テキストボックスの中身を消す
  typeInput.value="";

  StartTimer();
}

// タイマー処理
let startTime;
let originTime = 5;
function StartTimer(){
  timer.innerText= originTime;
  startTime = new Date();
  // console.log(startTime);
  setInterval(()=>{
    timer.innerText = originTime - getTimerTime();
    if(timer.innerText<=0)TimeUp()
    ;
  },1000);
}

function getTimerTime(){
  return Math.floor((new Date() - startTime)/1000);
}
function TimeUp(){
  RenderNextSentence();
}

RenderNextSentence();

