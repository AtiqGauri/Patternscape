#include "Constants.h"

//***************************************
//STATIC VARIABLES INITIALIZATION
//***************************************

//ERROR LOG FILE NAME 
const string Constants::errorLogFileName = "Error Log";

//HUGE FILES GETS RESIZED FIRST. SO, THIS WILL BE PREFIX FOR THEIR NAME
const string Constants::resizedFileName = "data/Input/resizedFile";

//SIZE OF SMALLER FILES WILL BE DECIDED BY THIS VARIABLE
const int Constants::resizedFileSize = 100000;

//STRING VARIABLE TO STORE .TXT EXTENSION
const string Constants::txtExtension = ".txt";


//ADDRESS OF NAME LIST FILE
const string Constants::nameListFileAddress = "data/datafiles/names.txt";

//ADDRESS OF DOB LIST FILE
const string Constants::dobListFileAddress = "data/datafiles/dobs.txt";

//ADDRESS OF LOCATION LIST FILE
const string Constants::locationListFileAddress = "data/datafiles/locations.txt";

//ADDRESS OF COMMON LIST FILE
const string Constants::commonListFileAddress = "data/datafiles/Commons.txt";

//TOTAL NUMBER OF LINES IN NAME LIST FILE (APPROX)
const int Constants::nameListFileSize = 187706;

//TOTAL NUMBER OF LINES IN DOB LIST FILE (APPROX)
const int Constants::dobListFileSize = 287281;

//TOTAL NUMBER OF LINES IN LOCATION LIST FILE (APPROX)
const int Constants::locationListFileSize = 39202;

//TOTAL NUMBER OF LINES IN COMMON LIST FILE (APPROX)
const int Constants::commonListFileSize = 369646;

//TAG TO DENOTE NAME DETECTION IN GENERATED PATTERN
const string Constants::nameListTag = "Name/";

//TAG TO DENOTE EMAIL NAME DETECTION IN GENERATED PATTERN
const string Constants::emailNameTag = "email_Name/";

//TAG TO DENOTE WEBSITE DETECTION IN GENERATED PATTERN
const string Constants::websiteTag = "Website/";

//TAG TO DENOTE DOB DETECTION IN GENERATED PATTERN
const string Constants::dobListTag = "DOB/";

//TAG TO DENOTE LOCATION DETECTION IN GENERATED PATTERN
const string Constants::locationListTag = "Location/";

//TAG TO DENOTE MOBILE DETECTION IN GENERATED PATTERN
const string Constants::mobileListTag = "Mobile/";

//TAG TO DENOTE FIRST COMMON WORD DETECTION IN GENERATED PATTERN
const string Constants::common1ListTag = "Common1/";

//TAG TO DENOTE SECOND COMMON WORD DETECTION IN GENERATED PATTERN
const string Constants::common2ListTag = "Common2/";

//TAG TO DENOTE THIRD COMMON WORD DETECTION IN GENERATED PATTERN
const string Constants::common3ListTag = "Common3/";

//DELIMITER OR DIVIDER FOR OUTPUT OF PROGRAM
const string Constants::outputDelimiter = "<|>";

//VARIABLE TO DENOTE LENGTH(LENGTH:) OF DETECTED VALUE IN GIVEN PASSWORD
const string Constants::outputLengthDelimiter = "Length:";

//VARIABLE TO DENOTE POSITION(POSITION:) OF DETECTED VALUE IN GIVEN PASSWORD
const string Constants::outputPositionDelimiter = "Position:";

//TAG TO DENOTE UNDETECTED PART DETECTION IN GENERATED PATTERN
const string Constants::undetectedTag = "Undetected/";

//FOLDER ADDRESS WHICH CONTAINS ALL THE PATTERN DATA FILES
const string Constants::patternDataFolderAddress = "data/Stats/Patterns Data/";

//PATTERN CATEGORIES FILE ADDRESS 
const string Constants::patternCategoriesFileAddress = "data/Stats/Patterns.txt";

//DELIMITER OR DIVIDER IN GIVEN INPUT FILES (EMAIL|DELIMITER|PASSWORD)
const string Constants::inputDelimiter = ":";

//ADDRESS OF INPUT FOLDER 
const string Constants::inputFolderAddress = "data/Input/";

//ADDRESS OF OUTPUT FOLDER
const string Constants::outputFolderAddress = "data/Output/";

//PREFIX FOR OUTPUT FILES
const string Constants::outputFileName = "output.txt";

//DEFAULT EMAIL WHEN NO EMAIL IS GIVEN (ONLY FOR SINGLE TARGET PATTERN GENERATION)
const string Constants::defaultEmailString = "*****@*****.com";

//TEMPORARY FILE ADDRESS FOR PATTERN GENERATION FOR A SINGLE TARGET
const string Constants::singleTargetFileDirectory = "data/Temp/single_target_files/";

//TEMPORARY FOLDER ADDRESS
const string Constants::tempFolderAddress = "data/Temp/";