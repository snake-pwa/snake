# Snake PWA

This repository contains source code of the simple snake game written as
Progressive Web Application (PWA). It uses TypeScript which is transcompiled
to ES5 and has hardly no dependencies. Application has been implemented as
a research project.

Demo: https://snake-pwa.github.io

## Usage

### Pre-Requisites

* NodeJs version at least 6.

### Configuring

If you wish to make changes in the source code and contribute to this project,
you problably would like to clone this git repository. The following commands
will help you setup the project in the development mode:

1. Run as root:
* `npm install -g grunt-cli`

2. Run as user:
* `npm install`
* `grunt`

3. To prepare a package that could be copied to server use:
* `grunt release`

### Tests

You can run tests by typing:

`grunt karma` or just `npm test`

## License

MIT
