from django.shortcuts import render
from django.http import JsonResponse
from time import sleep


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
        force = round(mass*accel,2)

        sleep(1.5)

        return JsonResponse({'force' : force}, status=200)

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