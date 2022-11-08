'use strict';
// ELEMENTS
const containerApp = document.querySelector('#app');
const containerMovements = document.querySelector('.movements');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance');
const labelSumIn = document.querySelector('.income-value');
const labelSumOut = document.querySelector('.outcome-value');
const labelSumInterest = document.querySelector('.interest-value');
const labelTimer = document.querySelector('.logout-in');

const loginBtn = document.querySelector('.login-btn');
const loginScreen = document.getElementById('login');
const inputLoginUsername = document.getElementById('username');
const inputLoginPin = document.getElementById('password');

const inputTransferTo = document.getElementById('transfer-to-input');
const inputTransferAmount = document.getElementById('transfer-amount');
const btnTransfer = document.getElementById('transfer-btn');

const inputReqLoan = document.getElementById('request-loan-input');
const btnReqLoan = document.getElementById('request-btn');

const inputCloseAccUsername = document.getElementById('close-account-input');
const inputCloseAccPin = document.getElementById('close-account-pass-input');
const btnCloseAcc = document.getElementById('close-account-btn');

// APP
///////////////////////////////
///////////////////////////////
// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// creating usernames with map method
const createUsername = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsername(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

// display movements in movements container with foreachs
const displayMovements = function (movements) {
  movements.forEach((mov, i) => {
    let movementType = mov > 0 ? 'deposit' : 'withdraw';

    let movement = `
      <div class="movement movement-${movementType}">
        <header>
          <h4 class="movement-type">${i + 1}. ${movementType}</h4>
          <p class="movement-date">3 days ago</p>
        </header>
        <div class="movement-value">${mov} €</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', movement);
  });
};

// calc balance with reduce method
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

// chainging array methods and display summary
const calcDisplaySummary = function (acc) {
  // calculating income
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} €`;

  // calculating outcome;
  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)} €`;

  // calculating interest
  const interests = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interests}`;
};

function padTo2Digits(num) {
  return String(num).padStart(2, '0');
}

// implementing login logic with using find method
let currentAccount;

loginBtn.addEventListener('click', (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // displaying current date
    const date = new Date();
    labelDate.textContent = `${padTo2Digits(date.getDate())}.${padTo2Digits(
      date.getMonth() + 1
    )}.${date.getFullYear()} ${padTo2Digits(date.getHours())}:${padTo2Digits(
      date.getMinutes()
    )}`;

    // displaying welcome message
    labelWelcome.innerHTML = `Welcome back, <strong>${
      currentAccount.owner.split(' ')[0]
    }</strong>`;

    // displaying the app and hiding login form
    loginScreen.style.display = 'none';
    setTimeout(() => {
      app.style.display = 'flex';
    }, 500);

    // update ui for the current account
    updateUI(currentAccount);
  } else {
    inputLoginPin.classList.add('wrong');
    inputLoginUsername.classList.add('wrong');
  }
});

// implementing transfer money logic
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

// implementing close account logic
