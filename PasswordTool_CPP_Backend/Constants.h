#ifndef CONSTANT_H
#define CONSTANT_H

#include<iostream>

using namespace std;


class Constants
{
public:
	
	//ERROR LOG FILE NAME 
	static const string errorLogFileName;
	
	//HUGE FILES GETS RESIZED FIRST. SO, THIS WILL BE PREFIX FOR THEIR NAME
	static const string resizedFileName;
	
	//SIZE OF SMALLER FILES WILL BE DECIDED BY THIS VARIABLE
	static const int resizedFileSize;
	
	//STRING VARIABLE TO STORE .TXT EXTENSION
	static const string txtExtension;

	//ADDRESS OF NAME LIST FILE
	static const string nameListFileAddress;
	
	//ADDRESS OF DOB LIST FILE
	static const string dobListFileAddress;
	
	//ADDRESS OF LOCATION LIST FILE
	static const string locationListFileAddress;
	
	//ADDRESS OF COMMON LIST FILE
	static const string commonListFileAddress;

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
	static const string patternDataFolderAddress;

	//PATTERN CATEGORIES FILE ADDRESS 
	static const string patternCategoriesFileAddress;

	//DELIMITER OR DIVIDER IN GIVEN INPUT FILES (EMAIL|DELIMITER|PASSWORD)
	static const string inputDelimiter;

	//ADDRESS OF INPUT FOLDER 
	static const string inputFolderAddress;

	//ADDRESS OF OUTPUT FOLDER
	static const string outputFolderAddress;
	
	//PREFIX FOR OUTPUT FILES
	static const string outputFileName;
	
	//DEFAULT EMAIL WHEN NO EMAIL IS GIVEN (ONLY FOR SINGLE TARGET PATTERN GENERATION)
	static const string defaultEmailString;
	
	//TEMPORARY FILE ADDRESS FOR PATTERN GENERATION FOR A SINGLE TARGET
	static const string singleTargetFileAddress;

	//TEMPORARY FOLDER ADDRESS
	static const string tempFolderAddress;

};

#endif // !CONSTANT_H
