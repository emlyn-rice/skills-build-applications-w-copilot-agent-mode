from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from octofit_tracker.models import Team, Activity, Leaderboard, Workout

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        User = get_user_model()
        # Delete existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create users
        users = [
            User.objects.create_user(username='ironman', email='ironman@marvel.com', password='pass'),
            User.objects.create_user(username='captainamerica', email='cap@marvel.com', password='pass'),
            User.objects.create_user(username='batman', email='batman@dc.com', password='pass'),
            User.objects.create_user(username='superman', email='superman@dc.com', password='pass'),
        ]

        # Activities
        Activity.objects.create(user='ironman', type='running', duration=30)
        Activity.objects.create(user='batman', type='cycling', duration=45)

        # Leaderboard
        Leaderboard.objects.create(team='Marvel', points=100)
        Leaderboard.objects.create(team='DC', points=80)

        # Workouts
        Workout.objects.create(user='ironman', suggestion='Push-ups')
        Workout.objects.create(user='batman', suggestion='Pull-ups')

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data'))
