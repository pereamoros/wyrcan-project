# Wyrcan

## install

Clone this repo, make sure you have mongodb running, and then...


```
npm install
npm start
```



# User stories

- *Login* - as a user, I want to log in to view/create jobs and get hired/get candidates
- *Singup* - As a user, I want to sign up so that I can view/create jobs to get hired/get candidates
- *Apply job* - As a user, I want to apply to a particular job to get hired
- *Create job* - As a user, I want to be able to create a job to find a candidate
- *View job details* - As a user, I want to be able to view job details and view candidates
- *View my jobs*- As a user, I want to be able to view my current jobs 
- *Logout* - As a user, I want to be able to log out


# Routes

## Homepage (/)

- GET / 

## Authentication (/auth)

- GET /login
- POST /login
- GET /signup
- POST /signup
- POST /logout

## Jobs (/jobs)

- GET /
- GET /:id/apply
- POST /:id/apply
- GET /Jobs/create
- POST /Jobs/create
- GET /Jobs/:id
- GET /Jobs/myjobs (employer only)
- POST /:id/archive

## My stuff (/my)

- GET /jobs

## Layouts - 

- footer - about us? 

## MODELS

### Users

- name
- username
- password
- optional email
- role: string // one of `student` or `employer`

### Jobs

- position
- Description
- archive
- applications = [{
  user: ''
  text: ''
 }]

### Main page when logged in 

- for employer it goes to my jobs
- for student it goes to jobs
- can't go to main page when logged in - will redirect