#include "Constants.h"

//***************************************
//Static Variables Initialization
//***************************************

//Error log file name 
const string Constants::errorLogFileName = "Error Log";

//Huge files gets resized first. So, this will be prefix for their name
const string Constants::resizedFileName = "data/Input/resizedFile";

//Size of smaller files will be decided by this variable
const int Constants::resizedFileSize = 100000;

//String variable to store .txt extension
const string Constants::txtExtension = ".txt";


//Address of name list file
const string Constants::nameListFileAddress = "data/datafiles/names.txt";

//Address of dob list file
const string Constants::dobListFileAddress = "data/datafiles/dobs.txt";

//Address of location list file
const string Constants::locationListFileAddress = "data/datafiles/locations.txt";

//Address of common list file
const string Constants::commonListFileAddress = "data/datafiles/Commons.txt";

//Total number of lines in name list file (APPROX)
const int Constants::nameListFileSize = 187706;

//Total number of lines in dob list file (APPROX)
const int Constants::dobListFileSize = 287281;

//Total number of lines in location list file (APPROX)
const int Constants::locationListFileSize = 39202;

//Total number of lines in common list file (APPROX)
const int Constants::commonListFileSize = 369646;

//Tag to denote name detection in generated pattern
const string Constants::nameListTag = "Name/";

//Tag to denote email name detection in generated pattern
const string Constants::emailNameTag = "email_Name/";

//Tag to denote website detection in generated pattern
const string Constants::websiteTag = "Website/";

//Tag to denote dob detection in generated pattern
const string Constants::dobListTag = "DOB/";

//Tag to denote location detection in generated pattern
const string Constants::locationListTag = "Location/";

//Tag to denote mobile detection in generated pattern
const string Constants::mobileListTag = "Mobile/";

//Tag to denote first common word detection in generated pattern
const string Constants::common1ListTag = "Common1/";

//Tag to denote second common word detection in generated pattern
const string Constants::common2ListTag = "Common2/";

//Tag to denote third common word detection in generated pattern
const string Constants::common3ListTag = "Common3/";

//Dilimiter or divider for output of program
const string Constants::outputDelimiter = "<|>";

//variable to denote length(Length:) of detected value in given password
const string Constants::outputLengthDelimiter = "Length:";

//variable to denote position(Position:) of detected value in given password
const string Constants::outputPositionDelimiter = "Position:";

//Tag to denote undetected part detection in generated pattern
const string Constants::undetectedTag = "Undetected/";

//Folder address which contains all the pattern data files
const string Constants::patternDataFolderAddress = "data/Stats/Patterns Data/";

//Pattern categories file address 
const string Constants::patternCategoriesFileAddress = "data/Stats/Patterns.txt";

//Delimiter or divider in given input files (Email|DELIMITER|Password)
const string Constants::inputDelimiter = ":";

//Address of input folder 
const string Constants::inputFolderAddress = "data/Input/";

//Address of output folder
const string Constants::outputFolderAddress = "data/Output/";

//Prefix for output files
const string Constants::outputFileName = "output.txt";

//Default email when no email is given (only for single target pattern generation)
const string Constants::defaultEmailString = "*****@*****.com";

//Temporary file address for pattern generation for a single target
const string Constants::singleTargetFileAddress = "data/Temp/singlePassword.txt";

//Temporary folder address
const string Constants::tempFolderAddress = "data/Temp/";