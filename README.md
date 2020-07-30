<!-- PROJECT LOGO -->
<br />
<p align="center">
  <img src="PasswordTool_GUI/source/assets/icons/app-icon.svg" alt="Logo" width="100" height="100">
  <h1 align="center">Password Tool</h1>
  <p align="center">
    A project designed to understand different patterns out of data breaches.
  </p>
</p>
<img src="screenshot.gif">      

<!-- TABLE OF CONTENTS -->
## Table of Contents
* [Download](#download)
  * [Windows](#download)
  * [MacOS](#download)
  * [Linux](#download)
* [Requirements](#requirements)
* [Installation](#installation)
  * [64 bit (Recommended)](#64bit)
  * [32 bit](#32bit)
* [Roadmap](#roadmap)
* [License](#license)
</br>
</br>


## Download App (binaries) <i id="download"></i>
  * Windows
    * [win32-x64](https://github.com/AtiqGauri/PasswordTool/releases/latest/download/PasswordTool-win32-x64.zip)
  * macOS
    * [darwin](https://github.com/AtiqGauri/PasswordTool/releases/latest/download/PasswordTool-darwin-x64.zip)     &emsp;[(need help?)](https://paper.dropbox.com/doc/App-Installation-Instructions--A4uRaRHGJG0vbUEDZdzfkrzmAg-Bhc188dViyiLTGI4BTqom#:uid=694129237904688615603558&h2=macOS)
  * Linux
    * [zip](https://github.com/AtiqGauri/PasswordTool/releases/latest/download/PasswordTool-linux-x64.zip)         &emsp;[(need help?)](https://paper.dropbox.com/doc/App-Installation-Instructions--A4uRaRHGJG0vbUEDZdzfkrzmAg-Bhc188dViyiLTGI4BTqom#:uid=999266699401838158655202&h2=Linux)
    

## Installation Requirements: <i id="requirements"></i> 
* Nodejs [^12.16.1](https://nodejs.org/en/)
* CMake [^3.17.1](https://cmake.org/download/)
* A proper C/C++ compiler toolchain
  * Windows:
    * [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) or if have pre-installed Visual studio IDE then you are good to go ([the free Community](https://visualstudio.microsoft.com/vs/community/) version works well)
  * Unix/Posix:
    * Clang or GCC
    * Ninja or Make (Ninja will be picked if both present)

## Installation: <i id="installation"></i>
### 64-bit Architecture (Recommended) <i id="64bit"></i>
```
git clone https://github.com/AtiqGauri/PasswordTool.git
cd PasswordTool/PasswordTool_GUI
npm install
npm start
```
#### 32-bit Architecture <i id="32bit"></i>
```
git clone https://github.com/AtiqGauri/PasswordTool.git
cd PasswordTool/PasswordTool_GUI
npm run install32
npm start
```
    
## Project Roadmap <i id="roadmap"></i>
  * [Timeline](https://paper.dropbox.com/doc/Projects-Timeline--AzP0A3Y1v5yEfAw5e8cNhcApAg-BoYhgTkFCHQ91an0uF9eg)


## License <i id="license"></i>
  * [MIT](https://github.com/AtiqGauri/PasswordTool/blob/master/LICENSE)