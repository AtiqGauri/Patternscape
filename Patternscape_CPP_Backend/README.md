# Patternscape <img src="../Patternscape_GUI/source/assets/icons/app-icon.svg" alt="Logo" width="25" height="25">

### IDE SETTINGS FOR BACKEND DEVELOPMENT    
#### VISUAL STUDIO 2019 SETTINGS
  * SET: Project -> Project Properties -> C/C++ -> Language -> C++ Language Standard -> std:c++latest
  * SET: PROJECT TO RELEASE MODE
  * SET: ARCH TO 64X (RECOMMENDED)       

#### XCODE 11.5^ SETTINGS
  * YOU NEED TO MAKE A XCODE C++(COMMAND LINE) PROJECT
  * COPY ALL THE SOURCE FILES IN THAT PROJECT AND ADD THEIR REFERENCES IN THE PROJECT
  * SET: BUILD SETTINGS -> APPLE CLANG LANGUAGE C++ -> C++ LANGUAGE DIALECT -> c++17[-std=c++17]
</br>
  
## Overview:
Backend is mainly responsible for two main tasks and third derived task, first is pattern detection in multiple email:password pairs, second is generating statistics of detected patterns, and the third derived task is just a wrapper to detect pattern in a single email:password pair.       
To know more about c++ backend and it working, [checkout our Backend documentation.](https://www.notion.so/atiqgauri/Backend-c-2cf239e87aa84d50af13be9d1af4a1ce)
