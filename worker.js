let running = false;

onmessage = (message) => {
  if (message.data == "start") {
    running = true;
    doWork();
  } else if (message.data == "pause") {
    running = false;
  }
};

let i = 0;
let chunk = 50000000;
let maxWork = 1000000000;
let result = 0;

function doWork() {
  if (!running) return false;

  let end = Math.min(i + chunk, maxWork);

  while (i < end && running) {
    result += Math.sqrt(i);
    i++;
  }

  if (i < maxWork) {
    postMessage({
      type: "progress",
      result: Math.round((i / maxWork) * 100),
    });
    setTimeout(doWork, 0);
  } else {
    postMessage({ type: "result", result });
    running = false;
  }
}
