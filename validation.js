const validationState = new Set();
const loginForm = document.forms[0];

// The function submits the form
function submitForm() {
    const submitBtn = document.querySelector('.form-item__button');
    submitBtn.addEventListener('click', function (e) {
        event.preventDefault();
        manageState().validateState();
        console.log(validationState);
    });
}

// Attaching 'keyup' event to the login form.
// Using event delegation
function attachKeyUpEvent() {
    loginForm.addEventListener('keyup', function (e) {
        const nodeName = e.target.nodeName;
        const inputProps = e.target;

        if (nodeName === 'INPUT') {
            validateForm(inputProps);
        }
    });
}

function attachSelectChange() {
    loginForm.addEventListener('change', function (e) {
        const nodeName = e.target.nodeName;
        const inputProps = e.target;

        if (nodeName === 'SELECT') {
            validateForm(inputProps);
        }
    });
}

export default function initValidation() {
    attachKeyUpEvent();
    attachSelectChange();
    submitForm();
}

// Collection of functions for managing state
function manageState() {
    return {
        addToState: (inputData) => {
            // const action = 'removeClass';
            const { inputProps, inputName } = inputData;
            validationState.add(inputName);
            manipulateValidationMsg({ inputProps });
        },
        removeFromState: (inputData) => {
            // const action = 'addClass';
            const action = 'hide';
            const { inputProps, inputName } = inputData;

            validationState.delete(inputName);
            manipulateValidationMsg({ inputProps, action });
        },
        validateState: () => {
            if (validationState.size > 0) {
                return false;
            }

            if (validationState.size === 0) {
                validationRules().emptyFields();
                return true;
            }
        },
    };
}

// Function receives an input with its properties
function validateForm(inputProps) {
    const inputName = inputProps.name;
    const verifyInputName = {
        'card-number': validationRules().cardNumber,
        name: validationRules().name,
        'date-month': validationRules().dateMonth,
        'date-year': validationRules().dateYear,
        cvv: validationRules().cvv,
    };

    return verifyInputName[inputName](inputProps);
}

// Validation rules for each field in our form.
function validationRules() {
    return {
        cardNumber: (inputProps) => {
            const cardNumberValidationRule = /^(?:4[0-9]{15}|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
            const inputValue = inputProps.value.replace(/\s/g, '');
            const inputName = inputProps.name;
            const isInputValid = cardNumberValidationRule.test(
                inputValue.replace(/\s/g, '')
            );
            isInputValid
                ? manageState().removeFromState({ inputProps, inputName })
                : manageState().addToState({ inputProps, inputName });

            return true;
        },
        name: (inputProps) => {
            const nameValidationRule = /[A-Za-z0-9]{3,}/;
            const inputValue = inputProps.value;
            const inputName = inputProps.name;
            const isInputValid = nameValidationRule.test(inputValue);

            isInputValid
                ? manageState().removeFromState({ inputProps, inputName })
                : manageState().addToState({ inputProps, inputName });

            return true;
        },
        dateMonth: (inputProps) => {
            const inputValue = inputProps.value;
            const inputName = inputProps.name;
            const isInputValid = inputValue !== 'Month' ? true : false;

            isInputValid
                ? manageState().removeFromState({ inputProps, inputName })
                : manageState().addToState({ inputProps, inputName });

            return true;
        },
        dateYear: (inputProps) => {
            const inputValue = inputProps.value;
            const inputName = inputProps.name;
            const isInputValid = inputValue !== 'Year' ? true : false;

            isInputValid
                ? manageState().removeFromState({ inputProps, inputName })
                : manageState().addToState({ inputProps, inputName });

            return true;
        },
        cvv: (inputProps) => {
            const cvvValudationRule = /\d{3,}/;
            const inputValue = inputProps.value;
            const inputName = inputProps.name;
            const isInputValid = cvvValudationRule.test(inputValue);

            isInputValid
                ? manageState().removeFromState({ inputProps, inputName })
                : manageState().addToState({ inputProps, inputName });

            return true;
        },
        emptyFields: () => {
            const formInputElems = [...loginForm.elements].filter(
                (item) =>
                    item.nodeName === 'INPUT' || item.nodeName === 'SELECT'
            );
            for (const inputProps of formInputElems) {
                const inputName = inputProps.name;
                const inputValue = inputProps.value;
                if (
                    !inputValue ||
                    inputValue === 'Month' ||
                    inputValue === 'year'
                ) {
                    manageState().addToState({ inputProps, inputName });
                }
            }
        },
    };
}

// Function manipulates validation messages by toggling them
function manipulateValidationMsg(validationData) {
    const { inputProps, action } = validationData;
    const elementValidatingMsg = inputProps;
    const labelValidatingMsg = inputProps.previousElementSibling.lastChild;
    const validationMsgClasses = elementValidatingMsg.classList;
    const labelValidationMsgClasses = labelValidatingMsg.classList;
    const removeClass = () => {
        validationMsgClasses.add('invalid');
        labelValidationMsgClasses.remove('hide');
    };
    const addClass = () => {
        validationMsgClasses.remove('invalid');
        labelValidationMsgClasses.add('hide');
    };
    return action === 'hide' ? addClass() : removeClass();
}
