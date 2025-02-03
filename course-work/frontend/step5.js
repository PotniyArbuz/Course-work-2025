// Создание пятого шага
export function createStep5 (steps, document, A, B, C) {
    const upp = steps[steps.length - 1];

    const newContainer = document.createElement('div'); // Создаем контейнер с новым шагом
    newContainer.className = 'container'; // Добавляем класс

    const anim = createAnim5(A, B, C); // Создаем анимацию
    newContainer.appendChild(anim); // Добавляем в контейнер

    const expl = createExplanations1(); // Создаем пояснения
    newContainer.appendChild(expl); // Добавляем в контейнер

    // Подготовка данных для графика
    const labels = A.map((_, index) => `Index ${index}`);
    const aData = A.map(c => ({ x: c.real, y: c.imag }));
    const bData = B.map(c => ({ x: c.real, y: c.imag }));
    const cData = C.map(c => ({ x: c.real, y: c.imag }));

    // Создание графика
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
            pointRadius: 4, // Размер точек
          },
          {
            label: 'B',
            data: bData,
            backgroundColor: 'rgb(0, 38, 255)',
            pointRadius: 4, // Размер точек
          },
          {
            label: 'C (A * B)',
            data: cData,
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            pointRadius: 4, // Размер точек
          },
        ],
      },
      options: {
        animation: {
            duration: 1000, // Длительность анимации
            easing: 'easeInOutQuad', // Тип анимации
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true, // Включить масштабирование с помощью колеса мыши
                        mode: 'xy', // Разрешить масштабирование по обеим осям
                    },
                    /*drag: {
                        enabled: true, // Включить масштабирование с помощью перетаскивания
                        mode: 'xy', // Разрешить масштабирование по обеим осям
                    },*/
                    pinch: {
                        enabled: true, // Включить масштабирование с помощью жестов
                        mode: 'xy', // Разрешить масштабирование по обеим осям
                    }
                },
                pan: {
                    enabled: true,
                    mode: 'xy', // Разрешить панорамирование по обеим осям
                }
            },
            title: {
                display: true, // Включить заголовок
                text: 'Chart of Array Coefficients', // Текст заголовка
                font: {
                    size: 18, // Размер шрифта
                    weight: 'bold', // Жирный шрифт
                },
                padding: {
                    top: 10,
                    bottom: 20, // Отступы
                },
                color: 'black', // Цвет текста
            },
            legend: {
                labels: {
                  color: 'black', // Цвет текста всех меток в легенде
                  font: {
                    size: 14,

                  },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true, // Включить подпись оси X
                    text: 'Re (Real Part)', // Текст подписи
                    color: 'black', // Цвет текста
                    font: {
                        size: 14, // Размер шрифта
                        weight: 'bold', // Жирный шрифт
                    },
                    padding: { top: 10, bottom: 10 }, // Отступы
                },
                type: 'linear',
                position: 'bottom',
                grid: {
                    color: 'rgba(0, 0, 0, 0.5)', // Цвет сетки по оси X
                    lineWidth: 1,
                },
                ticks: {
                    color: 'black', // Цвет чисел на оси X
                },
                border: {
                    color: 'black', // Цвет оси X
                },
            },
            y: {
                title: {
                    display: true, // Включить подпись оси Y
                    text: 'Im (Imaginary Part)', // Текст подписи
                    color: 'black', // Цвет текста
                    font: {
                        size: 14, // Размер шрифта
                        weight: 'bold', // Жирный шрифт
                    },
                    padding: { top: 10, bottom: 10 }, // Отступы
                },
                type: 'linear',
                position: 'left',
                grid: {
                    color: 'rgba(0, 0, 0, 0.5)', // Цвет сетки по оси Y
                    lineWidth: 1,
                },
                ticks: {
                    color: 'black', // Цвет чисел на оси Y
                },
                border: {
                    color: 'black', // Цвет оси Y
                },
            },
        },
    },
    });
    newContainer.appendChild(q);

    const downArrow = createArrow(newContainer, upp); // Создаем стрелочку
    document.body.appendChild(downArrow); // Добавляем стрелку
    document.body.appendChild(newContainer); // Добавляем новый шаг
                
    steps.push(newContainer); // Добавляем шаг в массив

    // Запускаем анимацию через небольшой таймаут
    setTimeout(() => {
        newContainer.classList.add('visible');
    }, 10);
}


function createAnim5(A, B, C) {

    const anim = document.createElement('div');
    anim.className = 'animation'; // Добавляем класс

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

function createExplanations1() {
    const expl = document.createElement('div');
    expl.className = 'explanations'; // Добавляем класс

    const heading = document.createElement('div');
    heading.innerHTML = 'Explanation';
    heading.className = 'heading';

    const l1 = document.createElement('div');
    l1.className = 'divider';

    const text = document.createElement('div');
    text.innerHTML = `After applying FFT to the arrays A and B, we obtain their frequency-domain representations. The next step is to perform <strong>element-wise multiplication</strong> of these transformed arrays. Here's how it works:<br>
    <br><strong>1. What is Element-wise Multiplication?</strong><br>
    Element-wise multiplication means multiplying corresponding elements of two arrays. If \\(A_{FFT}\\) and \\(B_{FFT}\\) are the FFT-transformed arrays, their element-wise product \\(C_{FFT}\\) is calculated as:<br>
    $$C_{FFT}[i] = A_{FFT}[i] \\cdot B_{FFT}[i], \\quad for\\; each\\; index\\; i$$
    <strong>2. Why Do We Do This?</strong><br>
    In the frequency domain, element-wise multiplication corresponds to <strong>convolution</strong> in the time domain. Since multiplying two polynomials (or numbers) is equivalent to convolving their coefficient arrays, this step effectively computes the product of the two original numbers.
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

// Функция для форматирования комплексного числа в строку
function formatComplex(a) {
    if (a.imag < 0)
        return `${a.real} - ${-a.imag}i`;
    return `${a.real} + ${a.imag}i`;
}