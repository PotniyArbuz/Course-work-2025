import { createStep1 } from './step1.js';
import { createStep2 } from './step2.js';
import { createStep3 } from './step3.js';
import { createStep5 } from './step5.js';
import { createStep7 } from './step7.js';

document.getElementById('submitButton').addEventListener('click', function () {
    const number1 = document.getElementById('number1').value;
    const number2 = document.getElementById('number2').value;

    if (!number1 || !number2) {
        document.getElementById('result').innerText = 'Please enter valid numbers.';
        return;
    }

    fetch('http://127.0.0.1:5000/multiply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number1: number1, number2: number2 })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = `Product: ${data.result}`;

            const intermediateSteps = data.intermediate_steps;

            // Массив ключей, которые вы хотите использовать
            const keys = ['a', 'b', 'A', 'B', 'C', 'c'];

            const steps = [document.getElementById('begin')];



            createStep1(steps, document, number1, number2); // Первый шаг
            createStep2(steps, document, number1, number2, intermediateSteps['a'], intermediateSteps['b']); // Второй шаг
            createStep3(steps, document, data.A, data.B);
            createStep5(steps, document, data.A.output, data.B.output, intermediateSteps['C']);
            createStep7(steps, document, intermediateSteps['r']);

            // Находим все контейнеры с классом .animation
            const containers = document.querySelectorAll('.animation');

            // Добавляем обработчик события wheel для каждого контейнера
            containers.forEach(container => {
                container.addEventListener('wheel', (event) => {
                    event.preventDefault(); // Отменяем стандартное поведение прокрутки
                    container.scrollBy({
                        left: event.deltaY * 2.8, // Прокручиваем по горизонтали на величину deltaY (вертикальная прокрутка мыши)
                        behavior: 'smooth' // Плавная прокрутка
                    });
                });
            });

            MathJax.typeset();
        })
        .catch(error => {
            document.getElementById('result').innerText = 'An error occurred: ' + error.message;
            console.error('Error:', error);
        });
});







// Функция для кастомной плавной прокрутки
function smoothScroll(element, distance, duration) {
    const start = element.scrollLeft;
    const startTime = performance.now();

    function scrollStep(timestamp) {
        const currentTime = timestamp - startTime;
        const progress = currentTime / duration;
        element.scrollLeft = start + distance * progress;

        if (currentTime < duration) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}
