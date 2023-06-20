const audioElement = document.getElementById('audio');
const button = document.getElementById('button');
const message = document.getElementById('message');
const replayButton = document.getElementById('button-container');

// add animated dots at the end of the sentence
function addDotsToSentence(text) {
  return `${text}<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;
}

// disable button & add message
function startLoading() {
  button.disabled = true;
  message.hidden = false;
  replayButton.hidden = true;
  message.innerHTML = addDotsToSentence('Requesting joke');
}

// enable button
function finishLoading() {
  button.disabled = false;
  replayButton.hidden = false;
}

// reset button if cant get a joke
function reset() {
  button.disabled = false;
  message.hidden = true;
}

// request text to speech joke
async function getAudio(text) {
  message.innerHTML = addDotsToSentence('Generating audio');
  const url = 'https://voicerss-text-to-speech.p.rapidapi.com/?key=9f524a9852db403cabe6b51b694088b4';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '2eabe93d66msh330d01dd8e46fafp16dd32jsn65f360425643',
      'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
    },
    body: new URLSearchParams({
      src: text,
      r: '0',
      c: 'mp3',
      f: '8khz_8bit_mono',
      b64: true,
    })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    audioElement.src = result;
    audioElement.play();
    message.textContent = text;
    finishLoading();
  } catch (error) {
    console.error(error);
    reset();
  }
}

// request joke in text format
async function getJoke() {
  startLoading();
  const url = 'https://v2.jokeapi.dev/joke/Any?format=txt&type=single'
  try {
    const response = await fetch(url);
    const result = await response.text();
    getAudio(result)
  } catch (error) {
    console.error(error);
    reset();
  }
}

// get new joke on button click
button.addEventListener('click', getJoke);

// replay last joke
replayButton.addEventListener('click', ()=> audioElement.play())