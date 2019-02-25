# LUCAS (Legitimate User Content Analysis Service)

## Description

LUCAS is a hosted web service, with a main endpoint that takes:
A list of user submitted reviews for a product or services page,
A list of every review submitted by every user in that list.
It will return a metric that corresponds to overall review quality.
It will do this by using a combination of machine learning and deep learning methods to produce a model that returns an accuracy metric when given a review.

## Installation and running

### Prerequisites

* Python 3.X
* Docker
* Conda [installed on your system](https://conda.io/docs/user-guide/install/index.html)

### 1. Steps to create the local conda environment

* Download the datasets from Google Drive, and copy the datasets into the LUCAS/data/ folder. Recommended folder hierarchy looks like:
  * `Amazoff/LUCAS/data/amazonBooks/`
  * `Amazoff/LUCAS/data/hotels/`
  * `Amazoff/LUCAS/data/yelpData/`

* In Amazoff/LUCAS/, Execute `conda env create -f environment.yml`. This will create a Python environment called 'classify' with all the necessary dependencies to run the code.

  * Side note: If you add dependencies to the `environment.yml`, run `conda-env update classify` to remake the env with the new packages.

* Once the dependencies have been downloaded and installed, execute `conda activate classify`. This will start the environment.

* Then, download the latest model files from the LUCAS/Models folder in Google Drive. Save them in a folder called 'models'.

### 2. Steps to run a hosted model API locally

**Make sure you are doing this on the master branch. Otherwise the API will not be configured to the latest model.**

* Execute `python app/lucas.py` to start the Flask server. Visit 0.0.0.0 to check the status. It should return the API version.

* Use `curl  -H "Content-Type: application/json" -d '{"review": "Great hotel would recommend" }' -X POST http://0.0.0.0:3050/classify` to query the local endpoint with a review. The endpoint will run the review over the model and return a classification.

### Helpful Conda activation

Since we need to set the python path variable, it's helpful to do this in the conda environment. You can do this automatically from the following file:

`<conda environment>/envs/lucas/etc/conda/activate.d/env_vars.sh`

where `<conda environment>` is likely to be under the home `~` directory (named anaconda3, miniconda3, etc)

`export PYTHONPATH=/home/stefan/Amazoff/LUCAS/`

Similarly, you can unset the changes in `<conda environment>/envs/lucas/etc/conda/dectivate.d/env_vars.sh`
