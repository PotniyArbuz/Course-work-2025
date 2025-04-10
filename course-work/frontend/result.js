import { createArrow } from './utils.js';

export function createResult(steps, document, result) {
    const container = document.createElement('div');
    container.className = 'result-container';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '20px';
    container.style.background = '#c5c9d3';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.15)';
    container.style.maxWidth = '800px';
    container.style.margin = '20px auto';

    const title = document.createElement('p');
    title.innerHTML = `<strong>Final Results</strong>`;
    title.style.marginBottom = '20px';
    title.style.fontFamily = 'Times New Roman, Times, serif';
    title.style.fontSize = '20px';
    container.appendChild(title);

    const resultText = document.createElement('p');
    resultText.innerHTML = `<strong>Multiplication Result:</strong> \\(${result}\\)`;
    resultText.style.fontSize = '20px';
    resultText.style.fontFamily = 'Times New Roman, Times, serif';
    resultText.style.marginBottom = '20px';
    container.appendChild(resultText);

    const explanation = document.createElement('p');
    explanation.innerHTML = `
        The algorithm used is based on the Fast Fourier Transform (FFT) for multiplying large numbers. 
        More about this method can be read in the article on 
        <a href="http://e-maxx.ru/algo/fft_multiply" target="_blank" style="color: #0066cc; text-decoration: underline;">
            e-maxx.ru
        </a>.
    `;

    explanation.style.textAlign = 'center';
    explanation.style.fontFamily = 'Times New Roman, Times, serif';
    explanation.style.fontSize = '18px';
    explanation.style.lineHeight = '1.5';
    container.appendChild(explanation);

    const downArrow = createArrow(container, steps[steps.length - 1]);
    document.body.appendChild(downArrow);

    const c = document.createElement('div');
    c.className = 'container';
    c.appendChild(container);

    document.body.appendChild(c);

    steps.push(c);

    setTimeout(() => {
        c.classList.add('visible');
    }, 10);
}