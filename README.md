# K-Table

The K-Table is a vue based frontend for the K-Fêt insa lyon.

## Installation

First you need [Node](https://nodejs.org/en/) 

```bash
npm install
```

## Usage

### 1. Development
```bash
npm run serve
```

### 2. Production

### Install Firebase-Tools
```bash
npm install -g firebase-tools
```

### Build for production
```bash
npm run build
```

### Connect to firebase
```bash
firebase init
``` 
Select your the hosting option, and select the appropriate firebase project. Once you do this a ```.firebaserc``` file will be added to your directory. This file should be good to go. Also, a ```firebase.json``` file will have been added.

### Deploy to firebase Hosting (Ask Access KomIf)
```
firebase deploy
```
Congrats, you did it!!! 🎉

To deploy future builds, just run:
```npm run build``` to build your project, then ```firebase deploy``` to deploy it.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[PEDALE](https://choosealicense.com/licenses/mit/)