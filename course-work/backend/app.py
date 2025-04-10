from flask import Flask, request, jsonify
from flask_cors import CORS
import cmath
import numpy as np

app = Flask(__name__)
CORS(app)

def complex_to_dict(c):
    if isinstance(c, complex):
        return {'real': c.real, 'imag': c.imag}
    elif isinstance(c, (int, float)):
        return {'real': float(c), 'imag': 0.0}
    return c

def convert_fft_steps(steps):
    if not isinstance(steps, dict):
        return steps
    for key, value in steps.items():
        if isinstance(value, dict):
            steps[key] = convert_fft_steps(value)
        elif isinstance(value, list):
            steps[key] = [complex_to_dict(item) for item in value]
        elif isinstance(value, (complex, int, float)):
            if key in ('id', 'depth'):
                steps[key] = value
            else:
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
    
    steps_even = fft(a[0::2], depth+1, step_id*2+1)
    steps_odd = fft(a[1::2], depth+1, step_id*2+2)
    
    even = steps_even['output']
    odd = steps_odd['output']
    
    T = []
    for k in range(n // 2):
        twiddle = cmath.exp(-2j * cmath.pi * k / n)
        T.append(twiddle * odd[k])
    
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

def ifft(a, depth=0, step_id=0):
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
    
    steps_even = ifft(a[0::2], depth+1, step_id*2+1)
    steps_odd = ifft(a[1::2], depth+1, step_id*2+2)
    
    even = steps_even['output']
    odd = steps_odd['output']
    
    T = []
    for k in range(n // 2):
        twiddle = cmath.exp(2j * cmath.pi * k / n)
        T.append(twiddle * odd[k])
    
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

def multiply(a, b):
    n = 1
    while n < len(a) + len(b) - 1:
        n *= 2

    a = a + [0] * (n - len(a))
    b = b + [0] * (n - len(b))

    A = fft(a)
    B = fft(b)

    C = [A['output'][i] * B['output'][i] for i in range(n)]
    
    c_steps = ifft(C)

    normalized_output = [x / n for x in c_steps['output']]
    result = [int(round(x.real)) for x in normalized_output]
    
    r = result.copy()

    for i in range(len(result) - 1):
        if result[i] < 0:
            result[i] += 10
            result[i + 1] -= 1
        result[i + 1] += result[i] // 10
        result[i] %= 10

    while len(result) > 1 and result[-1] == 0:
        result.pop()

    c_steps['output'] = normalized_output

    return result[::-1], r, a, b, A, B, C, c_steps

@app.route('/multiply', methods=['POST'])
def multiply_numbers():
    data = request.get_json()
    number1 = data.get('number1')
    number2 = data.get('number2')

    a_array = [int(digit) for digit in number1][::-1]
    b_array = [int(digit) for digit in number2][::-1]

    result_array, r, a, b, A, B, C, c_steps = multiply(a_array, b_array)

    result = ''.join(map(str, result_array))
    
    A = convert_fft_steps(A)
    B = convert_fft_steps(B)
    c_steps = convert_fft_steps(c_steps)

    response = {
        'result': result,
        'intermediate_steps': {
            'r': r,
            'a': a,
            'b': b,
            'C': [complex_to_dict(complex(c)) for c in C],
            'c': [round(x['real']) for x in c_steps['output']]
        },
        'A': A,
        'B': B,
        'c_steps': c_steps
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)