from django.shortcuts import render
from django.http import JsonResponse
from time import sleep


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