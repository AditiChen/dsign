# About D-sign

[Website URL](https://d-sig-2f338.web.app/)

The main purpose of this website is to allow users to post their ideas with google map or several designed templates, compress and crop images before uploading to firebase storage, categorize materials in the collection, able to add new friends and send messages to each other.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and hosted by [Firebase Hosting](https://firebase.google.com/docs/hosting).

## Test accounts

Account1: shu@gmail.com\
Password: test12345

Account2: ams@gmail.com\
Password: test12345

## Technique

- Reduced potential type error by using [TypeScript](https://www.typescriptlang.org/).
- Uniformed coding style to [ESLint Airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) rule.
- Managed project by Git Flow for clarifying version control.
- Used [immer](https://github.com/immerjs/immer) to ensure the data is rewrote immutably.
- Implemented [i18next](https://github.com/i18next/next-i18next) to provide different languages of the interface.
- Built email, Google and Facebook login functions through [Firebase Authentication](https://firebase.google.com/docs/auth).
- Provided [image editor](https://github.com/ValentinH/react-easy-crop) such as crop, rotate, zoom in and out to customize every image and automatically changed the cropping shape to fit the image containers in the templates.
- [Compressed files](https://github.com/Donaldcwl/browser-image-compression) to below 1 MB before uploading to [Firebase Cloud Storage](https://firebase.google.com/docs/storage) in order to avoid overlong loading time.
- Dealt with CORS problem while reediting the stored photo in the Firebase Cloud Storage by [gcloud CLI](https://cloud.google.com/sdk/docs/install) and [gsutil](https://cloud.google.com/storage/docs/gsutil_install).
- Offered [google map](https://github.com/JustFly1984/react-google-maps-api) as one of the templates to store the location for the project.
- Allowed users to categorize materials into different folders by [drag and drop](https://github.com/atlassian/react-beautiful-dnd) the file.
- Subscribe friend request and message to show notification instantly.
- Automatically deployed in [GitHub Actions](https://github.com/features/actions) after sending the pull request.

## Function map

![function map](https://user-images.githubusercontent.com/104111575/207782030-6012fc65-9caa-4b95-a029-5d1bb6c84b9d.png)

## Features demo

### Change language of interface

https://user-images.githubusercontent.com/104111575/207790652-3b9cd7f7-7adf-4804-9228-480a6f615f8c.mov

### Arrange template order

https://user-images.githubusercontent.com/104111575/207788735-c6d5ea2c-b90d-42f6-b867-e919a215d7bf.mov

### Crop image

https://user-images.githubusercontent.com/104111575/207787516-79bf020a-5345-41e8-83da-c0213e0ac0ae.mov

### Add google map

https://user-images.githubusercontent.com/104111575/207788032-7a9d5527-f43f-40b5-9cab-cf6bd69c9075.mov

### Upload multiple images

https://user-images.githubusercontent.com/104111575/207789172-f0f21883-78eb-411f-8118-24970b761169.mov

### Categorize materials

https://user-images.githubusercontent.com/104111575/207789733-1a1d8d54-fa1e-4c8f-bb00-087d97fd762a.mov

### Message to your friend

https://user-images.githubusercontent.com/104111575/207787052-1d42745a-f507-4332-afc2-c85cd46e3780.mov

### Favorite list

https://user-images.githubusercontent.com/104111575/207785643-2a968d21-4d02-442f-b4e9-0e2d8e15874b.mov
