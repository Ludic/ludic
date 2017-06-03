
var timeTotal = 0;
var averageArray = [];
var period = 5;
var average;

onmessage = function(event){
  timeTotal += event.data;

  averageArray.push(event.data);

  if(averageArray.length>period){
    timeTotal -= averageArray.shift();
    average = timeTotal / period;
    // return 1 / average;
    postMessage(1 / average);
  }
};
