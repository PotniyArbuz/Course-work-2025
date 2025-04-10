import { createStep1 } from './step1.js';
import { createStep2 } from './step2.js';
import { createStep3 } from './step3.js';
import { createStep5 } from './step5.js';
import { createStep6 } from './step6.js';
import { createStep7 } from './step7.js';
import { createResult } from './result.js';

const steps = [];

function clearSteps() {
    console.log('Clearing previous steps...');
    steps.forEach(step => {
        if (step !== document.getElementById('begin')) {
            if (step.parentNode) {
                step.parentNode.removeChild(step);
            }
        }
    });
    steps.length = 0;

    document.querySelectorAll('.arrow-4').forEach(arrow => {
        if (arrow.parentNode) {
            arrow.parentNode.removeChild(arrow);
        }
    });
}

document.getElementById('submitButton').addEventListener('click', async function () {
    const number1 = document.getElementById('number1').value;
    const number2 = document.getElementById('number2').value;

    if (!number1 || !number2) {
        document.getElementById('result').innerText = 'Please enter valid numbers.';
        return;
    }

    clearSteps();
    document.getElementById('result').innerText = '';

    try {
        const response = await fetch('http://127.0.0.1:5000/multiply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number1, number2 })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data);
        document.getElementById('result').innerText = `Product: ${data.result}`;

        const intermediateSteps = data.intermediate_steps;

        steps.push(document.getElementById('begin'));

        createStep1(steps, document, number1, number2);
        createStep2(steps, document, number1, number2, intermediateSteps['a'], intermediateSteps['b']);
        createStep3(steps, document, data.A, 'first');
        createStep3(steps, document, data.B, 'second');
        createStep5(steps, document, data.A.output, data.B.output, intermediateSteps['C']);
        createStep6(steps, document, data.c_steps, intermediateSteps['r']);
        createStep7(steps, document, intermediateSteps['r']);
        createResult(steps, document, data.result);

        const containers = document.querySelectorAll('.animation');
        containers.forEach(container => {
            container.addEventListener('wheel', (event) => {
                event.preventDefault();
                container.scrollBy({
                    left: event.deltaY * 2.8,
                    behavior: 'smooth'
                });
            });
        });

        MathJax.typeset();
    } catch (error) {
        document.getElementById('result').innerText = 'An error occurred: ' + error.message;
        console.error('Fetch error:', error);
    }
});




function restrictInput(inputElement) {
    inputElement.addEventListener('keydown', function (e) {
        const allowedKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'
        ];
        
        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    });

    inputElement.addEventListener('paste', function (e) {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (!/^[0-9]*$/.test(pastedText)) {
            e.preventDefault();
        }
    });
}

restrictInput(document.getElementById('number1'));
restrictInput(document.getElementById('number2'));