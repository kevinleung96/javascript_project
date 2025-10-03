
$(document).ready(function(){    

    // Color Checker
    $('#color_btn').click(function(){
        var color = $('#color_input').val();
        $('#color_checker').css('background-color', color);
    });

    // Light Bulb Switch
    var isOn = false;
    $('#switch_button').click(function(){
        if (isOn) {
            $('#bulb_photo').attr('src', 'assets/bulb_off.png');
            $('#switch_button').text('Turn On');
            $('.wrapper').css({'background': 'transparent',
                'border': '2px solid rgba(255, 255, 255, 0.2)',
                'box-shadow': '0 0 10px rgba(255, 255, 255, 0.2)',
                'backdrop-filter': 'blur(4px)'});
        } else {
            $('#bulb_photo').attr('src', 'assets/bulb_on.png');    
            $('#switch_button').text('Turn Off');
            $('.wrapper').css({'background': 'rgba(227, 202, 10, 0.5)',
                'border': '2px solid rgba(227, 202, 10, 0.5)',
                'box-shadow': '0 0 20px rgba(227, 154, 10, 0.5)',
                'backdrop-filter': 'blur(10px)'});
            
        }
        isOn = !isOn;
    });



    // tic tac
    let board = Array(9).fill(null);
    let isXNext = true;

    // creat board
    for (let i = 0; i < 9; i++) {
        $('#board').append(`<div class="cell" data-index="${i}"></div>`);
    }

    // creat event
    $('.cell').click(function(){
        let index = $(this).data('index');

        if (!board[index]) {
            board[index] = isXNext ? 'X' : 'O';
            $(this).text(board[index]);
            isXNext = !isXNext;

            let winner = checkWinner();
            if (winner) {
                $('#winner_message').text(`Player ${winner} won！`);
                $('.cell').off('click'); // click banned
            }
            
        }
        
    });

    // check if winner
    function checkWinner() {
        const winningPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // row
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // col
            [0, 4, 8], [2, 4, 6]             // bia
        ];

        for (let pattern of winningPatterns) {
            let [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // winner ('X' or 'O')
            }
        }

        board.includes(null) ? null : $('#winner_message').text('Tie');
    }

    // reset game
    $('#reset_btn').click(function(){
        board.fill(null);
        isXNext = true;
        $('.cell').text('');
        $('#winner_message').text('');
        $('.cell').off('click').click(function(){
            let index = $(this).data('index');
            if (!board[index]) {
                board[index] = isXNext ? 'X' : 'O';
                $(this).text(board[index]);
                isXNext = !isXNext;
                
                let winner = checkWinner();
                if (winner) {
                    $('#winner_message').text(`Player ${winner} won！`);
                    $('.cell').off('click');
                }
            }
        });
    });

    let offset = {offset:'90%'};

    $('h2').waypoint(function() {
        $(this.element).addClass("animate__animated animate__bounceIn")
    }, offset);

    $('#renew_btn').click(function(){
        $.get('https://dog.ceo/api/breeds/image/random', function(data){
            if(data.status === "success")
               $('#my_img').attr('src', data.message);
            else $('#my_img').attr('alt', 'erro');
        });

        $.get('https://official-joke-api.appspot.com/random_joke',function(data){
            $('#jokes').html(`${data.setup}<br>${data.punchline}`);
        });
    });


    // calculator
    let currentInput = '';  // 当前输入
    let operator = '';  // 运算符
    let firstNumber = null;  // 第一个数字

    let board_calculator = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'];

    // 动态创建计算器按钮
    board_calculator.forEach(function(value) {
        $('#board_calculator').append(`<div class="cell_calculator" data-value="${value}">${value}</div>`);
    });

    // 处理按钮点击事件
    $('.cell_calculator').click(function() {
        const value = $(this).data('value');

        if (value === '=') {
            // 执行计算
            if (operator && firstNumber !== null) {
                currentInput = eval(firstNumber + operator + currentInput).toString();
                $('#calculator_result').text(currentInput);  // 只显示计算结果
                firstNumber = null;
                operator = '';
            }
        } else if (['+', '-', '*', '/'].includes(value)) {
            // 处理运算符
            if (firstNumber === null) {
                firstNumber = currentInput;  // 保存第一个数字
            } else if (operator) {
                // 如果之前有运算符，先进行运算再保存
                firstNumber = eval(firstNumber + operator + currentInput).toString();
            }
            operator = value;  // 设置当前运算符
            currentInput = '';  // 清空当前输入
            $('#calculator_result').text(firstNumber);  // 显示第一个数字（不显示运算符）
        } else if (value === '.') {
            // 处理小数点
            if (!currentInput.includes('.')) {
                currentInput += value;
                $('#calculator_result').text(currentInput);
            }
        } else {
            // 处理数字按钮
            currentInput += value;
            $('#calculator_result').text(currentInput);
        }
    });

    // 重置按钮
    $('#calculator_btn').click(function() {
        currentInput = '';  // 清空当前输入
        operator = '';  // 清空运算符
        firstNumber = null;  // 清空第一个数字
        $('#calculator_result').text('0');  // 重置显示框为 0
    });
    

});
