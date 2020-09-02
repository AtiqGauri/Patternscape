<!-- PROJECT LOGO -->
<br />
<p align="center">
  <img src="Patternscape_GUI/source/assets/icons/app-icon.svg" alt="Logo" width="100" height="100">
  <h1 align="center">Patternscape</h1>
  <p align="center">
    A project to detect patterns in passwords by processing data breaches.
  </p>
</p>
<img src="screenshot.gif">      
We developed this project to analyze passwords and detect specific patterns in them. 
These patterns can be used to avoid insecure passwords, to target specific passwords, reporting vulnerable passwords or any other security application. 

Patternscape uses data breaches to generate patterns out of raw passwords and email.
In order to generate a pattern we compare passwords against common data like:

1. Names (originating from different regions and cultures) &ensp;&ensp;~  188,000 records
2. Locations (include all countries and states) &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;~  39,200 records
3. Common words (for now English only) &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; ~  370,000 records
4. Target website (if available)
5. User email (if available)
6. Date of birth (if available)
7. Mobile number (if available)

Once we have common patterns we rank them according to highest appearance.
These patterns then can be used to detect patterns in raw data or on specific passwords for security purpose.       
If you want to know more about the project then checkout [Patternscape wiki](https://www.notion.so/atiqgauri/Patternscape-46cee07f3f6443628655cc1f48ca1e07) or have an [overview of patternscape](https://www.notion.so/atiqgauri/Project-Overview-f44b4344a919452aace7d8c99d206c5f). 

**We don't encourage any bad use of this project and in no case, we code authors are liable to any damage or illegal action.**
</br>
</br>

<!-- TABLE OF CONTENTS -->
## Table of Contents
* [Download](#download)
  * [Windows](#download)
  * [MacOS](#download)
  * [Linux](#download)
* [Patternscape Documentation](#documentation)
* [Installation Requirements](#requirements)
* [Installation](#installation)
  * [64 bit (Recommended)](#64bit)
  * [32 bit](#32bit)
* [License](#license)
</br>
</br>


## Download App (binaries) <i id="download"></i>
  * Windows
    * [win32-x64](https://github.com/AtiqGauri/Patternscape/releases/latest/download/Patternscape-win32-x64.zip)
  * macOS
    * [dmg](https://github.com/AtiqGauri/Patternscape/releases/latest/download/Patternscape-darwin-x64.zip)     &emsp;[(need help?)](https://www.notion.so/atiqgauri/App-Installation-Instructions-e9af1d9668674b53bca4527c6f54ddf2#ebe14a5f513b472896beebbb68f5e3f9)
  * Linux
    * [zip](https://github.com/AtiqGauri/Patternscape/releases/latest/download/Patternscape-linux-x64.zip)         &emsp;[(need help?)](https://www.notion.so/atiqgauri/App-Installation-Instructions-e9af1d9668674b53bca4527c6f54ddf2#4884793eaecc4bcfb11bdf40138d86c5)
</br>

## Patternscape Documentation <i id="documentation"></i>
This project was aimed to be open source from starting and no open source project is complete without good documentation. So, I tried to write about all the things related to project in a way, which is organized and easy to access.       
  * [Patternscape Wiki](https://www.notion.so/atiqgauri/Patternscape-46cee07f3f6443628655cc1f48ca1e07)
  * [New User ?](https://www.notion.so/atiqgauri/New-User-a4f3448686724c5c9dcd0d91fe88817d)
  * [Code Documentation](https://www.notion.so/atiqgauri/Documentation-432add2c655d4ef2b58e6e275fb06369)
  * [Development Documents](https://www.notion.so/atiqgauri/Development-43cccfc464f94f51b8f5d5a39058ccfb)
  * [User Guides](https://www.notion.so/atiqgauri/User-Guides-c5e2f377a55448fba0dbc5aeb3ee7374)
  * [Active Development](https://www.notion.so/atiqgauri/2c5ddc430916417193c7e7b890a7266c?v=37fda3dbb2fb45408423e17e23cf2ab3)
  * [Future Roadmap](https://www.notion.so/atiqgauri/Future-development-goals-da6c32ff3ef840219c8e9ffb499224ac)
  * [Changelog](https://www.notion.so/atiqgauri/Patternscape-Changelog-efe215fa53aa4412aef4439753ae52cd)
</br>

## Installation Requirements: <i id="requirements"></i> 
* Nodejs [^12.16.1](https://nodejs.org/en/)
* CMake [^3.17.1](https://cmake.org/download/)
* A proper C/C++ compiler toolchain
  * Windows:
    * [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) or if have pre-installed Visual studio IDE then you are good to go ([the free Community](https://visualstudio.microsoft.com/vs/community/) version works well)
  * Unix/Posix:
    * Clang or GCC
    * Ninja or Make (Ninja will be picked if both present)
</br>

## Installation: <i id="installation"></i>
### 64-bit Architecture (Recommended) <i id="64bit"></i>
```
git clone https://github.com/AtiqGauri/Patternscape.git
cd Patternscape/Patternscape_GUI
npm install
npm start
```
#### 32-bit Architecture <i id="32bit"></i>
```
git clone https://github.com/AtiqGauri/Patternscape.git
cd Patternscape/Patternscape_GUI
npm run install32
npm start
```
</br>

## License <i id="license"></i>
  * [MIT](https://github.com/AtiqGauri/Patternscape/blob/master/LICENSE)