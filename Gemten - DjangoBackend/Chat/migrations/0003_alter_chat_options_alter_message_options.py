# Generated by Django 5.1.6 on 2025-02-14 06:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0002_chat_last_message'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='chat',
            options={'ordering': ['-updated_at']},
        ),
        migrations.AlterModelOptions(
            name='message',
            options={'ordering': ['-id']},
        ),
    ]
