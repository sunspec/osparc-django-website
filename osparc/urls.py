from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^head_nav$', views.head_nav, name='head_nav'),
    url(r'^add_plant$', views.add_plant, name='add_plant'),
    url(r'^plant_added$', views.plant_added, name='plant_added'),
    url(r'^view_plant$', views.view_plant, name='view_plant'),
    url(r'^list_plants$', views.list_plants, name='list_plants'),

    url(r'^add_query$', views.add_query, name='add_query'),
    url(r'^list_queries$', views.list_queries, name='list_queries'),
    url(r'^view_query$', views.view_query, name='view_query'),
    url(r'^query_added$', views.query_added, name='query_added'),
    url(r'^list_reports$', views.list_reports, name='list_reports'),
    url(r'^view_report$', views.view_report, name='view_report'),
]