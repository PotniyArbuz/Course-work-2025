// Создание седьмого шага
export function createStep7 (steps, document, res) {
    const upp = steps[steps.length - 1];

    const newContainer = document.createElement('div'); // Создаем контейнер с новым шагом
    newContainer.className = 'container'; // Добавляем класс

    const downArrow = createArrow(newContainer, upp); // Создаем стрелочку
    document.body.appendChild(downArrow); // Добавляем стрелку
    document.body.appendChild(newContainer); // Добавляем новый шаг 

    createAnim7(res, newContainer); // Создаем анимацию

    const expl = createExplanations1(); // Создаем пояснения
    newContainer.appendChild(expl); // Добавляем в контейнер

          
    steps.push(newContainer); // Добавляем шаг в массив

    // Запускаем анимацию через небольшой таймаут
    setTimeout(() => {
        newContainer.classList.add('visible');
    }, 10);
}


function createAnim7(r, newContainer) {
    const anim = document.createElement('div');
    anim.className = 'animation'; // Добавляем класс
    newContainer.appendChild(anim);

    const st = document.createElement('div');
    st.innerHTML = 'Step 7';
    st.className = 'heading';

    anim.appendChild(st);

    const l1 = document.createElement('div');
    l1.className = 'divider';
    anim.appendChild(l1);


    const controls = document.createElement('div');
    controls.className = 'controls';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Back';
    prevButton.addEventListener('click', prevStep);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', nextStep);

    controls.appendChild(prevButton);
    controls.appendChild(nextButton);

    // Создаем контейнер для массива
    const arrayContainer = document.createElement('div');
    arrayContainer.id = 'array-container';
    arrayContainer.className = 'array-container';

    
    anim.appendChild(arrayContainer);
    anim.appendChild(controls);

    let steps = []; // Шаги для визуализации
        let currentStep = 0;

        // Функция для выполнения переноса
        function performCarry(array) {
            let newArray = [...array];
            const start = document.createElement('div');
            start.className = 'array-container';
            for (let j = 0; j < newArray.length; j++) {
                const element = document.createElement('div');
                element.className = 'array-element';
                element.textContent = newArray[j];
                start.appendChild(element);
            }
            const childrenArray = Array.from(start.children);
            childrenArray.reverse().forEach(child => start.appendChild(child));
            steps.push(start);
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i] >= 10) {
                    const a = document.createElement('div');
                    a.className = 'array-container';
                    for (let j = 0; j < newArray.length; j++) {
                        const element = document.createElement('div');
                        element.className = 'array-element';
                        element.textContent = newArray[j];
                        if (i === j) {
                            element.classList.add('carry');
                        }
                        a.appendChild(element);
                    }
                    const childrenArray = Array.from(a.children);
                    childrenArray.reverse().forEach(child => a.appendChild(child));
                    steps.push(a);

                    newArray[i + 1] += Math.floor(newArray[i] / 10);
                    newArray[i] = newArray[i] % 10;

                    const b = document.createElement('div');
                    b.className = 'array-container';
                    for (let j = 0; j < newArray.length; j++) {
                        const element = document.createElement('div');
                        element.className = 'array-element';
                        element.textContent = newArray[j];
                        b.appendChild(element);
                    }
                    const childrenArray1 = Array.from(b.children);
                    childrenArray1.reverse().forEach(child => b.appendChild(child));
                    steps.push(b);
                }
            }
            let i = newArray.length - 1;
            while (i > 0 && newArray[i] === 0) {
                i--;
            }
            const end = document.createElement('div');
            end.className = 'array-container';
            for (let j = i; j >= 0; j--) {
                const element = document.createElement('div');
                element.className = 'array-element';
                element.textContent = newArray[j];
                end.appendChild(element);
            }
            steps.push(end);
        }

        // Функция для удаления ведущих нулей
        function removeLeadingZeros(array) {
            let i = 0;
            while (i < array.length - 1 && array[i] === 0) {
                steps.push({ type: 'remove', index: i });
                i++;
            }
            return array.slice(i);
        }

        // Инициализация шагов
        performCarry(r);

        // Отображение массива
        function renderArray(array, step) {
            const container = document.getElementById('array-container');
            container.innerHTML = '';
            array.forEach((value, index) => {
                const element = document.createElement('div');
                element.className = 'array-element';
                element.textContent = value;
                if (step.type === 'carry' && step.index === index) {
                    element.classList.add('carry');
                }
                if (step.type === 'remove' && step.index === index) {
                    element.classList.add('fade-out');
                }
                container.appendChild(element);
            });
        }

        // Переход к следующему шагу
        function nextStep() {
            if (currentStep < steps.length - 1) {
                currentStep++;
                arrayContainer.innerHTML = '';
                arrayContainer.appendChild(steps[currentStep]);
            }
        }

        // Переход к предыдущему шагу
        function prevStep() {
            if (currentStep > 0) {
                currentStep--;
                arrayContainer.innerHTML = '';
                arrayContainer.appendChild(steps[currentStep]);
            }
        }

        // Инициализация
        arrayContainer.appendChild(steps[currentStep]);

}


function createExplanations1() {
    const expl = document.createElement('div');
    expl.className = 'explanations'; // Добавляем класс

    const heading = document.createElement('div');
    heading.innerHTML = 'Explanation';
    heading.className = 'heading';

    const l1 = document.createElement('div');
    l1.className = 'divider';

    const text = document.createElement('div');
    text.innerHTML = `We have received an array of coefficients that represent the result of multiplying two numbers. However, these coefficients may be greater than 9, which requires carrying over digits (similar to traditional column multiplication). After that, we need to remove leading zeros to obtain the final result:
    <br><br><strong>1. Carrying Over Digits:</strong><br>
    We traverse the array of coefficients from right to left. If an element is greater than 9, we divide it by 10: the integer part is added to the next element, while the remainder stays in the current element.
    <br><br><strong>2. Removing Leading Zeros:</strong><br>
    We remove all zeros at the beginning of the array, leaving only significant digits. This gives us the final result without any unnecessary zeros.
    <br><br><strong>Conclusion: </strong> The array of coefficients is transformed into the final number.
    `;
    text.className = 'text-expl';

    expl.appendChild(heading);
    expl.appendChild(l1);
    expl.appendChild(text);
    return expl;
}


function createArrow(newContainer, upp) {
    const downArrow = document.createElement('div');
    downArrow.className = 'arrow-4';
    const q1 = document.createElement('span');
    q1.className = 'arrow-4-left';
    const q2 = document.createElement('span');
    q2.className = 'arrow-4-right';
    downArrow.appendChild(q1);
    downArrow.appendChild(q2);
    downArrow.addEventListener('click', () => {
        downArrow.classList.toggle('open');
        if (downArrow.classList.contains('open')) {
            // Если стрелка вниз — скролл вниз
            newContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Если стрелка вверх — скролл вверх
            upp.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    return downArrow;
}


// Функция для преобразования числа в многочлен
function numberToPolynomial(number) {
    const digits = String(number).split('').reverse(); // Разбиваем число на цифры и переворачиваем
    let polynomial = '';

    digits.forEach((digit, index) => {
        if (digit !== '0') {
            if (polynomial !== '') {
                polynomial += ' + ';
            }
            polynomial += `${digit} \\cdot x^{${index}}`;
        }
    });

    return `$$${polynomial}$$`;
}