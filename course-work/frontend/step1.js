// Создание первого шага
export function createStep1 (steps, document, number1, number2) {
    const upp = steps[steps.length - 1];

    const newContainer = document.createElement('div'); // Создаем контейнер с новым шагом
    newContainer.className = 'container'; // Добавляем класс

    const anim = createAnim1(number1, number2); // Создаем анимацию
    newContainer.appendChild(anim); // Добавляем в контейнер

    const expl = createExplanations1(); // Создаем пояснения
    newContainer.appendChild(expl); // Добавляем в контейнер

    const downArrow = createArrow(newContainer, upp); // Создаем стрелочку
    document.body.appendChild(downArrow); // Добавляем стрелку

    
    document.body.appendChild(newContainer); // Добавляем новый шаг       
    steps.push(newContainer); // Добавляем шаг в массив

    // Запускаем анимацию через небольшой таймаут
    setTimeout(() => {
        newContainer.classList.add('visible');
    }, 10);
}


function createAnim1(number1, number2) {
    const anim = document.createElement('div');
    anim.className = 'animation'; // Добавляем класс

    const st = document.createElement('div');
    st.innerHTML = 'Step 1';
    st.className = 'heading';

    anim.appendChild(st);


    const l1 = document.createElement('div');
    l1.className = 'divider';
    anim.appendChild(l1);
    let str = 'First number: ';
    createStep1_number(anim, number1, str);
    const l2 = document.createElement('div');
    l2.className = 'divider';
    anim.appendChild(l2);
    str = 'Second number: ';
    createStep1_number(anim, number2, str);

    return anim;
}

function createStep1_number(anim, number, str) {
    const num = document.createElement('div');
    num.className = 'text';
    num.innerHTML = str + number;
    anim.appendChild(num);

    const s = document.createElement('div');
    s.className = 'arrow_down';
    s.innerHTML = '↓';

    anim.appendChild(s);
 
    const p = document.createElement('div');
    p.className = 'formuls';
    p.innerHTML = numberToPolynomial(number);

    anim.appendChild(p);

    const s1 = document.createElement('div');
    s1.className = 'arrow_down';
    s1.innerHTML = '↓';

    anim.appendChild(s1);

    const m = document.createElement('div');
    m.className = 'text';
    m.innerHTML = String(number).split('').map(Number).reverse();

    anim.appendChild(m);
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
    text.innerHTML = `
        <strong>1. Representing a Number as a Polynomial:</strong><br>
           A number (for example, 1234) is represented as a polynomial, where each digit is a coefficient of a specific power of \\( x \\):<br>
           $$1234 = 1x^3 + 2x^2 + 3x + 4$$
           <strong>2. Creating an Array of Coefficients:</strong><br>
           The coefficients of the polynomial are written into an array. For convenience when working with the FFT, the array is reversed, starting with the coefficient of the lowest power of \\( x \\):<br>
           $$[4, 3, 2, 1]$$
           This array will be used in the subsequent steps of the FFT for number multiplication.
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
    const digits = String(number).split(''); // Разбиваем число на цифры
    let polynomial = '';

    digits.forEach((digit, index) => {
        if (polynomial !== '') {
            polynomial += ' + ';
        }
        polynomial += `${digit} \\cdot x^{${digits.length - index - 1}}`;
    });

    return `$$${polynomial}$$`;
}