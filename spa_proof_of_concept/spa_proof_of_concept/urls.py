from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import RedirectView

from tg_utils.health_check.views import HealthCheckViewMinimal, HealthCheckViewProtected


admin.autodiscover()

urlpatterns = [
    path("api/", include("spa_proof_of_concept.rest.urls")),
    path("adminpanel/", admin.site.urls),
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
    path("_health", HealthCheckViewMinimal.as_view(), name="health-check"),
    path(
        "_health/details",
        HealthCheckViewProtected.as_view(),
        name="health-check-details",
    ),
]

if not settings.DEBUG:
    handler500 = "spa_proof_of_concept.views.server_error"
    handler404 = "spa_proof_of_concept.views.page_not_found"

if settings.DEBUG:
    try:
        import debug_toolbar

        urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
    except ImportError:
        pass

if settings.IS_UNITTEST:  # pragma: no branch

    def failing_view(*args, **kwargs):
        """
        This view is used during unit tests to ensure correct error view is
        used by the application when another view fails.
        """
        raise Exception("Example error")

    urlpatterns += [
        path("test500", failing_view),
    ]


urlpatterns += [
    path(
        "",
        RedirectView.as_view(url=settings.SITE_URL, permanent=False),
        name="app-redirect",
    )
]
