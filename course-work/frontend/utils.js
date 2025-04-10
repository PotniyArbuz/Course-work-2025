export function createArrow(newContainer, upp) {
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
            newContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            upp.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    return downArrow;
}

export function createExplanations(stepNumber) {
    const expl = document.createElement('div');
    expl.className = 'explanations';

    const heading = document.createElement('div');
    heading.innerHTML = 'Explanation';
    heading.className = 'heading';

    const l1 = document.createElement('div');
    l1.className = 'divider';

    const text = document.createElement('div');
    text.className = 'text-expl';

    switch (stepNumber) {
        case 1:
            text.innerHTML = `
                <strong>1. Representing a Number as a Polynomial:</strong><br>
                A number (for example, 1234) is represented as a polynomial, where each digit is a coefficient of a specific power of \\( x \\):<br>
                $$1234 = 1x^3 + 2x^2 + 3x + 4$$
                <strong>2. Creating an Array of Coefficients:</strong><br>
                The coefficients of the polynomial are written into an array. For convenience when working with the FFT, the array is reversed, starting with the coefficient of the lowest power of \\( x \\):<br>
                $$[4, 3, 2, 1]$$
                This array will be used in the subsequent steps of the FFT for number multiplication.
            `;
            break;
        case 2:
            text.innerHTML = `
                <strong>1. Determining the Final Array Length:</strong><br>
                When multiplying two numbers, the length of the final array will be equal to the sum of the lengths of the original arrays. For example, for numbers of length <strong>n</strong> and <strong>m</strong>, the final length is <strong>n + m</strong>. Then, we choose the nearest power of two that is greater than or equal to this length.
                <br><br><strong>2. Adding Zeros to the End of Arrays:</strong><br>
                To make the length of the arrays equal to the chosen power of two, we pad them with zeros. This is called zero-padding.
            `;
            break;
        case 5:
            text.innerHTML = `
                After applying FFT to the arrays A and B, we obtain their frequency-domain representations. The next step is to perform <strong>element-wise multiplication</strong> of these transformed arrays. Here's how it works:<br>
                <br><strong>1. What is Element-wise Multiplication?</strong><br>
                Element-wise multiplication means multiplying corresponding elements of two arrays. If \\(A_{FFT}\\) and \\(B_{FFT}\\) are the FFT-transformed arrays, their element-wise product \\(C_{FFT}\\) is calculated as:<br>
                $$C_{FFT}[i] = A_{FFT}[i] \\cdot B_{FFT}[i], \\quad for\\; each\\; index\\; i$$
                <strong>2. Why Do We Do This?</strong><br>
                In the frequency domain, element-wise multiplication corresponds to <strong>convolution</strong> in the time domain. Since multiplying two polynomials (or numbers) is equivalent to convolving their coefficient arrays, this step effectively computes the product of the two original numbers.
            `;
            break;
        case 7:
            text.innerHTML = `
                We have received an array of coefficients that represent the result of multiplying two numbers. However, these coefficients may be greater than 9, which requires carrying over digits (similar to traditional column multiplication). After that, we need to remove leading zeros to obtain the final result:
                <br><br><strong>1. Carrying Over Digits:</strong><br>
                We traverse the array of coefficients from right to left. If an element is greater than 9, we divide it by 10: the integer part is added to the next element, while the remainder stays in the current element.
                <br><br><strong>2. Removing Leading Zeros:</strong><br>
                We remove all zeros at the beginning of the array, leaving only significant digits. This gives us the final result without any unnecessary zeros.
                <br><br><strong>Conclusion: </strong> The array of coefficients is transformed into the final number.
            `;
            break;
        default:
            text.innerHTML = 'Explanation not available for this step.';
    }

    expl.appendChild(heading);
    expl.appendChild(l1);
    expl.appendChild(text);
    return expl;
}