import { createArrow, createExplanations } from './utils.js';

export function createStep5(steps, document, A, B, C) {
    const upp = steps[steps.length - 1];

    const newContainer = document.createElement('div');
    newContainer.className = 'container';

    const anim = createAnim5(A, B, C);
    newContainer.appendChild(anim);

    const expl = createExplanations(5);
    newContainer.appendChild(expl);

    const labels = A.map((_, index) => `Index ${index}`);
    const aData = A.map(c => ({ x: c.real, y: c.imag }));
    const bData = B.map(c => ({ x: c.real, y: c.imag }));
    const cData = C.map(c => ({ x: c.real, y: c.imag }));

    const q = document.createElement('canvas');
    q.className = 'plot';
    const ctx = q.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'A',
                    data: aData,
                    backgroundColor: 'rgb(255, 255, 255)',
                    pointRadius: 4,
                },
                {
                    label: 'B',
                    data: bData,
                    backgroundColor: 'rgb(0, 38, 255)',
                    pointRadius: 4,
                },
                {
                    label: 'C (A * B)',
                    data: cData,
                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                    pointRadius: 4,
                },
            ],
        },
        options: {
            animation: {
                duration: 1000,
                easing: 'easeInOutQuad',
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                            mode: 'xy',
                        },
                        pinch: {
                            enabled: true,
                            mode: 'xy',
                        }
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                },
                title: {
                    display: true,
                    text: 'Chart of Array Coefficients',
                    font: {
                        size: 18,
                        weight: 'bold',
                    },
                    padding: {
                        top: 10,
                        bottom: 20,
                    },
                    color: 'black',
                },
                legend: {
                    labels: {
                        color: 'black',
                        font: {
                            size: 14,
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Re (Real Part)',
                        color: 'black',
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                        padding: { top: 10, bottom: 10 },
                    },
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineWidth: 1,
                    },
                    ticks: {
                        color: 'black',
                    },
                    border: {
                        color: 'black',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Im (Imaginary Part)',
                        color: 'black',
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                        padding: { top: 10, bottom: 10 },
                    },
                    type: 'linear',
                    position: 'left',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineWidth: 1,
                    },
                    ticks: {
                        color: 'black',
                    },
                    border: {
                        color: 'black',
                    },
                },
            },
        },
    });
    newContainer.appendChild(q);

    const downArrow = createArrow(newContainer, upp);
    document.body.appendChild(downArrow);
    document.body.appendChild(newContainer);

    steps.push(newContainer);

    setTimeout(() => {
        newContainer.classList.add('visible');
    }, 10);
}

function createAnim5(A, B, C) {
    const anim = document.createElement('div');
    anim.className = 'animation';

    const st = document.createElement('div');
    st.innerHTML = 'Step 5';
    st.className = 'heading';

    anim.appendChild(st);

    const l1 = document.createElement('div');
    l1.className = 'divider';
    anim.appendChild(l1);

    createStep5_array(anim, A, B, C);

    return anim;
}

function createStep5_array(anim, A, B, C) {
    const cards = document.createElement('div');
    cards.className = 'cards-row';
    A.forEach((a, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>Index: ${index}</h3>
            <p><strong>A[${index}]:</strong> ${formatComplex(a)}</p>
            <p><strong>B[${index}]:</strong> ${formatComplex(B[index])}</p>
            <p><strong>C[${index}] = A[${index}] \u00D7 B[${index}] = </strong> ${formatComplex(C[index])}</p>
        `;
        cards.appendChild(card);
    });
    anim.appendChild(cards);
}

function formatComplex(a) {
    if (a.imag < 0) return `${a.real.toFixed(3)} - ${(-a.imag).toFixed(3)}i`;
    return `${a.real.toFixed(3)} + ${a.imag.toFixed(3)}i`;
}