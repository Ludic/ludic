
let timeTotal = 0
let averageArray = []
let period = 5
let average

onmessage = function(event){
  timeTotal += event.data

  averageArray.push(event.data)

  if(averageArray.length>period){
    timeTotal -= averageArray.shift()
    average = timeTotal / period
    // return 1 / average
    postMessage(1 / average)
  }
}
