from django.shortcuts import render
from django.http import JsonResponse
from time import sleep
import numpy as np
import math

def vdi(request):
    
    # AJAX processing
    if request.method == 'POST':

        # Get reading from AJAX
        f = float(request.POST.get('f'))
        v = float(request.POST.get('v'))

        # Evaluate category of severity
        v1 = 0.84 * f**0.5 # Design
        v2 = 1.83 * f**0.5 # Marginal
        v3 = 3.50 * f**0.5 # Correction
        v4 = 9.00 * f**0.5 # Danger

        # Danger
        if v >= v4:
            category = 'Danger'

        # Correction
        elif v >= v3:
            category = 'Correction'

        # Marginal
        elif v >= v2:
            category = 'Marginal'

        # Design
        elif v >= v1:
            category = 'Design'

        # N/A
        else:
            category = 'N/A'

        context = {'category': category}

        sleep(1.5)
        return JsonResponse(context, status=200)

    # Initialize page
    else:
        return render(request, 'app/7-vdi.html')


def va_designer_pse(request):

    inputs = {
        'mass': {'sym': 'm', 'desc': 'tune mass', 'unit': 'lb', 'value': ''},
        'position': {'sym': 'a', 'desc': 'tune mass position', 'unit': 'in', 'value': ''},
        'modulus': {'sym': 'E', 'desc': 'modulus of elasticity', 'unit': 'psi', 'value': ''},
        'density': {'sym': 'd', 'desc': 'material density', 'unit': 'lb/in^3', 'value': ''},
        'width': {'sym': 'b', 'desc': 'width', 'unit': 'in', 'value': ''},
        'height': {'sym': 'h', 'desc': 'height', 'unit': 'in', 'value': ''},
        'length': {'sym': 'L', 'desc': 'length', 'unit': 'in', 'value': ''},
        'frequency': {'sym': 'w', 'desc': 'targeted natural frequency', 'unit': 'cpm', 'value': ''},
    }

    if request.GET.get("check"):

        # Record the checked parameter
        check = request.GET.get('check')

        # Get all inputs from the fields, as passed by AJAX, and
        # replace 0 for empty (checked) field <-- the only reason for this separate section
        for i in inputs:
            try:
                inputs[i]['value'] = float(request.GET.get(i))
            except (TypeError, ValueError):
                inputs[i]['value'] = 0

        # Assign each input to the symbol notation
        m = inputs['mass']['value']
        a = inputs['position']['value']
        E = inputs['modulus']['value']
        d = inputs['density']['value']
        b = inputs['width']['value']
        h = inputs['height']['value']
        L = inputs['length']['value']
        w = inputs['frequency']['value']

        # x is a generic output value
        if check == 'mass':
            x = 2.115e5 * E * (b * h **3 / 12) / (
                    (w ** 2) * (3 * a**2 * L - a**3)) - (
                        (0.75 * (b*h*d) *  L**4) / (
                            3 * a**2 * L - a**3))

        elif check == 'position':
            c3 = -m
            c2 = 3*m*L
            c1 = 0
            c0 = (-17625 * E * b * h**3 / w**2) + (0.75 * b * h * d * L**4)
            eqn = [c3,c2,c1,c0]
            roots = np.roots(eqn)
            x = roots[1]

        elif check == 'modulus':
            x = (m * w**2 * (3*a**2*L - a**3) + 0.75 * b * h * L**4 * d * w**2) / (17625 * b * h**3)

        elif check == 'density':
            x =  (m * w**2 * (3*a**2*L - a**3) - 17625 * E * b * h**3) / (-0.75 * b * h * L**4 * w**2)

        elif check == 'width':
            x = (3 * m * a**2 * L * w**2 - m * a**3 * w**2) / (h * (17625 * h**2 * E - 0.75 * L**4 * d * w**2))

        elif check == 'height':
            c3 = 17625 * E * b
            c2 = 0
            c1 = -(0.75 * b * d * L**4 * w**2)
            c0 = -m * w ** 2 * (3 * a**2 * L - a**3)
            p = [c3,c2,c1,c0]
            roots = np.roots(p)
            x = roots.real[0]

        elif check == 'length':
            c4 = 0.75*b*h*d
            c3 = 0
            c2 = 0
            c1 = 3*m*a**2
            c0 = -m*a**3 - (2.115e5 * E * (b * h **3 / 12) / (w ** 2))
            eqn = [c4,c3,c2,c1,c0]
            roots = np.roots(eqn)
            x = roots.real[3]

        elif check == 'frequency':
            x = math.sqrt((17625 * E * b * h**3) / (3 * m * a**2 * L - m * a**3 + 0.75 * b * L**4 * d * h))
        
        else:
            x = 0

        # Assign whatever parameter was checked with the calculated answer
        inputs[check]['value'] = round(x, 4)

        # Create context variables
        context = { 'output': inputs[check]['value'],
                }

        sleep(1)
        return JsonResponse(context, status=200)

    else:

        # Create context variables
        context = {'inputs': inputs}

    return render(request, 'app/6-vad-pse.html', context)

def va_designer(request):
    
    inputs = {
        'position': {'sym': 'a', 'desc': 'tune mass position', 'unit': 'in', 'value': ''},
        'modulus': {'sym': 'E', 'desc': 'modulus of elasticity', 'unit': 'psi', 'value': ''},
        'density': {'sym': 'd', 'desc': 'material density', 'unit': 'lb/in^3', 'value': ''},
        'width': {'sym': 'b', 'desc': 'width', 'unit': 'in', 'value': ''},
        'height': {'sym': 'h', 'desc': 'height', 'unit': 'in', 'value': ''},
        'length': {'sym': 'L', 'desc': 'length', 'unit': 'in', 'value': ''},
        'frequency': {'sym': 'w', 'desc': 'targeted natural frequency', 'unit': 'cpm', 'value': ''},
    }
    
    if request.method == 'POST':

        # Get all parameters from the form
        a = float(request.POST.get("position"))
        E = float(request.POST.get("modulus"))
        d = float(request.POST.get("density"))
        b = float(request.POST.get("width"))
        h = float(request.POST.get("height"))
        L = float(request.POST.get("length"))
        w = float(request.POST.get("frequency"))

        # Calculate the vibration absorber design equation using Randy Fox's method
        m = 2.115e5 * E * (b * h **3 / 12) / (
                (w ** 2) * (3 * a**2 * L - a**3)) - (
                    (0.75 * (b * h * d) *  L**4) / (
                        3 * a**2 * L - a**3))
        m = round(m,4)

        # Accumulate all submitted values into dictionary to be passed to the template
        for i in inputs:
            inputs[i]['value'] = float(request.POST.get(i))

        # Create context variables
        context = {'inputs': inputs,
                    'output': m,
        }

    else:

        # Create context variables
        context = {'inputs': inputs}

    return render(request, 'app/5-vad.html', context)


def newton_ajax(request):

    if request.GET.get('mass') or request.GET.get('accel'):
        mass = float(request.GET.get('mass'))
        accel = float(request.GET.get('accel'))
        force = round(mass*accel, 2)

        sleep(1.5)

        return JsonResponse({'force': force}, status=200)

    return render(request, 'app/4-newton-ajax.html')


def newton_js(request):
    return render(request, 'app/3-newton-js.html')


def newton(request):
    # Form process
    if request.method == "POST":
        mass = float(request.POST.get('mass'))
        accel = float(request.POST.get('accel'))
        force = round(mass * accel, 2)
        context = {'mass': mass, 'accel': accel, 'force': force}

    # Form generating
    else:
        context = {}

    return render(request, 'app/2-newton.html', context)


def hello(request):
    return render(request, 'app/1-hello.html')
