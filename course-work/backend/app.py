from flask import Flask, request, jsonify
from flask_cors import CORS
import cmath
import numpy as np

app = Flask(__name__)
CORS(app)

def complex_to_dict(c):
    """Преобразует комплексное число в словарь."""
    if isinstance(c, complex):
        return {'real': c.real, 'imag': c.imag}
    return c

def convert_fft_steps(steps):
    """
    Рекурсивно преобразует все комплексные числа в структуре шагов БПФ.

    :param steps: Структура шагов БПФ (словарь).
    :return: Структура шагов с преобразованными комплексными числами.
    """
    if not isinstance(steps, dict):
        return steps

    # Преобразуем все поля, содержащие комплексные числа
    for key, value in steps.items():
        if isinstance(value, dict):
            # Рекурсивно обрабатываем вложенные структуры
            steps[key] = convert_fft_steps(value)
        elif isinstance(value, list):
            # Обрабатываем списки (например, если есть вложенные списки)
            steps[key] = [complex_to_dict(item) for item in value]
        elif isinstance(value, (complex, int, float)):
            # Преобразуем одиночные комплексные числа
            steps[key] = complex_to_dict(value)

    return steps


def fft(a, depth=0, step_id=0):
    n = len(a)
    steps = {
        'id': step_id,
        'depth': depth,
        'input': a.copy(),
        'even': None,
        'odd': None,
        'twiddle_factors': [],
        'output': None
    }
    
    if n <= 1:
        steps['output'] = a
        return steps
    
    # Рекурсивное разбиение
    steps_even = fft(a[0::2], depth+1, step_id*2+1)
    steps_odd = fft(a[1::2], depth+1, step_id*2+2)
    
    even = steps_even['output']
    odd = steps_odd['output']
    
    # Вычисление поворотных множителей
    T = []
    for k in range(n // 2):
        twiddle = cmath.exp(-2j * cmath.pi * k / n)
        T.append(twiddle * odd[k])
    
    # Объединение результатов
    result = (
        [even[k] + T[k] for k in range(n // 2)] +
        [even[k] - T[k] for k in range(n // 2)]
    )
    
    steps.update({
        'even': steps_even,
        'odd': steps_odd,
        'twiddle_factors': T,
        'output': result
    })
    
    return steps

def ifft(a):
    n = len(a)
    a_conj = [x.conjugate() for x in a]
    y = fft(a_conj)
    return [x.conjugate() / n for x in y['output']]

def multiply(a, b):
    # Находим длину, достаточную для хранения результата
    n = 1
    while n < len(a) + len(b) - 1:
        n *= 2

    # Дополняем массивы нулями
    a = a + [0] * (n - len(a))
    b = b + [0] * (n - len(b))

    # Применяем БПФ
    A = fft(a)
    B = fft(b)

    # Умножаем в частотной области
    C = [A['output'][i] * B['output'][i] for i in range(n)]

    # Применяем обратное БПФ
    c = ifft(C)

    # Округляем и преобразуем в целые числа
    result = [int(round(x.real)) for x in c]
    
    r = result.copy()

    # Обработка переноса
    for i in range(len(result) - 1):
        if result[i] < 0:
            result[i] += 10
            result[i + 1] -= 1
        result[i + 1] += result[i] // 10
        result[i] %= 10

    # Удаляем ведущие нули
    while len(result) > 1 and result[-1] == 0:
        result.pop()

    return result[::-1], r, a, b, A, B, C, c

@app.route('/multiply', methods=['POST'])
def multiply_numbers():
    data = request.get_json()
    number1 = data.get('number1')
    number2 = data.get('number2')

    # Преобразуем строки в массивы цифр
    a_array = [int(digit) for digit in number1][::-1]
    b_array = [int(digit) for digit in number2][::-1]

    # Умножаем
    result_array, r, a, b, A, B, C, c = multiply(a_array, b_array)

    # Преобразуем массив обратно в строку
    result = ''.join(map(str, result_array))
    
    A = convert_fft_steps(A)
    B = convert_fft_steps(B)
    

    # Формируем ответ с промежуточными результатами
    response = {
        'result': result,
        'intermediate_steps': {
            'r': r,
            'a': a,
            'b': b,
            'C': [complex_to_dict(complex(c)) for c in C],
            'c': [round(x.real) for x in c]  # Округляем для удобства
        },
        'A': A,
        'B': B
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)