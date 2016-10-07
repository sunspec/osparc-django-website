from django.shortcuts import render

from django.http import HttpResponse
from django.template import loader

def index(request):
    context = {
    	'account':'oSPARC Admin',
    	'total':3857,
    	'dccapacity':'924.85 MW',
    	'storagecapacity':'100 kWh'
    }
    return render(request, 'osparc/index.html', context)

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
