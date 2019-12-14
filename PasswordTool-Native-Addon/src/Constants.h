#ifndef CONSTANT_H
#define CONSTANT_H

#include<iostream>

using namespace std;


class Constants
{
public:
	
	//Error log file name 
	static const string errorLogFileName;
	
	//Huge files gets resized first. So, this will be prefix for their name
	static const string resizedFileName;
	
	//Size of smaller files will be decided by this variable
	static const int resizedFileSize;
	
	//String variable to store .txt extension
	static const string txtExtension;

	//Address of name list file
	static const string nameListFileAddress;
	
	//Address of dob list file
	static const string dobListFileAddress;
	
	//Address of location list file
	static const string locationListFileAddress;
	
	//Address of common list file
	static const string commonListFileAddress;

	//Total number of lines in name list file (APPROX)
	static const int nameListFileSize;
	
	//Total number of lines in dob list file (APPROX)
	static const int dobListFileSize;

	//Total number of lines in location list file (APPROX)
	static const int locationListFileSize;

	//Total number of lines in common list file (APPROX)
	static const int commonListFileSize;

	//Tag to denote name detection in generated pattern
	static const string nameListTag;

	//Tag to denote email name detection in generated pattern
	static const string emailNameTag;
	
	//Tag to denote website detection in generated pattern
	static const string websiteTag;

	//Tag to denote dob detection in generated pattern
	static const string dobListTag;

	//Tag to denote location detection in generated pattern
	static const string locationListTag;

	//Tag to denote mobile detection in generated pattern
	static const string mobileListTag;

	//Tag to denote first common word detection in generated pattern
	static const string common1ListTag;

	//Tag to denote second common word detection in generated pattern
	static const string common2ListTag;

	//Tag to denote third common word detection in generated pattern
	static const string common3ListTag;

	//Dilimiter or divider for output of program
	static const string outputDelimiter;

	//variable to denote length(Length:) of detected value in given password
	static const string outputLengthDelimiter;
	
	//variable to denote position(Position:) of detected value in given password
	static const string outputPositionDelimiter;

	//Tag to denote undetected part detection in generated pattern
	static const string undetectedTag;

	//Folder address which contains all the pattern data files
	static const string patternDataFolderAddress;

	//Pattern categories file address 
	static const string patternCategoriesFileAddress;

	//Delimiter or divider in given input files (Email|DELIMITER|Password)
	static const string inputDelimiter;

	//Address of input folder 
	static const string inputFolderAddress;

	//Address of output folder
	static const string outputFolderAddress;
	
	//Prefix for output files
	static const string outputFileName;
	
	//Default email when no email is given (only for single target pattern generation)
	static const string defaultEmailString;
	
	//Temporary file address for pattern generation for a single target
	static const string singleTargetFileAddress;

	//Temporary folder address
	static const string tempFolderAddress;

};

#endif // !CONSTANT_H
