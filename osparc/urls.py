from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^head_nav$', views.head_nav, name='head_nav'),
    url(r'^add_plant$', views.add_plant, name='add_plant'),
    url(r'^view_plant$', views.view_plant, name='view_plant'),
    url(r'^list_plants$', views.list_plants, name='list_plants'),
    url(r'^(?P<question_id>[0-9]+)/$', views.detail, name='detail')
]