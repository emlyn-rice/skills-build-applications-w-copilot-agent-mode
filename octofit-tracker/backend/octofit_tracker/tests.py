from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Team, Activity, Leaderboard, Workout

User = get_user_model()

class ModelTests(TestCase):
    def test_create_team(self):
        team = Team.objects.create(name='Test Team')
        self.assertEqual(team.name, 'Test Team')

    def test_create_user(self):
        user = User.objects.create_user(username='testuser', email='test@example.com', password='pass')
        self.assertEqual(user.username, 'testuser')

    def test_create_activity(self):
        activity = Activity.objects.create(user='testuser', type='run', duration=10)
        self.assertEqual(activity.type, 'run')

    def test_create_leaderboard(self):
        leaderboard = Leaderboard.objects.create(team='Test Team', points=50)
        self.assertEqual(leaderboard.points, 50)

    def test_create_workout(self):
        workout = Workout.objects.create(user='testuser', suggestion='Sit-ups')
        self.assertEqual(workout.suggestion, 'Sit-ups')
