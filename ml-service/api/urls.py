from django.urls import path
from .views import ResumeAnalyzeView, SuggestionView, ReadinessScoreView

urlpatterns = [
    path('analyze-resume', ResumeAnalyzeView.as_view(), name='analyze-resume'),
    path('suggestions', SuggestionView.as_view(), name='suggestions'),
    path('readiness-score', ReadinessScoreView.as_view(), name='readiness-score'),
]
