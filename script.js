//
// Fetch & Prototypes
//
function Quote(author, quote) {
  this.author = author;
  this.quote = quote;
}

Quote.prototype.toHTML = function () {
  return `
    <blockquote>
      “${this.author}”
      <footer>— ${this.quote}</footer>
    </blockquote>
    `;
};

async function onGetQuoteClick() {
  const data = await makeRequest("https://zenquotes.io/api/random");

  if (data?.length > 0) {
    const quote = new Quote(data[0].a, data[0].q);

    console.log(quote);
    console.log(data);

    document.getElementById("quoteDisplay").innerHTML = quote.toHTML();
  }
}

async function makeRequest(url) {
  try {
    // Bypass CORS - This still confuses me
    const proxyUrl = "https://api.allorigins.win/raw?url=";

    const response = await fetch(proxyUrl + url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

//
// setInterval
//
let intervalCount = 0;
let intervalId = null;

const startIntervalBtn = document.getElementById("startIntervalBtn");
const stopIntervalBtn = document.getElementById("stopIntervalBtn");
const intervalOutput = document.getElementById("intervalOutput");

startIntervalBtn.addEventListener("click", () => {
  if (intervalId !== null) return;

  console.log(getOutputAndTime("Interval", "start"));

  intervalId = setInterval(() => {
    const outputString = `${getOutputAndTime(
      "Interval",
      "ran"
    )} ${++intervalCount} times`;
    intervalOutput.textContent = outputString;
    console.log(outputString);
  }, 1000);
});

stopIntervalBtn.addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = null;
  intervalOutput.textContent = "Interval stopped";
});

//
// setTimeout
//
let timeoutId = null;

const startTimeoutBtn = document.getElementById("startTimeoutBtn");
const timeoutOutput = document.getElementById("timeoutOutput");

startTimeoutBtn.addEventListener("click", async () => {
  const outputStartString = `${getOutputAndTime("Timeout", "start")}`;
  timeoutOutput.textContent = outputStartString;
  console.log(outputStartString);

  const loader = document.getElementById("loader");
  loader.style.display = "block";

  await longRunning(2000);

  loader.style.display = "none";

  const outputRanString = `${getOutputAndTime("Timeout", "ran")}`;
  timeoutOutput.textContent = outputRanString;
  console.log(outputRanString);
});

// Seriously, no "hh:mm:ss.fff" formatting? :)
function getOutputAndTime(mode, startRan) {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");
  const ms = now.getMilliseconds().toString().padStart(3, "0");

  return `${mode} ${startRan} | ${h}:${m}:${s}.${ms}`;
}

//
// Long running process
//
function longRunning(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

//
// Make long running process that is CPU bound
//
document
  .getElementById("startCpuBoundBtn")
  .addEventListener("click", startWorker);
document
  .getElementById("pauseCpuBoundBtn")
  .addEventListener("click", pauseWorker);

const cpuBoundOutput = document.getElementById("cpuBoundOutput");
const loader2 = document.getElementById("loader2");

const worker = new Worker("worker.js");

function startWorker() {
  loader2.style.display = "block";
  worker.postMessage("start");
}

function pauseWorker() {
  loader2.style.display = "none";
  worker.postMessage("pause");
}

worker.onmessage = (message) => {
  if (message.data.type == "progress") {
    cpuBoundOutput.innerText = `${message.data.type}: ${message.data.result}%`;
  }
  else {
    loader.style.display = "none";
    cpuBoundOutput.innerText = `${message.data.type}: ${message.data.result}`;
  }
};
