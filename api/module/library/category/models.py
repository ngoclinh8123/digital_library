from django.db import models
from service.framework.model.timestamped_model import TimeStampedModel


class Category(TimeStampedModel):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = "categories"
        ordering = ["-id"]
