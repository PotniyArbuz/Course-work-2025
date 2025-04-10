import { createArrow, createExplanations } from './utils.js';

export function createStep2(steps, document, number1, number2, a, b) {
    const upp = steps[steps.length - 1];

    const newContainer = document.createElement('div');
    newContainer.className = 'container';

    const anim = createAnim2(number1, number2, a, b);
    newContainer.appendChild(anim);

    const expl = createExplanations(2);
    newContainer.appendChild(expl);

    const downArrow = createArrow(newContainer, upp);
    document.body.appendChild(downArrow);
    document.body.appendChild(newContainer);

    steps.push(newContainer);

    setTimeout(() => {
        newContainer.classList.add('visible');
    }, 10);
}

function createAnim2(number1, number2, a, b) {
    const n1 = String(number1).split('').map(Number).reverse();
    const n2 = String(number2).split('').map(Number).reverse();

    const anim = document.createElement('div');
    anim.className = 'animation';

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