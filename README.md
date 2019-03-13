# Solid Filemanager

This is a file manager for solid pods, based on [this awesome react app](https://github.com/joni2back/react-filemanager/).

The app is available here: https://otto-aa.github.io/solid-filemanager/build/. To use it you need to have a [solid pod](https://solid.inrupt.com/get-a-solid-pod).

## Features

- Navigation through folders
- Upload files
- Copy, remove, move and rename file and folders
- Edit text files (txt, html, ...)
- Zip actions (archive and extract)
- Download files
- Open files in a new tab

![Screenshot of the file manager](./images/Screenshot.png "Demo Screenshot")

## Installing locally

If you want to run your own version of the file manager you can follow these steps:

```shell
git clone https://github.com/otto-aa/solid-filemanager/
cd solid-filemenager
npm install
npm start
```

With `npm build` you can create a static build (like [this one](https://otto-aa.github.io/solid-filemanager/build/)), but keep in mind that it is expected to be hosted at the location specified by "homepage" in package.json.

## Contribute

Feel free to make contributions by adding features, filing issues, fixing bugs, making suggestions, etc.