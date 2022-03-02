from django.shortcuts import render

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