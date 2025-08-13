let running = false;
let i = 0;
let maxWork = 3000000000;
let result = 0;

onmessage = (message) => {
  if (message.data == "start") {
    running = true;
    doWork();
  } else if (message.data == "pause") {
    running = false;
  }
};

function doWork() {
  while (i < maxWork && running) {
    i++;

    result += Math.sqrt(i);

    if (i % 100000000 === 0) {
      postMessage({ type: "progress", result: Math.round((i / maxWork) * 100) });
    }

    if (i >= maxWork) {
      postMessage({ type: "result", result });
    }
  }
}
