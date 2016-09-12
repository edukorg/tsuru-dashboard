from django.conf.urls import url, include
from django.contrib.staticfiles import views


urlpatterns = [
    url(r'^', include('tsuru_dashboard.urls')),
    url(r'^', include('tsuru_autoscale.urls')),
    url(r'^static/(?P<path>.*)$', views.serve),
]
