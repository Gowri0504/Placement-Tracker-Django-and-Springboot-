import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import PyPDF2
import io

class ResumeAnalyzeView(APIView):
    def post(self, request):
        if 'resume' not in request.FILES:
            return Response({"error": "No resume file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        resume_file = request.FILES['resume']
        try:
            # Extract text from PDF
            pdf_reader = PyPDF2.PdfReader(resume_file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            # Basic ATS scoring logic (mock)
            skills_found = []
            suggested_skills = ["Docker", "Kubernetes", "AWS", "Microservices", "System Design"]
            
            common_skills = ["Java", "Python", "React", "Node", "SQL", "Git", "Spring Boot", "Django"]
            for skill in common_skills:
                if skill.lower() in text.lower():
                    skills_found.append(skill)
            
            score = min(100, (len(skills_found) * 10) + random.randint(10, 30))
            
            return Response({
                "ats_score": score,
                "skills_found": skills_found,
                "suggested_skills": [s for s in suggested_skills if s not in skills_found],
                "message": "Resume analyzed successfully"
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SuggestionView(APIView):
    def post(self, request):
        # request.data contains user's progress stats
        user_stats = request.data.get('stats', {})
        weak_topics = user_stats.get('weak_topics', ["System Design", "DP"])
        
        suggestions = [
            f"Focus more on {topic} as your accuracy is below 40%." for topic in weak_topics
        ]
        suggestions.append("Try solving more Hard difficulty problems to improve your PRS score.")
        
        return Response({
            "weak_topics": weak_topics,
            "suggestions": suggestions,
            "readiness_prediction": "Medium"
        })

class ReadinessScoreView(APIView):
    def post(self, request):
        # Calculate readiness based on PRS and recent consistency
        prs_score = request.data.get('prs_score', 0)
        consistency = request.data.get('consistency', 0)
        
        readiness = (prs_score * 0.7) + (consistency * 30)
        readiness = min(100, max(0, readiness))
        
        return Response({
            "readiness_score": round(readiness, 2),
            "status": "Ready for interviews" if readiness > 75 else "Needs more practice"
        })
