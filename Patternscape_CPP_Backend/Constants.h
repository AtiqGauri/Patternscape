#ifndef CONSTANT_H
#define CONSTANT_H

#include<iostream>

using namespace std;


class Constants
{
public:
	
	//ERROR LOG FILE NAME 
	static const string errorLogFileName;
	
 	//TO RESIZE LARGE FILES WE ADD A PREFIX WITH ADDRESS
	static string resizedFileName;
	
	//SIZE OF SMALLER FILES WILL BE DECIDED BY THIS VARIABLE
	static const int resizedFileSize;
	
	//STRING VARIABLE TO STORE .TXT EXTENSION
	static const string txtExtension;

	//ADDRESS OF NAME LIST FILE
	static string nameListFileAddress;
	
	//ADDRESS OF DOB LIST FILE
	static string dobListFileAddress;
	
	//ADDRESS OF LOCATION LIST FILE
	static string locationListFileAddress;
	
	//ADDRESS OF COMMON LIST FILE
	static string commonListFileAddress;

	//TOTAL NUMBER OF LINES IN NAME LIST FILE (APPROX)
	static const int nameListFileSize;
	
	//TOTAL NUMBER OF LINES IN DOB LIST FILE (APPROX)
	static const int dobListFileSize;

	//TOTAL NUMBER OF LINES IN LOCATION LIST FILE (APPROX)
	static const int locationListFileSize;

	//TOTAL NUMBER OF LINES IN COMMON LIST FILE (APPROX)
	static const int commonListFileSize;

	//TAG TO DENOTE NAME DETECTION IN GENERATED PATTERN
	static const string nameListTag;

	//TAG TO DENOTE EMAIL NAME DETECTION IN GENERATED PATTERN
	static const string emailNameTag;
	
	//TAG TO DENOTE WEBSITE DETECTION IN GENERATED PATTERN
	static const string websiteTag;

	//TAG TO DENOTE DOB DETECTION IN GENERATED PATTERN
	static const string dobListTag;

	//TAG TO DENOTE LOCATION DETECTION IN GENERATED PATTERN
	static const string locationListTag;

	//TAG TO DENOTE MOBILE DETECTION IN GENERATED PATTERN
	static const string mobileListTag;

	//TAG TO DENOTE FIRST COMMON WORD DETECTION IN GENERATED PATTERN
	static const string common1ListTag;

	//TAG TO DENOTE SECOND COMMON WORD DETECTION IN GENERATED PATTERN
	static const string common2ListTag;

	//TAG TO DENOTE THIRD COMMON WORD DETECTION IN GENERATED PATTERN
	static const string common3ListTag;

	//DELIMITER OR DIVIDER FOR OUTPUT OF PROGRAM
	static const string outputDelimiter;

	//VARIABLE TO DENOTE LENGTH(LENGTH:) OF DETECTED VALUE IN GIVEN PASSWORD
	static const string outputLengthDelimiter;
	
	//VARIABLE TO DENOTE POSITION(POSITION:) OF DETECTED VALUE IN GIVEN PASSWORD
	static const string outputPositionDelimiter;

	//TAG TO DENOTE UNDETECTED PART DETECTION IN GENERATED PATTERN
	static const string undetectedTag;

	//FOLDER ADDRESS WHICH CONTAINS ALL THE PATTERN DATA FILES
	static string patternDataFolderAddress;

	//PATTERN CATEGORIES FILE ADDRESS 
	static string patternCategoriesFileAddress;

	//DELIMITER OR DIVIDER IN GIVEN INPUT FILES (EMAIL|DELIMITER|PASSWORD)
	static const string inputDelimiter;

	//ADDRESS OF INPUT FOLDER 
	static string inputFolderAddress;

	//ADDRESS OF OUTPUT FOLDER
	static string outputFolderAddress;
	
	//PREFIX FOR OUTPUT FILES
	static const string outputFileName;
	
	//DEFAULT EMAIL WHEN NO EMAIL IS GIVEN (ONLY FOR SINGLE TARGET PATTERN GENERATION)
	static const string defaultEmailString;
	
	//TEMPORARY FILE ADDRESS FOR PATTERN GENERATION FOR A SINGLE TARGET
	static string singleTargetFileDirectory;

	//TEMPORARY FOLDER ADDRESS
	static string tempFolderAddress;

	/*
		1. IMPORTANT: THIS FUNCTION MUST BE CALLED IN ADDON API LAYER BEFORE
		   ANY BACKEND CALL TO ADJUST PATHS ACCORDING TO PLATFORMS. 
		2. ADDING PROJECT DIRECTORY ADDRESS AS PREFIX OF RELATIVE PATHS.
	*/
    static void add_project_directory_path(const string projectDirectory);
    
};

#endif // !CONSTANT_H
