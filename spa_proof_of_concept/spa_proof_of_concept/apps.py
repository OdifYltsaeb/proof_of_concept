from django.apps import AppConfig
from django.core import checks

from tg_utils.checks import check_production_settings, check_sentry_config


class SpaProofOfConceptConfig(AppConfig):
    name = "spa_proof_of_concept"
    verbose_name = "spa-proof-of-concept"

    def ready(self):
        # Import and register the system checks
        checks.register(check_production_settings)
        checks.register(check_sentry_config)
