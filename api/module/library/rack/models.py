from xml.dom import ValidationErr
from django.db import models
from service.framework.model.timestamped_model import TimeStampedModel


class Rack(TimeStampedModel):
    number = models.IntegerField()
    location = models.IntegerField()

    def __str__(self):
        return f"{self.id}"

    class Meta:
        db_table = "racks"
        ordering = ["-id"]
