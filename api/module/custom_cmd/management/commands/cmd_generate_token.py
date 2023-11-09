from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from service.token_service import TokenService

User = get_user_model()


class Command(BaseCommand):
    help = "generate_token"

    def add_arguments(self, parser):
        parser.add_argument(
            "username",
            type=str,
            help="email address",
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Start..."))
        username = options["username"]
        user = User.objects.get(username=username)
        token = TokenService.generate_token(user)
        self.stdout.write(self.style.WARNING(f"JWT {token}"))
        self.stdout.write(self.style.SUCCESS("Done!"))
