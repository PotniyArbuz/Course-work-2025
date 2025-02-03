// Создание второго шага
export function createStep2 (steps, document, number1, number2, a, b) {
    const upp = steps[steps.length - 1];

    const newContainer = document.createElement('div'); // Создаем контейнер с новым шагом
    newContainer.className = 'container'; // Добавляем класс

    const anim = createAnim2(number1, number2, a, b); // Создаем анимацию
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


function createAnim2(number1, number2, a, b) {
    const n1 = String(number1).split('').map(Number).reverse();
    const n2 = String(number2).split('').map(Number).reverse();


    const anim = document.createElement('div');
    anim.className = 'animation'; // Добавляем класс

    const st = document.createElement('div');
    st.innerHTML = 'Step 2';
    st.className = 'heading';

    anim.appendChild(st);


    const l1 = document.createElement('div');
    l1.className = 'divider';
    anim.appendChild(l1);
    let str = 'First array: ';
    createStep2_array(anim, n1, str, a);
    const l2 = document.createElement('div');
    l2.className = 'divider';
    anim.appendChild(l2);
    str = 'Second array: ';
    createStep2_array(anim, n2, str, b);

    return anim;
}

function createStep2_array(anim, n, str, a) {
    const num = document.createElement('div');
    num.className = 'text';
    num.innerHTML = str + n;
    anim.appendChild(num);

    const s = document.createElement('div');
    s.className = 'arrow_down';
    s.innerHTML = '↓';

    anim.appendChild(s);

    const m = document.createElement('div');
    m.className = 'text';
    m.innerHTML = a;

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
    text.innerHTML = `<strong>1. Determining the Final Array Length:</strong><br>
    When multiplying two numbers, the length of the final array will be equal to the sum of the lengths of the original arrays. For example, for numbers of length <strong>n</strong> and <strong>m</strong>, the final length is <strong>n + m</strong>. Then, we choose the nearest power of two that is greater than or equal to this length.
    <br><br><strong>2. Adding Zeros to the End of Arrays:</strong><br>
    To make the length of the arrays equal to the chosen power of two, we pad them with zeros. This is called zero-padding.
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