function $(id) {
  return document.getElementById(id);
}

function convertInfixToPostfix(infix) {
  var stack = [];
  var output = '';
  var precedence = {
    '*': 4,
    '/': 3,
    '+': 2,
    '-': 2,
    '(': 1,
  };

  for (var i = 0; i < infix.length; i++) {
    var c = infix[i];
    if (/\d/.test(c)) {
      output += c;
    } else if (c === '(') {
      stack.push(c)
    } else if (c === ')') {
      var top = stack.pop();
      while (top != '(') {
        output += top;
        top = stack.pop();
      }
    } else {
      while (stack.length > 0
        && precedence[stack[stack.length-1]] > precedence[c]) {
          output += stack.pop();
      }
      stack.push(c);
    }
  };

  while (stack.length > 0) {
    output += stack.pop();
  }
  return output;
}

function reverse(s) {
  for (var i = s.length - 1, o = ''; i >= 0; o += s[i--]);
  return o;
}

function convertInfixToPrefix(infix) {
  return reverse(convertInfixToPostfix(reverse(infix)))
}

function evaluatePostfix(postfix) {
  var stack = [];
  postfix.split('').forEach(function(token) {
    if (/\d/.test(token)) {
      stack.push(parseInt(token));
    } else {
      var operand2 = stack.pop();
      var operand1 = stack.pop();
      stack.push(evaluateOperator(token, operand1, operand2));
    }
  });
  return stack.pop()
}

function evaluateOperator(operator, operand1, operand2) {
  switch (operator) {
    case '*': return operand1 * operand2;;
    case '/': return operand1 / operand2;;
    case '+': return operand1 + operand2;;
    case '-': return operand1 - operand2;;
  }
}

function assertEq(msg, a, b) {
  console.log(msg + ":\t\t'" + a + "' == '" + b + "'");
  if (a !== b) {
    throw new Error("Value " + a + " is different from value " + b);
  }
}

function test() {
  assertEq('convertInfixToPostfix("2*3+4/5")',   convertInfixToPostfix("2*3+4/5"),   "23*45/+");
  assertEq('convertInfixToPostfix("2*(3+4)/5")', convertInfixToPostfix("2*(3+4)/5"), "234+*5/");
  assertEq('convertInfixToPrefix("2*3+4/5")',    convertInfixToPrefix("2*3+4/5"),    "+*23/45");
  //assertEq('convertInfixToPrefix("2*(3+4)/5")',  convertInfixToPrefix("2*(3+4)/5"),  "/*2+345");

  assertEq('evaluatePostfix("23*4+")',   evaluatePostfix("23*4+"),   10);
  assertEq('evaluatePostfix("94+1-2*")', evaluatePostfix("94+1-2*"), 24);
}

test();
