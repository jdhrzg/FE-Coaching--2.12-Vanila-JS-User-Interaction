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
}

async function onGetQuoteClick() {
    const data = await makeRequest("https://zenquotes.io/api/random");

    if (data?.length > 0)
    {
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
    
        return json

    } catch (error) {
        console.error(error.message);
        return null
    }
}


let count = 0;
let timeoutId = null;

const startIntervalBtn = document.getElementById("startIntervalBtn");
const stopIntervalBtn = document.getElementById("stopIntervalBtn");
const timeoutOutput = document.getElementById("timeoutOutput");

startIntervalBtn.addEventListener("click", () => {
    if (timeoutId !== null) return;

    timeoutId = setInterval(() => {
        const outputString = `Interval ran ${++count} times | ${getCurrentTime()}`;
        timeoutOutput.textContent = outputString;
        console.log(outputString);
    }, 1000);
});

stopIntervalBtn.addEventListener("click", () => {
    clearInterval(timeoutId);
    timeoutId = null;
    timeoutOutput.textContent = "Interval stopped";
});

// Seriously, no "hh:mm:ss.ffff" formatting? :)
function getCurrentTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  const ms = now.getMilliseconds().toString().padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}