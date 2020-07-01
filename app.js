import initValidation from './validation.js';

const card = document.querySelector('.card-block');
const logo = document.querySelector('.card-item__logo');
const logoBack = document.querySelector('.card-item__logo--back');
const bgFront = document.querySelector('.card-block__side--front');
const bgBack = document.querySelector('.card-block__side--back');
const inputNumber = document.getElementById('card-number');
const inputName = document.querySelector('.form-item__name');
const cardNumber = document.querySelector('.card-item__number');
const cardName = document.querySelector('.card-item__name');
const inputMonths = document.getElementById('date-month');
const inputYears = document.getElementById('date-year');
const cardMonth = document.getElementById('month');
const cardYear = document.getElementById('year');
const inputCvv = document.getElementById('cvv');
const cardCvv = document.querySelectorAll('.cvv');
const reset = document.querySelector('.form-item__reset');

let spans,
    months = [],
    years = [];

const patterns = {
    visa: '1234 1234 1234 1234',
    mastercard: '1234 1234 1234 1234',
    amex: '1234 123456 12345',
};
let value = '';
let values = [];
let spaceIndex = [];

// init
window.addEventListener('DOMContentLoaded', () => {
    // init validation
    initValidation();

    // random card background image
    randomCardBg();

    // generate card's placeholders
    cardPlaceholder();

    // populate expiration date dropdown menus
    generateMonths();
    generateYears();
});

// input handler + map numbers to card template
inputNumber.addEventListener('input', mapCardNumbers);

// delete handler
inputNumber.addEventListener('keyup', deleteHandler);

// card number input focus-out
inputNumber.addEventListener('blur', focusOut);

// card number input focus-in
inputNumber.addEventListener('focus', focusIn);

// card holder input name handler
inputName.addEventListener('keyup', cardNameHandler);

// Expiration date handler
inputMonths.addEventListener('change', ({ target }) => {
    cardMonth.textContent = target.value;
});

inputYears.addEventListener('change', ({ target }) => {
    cardYear.textContent = target.value.slice(-2);
});

// cvv handler
inputCvv.addEventListener('keyup', cardCvvHandler);

// cvv input focus / blur handler to rotate the credit card
inputCvv.addEventListener('focus', () => {
    card.firstElementChild.classList.toggle('flip-front');
    card.lastElementChild.classList.toggle('flip-back');
});

inputCvv.addEventListener('blur', () => {
    card.firstElementChild.classList.toggle('flip-front');
    card.lastElementChild.classList.toggle('flip-back');
});

reset.addEventListener('click', () => document.location.reload());

function randomCardBg() {
    // display random background
    let random = Math.floor(Math.random() * 6) + 1;
    bgFront.style.backgroundImage = `url('https://atpacbwsyo.cloudimg.io/v7/creditcardform.imfast.io/assets/bg-${random}-min.jpg')`;
    bgFront.style.backgroundSize = 'cover';

    bgBack.style.backgroundImage = `url('https://atpacbwsyo.cloudimg.io/v7/creditcardform.imfast.io/assets/bg-${random}-min.jpg')`;
    bgBack.style.backgroundSize = 'cover';
}

function cardPlaceholder() {
    // populate credit card with placeholders
    const templateNumber = `<span>#</span><span>#</span><span>#</span><span>#</span><span>&nbsp;</span>`;
    for (let i = 0; i < 4; i++) {
        cardNumber.innerHTML += templateNumber;
    }
    let last = cardNumber.lastChild;
    cardNumber.removeChild(last);
    spans = document.querySelectorAll(
        'span:not(.date):not(.cvv):not(.danger):not(.hide)'
    );
}

function generateMonths() {
    // generate months
    for (let i = 1; i < 13; i++) {
        if (i < 10) {
            months.push(`0${i}`);
        } else {
            months.push(`${i}`);
        }
    }
    // populate select inputs + add disabled attribute to months already past
    let monthsList = months.map((month) => {
        if (month <= new Date().getMonth()) {
            return `<option value="${month}" disabled="disabled">${month}</option>`;
        } else {
            return `<option value="${month}">${month}</option>`;
        }
    });
    inputMonths.innerHTML += monthsList;
}

function generateYears() {
    // generate years
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i < currentYear + 10; i++) {
        years.push(`${i}`);
    }

    // populate select inputs
    let yearsList = years.map(
        (year) => `<option value="${year}">${year}</option>`
    );
    inputYears.innerHTML += yearsList;
}

function getPattern(pattern) {
    spaceIndex = [];

    pattern.split('').forEach((char, idx) => {
        if (char !== ' ') return;

        spaceIndex.push(idx);
    });

    return spaceIndex;
}

// TODO: to refactor
function deleteHandler(e) {
    if (e.keyCode === 8 || e.keyCode === 46) {
        value = inputNumber.value;

        if (spaceIndex.includes(value.length - 1)) {
            value = value.slice(0, -1);
            inputNumber.value = value;
            spans[values.length - 1].textContent = ' #';
        } else if (spans[values.length - 1].textContent == ' ') {
            spans[values.length - 1].textContent = ' ';
        } else {
            spans[values.length - 1].textContent = '#';
        }
    } else {
        e.preventDefault();
    }

    if (values.length === 0 || inputNumber.value === '') {
        values = [];
        value = [];
        for (let i = 0; i < spans.length; i++) {
            if (
                spans[i].textContent === ' ' ||
                spans[i].textContent == String.fromCharCode(160) // check for &nbsp;
            ) {
                spans[i].textContent = ' ';
            } else {
                spans[i].textContent = '#';
            }
        }
    }
}

function mapCardNumbers(e) {
    getPattern(patterns.visa); // TODO - add card type detection and adapt parameter accordingly

    if (parseInt(e.data) >= 0 && parseInt(e.data) <= 9) {
        value += e.data;
        if (spaceIndex.includes(value.length)) {
            value += ' ';
            inputNumber.value = value;
        }
    } else if (e.inputType !== 'deleteContentBackward') {
        inputNumber.value = value;
    }

    values = [...value];

    values.map((span, index) => {
        spans[index].innerHTML = values[index];
    });

    // check if credit card number is complete,then switch automatically to input name
    // if (values.length >= spans.length) {
    //     document.getElementById('name').focus();
    // }

    if (values.length < 4 && e.inputType !== 'deleteContentBackward') {
        detectCard();
    }
}

function focusOut() {
    value.length > 0 ? (values = value.split('')) : false;
    if (values.length > 10 && inputNumber.value !== '') {
        for (let i = 0; i < spans.length - 4; i++) {
            if (spans[i].textContent !== ' ') {
                spans[i].innerHTML = '*';
            } else {
                spans[i].innerHTML = ' ';
            }
        }
    }
    if (values.length === 0 || inputNumber.value === '') {
        values = [];
        value = [];
        for (let i = 0; i < spans.length; i++) {
            if (
                spans[i].textContent === ' ' ||
                spans[i].textContent == String.fromCharCode(160) // check for &nbsp;
            ) {
                spans[i].textContent = ' ';
            } else {
                spans[i].textContent = '#';
            }
        }
    }
}

function focusIn() {
    if (values.length > 5) {
        for (let i = 0; i < values.length; i++) {
            if (spans[i].textContent !== ' ') {
                spans[i].innerHTML = values[i];
            }
        }
    }
}

function cardNameHandler({ target }) {
    cardName.textContent = truncateString(target.value, 22);

    if (cardName.textContent.length === 0) {
        cardName.textContent = 'Type your name';
    }
}

function truncateString(str, num) {
    return str.length > num ? str.slice(0, num) + '...' : str;
}

function cardCvvHandler(e) {
    let values = [...e.target.value];

    values.map((el, index) => {
        cardCvv[index].textContent = values[index];
    });

    if (e.keyCode === 8) {
        if (values.length <= cardCvv.length) {
            cardCvv[values.length].textContent = '*';
        }
    }
}

function detectCard() {
    var visa = new RegExp('^4[0-9]{1,}$');
    var amex = new RegExp('^3[47][0-9]{1,}$');
    var mastercard = new RegExp(
        '^5[1-5][0-9]{1,}|222[1-9][0-9]{1,}|22[3-9][0-9]{1,}|2[3-6][0-9]{1,}|27[01][0-9]{1,}|2720[0-9]{1,}$'
    );

    if (visa.test(value)) {
        logo.style.backgroundImage = `url('./assets/visa.png')`;
        logoBack.style.backgroundImage = `url('./assets/visa.png')`;
    }
    if (mastercard.test(value)) {
        randomCardBg();
        logo.style.backgroundImage = `url('./assets/mastercard.png')`;
        logoBack.style.backgroundImage = `url('./assets/mastercard.png')`;
    }
    if (amex.test(value)) {
        randomCardBg();
        logo.style.backgroundImage = `url('./assets/amex.png')`;
        logoBack.style.backgroundImage = `url('./assets/amex.png')`;
    }
}
