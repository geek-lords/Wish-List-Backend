window.onload = function() 
{

    document.getElementById("hideAll").style.display = "none"; 

    // Set the date we're counting down to
var countDownDate = new Date("Dec 25, 2020 00:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  //document.getElementById("demo").innerHTML = days + "d " + hours + "h "
 // + minutes + "m " + seconds + "s ";
 document.getElementById("days").innerHTML = days + " : ";
 document.getElementById("hours").innerHTML = hours + " : ";
 document.getElementById("mins").innerHTML = minutes + " : ";
 document.getElementById("secs").innerHTML = seconds;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("days").innerHTML = "EXPIRED after 25th Dec";
  }
}, 1000);
}

function redirect(){
  window.location.href = './form.html';
}