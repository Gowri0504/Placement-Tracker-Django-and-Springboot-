from django.urls import path
from .views import ResumeAnalyzeView, SuggestionView, ReadinessScoreView, MockInterviewStartView, MockInterviewEvaluateView

urlpatterns = [
    path('analyze/', ResumeAnalyzeView.as_view(), name='analyze-resume'),
    path('suggestions/', SuggestionView.as_view(), name='suggestions'),
    path('readiness-score/', ReadinessScoreView.as_view(), name='readiness-score'),
    path('mock-start/', MockInterviewStartView.as_view(), name='mock-start'),
    path('mock-evaluate/', MockInterviewEvaluateView.as_view(), name='mock-evaluate'),
]
