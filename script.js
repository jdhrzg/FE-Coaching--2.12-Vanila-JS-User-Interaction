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

        document.getElementById("quoteDisplay").innerHTML += quote.toHTML();
    }
}

async function makeRequest(url) {
    try {
        // Bypass CORS
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