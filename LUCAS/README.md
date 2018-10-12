# LUCAS (Legitimate User Content Analysis Service)

## Description

LUCAS is a hosted web service, with a main endpoint that takes:
A list of user submitted reviews for a product or services page,
A list of every review submitted by every user in that list.
It will return a metric that corresponds to overall review quality.

## How to run

### Prerequisites

Pythonn 3.X
Conda [installed on your system](https://conda.io/docs/user-guide/install/index.html)

* Copy the datasets into the LUCAS/data/ folder. Reccomended folder heirarchy looks like:
  * `Amazoff/LUCAS/data/amazonBooks/`
  * `Amazoff/LUCAS/data/hotels/`
  * `Amazoff/LUCAS/data/yelpData/`

* In Amazoff/LUCAS/, Execute `conda env create -f environment.yml`. This will create a Python environment called 'classify' with all the necessary dependencies to run the code.

* Once the dependencies have been downloaded and installed, execute `conda activate classify`. This will start the environment.

* To run the naive_bayes.py classifier, execute `python naive_bayes.py`. This will produce an accuracy.