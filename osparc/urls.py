from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^head_nav$', views.head_nav, name='head_nav'),
    url(r'^add_plant$', views.add_plant, name='add_plant'),
    url(r'^plant_added$', views.plant_added, name='plant_added'),
    url(r'^delete_plant$', views.list_plants, name='delete_plant'),	# list after the client deletes
    url(r'^view_plant$', views.view_plant, name='view_plant'),
    url(r'^list_plants$', views.list_plants, name='list_plants'),

    url(r'^add_report$', views.add_report, name='add_report'),
    # url(r'^view_report$', views.view_report, name='view_report'),
    url(r'^list_reports$', views.list_reports, name='list_reports'),
]