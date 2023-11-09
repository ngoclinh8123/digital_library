from django.db import models
from service.framework.model.timestamped_model import TimeStampedModel


class Author(TimeStampedModel):
    name = models.CharField(max_length=512)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "authors"
        ordering = ["-id"]
