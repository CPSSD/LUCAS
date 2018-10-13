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
* Conda [installed on your system](https://conda.io/docs/user-guide/install/index.html)

### Steps to run

* Copy the datasets into the LUCAS/data/ folder. Recommended folder hierarchy looks like:
  * `Amazoff/LUCAS/data/amazonBooks/`
  * `Amazoff/LUCAS/data/hotels/`
  * `Amazoff/LUCAS/data/yelpData/`

* In Amazoff/LUCAS/, Execute `conda env create -f environment.yml`. This will create a Python environment called 'classify' with all the necessary dependencies to run the code.

* Once the dependencies have been downloaded and installed, execute `conda activate classify`. This will start the environment.

* To run the naive_bayes.py classifier, execute `python naive_bayes.py`. This will produce an accuracy.