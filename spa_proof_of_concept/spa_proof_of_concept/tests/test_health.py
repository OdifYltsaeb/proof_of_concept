from django.conf import settings
from django.test import Client

import pytest


@pytest.mark.django_db
def test_health_url(django_client: Client):
    response = django_client.get("/_health")
    assert response.status_code == 200
    assert response.json() == {"error": False}


@pytest.mark.django_db
def test_health_detail_no_token(django_client: Client):
    response = django_client.get("/_health/details")
    assert response.status_code == 403

    response = django_client.get("/_health/details?healthtoken=fake")
    assert response.status_code == 403


@pytest.mark.django_db
def test_health_detail(django_client: Client):
    response = django_client.get(
        "/_health/details?healthtoken={healthtoken}".format(
            healthtoken=settings.HEALTH_CHECK_ACCESS_TOKEN,
        )
    )
    assert response.status_code == 200
