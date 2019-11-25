#ifndef PATTERN_H
#define PATTERN_H

#include<iostream>
#include<vector>
#include<mutex>
#include<string>
#include"Resources.h"

using namespace std;

class Patterns
{
public:
	vector<Resources::patternStructure> rawResults;//storing raw results to make them into patterns
	vector<vector<Resources::patternStructure>> splittedResults;//required in pattern creation
	vector<string> output;//processed output / final patterns

	/*
		Here processed data will be converted into patterns
		Step 1. sort data
		Step 2. call divide_patterns() on data to divide overlapping patterns and addressing undetected part
		Step 3. sort data on basis of struct length element
		Step 4. Formatting output and write it in a file
	*/
	void pattern(string password);

	/*
		This function takes a vector of type patternStructure and sort it
		on the basis of its length element
	*/
	void sort_vector_struct_on_length(vector<Resources::patternStructure>& x);

	/*
		This function takes a vector of type patternStructure and sort it
		on the basis of its location element
	*/
	void sort_vector_struct_on_location(vector<Resources::patternStructure>& x);
	
	/*
		Here a single pattern get divided into multiple if it overlapping itself.
		To address undetected part Undetected() will called after dividing patter in multiple patterns
		Step 1. every part will be tested to verify location attribute is overlapping or not
		Step 2. if so then overlapping part will be called reqursivly and current part will be stored.
		Step 3. this will end with calling Undetected() on all the patterns.
	*/
	void divide_patterns(vector<Resources::patternStructure>& patternVector, string password);

	/*
		This function takes splittedResults and analyse their undetected part to add undetected tag.
		Step 1. every pattern will go through for loop one by one
		Step 2. for loop has 3 if statements to address front - middle - end part of pattern
		Step 3. first if will check if location 0 is an undetected part or not
		Step 4. second if will run a loop until last detected part to check if there is an undetected
				part in middle
		Step 5. Thired if will check if end of password is undetected part or not
		Step 6. If any part of password is found to be undetected than a tag will we added to that
				location.
	*/
	void undetected(string password);

	/*
		This function starts a mutex to insert output of this thread to main resource output container
	*/
	void insert_output();

	/*
		This function will clear and shrink vectors and other members
	*/
	void clear_and_shrink();
};

#endif