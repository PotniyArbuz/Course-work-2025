import { createArrow, createExplanations } from './utils.js';

export function createStep1(steps, document, number1, number2) {
    const upp = steps[steps.length - 1];

    const newContainer = document.createElement('div');
    newContainer.className = 'container';

    const anim = createAnim1(number1, number2);
    newContainer.appendChild(anim);

    const expl = createExplanations(1);
    newContainer.appendChild(expl);

    const downArrow = createArrow(newContainer, upp);
    document.body.appendChild(downArrow);
    document.body.appendChild(newContainer);

    steps.push(newContainer);

    setTimeout(() => {
        newContainer.classList.add('visible');
    }, 10);
}

function createAnim1(number1, number2) {
    const anim = document.createElement('div');
    anim.className = 'animation';

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

function numberToPolynomial(number) {
    const digits = String(number).split('');
    let polynomial = '';

    digits.forEach((digit, index) => {
        if (polynomial !== '') {
            polynomial += ' + ';
        }
        polynomial += `${digit} \\cdot x^{${digits.length - index - 1}}`;
    });

    return `$$${polynomial}$$`;
}