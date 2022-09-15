import sys

from poetry.utils.env import EnvManager


if __name__ == "__main__":
    # /app since pyproject.toml in the foot folder is symlinked from internal folder
    env_name = EnvManager.generate_env_name("spa-proof-of-concept", "/app")

    print(f"{env_name}-py{sys.version_info.major}.{sys.version_info.minor}")
