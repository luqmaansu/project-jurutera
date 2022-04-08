"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views as appViews

urlpatterns = [
    
    path('', appViews.va_designer_pse, name='home'),

    path('admin/', admin.site.urls),
    path('app/1-hello', appViews.hello, name='1-hello'),
    path('app/2-newton', appViews.newton, name='2-newton'),
    path('app/3-newton-js', appViews.newton_js, name='3-newton-js'),
    path('app/4-newton-ajax', appViews.newton_ajax, name='4-newton-ajax'),
    path('app/5-vad', appViews.va_designer, name='5-vad'),
    path('app/6-vad-pse', appViews.va_designer_pse, name='6-vad-pse'),
    
]
