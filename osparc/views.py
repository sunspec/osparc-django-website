from django.shortcuts import render,redirect

from django.http import HttpResponse
from django.template import loader

def index(request):
    context = {
    	'account':'oSPARC Admin',
    }
    return render(request, 'osparc/index.html', context)

def head_nav(request):
	return render(request, 'osparc/head_nav.html')

def list_plants(request):
	print "in list_plants"
	context = {
		'account':'oSPARC Admin'
	}
	return render(request, 'osparc/list_plants.html', context)

def add_plant(request):
	print "in add_plant"
	context = {
		'account':'oSPARC Admin'
	}
	return render(request, 'osparc/add_plant.html', context)

def api_add_plant(request):
   return redirect("https://localhost:8001/api/plants")

def detail(request, question_id):
	context = { 'id':question_id}
	return render(request,'osparc/detail.html', context)

def results(request, question_id):
	print request
	print question_id
	response = "You're looking at the results of question %s."
	return HttpResponse(response % question_id)

def vote(request, question_id):
	print request
	print question_id
	return HttpResponse("You're voting on question %s." % question_id)
