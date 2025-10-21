class computer {

    constructor(previousNumberDisplay, currentNumberDisplay){

        this.previousNumberDisplay= previousNumberDisplay
        this.currentNumberDisplay = currentNumberDisplay
        this.twoElement = false
        this.clear()
    }

    clear(){

        this.previousNumber = ''
        this.currentNumber = '0'
        this.operator = undefined
    }

    clear_entry(){

        this.currentNumber = '0'
    }

    delete(){

        if(this.currentNumber === '0' || this.currentNumber.length === 1) {
        this.currentNumber = '0'
        } 
        else {
                this.currentNumber = this.currentNumber.slice(0, -1)
            }
    }
    

    addNumber(number){

        if(number === '.' && this.currentNumber.includes('.')) return
        if(number != '.' && this.currentNumber === '0') this.currentNumber = number
        else if(this.twoElement == false){

            this.twoElement = true
            this.currentNumber = number
        }
        else{

            this.currentNumber = this.currentNumber + number
        }
    }

    chooseOperator(operator){

        if(this.previousNumber !== '') {

            this.compute()
        }

        this.previousNumber = this.currentNumber
        this.twoElement = false
        this.operator = operator
    }


    compute(){

        const numberA = parseFloat(this.previousNumber)
        const numberB = parseFloat(this.currentNumber)
        if (isNaN(numberA) || isNaN(numberB)){

            return
        }

        let result

        switch(this.operator){

            case '+' :  
                result = numberA + numberB
                break
            case '-' :
                result = numberA - numberB
                break
            case '÷' :
                if(numberB == 0){
                    alert('Không thể chia cho số 0')
                    break
                }
                result = numberA / numberB
                break
            case 'X' :
                result = numberA * numberB
                break
            default:
                return
        }

        this.currentNumber = result.toString()
        this.previousNumber = numberA.toString() + ' ' + this.operator + ' ' + numberB.toString() + '=' 
        this.operator = undefined
    }


    applyUnaryOperation(operator) {

        const numberA = parseFloat(this.currentNumber);
        if (isNaN(numberA)) return;
        
        let result;
        switch (operator) {
            case '%':
                result = numberA / 100;
                this.previousNumber = numberA.toString() + '%'
                break;
            case 'x²':
                result = numberA * numberA;
                this.previousNumber = numberA.toString() + '²'
                break;
            case '√':
                if (numberA < 0) {
                    alert('Không thể tính căn bậc 2 của số âm');
                    return;
                }
                this.previousNumber = 'sqrt(' + numberA.toString() + ')' 
                result = Math.sqrt(numberA);
                break;
            case '+/-':
                result = -numberA;
                break;
            default:
                return;
        }
        
        this.currentNumber = result.toString();
    }


    getDisplayNumber(number) {
            const stringNumber = number.toString();
            const integerDigits = parseFloat(stringNumber.split('.')[0]);
            const decimalDigits = stringNumber.split('.')[1];
            let integerDisplay;
            
            if (isNaN(integerDigits)) {
                integerDisplay = '';
            } else {
                integerDisplay = integerDigits.toLocaleString('en', {
                    maximumFractionDigits: 0
                });
            }
            
            if (decimalDigits != null) {
                return `${integerDisplay}.${decimalDigits}`;
            } else {
                return integerDisplay;
            }
        }
        
    updateDisplay() {

        this.currentNumberDisplay.innerText = 
            this.getDisplayNumber(this.currentNumber);
        
        if (this.operator != null) {
            this.previousNumberDisplay.innerText = 
                `${this.getDisplayNumber(this.previousNumber)} ${this.operator}`;
        } else {
            this.previousNumberDisplay.innerText = this.previousNumber;
        }
    }
}

const numbersButton = document.querySelectorAll('.number')
const normalOperator = document.querySelectorAll('.operator')
const unaryOperator = document.querySelectorAll('.unary-operator')
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');
const clearEntryButton = document.querySelector('.clear-entry')
const BackSpaceButton = document.querySelector('.backspace');
const previousNumberDisplay = document.querySelector('.previous-operand');
const currentnumberDisplay = document.querySelector('.current-operand');

const calculate =  new computer(previousNumberDisplay, currentnumberDisplay)

BackSpaceButton.addEventListener('click', () => {

    calculate.delete()
    calculate.updateDisplay()
});

clearButton.addEventListener('click', () => {

    calculate.clear()
    calculate.updateDisplay()
});

clearEntryButton.addEventListener('click', () => {

    calculate.clear_entry()
    calculate.updateDisplay()
});

numbersButton.forEach(button => {
    button.addEventListener('click', () => {
        calculate.addNumber(button.innerText);
        calculate.updateDisplay();
    });
});


normalOperator.forEach(button => {
    button.addEventListener('click', () => {
        calculate.chooseOperator(button.innerText);
        calculate.updateDisplay();
    });
});


equalsButton.addEventListener('click', () => {

    calculate.compute()
    calculate.updateDisplay()
});


unaryOperator.forEach(button => {
    button.addEventListener('click', () => {
        calculate.applyUnaryOperation(button.innerText);
        calculate.updateDisplay();
    });
});


document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        calculate.addNumber(event.key);
        calculate.updateDisplay();
    }
    if (event.key === '.') {
        calculate.addNumber('.');
        calculate.updateDisplay();
    }
    if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        let operator;
        switch (event.key) {
            case '+': operator = '+'; break;
            case '-': operator = '-'; break;
            case '*': operator = 'X'; break;
            case '/': operator = '÷'; break;
        }
        calculate.chooseOperator(operator);
        calculate.updateDisplay();
    }
    if (event.key === 'Enter' || event.key === '=') {
        calculate.compute();
        calculate.updateDisplay();
    }
    if (event.key === 'Backspace') {
        calculate.delete();
        calculate.updateDisplay();
    }
    if (event.key === 'Escape') {
        calculate.clear();
        calculate.updateDisplay();
    }
});








