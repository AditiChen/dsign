# About D-sign

[Website URL](https://d-sig-2f338.web.app/)

The main purpose of this website is to allow users to post their ideas with google map or several designed templates, compress and crop images before uploading to firebase storage, categorize materials in the collection, able to add new friends and send messages to each other.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and hosted by [Firebase Hosting](https://firebase.google.com/docs/hosting).

## Test accounts

Account1: shu@gmail.com
Password: test12345

Account2: ams@gmail.com
Password: test12345

Account2: apple@test.com
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

![function map](https://firebasestorage.googleapis.com/v0/b/d-sig-2f338.appspot.com/o/images%2Ffunction%20map.jpg?alt=media&token=2a1ac99c-91c2-4a0f-94fe-fb6613e65959)
