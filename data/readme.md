## What

This folder has metrics for each country per day.

Currently, the metrics it has are:

- `dayNumber` (the Nth number of day from date of first recorded incident)
- `rateOfGrowth` (the rate of growth of new incidents from previous date)
- `newIncidents` (the actual new incidents on a given date)

## Usage

- Clone this repo in full
  ```
  > git clone REPO_URL
  ```
- Clone/pull the latest inside `origin` folder submodule
  ```
  > cd origin
  > git pull origin master
  ```
- Come back to this folder and run compute
  ```
  > cd ..
  > node compute
  ```
- Check that the three files `confirmed.json`, `deaths.json`, `recovered.json` are updated.
