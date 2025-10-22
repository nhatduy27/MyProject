class computer {

    constructor(previousNumberDisplay, currentNumberDisplay){
        this.previousNumberDisplay= previousNumberDisplay
        this.currentNumberDisplay = currentNumberDisplay
        this.newNumber = false
        this.history = [] // Mảng lưu lịch sử
        this.clear()
    }

    clear(){ //Hàm xóa toàn bộ phép tính
        this.previousNumber = ''
        this.currentNumber = '0'
        this.operator = undefined
    }

    clear_entry(){ //Xóa toán hạng hiện tại
        this.currentNumber = '0'
    }

    delete(){ //Hàm xóa 
        if(this.currentNumber === '0' || this.currentNumber.length === 1) {
            this.currentNumber = '0'
        } 
        else {
            this.currentNumber = this.currentNumber.slice(0, -1)
        }
    }
    
    addNumber(number){ //Hàm nhập số khi nhấn phím
        if(number === '.' && this.currentNumber.includes('.')) return
        else if(number != '.' && this.currentNumber === '0') this.currentNumber = number
        else if(this.newNumber){

            this.currentNumber = number
            this.newNumber = false
        }
        else{
            this.currentNumber = this.currentNumber + number
        }
    }

    chooseOperator(operator){ //Xử lí khi chọn toán tử
        
        this.previousNumber = this.currentNumber
        this.newNumber = true
        this.operator = operator
    }

    compute(){ //Hàm tính toán cho phép tính 2 toán hạng
        const numberA = parseFloat(this.previousNumber)
        const numberB = parseFloat(this.currentNumber)


        if (isNaN(numberA) || isNaN(numberB)){
            if(!isNaN(numberB)){
                this.previousNumber = numberB
                this.operator = ' ='
            }
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

       
        this.saveToHistory(numberA, numberB, result) 
        this.currentNumber = result.toString()
        this.previousNumber = numberA.toString() + ' ' + this.operator + ' ' + numberB.toString() + ' = ' 
        this.operator = undefined
        this.newNumber = true
    }

    applyUnaryOperation(operator) {  //Hàm tính cho phép tính 1 toán hạng
        const numberA = parseFloat(this.currentNumber);
        if (isNaN(numberA)) return;
        
        let result;
        let expression = '';
        
        switch (operator) {
            case '%':
                result = numberA / 100;
                expression = numberA.toString() + '%';
                break;
            case 'x²':
                result = numberA * numberA;
                expression = '('+ numberA.toString() + ')' + '²';
                break;
            case '√':
                if (numberA < 0) {
                    alert('Không thể tính căn bậc 2 của số âm');
                    return;
                }
                expression = '√(' + numberA.toString() + ')';
                result = Math.sqrt(numberA);
                break;
            case '+/-':
                result = -numberA;
                expression = '±(' + numberA.toString() + ')';
                break;
            default:
                return;
        }
        
        this.saveUnaryToHistory(expression, result)
        this.currentNumber = result.toString();
        this.previousNumber = expression;
        this.newNumber = true
    }


    //2 hàm lưu lại lịch sử của 2 hàm tính toán
    saveToHistory(numA, numB, result) {
        const historyItem = {
            type: 'binary',
            expression: `${this.getDisplayNumber(numA)} ${this.operator} ${this.getDisplayNumber(numB)}`,
            result: this.getDisplayNumber(result),
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.history.unshift(historyItem);
        
        if (this.history.length > 20) {
            this.history.pop();
        }
        
        this.saveHistoryToStorage();
    }

    saveUnaryToHistory(expression, result) {
        const historyItem = {
            type: 'unary',
            expression: expression,
            result: this.getDisplayNumber(result),
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.history.unshift(historyItem);
        
        if (this.history.length > 20) {
            this.history.pop();
        }
        
        this.saveHistoryToStorage();
    }

    //lưu lịch sử vào localStorage
    saveHistoryToStorage() {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        } catch (e) {
            console.log('Không thể lưu lịch sử:', e);
        }
    }

    
    //load lên từ localStorage 
    loadHistoryFromStorage() {
        try {
            const savedHistory = localStorage.getItem('calculatorHistory');
            if (savedHistory) {
                this.history = JSON.parse(savedHistory);
            }
        } catch (e) {
            console.log('Không thể tải lịch sử:', e);
        }
    }

    //xóa lịch sử
    clearHistory() {
        this.history = [];
        try {
            localStorage.removeItem('calculatorHistory');
        } catch (e) {
            console.log('Không thể xóa lịch sử:', e);
        }
    }

    //Hiển thị lịch sử
    showHistory() {
        if (this.history.length === 0) {
            alert('Chưa có phép tính nào trong lịch sử');
            return;
        }

        //popup hiển thị lịch sử
        const historyPopup = document.createElement('div');
        historyPopup.className = 'history-popup';
        historyPopup.innerHTML = `
            <div class="history-content">
                <div class="history-header">
                    <h3>Lịch Sử Tính Toán</h3>
                    <button class="close-history">&times;</button>
                </div>
                <div class="history-list">
                    ${this.history.map((item, index) => `
                        <div class="history-item">
                            <div class="history-expression">${item.expression}</div>
                            <div class="history-result">= ${item.result}</div>
                            <div class="history-time">${item.timestamp}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="history-actions">
                    <button class="clear-history-btn">Xóa Lịch Sử</button>
                </div>
            </div>
        `;

        // CSS cho popup hiện lịch sử
        const style = document.createElement('style');
        style.textContent = `
            .history-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .history-content {
                background: white;
                border-radius: 10px;
                padding: 20px;
                max-width: 400px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 10px;
            }
            .history-header h3 {
                margin: 0;
                color: #333;
            }
            .close-history {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            .history-list {
                margin-bottom: 15px;
            }
            .history-item {
                padding: 10px;
                border-bottom: 1px solid #eee;
            }
            .history-expression {
                font-weight: bold;
                color: #333;
            }
            .history-result {
                color: #007bff;
                font-size: 1.1em;
            }
            .history-time {
                font-size: 0.8em;
                color: #666;
                text-align: right;
            }
            .history-actions {
                text-align: center;
            }
            .clear-history-btn {
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            }
            .clear-history-btn:hover {
                background: #c82333;
            }
        `;
        document.head.appendChild(style);

        // Thêm sự kiện cho nút đóng
        historyPopup.querySelector('.close-history').addEventListener('click', () => {
            document.body.removeChild(historyPopup);
            document.head.removeChild(style);
        });

        //nút xóa lịch sử
        historyPopup.querySelector('.clear-history-btn').addEventListener('click', () => {
            if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
                this.clearHistory();
                document.body.removeChild(historyPopup);
                document.head.removeChild(style);
                alert('Đã xóa lịch sử');
            }
        });

        //trường hợp người dùng click ra ngoài để đóng
        historyPopup.addEventListener('click', (e) => {
            if (e.target === historyPopup) {
                document.body.removeChild(historyPopup);
                document.head.removeChild(style);
            }
        });

        document.body.appendChild(historyPopup);
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
const historyButton = document.querySelector('.history'); 
const previousNumberDisplay = document.querySelector('.previous-operand');
const currentnumberDisplay = document.querySelector('.current-operand');

const calculate =  new computer(previousNumberDisplay, currentnumberDisplay)

calculate.loadHistoryFromStorage();

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

historyButton.addEventListener('click', () => {
    calculate.showHistory();
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