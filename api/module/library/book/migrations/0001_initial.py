# Generated by Django 4.2.3 on 2023-07-18 14:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('category', '0001_initial'),
        ('author', '0001_initial'),
        ('rack', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=255)),
                ('language', models.CharField(choices=[('VIETNAMESE', 'Vietnamese'), ('ENGLISH', 'English')], default='VIETNAMESE', max_length=60)),
                ('publisher', models.CharField(blank=True, max_length=250, null=True)),
                ('quality', models.IntegerField()),
                ('publication_date', models.DateTimeField()),
                ('price', models.IntegerField()),
                ('thumbnail', models.ImageField(blank=True, null=True, upload_to='books')),
                ('description', models.TextField(blank=True, null=True)),
                ('file', models.FileField(upload_to='files')),
                ('authors', models.ManyToManyField(related_name='books', to='author.author')),
                ('categories', models.ManyToManyField(related_name='books', to='category.category')),
                ('racks', models.ManyToManyField(related_name='books', to='rack.rack')),
            ],
            options={
                'db_table': 'books',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='BookItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('barcode', models.CharField(max_length=255, unique=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='book.book')),
            ],
            options={
                'db_table': 'book_items',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('BORROWED', 'Borrowed'), ('RETURNED', 'Returned')], default='BORROWED', max_length=250)),
                ('borrow_at', models.DateTimeField()),
                ('due_date', models.DateTimeField()),
                ('return_at', models.DateTimeField(blank=True, null=True)),
                ('book_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='book.bookitem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'orders',
                'ordering': ['-id'],
            },
        ),
        migrations.AddField(
            model_name='bookitem',
            name='users',
            field=models.ManyToManyField(related_name='book_items', through='book.Order', to=settings.AUTH_USER_MODEL),
        ),
    ]