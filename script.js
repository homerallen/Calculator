$(document).ready(function() {
  var current = 0;
  var history = " ";
  var queue = [];
  var num1;
  var num2;
  var total;
  var operand;

  $("#AC").click(function() {
    queue = [];
    current = 0;
    history = " ";
    updateDisplay();
  });

  $("#CE").click(function() {
    current = 0;
    updateDisplay();
  });

  $(".number").click(function(e) {
    processNumber(event.currentTarget.id);
  });

  $(".operand").click(function(e) {
    processOperand(event.currentTarget.id);
  });

  $("#decimal").click(function() {
    if (!containsDecimal(current)) {
      processDecimal();
    }
  });

  $("#equals").click(function() {
    if (!containsEquals(history) && isNumber(current) && queue.length !== 0) {
      processEquals();
    }
  });

  function processNumber(strNum) {
    if (history === "Limit Exceeded") {
      history = " ";
      current = strNum;
    } else if (current === 0 || !isNumber(current)) {
      current = strNum;
    } else if (isNumber(current) && current.length <= 8 && history.length <= 16) {
      current += strNum;
    } else {
      current = 0;
      queue = [];
      history = "Limit Exceeded";
    }
    updateDisplay();
  }

  function processOperand(strOp) {
    if (history === "Limit Exceeded") {
      history = 0;
    }

    if (isNumber(parseFloat(current))) {
      queue.push(parseFloat($("#current").text()));

      if (!/\=+/.test(history)) {
        history += parseFloat($("#current").text());
      } else {
        history = parseFloat($("#current").text());
      }

      switch (strOp) {
        case "add":
          current = "+";
          history += "+";
          queue.push("+");
          break;
        case "subtract":
          current = "-";
          history += "-";
          queue.push("-");
          break;
        case "divide":
          current = "/";
          history += "/";
          queue.push("/");
          break;
        case "multiply":
          current = "*";
          history += "*";
          queue.push("*");
          break;
      }
    }
    updateDisplay();
  }

  function processDecimal() {
    current += ".";
    updateDisplay();
  }

  function processEquals() {
    var divideByZero;
    queue.push(parseFloat($("#current").text()));
    history += parseFloat($("#current").text());
    history += "=";

    while (queue.length >= 3) {
      num1 = queue.shift();
      operand = queue.shift();
      num2 = queue.shift();
      switch (operand) {
        case "+":
          total = num1 + num2;
          break;
        case "-":
          total = num1 - num2;
          break;
        case "/":
          if (num2 === 0) {
            divideByZero = true;
          } else {
            total = num1 / num2;
          }
          break;
        case "*":
          total = num1 * num2;
          break;
      }

      queue.unshift(total);
    }

    if (divideByZero === true) {
      current = "Cannot divide by zero!"
      history = " ";
    } else if (containsDecimal(total.toString())) {
      current = total.toFixed(4);
      history += total.toFixed(4);
    } else {
      current = total;
      history += parseInt(total);
    }

    total = 0;
    queue = [];
    updateDisplay();
  }

  function updateDisplay() {
    $("#current").text(current);
    $("#history").text(history);
  }

  function isNumber(str) {
    return /\d+/.test(str);
  }

  function containsDecimal(str) {
    return /\.+/.test(str);
  }

  function containsEquals(str) {
    return /\=+/.test(str);
  }
});