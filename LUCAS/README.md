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

### Steps to create the local conda environment for development / training

* Copy the datasets into the LUCAS/data/ folder. Recommended folder hierarchy looks like:
  * `Amazoff/LUCAS/data/amazonBooks/`
  * `Amazoff/LUCAS/data/hotels/`
  * `Amazoff/LUCAS/data/yelpData/`

* In Amazoff/LUCAS/, Execute `conda env create -f environment.yml`. This will create a Python environment called 'classify' with all the necessary dependencies to run the code.

  * Side note: If you add dependencies to the `environment.yml`, run `conda-env update classify` to remake the env with the new packages.

* Once the dependencies have been downloaded and installed, execute `conda activate classify`. This will start the environment.

* To run the naive_bayes.py classifier, execute `python naive_bayes.py`. This will produce an accuracy, and pickle the model. 
  * For best results, re-run the classifer until it pickles a model with the best accuracy. Then serve that model.

### Steps to run the docker container with the model to test locally

* Execute `docker build -t classifyreviews .` This will build the docker image.

* Execute `docker run -p 80:80 -it classifyreviews`. This will start the docker image with port 80 exposed, allowing you to query it from the host machine.

* Execute `python app.py` to start the Flask server inside the container. Visit 0.0.0.0 to check the status.

* Use `curl  -H "Content-Type: text/plain" -d "Great hotel would recommend." http://0.0.0.0:80/classify` to query the local endpoint with a custom review. The endpoint will run the review over the model and return a classification.