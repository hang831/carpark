const savedState = localStorage.getItem('toggleState') || '關閉';
const rangeInput = document.getElementById('rangeInput');
const selectedValue = document.getElementById('selectedValue');

// Load the saved value from local storage
const savedValue = localStorage.getItem('selectedRangeValue');

// Array of corresponding values for the range input
const values = [5, 10, 15, 30, 60, 300];

let intervalId;
let intervalDuration = 300000; // Default to 300 seconds (300000 milliseconds)

$(document).ready(function() {
    if  (savedValue != null)
        intervalDuration = values[savedValue] * 1000; // Convert to milliseconds
    if (savedState === '開啟') {
        $('#collapsible').collapse('show'); // Show collapsible if open
         console.log(savedValue);         
         clearInterval(intervalId);
         startInterval();
         console.log(savedValue);
    }else{
        $('#collapsible').collapse('hide'); // Hide collapsible if closed
        
    }
   
});



if (savedValue) {
    rangeInput.value = savedValue;
    selectedValue.textContent = values[savedValue]; // Set based on saved value
}

rangeInput.addEventListener('input', function() {
    const value = rangeInput.value;
    selectedValue.textContent = values[value]; // Get the corresponding value
    localStorage.setItem('selectedRangeValue', value); // Save in local storage
    intervalDuration = values[value] * 1000; // Convert to milliseconds
    clearInterval(intervalId);
        startInterval();
});

function setting() {
    // Load saved toggle state from local storage
   
    
    // Initialize button states based on saved state
    if (savedState === '開啟') {
        // Show collapsible panel and set "開啟" button active
       
        $('.btn-toggle .btn-default').removeClass('btn-default')
        $('.btn-toggle .btn-primary').removeClass('btn-primary active')
        $('.btn1').addClass('btn-primary active');
        $('.btn2').addClass('btn-default');
       
    } else {
        // Hide collapsible panel and set "關閉" button active
        
        $('.btn-toggle .btn-default').removeClass('btn-primary active')
        $('.btn-toggle .btn-primary').removeClass('btn-default')
        $('.btn1').addClass('btn-default');
        $('.btn2').addClass('btn-primary active');
       
    }

};

   // Click event for the toggle button
   function toggle1() {
 
        $('.btn-toggle .btn-default').removeClass('btn-default')
        $('.btn-toggle .btn-primary').removeClass('btn-primary active')
        $('.btn1').addClass('btn-primary active');
        $('.btn2').addClass('btn-default');
        localStorage.setItem('toggleState', '開啟');
        $('#collapsible').collapse('show'); // Show collapsible
        localStorage.setItem('selectedRangeValue', rangeInput.value);     
        console.log("click");
        clearInterval(intervalId);
        startInterval();
}

  // Click event for the toggle button
  function toggle2() {
 
    $('.btn-toggle .btn-default').removeClass('btn-default')
    $('.btn-toggle .btn-primary').removeClass('btn-primary active')
    $('.btn1').addClass('btn-default');
    $('.btn2').addClass('btn-primary active');
    localStorage.setItem('toggleState', '關閉');
    $('#collapsible').collapse('hide'); // Hide collapsible
    clearInterval(intervalId);
}


function startInterval() {
    intervalId = setInterval(myFunction, intervalDuration);
}


