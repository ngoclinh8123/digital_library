from django.db import models
from django.contrib.postgres.fields import ArrayField
from service.framework.model.timestamped_model import TimeStampedModel


class Verif(TimeStampedModel):
    uid = models.CharField(max_length=36)
    code = models.CharField(max_length=36)
    target = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.target} - {self.code} : {self.uid}"

    class Meta:
        db_table = "verifs"
        ordering = ["-id"]


class VerifLog(TimeStampedModel):
    target = models.CharField(max_length=50)
    ips = ArrayField(models.CharField(max_length=36), default=list)

    def __str__(self):
        return f'{self.target}: {", ".join(self.ips)}'

    class Meta:
        db_table = "verif_logs"
        ordering = ["-id"]


class WhitelistTarget(models.Model):
    target = models.CharField(max_length=36, unique=True)

    def __str__(self):
        return self.target

    class Meta:
        db_table = "whitelist_target"
        ordering = ["-id"]
