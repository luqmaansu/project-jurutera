from django.shortcuts import render

# Create your views here.
def hello(request):
    return render(request, 'app/1-hello.html')