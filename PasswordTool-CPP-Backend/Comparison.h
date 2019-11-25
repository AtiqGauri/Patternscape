#ifndef COMPARISON_H
#define COMPARISON_H

#include<iostream>
#include<vector>
#include<string>
#include<mutex>
#include"FileHandler.h"
#include"DataCleanser.h"
#include"Resources.h"
#include"Patterns.h"

using namespace std;

class Comparison
{
public:
	vector<string> passwordsList;//vector to store passwords of single files
	vector<string> emailsList;//vector to store emails of single files
	vector<string> emailNamesList;//vector to store email_names extracted from emails vector
	vector<string> websitesList;//vector to store websites extracted from emails vector
	vector<string> rawData;//To store temp data for future processing
	vector<Resources::patternStructure> results;//final output of all this process will stored in this vector

	/*
		Here data will be loaded into a vector according to reserveSize value
	*/
	void load_data(vector<string>::iterator beginIt, vector<string>::iterator endIt, int reserveSize);
	
	/*
		This function will lower all incoming data
	*/
	void lower_case_raw_data();

	/*
		delimiter is seperating string of email and password e.g. ':'
		Here email and password will be extracted out and stored in respective vectors
		Step 1. for loop will iterate over rawdata one by one
		Step 2. first we will find @ from there we will find delimiter. This is for avoiding
				front part which can include ':' delimiter
		Step 3. content before delimiter and after delimiter will be sperated on basis of locations
	*/
	void extract_email_and_password(string delimiter);

	/*
		Here we will extract email both half part as email name and website
		Step 1. first we will find @ symbol which can be seen as middle location
		Step 2. content before @ and after @ will be seperated out in two strings
		Step 3. both strings will be stored in respective vectors
	*/
	void extract_email_names_and_websites();

	/*
		Here password string will be compared against all common name lists
		Step 1. an iterator will set on name list vector
		Step 2. while loop will check if any name exists in password string
		Step 3. if so then result will be added with location, length, tag and content
	*/
	void name_list_comparison(string password);

	/*
		Here email name/ front part of email will be compared against password string
		Step 1. first according to password number its respective email front will be called
		Step 2. if statement will check if front part exists in password or not
		Step 3. if so then result will be added with location, length, tag and content
	*/
	void email_name_list_comparison(string password, vector<string>::iterator& password_it);

	/*
		Here website part of email will be compared against password string
		Step 1. first according to password number its respective website part will be called
		Step 2. if statement will check if website part exists in password or not
		Step 3. if so then result will be added with location, length, tag and content
	*/
	void website_list_comparison(string password, vector<string>::iterator& password_it);
	
	/*
		Here DOB lists will be compared against password string
		Step 1. an iterator will set on DOB list vector
		Step 2. while loop will check if any dob exists in password string
		Step 3. if so then result will be added with location, length, tag and content
	*/
	void dob_list_comparison(string password);

	/*
		Here location lists will be compared against password string
		Step 1. an iterator will set on location list vector
		Step 2. while loop will check if any location exists in password string
		Step 3. if so then result will be added with location, length, tag and content
	*/
	void location_list_comparison(string password);

	/*
		Here password string will be examined to test if thier any mobile number exists
		Step 1. for loop will iterate over every character of password string
		Step 2. first if will check if current character is a digit or not. if it is a digit
				then program will continue to further statments else will be continue to next character.
		Step 3. second if will check if password has another 3 character after current character
				if not then loop will be breaked
		Step 4. thired if will check  if all these 4 character including current character are digits or not.
				if not then loop will be continued to next character.
		Step 5. secon for loop will check after these 4 character including current character are there
				anymore digits are present. If there are more digit then it will check how many are there.
		Step 6. finally result will be added with location, length, tag and content
	*/
	void mobile_number_comparison(string password);
	
	/*
		Here common words lists will be compared against password string
		Step 1. an iterator will set on common words list vector
		Step 2. while loop will check if any common word exists in password string
		Step 3. maximum 3 common words will be find in a single password string (using if statments)
		Step 3. if so then result will be added with location, length, tag and content
	*/
	void common_word_list_comparison(string password);

	/*
		Here vectors and other members will be cleared and shrinked to release memory
	*/
	void clear_and_shrink();
};

#endif