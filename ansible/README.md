# Ansible Deployments

Contents:

- [Ansible Deployments](#ansible-deployments)
  - [TL;DR](#tldr)
  - [Benefits](#benefits)
  - [Installing ansible](#installing-ansible)
  - [Deployment](#deployment)
    - [Server setup](#server-setup)
    - [Incremental deploy](#incremental-deploy)
      - [Deploying a different version](#deploying-a-different-version)
    - [The first deployment](#the-first-deployment)
    - [Configuring the environment](#configuring-the-environment)
  - [Download server state](#download-server-state)

## TL;DR

The command to deploy the project (change the `limit` arg to `live` if you want to deploy to live servers):

```bash
poetry run ansible-playbook --limit test deploy.yml
```

see more details in [Incremental deploy](#incremental-deploy).

## Benefits

[Ansible](https://docs.ansible.com/ansible/latest/index.html), as a configuration & automation framework, provides
fully automated deployments with no user interference on the server host. So all tasks only need to be described
in the configuration, and run on a local machine, thus there is guarantee that no human error would creep in, and that
all hosts managed by the same `ansible` configuration are configured in a consistent fashion.

## Installing ansible

The `ansible` installation is managed by the [Poetry](https://python-poetry.org/docs/) tool, which is a Python package manager.

To install `Poetry` on Linux/OS X, run the following command:

```bash
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
```

A complete installation guide for `Poetry` is available here: https://python-poetry.org/docs/#installation .

After `Poetry` is installed, run (in the `.ansible` directory):

```bash
poetry install
```

- this will install `ansible` and other dependencies.

With `Poetry` and `ansible` installed, all `ansible` commands can be executed like:

```bash
poetry run ansible-playbook --version
```

or within a subshell started by

```bash
poetry shell
Spawning shell within /home/user/.cache/pypoetry/virtualenvs/spa_proof_of_concept-ansible-Yf1XQtRW-py3.6 ...
(spa_proof_of_concept-ansible-Yf1XQtRW-py3.6) user@host:.ansible $
```
in which case you don't need to prefix the commands with `poetry run`. This mode of operation is assumed below
throughout the document.

## Deployment

### Server setup

Your server needs to have [Docker Engine](https://docs.docker.com/engine/installation/)
as well as [Docker Compose](https://docs.docker.com/compose/) installed.

We also assume that you have Nginx and Postgres (version 10 by default) running in Docker containers and reachable via
'private' network. We also make a few assumptions regards directories that will be used as volumes for static assets,
etc. You can find these paths in [docker-compose.production.yml](../docker-compose.production.yml).

### Incremental deploy

> NB: If the code has **not been deployed** to the server already follow the instructions in [The first deployment](#the-first-deployment).

Before deploying code ensure that whatever you want deployed is committed and pushed to the server. After that
you can deploy the project to the server by running `deploy.yml` stack with Ansible. This will:

1. Clone & checkout the project into test server (with branch/commit specified in `deployment_version` variable)
2. Add some configuration files (nginx, env, etc)3. Build docker images for the project
4. Run migrations and collectstatic


Run the stack with (against test server):

```bash
poetry run ansible-playbook --limit test deploy.yml
```

#### Deploying a different version

To deploy a specific version of code to the server you can use the `force_deploy` variable. To set it use
 ansibles `-e` CLI parameter.

```bash
poetry run ansible-playbook --limit test -e "force_deploy=stable" deploy.yml
```

### The first deployment

* Figure out which server you're going to deploy to.
  We usually have one main test server and one main production server for new project.
* Check [inventory](./inventory) file. It has two groups - `test` and `live`.
  Ensure that the server you'll use is added to the correct group.
* Add (or update) the `vars.yml` and `vault.yml` files for the server in the [host_vars](./host_vars) directory.
  * When creating the files use [vars-template.yml](./host_vars/vars-template.yml) and
     [vault-template.yml](./host_vars/vault-template.yml) as an example.
* If you created the vault file make sure to encrypt it: `ansible-vault encrypt host_vars/<hostname>/vault.yml`
  * NB: Vault for production and test should have different password.
* Check django settings (`settings/cloud.py`)
* Add the server's SSH key (`/root/.ssh/id_rsa.pub`) to the project repo settings as deployment key.
* Ensure you've committed and pushed all relevant changes.



* [Create the bucket for media files](http://docs.aws.amazon.com/AmazonS3/latest/UG/CreatingaBucket.html):
  * Bucket name: spa_proof_of_concept-{ENV} where `ENV` is either `staging` or `production`.
  * Region: Closest to the users of the project.
    * Don't forget to change `AWS_S3_REGION_NAME` to the correct one
  * Public access settings:
    * `Block new public ACLs and uploading public objects (Recommended)` = False
    * `Remove public access granted through public ACLs (Recommended)` = False
  * Properties:
    * Default encryption - AES-256
    * It's nice to add tags
  * Create a new user:
    * Go to [AWS IAM](https://console.aws.amazon.com/iam/home?#users).
    * Click "Create new users" and follow the prompts.
    * Leave "Generate an access key for each User" selected.
    * It's nice to add tags
  * Get the credentials:
    * Go to the new user's Security Credentials tab.
    * Click "Manage access keys".
    * Download the credentials for the access key that was created.
    * and Save them somewhere because no one will ever be able to download them again.
      * Add them to the vault file for the target server
    * Get the new user's ARN (Amazon Resource Name) by going to the user's Summary tab.
       It'll look like this: "arn:aws:iam::123456789012:user/someusername".
  * Go to the bucket properties in the [S3 management console](https://console.aws.amazon.com/s3/home).
  * Add a bucket policy that looks like this, but change "BUCKET-NAME" to the bucket name,
     and "USER-ARN" to your new user's ARN. This grants full access to the bucket and
     its contents to the specified user:

    ```json
    {
        "Statement": [
            {
                "Action": "s3:*",
                "Effect": "Allow",
                "Resource": [
                    "arn:aws:s3:::BUCKET-NAME/*",
                    "arn:aws:s3:::BUCKET-NAME"
                ],
                "Principal": {
                    "AWS": [
                        "USER-ARN"
                    ]
                }
            }
        ]
    }
    ```
  * When receiving `signature we calculated does not match` error, one of the following courses of action should fix it:
    * A) waiting; around 1-2 hours max
        * files should still have been uploaded
            * can be confirmed by removing url params in browser (`?X-Amz-Algorithm=....`)
    * B) make sure that `AWS_S3_ADDRESSING_STYLE = "path"` is in django settings. See details in this issue: [django-storages issue](https://github.com/jschneier/django-storages/issues/649),
  * More information about working with S3 can be found [here](https://github.com/Fueled/django-init/wiki/Working-with-S3).





Now that the prerequisites are done you can deploy the code with the following command.

> Replace `ENV` with either `test` or `live` (or the actual hostname of the target server).

```bash
poetry run ansible-playbook --limit ENV deploy.yml
```

If it worked, you're all done, congrats!

Otherwise, if something else broke, you can in most cases fix it and then just run the
Ansible stack again.

### Configuring the environment

All the environment variables necessary on the server are located in the 
[environment](./roles/deploy/templates/environment) file, which is installed to `.env` 
in the project root. Variables in this file can be
(and some should be) populated from Ansible variables, including vault variables. 

All docker containers and `docker-compose` itself use environment variables from the `.env` file. 

There is a special ansible target (tag) to update the `.env` file on the server: `env`, e.g.
```shell
poetry run ansible-playbook --limit HOST -t env deploy.yml
```

## Download server state

> **Warning:** Using this playbook deletes the local database so back up `.data/postgresql` directory before if you
>               need to preserve your current database.

We have a playbook to download the media and database state from a remote server hosting the project. If the media
files in the remote server are using S3 then you must first install [aws-cli](https://pypi.org/project/awscli/) locally.
The easiest way to do it is via pip: `sudo pip install awscli`.

Every time before you can use the mirror role you also need to activate virtual env containing ansible.
You can do this via: `poetry shell`

This ensures the permissions of local paths are correct to allow the mirror role to work. Once this is done you
can run the restore role with:

```bash
poetry run ansible-playbook -v --limit test mirror.yml
```

To restore only database or media files ansible tags can be used:

```bash
poetry run ansible-playbook -v --limit test --tags db mirror.yml  # restores only the database
poetry run ansible-playbook -v --limit test --tags media mirror.yml  # restores only the media files
```


## Create superuser to server

> **Warning:** This feature only works with Django 3.0 or later. 

We have a playbook to help user to create superuser to remote server hosting the project.

The role will ask for superuser email to use for creating it. Random password will be generated for you.
You can run the role with:


```shell
poetry run ansible-playbook --limit test superuser.yml
```
