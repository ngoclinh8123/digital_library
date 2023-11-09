from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "cmd_random_command"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("[+] Start..."))
        self.stdout.write(self.style.SUCCESS("[+] Done!!!"))
