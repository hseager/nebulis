### n e b u l i s

A desktop app for downloading music from YouTube videos with metadata editing.

![screenshot](public/images/screenshots/image1.webp)

![screenshot](public/images/screenshots/image2.webp)

## Linux

ffmpeg must be installed when using on Linux

```
sudo apt update
sudo apt install ffmpeg
```

## To do

- Probably need Zustand soon as props getting out of hand
- Checkboxes in preferences for metadata fields
- Adjust start and end times
- Write unit tests (which frameworks? WebDriverIO, mocha, jest? needs to work with typescript, react & electron. How to test multiple OS for ffmpeg?)

## Bugs

- convertSecondstoMintues zero padding bug

# Setup Dev environment

1. clone repo
2. npm install
3. npm run watch
4. npm run start

# Build for prod

1. npm run build
2. npm run package
