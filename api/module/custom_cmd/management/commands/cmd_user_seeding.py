from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from apps.customer.models import Customer

User = get_user_model()


class Command(BaseCommand):
    help = "cmd_user_seeding"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Start..."))

        customers = [
            {
                "username": "user",
                "email": "user@localhost.com",
                "first_name": "john",
                "last_name": "doe",
                "password": "password",
            },
            {
                "username": "user1",
                "email": "user1@localhost.com",
                "first_name": "jim",
                "last_name": "colin",
                "password": "password",
            },
        ]
        for customer_data in customers:
            try:
                User.objects.get(email=customer_data["email"])
            except User.DoesNotExist:
                print("[+] Creating customer: {}".format(customer_data["username"]))
                user = User.objects.create_user(**customer_data)
                Customer.objects.create(user=user)

        self.stdout.write(self.style.SUCCESS("Done!!!"))
