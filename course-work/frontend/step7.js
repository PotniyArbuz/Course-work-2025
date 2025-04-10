import { createArrow, createExplanations } from './utils.js';

export function createStep7(steps, document, res) {
    const upp = steps[steps.length - 1];

    const newContainer = document.createElement('div');
    newContainer.className = 'container';

    const downArrow = createArrow(newContainer, upp);
    document.body.appendChild(downArrow);
    document.body.appendChild(newContainer);

    createAnim7(res, newContainer);

    const expl = createExplanations(7);
    newContainer.appendChild(expl);

    steps.push(newContainer);

    setTimeout(() => {
        newContainer.classList.add('visible');
    }, 10);
}

function createAnim7(r, newContainer) {
    const anim = document.createElement('div');
    anim.className = 'animation';
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

    const arrayContainer = document.createElement('div');
    arrayContainer.id = 'array-container';
    arrayContainer.className = 'array-container';

    anim.appendChild(arrayContainer);
    anim.appendChild(controls);

    let steps = [];
    let currentStep = 0;

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
        for (let i = 0; i < newArray.length - 1; i++) {
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

    performCarry(r);

    function nextStep() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            arrayContainer.innerHTML = '';
            arrayContainer.appendChild(steps[currentStep]);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            arrayContainer.innerHTML = '';
            arrayContainer.appendChild(steps[currentStep]);
        }
    }

    arrayContainer.appendChild(steps[currentStep]);
}