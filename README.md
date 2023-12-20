# Lean Study Host
This is the official repository for "Lean Study Host: Towards an Automated Pipeline for Multi-Center Study Hosting" scheduled to be presented on HICSS.

## Third Party Software

This project take use of software developed by other parties.

## Preliminaries

- Docker Desktop installed: https://www.docker.com/products/docker-desktop/
- GitHub account
- Git LFS installed (only to pull test_data/): read the guide &rightarrow; https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage
- May create a personal GitHub access token (permission read:packages required): read the guide &rightarrow; https://docs.github.com/de/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

## Install

1. clone the repo
2. ```docker-compose up -d --force-recreate --remove-orphans```
3. Observe the startup process and access http://localhost:8090

## Tear Down

To stop the environment and remove all data

```bash
docker-compose down -v --remove-orphans
```

## Deploy for Development

There is a specific `docker-compose.develop.yml` to introduce some development specific features using docker-compose overrite mechanism.

**!!! DO NOT USE FOR PRODUCTION !!!**

At the moment, the docker-compose override introduces:
- hot reloading of the django container

To enable *Deploy for Development* add an `.env` file with the following content to the cloned repo:

```env
COMPOSE_FILE=docker-compose.yml:docker-compose.develop.yml
```

## Disclaimer

This project is intended for educational and informational purposes only and still work in progress. It relies on a series of fragile components and assumptions, any of which may break at any time. It is not FDA approved and should not be used to make medical decisions.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
