from django.db import models


VN = "VIETNAMESE"
ENG = "ENGLISH"

LANGUAGE_CHOICES = [
    (VN, "VIETNAMESE"),
    (ENG, "ENGLISH"),
]


class OrderStatus(models.TextChoices):
    REQUESTED = "REQUESTED"
    APPROVED = "APPROVED"
    BORROWED = "BORROWED"
    RETURNED = "RETURNED"
    OVER_DUE = "OVER_DUE"
    CANCELED = "CANCELED"


AVAILABLE_STATUS = [
    OrderStatus.RETURNED,
    OrderStatus.CANCELED,
]

NOT_AVAILABLE_STATUS = [
    OrderStatus.REQUESTED,
    OrderStatus.APPROVED,
    OrderStatus.BORROWED,
    OrderStatus.OVER_DUE,
]

INTERVAL_DUE_DATE = 90
