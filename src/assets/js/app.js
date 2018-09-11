import $ from 'jquery';
import whatInput from 'what-input';

window.$ = $;

import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';


$(document).foundation();

//----------------- INPUT
// Variables

// Form
const form = document.querySelector('#booking');

// Reading values from Input fields
const allInputs = document.querySelectorAll('.input-field');
const allBookNowBtn = document.querySelectorAll('.rooms__book-now');
const yourBookingBtns = document.querySelectorAll('.confirm a');

// Event listeners
EventListeners();

function EventListeners() {
// Month field
  allInputs.forEach(function(each) {
    each.addEventListener('change', checkInput);
  });
  
  if(form) {
    form.addEventListener('submit', fillOutInputsValidation);
  } else {
    console.log('No form on this page');
  }

  yourBookingBtns[2].addEventListener('click', fieldRequiredAlert);
  yourBookingBtns[1].addEventListener('click', removeFromCart);
  window.addEventListener('DOMContentLoaded', addFromLocalStorage);
};

// LEAP YEAR
function leapYear(y) {
  return !(y%4)&&(!(y%400)||!!(y%100)); 
}

// Checking how many days is in each month including leap-year (every 4 years)
const validationMonth = function(month) {
  const m = month;
  const y = new Date().getFullYear();
  let end;
  //console.log(m);

  if((m === 1) || (m === 3) || (m === 5) || (m === 7) || (m === 8) || (m === 10) || (m === 12)) {
    end = 31;
  } else if((m === 4) || (m === 6) || (m === 9) || (m === 11)) {
    end = 30;
  } else if((m === 2)) {
    if(leapYear(y)) {
      end = 29;
    } else {
      end = 28;
    }
  } else {
    end = -1;
  }
  return end;  
}

// Converting Month string into a number
function convertMonth(month) {
  switch(month) {
    case 'Jan': return month = 1;
      break;
    case 'Feb': return month = 2;
      break;
    case 'Mar': return month = 3;
      break;
    case 'Apr': return month = 4;
      break;
    case 'May': return month = 5;
      break;
    case 'Jun': return month = 6;
      break;
    case 'Jul': return month = 7;
      break;
    case 'Aug': return month = 8;
      break;
    case 'Sep': return month = 9;
      break;
    case 'Oct': return month = 10;
      break;
    case 'Nov': return month = 11;
      break;
    case 'Dec': return month = 12;
      break;
    default: "Error";
  }
};

// Adding a number of options in DAYS field based on numbers of days in the month
function printDaysInSelect(m) {
  // getting value from DISPLAY month input
  const x = convertMonth(m); 
  // second input - DAYS
  const inputDay = allInputs[1];
  const correctMonth = validationMonth(x);
  for(let i = correctMonth; i > 0; i-- ) {
    inputDay.innerHTML += `
      <option value="${i}">${i}</option>
    `;
  }
}


function checkInput(e) {
  // Event listener reads the ID from booking container (from the select or input)
  const selectTarget = e.target.getAttribute('id');
  // assigning correct booking container to the variable based on the customer choice
  const findId = document.querySelector(`#${selectTarget}`);
  //console.log(findId);

  // vaildation between SELECT and INPUT selector
  if(findId.tagName === 'SELECT') {
    const selectedOpt = findId.options[findId.selectedIndex].text;
    changeDisplay(selectTarget, selectedOpt);
    printDaysInSelect(selectedOpt);
  } else if(findId.tagName === 'INPUT') {
    const selectedOpt = findId.value;
    changeDisplay(selectTarget, selectedOpt);
  }
}

// changing the display number in the field based on the input
function changeDisplay(id, element) {
  let ele = element;
  if(id === 'nights') {
    if(element <= 0) {
      ele = 1;
    }
  }
  document.querySelector(`#${id}`).previousElementSibling.innerHTML = ele;
}

// SUBMIT FORM AND BOOK A ROOM

function fillOutInputsValidation(e) {
  
  let results = [];
  
  //validation if form is present on the page
  if(allInputs.length > 0) {
    e.preventDefault();
    // validation if all fields are filled
    allInputs.forEach(function(each) {
      if(each.previousElementSibling.textContent == "") {
        each.previousElementSibling.style.backgroundColor = "rgba(255,99,71, .5)";
        results.push(0);
        
      } else {
        each.previousElementSibling.style.backgroundColor = "";
        results.push(1);
      }
      // If the field is empty, the results array gets 0 and the background red, if not empty, the array gets 1 and no background color
    });

    
  
    // if the array containes 0 (field emtpy) it gets logged to the console, otherwise the filterRoomsBySize function is being executed
    if(results.includes(0)) {
      alert('Fill out required fields and submit');
    } else {
      filterRoomsBySize();
      // console.log(readDetailsFromInput());
    }
  }
}

function filterRoomsBySize() {
  const room = readDetailsFromInput();
  let size = 'rooms__';
  // Filtering cards by their size. Rooms 1 & 2 display together, so do 3 & 4, and 5 & 6
  if(room.room == 1 || room.room == 2) {
    size += 'small';
  } else if(room.room == 3 || room.room == 4) {
    size += 'medium';
  } else if(room.room == 5 || room.room ==6) {
    size += 'big';
  } else {
    console.log('Unknowh size');
  }

  const cards = document.querySelectorAll('.card-js');
  // loop and hide what is not equal to size
  cards.forEach(function(each) {
    if(each.classList.contains(size)) {
      each.style.display = "block";
    } else {
      each.style.display = "none";
    }
  });

  // EVENT LISTENERS ADDED WHEN ALL INPUTS ARE FILLED AND THE ROOM SIZE CHOOSEN, TO AVOID ADDING ROOM TO THE CART WITHOUT SUBMITING THE FORM
  allBookNowBtn.forEach(function(each) {
    each.addEventListener('click', addToCart);
  });
}

// Read the data which is displayed (read from inputs) and create object from them
function readDetailsFromInput() {

  const inputDetails = {
    'month': allInputs[0].previousElementSibling.textContent,
    'day': allInputs[1].previousElementSibling.textContent,
    'nights': allInputs[2].previousElementSibling.textContent,
    'room': allInputs[3].previousElementSibling.textContent
  };
  return inputDetails;
}


/// ADDING ROOM TO CART

function addToCart(e) {
  e.preventDefault();
  // create variables
  const room = e.target.parentElement;
  const card = getCartObject(room);
  const inputs = readDetailsFromInput();
  const yourBookings = document.querySelector('.booking-table');
  const descBookings = document.querySelector('.desc');
  const cartElements = createCartDOM(inputs, card);

  // insert created elements
  yourBookings.innerHTML = cartElements[0];
  descBookings.innerHTML = cartElements[1];

  yourBookingBtns[0].style.display = 'block';
  yourBookingBtns[1].style.display = 'block';
  yourBookingBtns[2].style.display = 'none';

  // adding created objects to the local storage
  addToLocalStorage(cartElements);
}

function removeFromCart() {
  // There are two part of the cart. Table and description. Both need to be hidden
  const yourBookings = document.querySelector('.booking-table');
  console.log(yourBookings.firstChild);
  while(yourBookings.firstChild) {
    yourBookings.removeChild(yourBookings.firstChild);;
  }

  const bookingDesc = document.querySelector('.desc');
  while(bookingDesc.firstChild) {
    bookingDesc.removeChild(bookingDesc.firstChild);
  }

  //remove from local storage
  removeFromLocalStorage();

  // Hiding "confirm and remove btns" and display add new
  yourBookingBtns[0].style.display = 'none';
  yourBookingBtns[1].style.display = 'none';
  yourBookingBtns[2].style.display = 'block';
}

function createCartDOM(input, cart) {
  //input and cart are object created by functions readDetailsFromInput & getCartObject
  const table = `
  <thead>
    <tr>
      <th>Room</th>
      <th>Bed</th>
      <th>Nights</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="${cart.image}" alt=""></td>
      <td>${cart.bed}</td>
      <td>${input.nights}</td>
    </tr>
  </tbody>
  `;

  const divDesc = `
  <span>
    <span>Price</span>
    <span>£<strong>${cart.perNight}</strong></span>
    <span>per night</span>
  </span>

  <span>
    <span>Your Total:</span>
    <span>£<strong>${input.nights * cart.perNight}</strong></span>
  </span>
  <span class="discount">Discount (if apply): £<span>${cart.off}</span></span>
  <span class="final-price">Amount to pay: £<span>${(cart.perNight * input.nights) - (cart.off * input.nights)}</span></span>
  <span class="save">You save: <span>£</span><span><strong>${cart.off * input.nights}</strong></span>
  </span>
  `;

  return [table, divDesc];

}

// Reading the data from the DOM and asigning them to the object
function getCartObject(room) {
  const roomCart = {
    'image': room.children[0].getAttribute('src'),
    'off': room.children[1].children[0].textContent,
    'bed': room.children[2].children[0].children[0].textContent,
    'perNight': room.children[2].children[1].children[0].children[0].textContent
  }

  return roomCart;
}

// passing the addEventListener event to the vaildation function and asigning the add new btn to the alert if the input fields are not filled out
function fieldRequiredAlert(e) {
  fillOutInputsValidation(e);
}

 
// LOCAL STORAGE

// get from local storage and convert to table
function getFromLocalStorage() {
  const localSt = localStorage.getItem('room');
  let LS;
  if(localSt === null) {
    LS = [];
  } else {
    LS = JSON.parse(localSt);
  }
  return LS;
}

// adding to tle local storage
function addToLocalStorage(table) {
  // converting table from localStorage into JSON object
  const tableString = JSON.stringify(table);
  //adding the JSON object to the localStorage
  localStorage.setItem('room', tableString);
}

// adding to the cart from LS after the DOM load
function addFromLocalStorage() {
  const localSt = getFromLocalStorage();
  console.log(localSt);
  if(localSt.length > 0) {
    const yourBookings = document.querySelector('.booking-table');
    const descBookings = document.querySelector('.desc');
    // insert created elements
    yourBookings.innerHTML = localSt[0];
    descBookings.innerHTML = localSt[1];
  
    yourBookingBtns[0].style.display = 'block';
    yourBookingBtns[1].style.display = 'block';
    yourBookingBtns[2].style.display = 'none';
  }
}

//remove from the local storage
function removeFromLocalStorage() {
  localStorage.removeItem('room');
}
