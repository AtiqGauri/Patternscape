#include "Comparison.h"
#include "Constants.h"

DataCleanser dataCleanser;

void Comparison::load_data(vector<string>::iterator beginIt, vector<string>::iterator endIt, int reserveSize) {
	/*
		HERE DATA WILL BE LOADED INTO A VECTOR ACCORDING TO RESERVESIZE VALUE
	*/
	rawData.reserve(reserveSize);
	rawData.insert(rawData.end(), beginIt, endIt);
}

void Comparison::lower_case_raw_data() {
	/*
		HERE DATA WILL BE LOWER CASED 
	*/
	for (auto it = rawData.begin(); it != rawData.end(); it++) {
		transform(it->begin(), it->end(), it->begin(), ::tolower);
	}
}

void Comparison::extract_email_and_password(string delimiter) {
	/*
		DELIMITER IS SEPERATING STRING OF EMAIL AND PASSWORD E.G. ':'
		HERE EMAIL AND PASSWORD WILL BE EXTRACTED OUT AND STORED IN RESPECTIVE VECTORS
		STEP 1. FOR LOOP WILL ITERATE OVER RAWDATA ONE BY ONE
		STEP 2. FIRST WE WILL FIND @ FROM THERE WE WILL FIND DELIMITER. THIS IS FOR AVOIDING
				FRONT PART WHICH CAN INCLUDE ':' DELIMITER
		STEP 3. CONTENT BEFORE DELIMITER AND AFTER DELIMITER WILL BE SEPARATED ON BASIS OF LOCATIONS
	*/
	size_t found, foundDelimeter;
	emailsList.reserve(rawData.size());
	passwordsList.reserve(rawData.size());
	for (auto it = rawData.begin(); it != rawData.end(); it++) {
		found = it->find("@");
		if (found != string::npos) {
			foundDelimeter = it->find(delimiter, found + 1);
			if (foundDelimeter != string::npos) {
				emailsList.push_back(it->substr(0, foundDelimeter));
				passwordsList.push_back(it->substr(foundDelimeter + 1, it->length() - 1));
				continue;
			}
		}
	}
	rawData.clear(); rawData.shrink_to_fit();
}

void Comparison::extract_email_names_and_websites() {
	/*
		HERE WE WILL EXTRACT EMAIL BOTH HALF PART AS EMAIL NAME AND WEBSITE
		STEP 1. FIRST WE WILL FIND @ SYMBOL WHICH CAN BE SEEN AS MIDDLE LOCATION
		STEP 2. CONTENT BEFORE @ AND AFTER @ WILL BE SEPERATED OUT IN TWO STRINGS
		STEP 3. BOTH STRINGS WILL BE STORED IN RESPECTIVE VECTORS
	*/
	size_t found;
	emailNamesList.reserve(emailsList.size());
	websitesList.reserve(emailsList.size());
	for (auto it = emailsList.begin(); it != emailsList.end(); it++) {
		found = it->find("@");
		if (found != string::npos) {
			emailNamesList.push_back(it->substr(0, found));
			websitesList.push_back(it->substr(found + 1, it->length() - 1));
			continue;
		}
	}
	emailsList.clear(); emailsList.shrink_to_fit();
}

void Comparison::name_list_comparison(string password) {
	/*
		HERE PASSWORD STRING WILL BE COMPARED AGAINST ALL COMMON NAME LISTS
		STEP 1. AN ITERATOR WILL SET ON NAME LIST VECTOR
		STEP 2. WHILE LOOP WILL CHECK IF ANY NAME EXISTS IN PASSWORD STRING
		STEP 3. IF SO THEN RESULT WILL BE ADDED WITH LOCATION, LENGTH, TAG AND CONTENT
	*/
	/*
	auto it = Resources::namesList.begin();
	while (it != Resources::namesList.end()) {
		size_t found = password.find(*it);
		if (found != string::npos) {
			results.push_back({ Constants::nameListTag, *it, static_cast<int>(it->length()), static_cast<int>(found) });
		}
		it++;
	}
	*/
	dataCleanser.all_sub_strings(passwordSubStrings, password);
	for (int i = 0; i < passwordSubStrings.size(); i++) {
		if (Resources::namesList1.find(passwordSubStrings[i]) != Resources::namesList1.end()) {
			results.push_back({ Constants::nameListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
			//n2Results.push_back({ Constants::nameListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
		}
	}
}

void Comparison::email_name_list_comparison(string password, vector<string>::iterator& password_it) {
	/*
		HERE EMAIL NAME/ FRONT PART OF EMAIL WILL BE COMPARED AGAINST PASSWORD STRING
		STEP 1. FIRST ACCORDING TO PASSWORD NUMBER ITS RESPECTIVE EMAIL FRONT WILL BE CALLED
		STEP 2. IF STATEMENT WILL CHECK IF FRONT PART EXISTS IN PASSWORD OR NOT
		STEP 3. IF SO THEN RESULT WILL BE ADDED WITH LOCATION, LENGTH, TAG AND CONTENT
	*/
	string temp = emailNamesList.at(distance(passwordsList.begin(), password_it));
	size_t found = password.find(temp);
	if (found != string::npos) {
		results.push_back({ Constants::emailNameTag, temp, static_cast<int>(temp.length()), static_cast<int>(found) });
	}
}

void Comparison::website_list_comparison(string password, vector<string>::iterator& password_it) {
	/*
		HERE WEBSITE PART OF EMAIL WILL BE COMPARED AGAINST PASSWORD STRING
		STEP 1. FIRST ACCORDING TO PASSWORD NUMBER ITS RESPECTIVE WEBSITE PART WILL BE CALLED
		STEP 2. IF STATEMENT WILL CHECK IF WEBSITE PART EXISTS IN PASSWORD OR NOT
		STEP 3. IF SO THEN RESULT WILL BE ADDED WITH LOCATION, LENGTH, TAG AND CONTENT
	*/
	string temp = websitesList.at(distance(passwordsList.begin(), password_it));
	size_t found = password.find(temp);
	if (found != string::npos) {
		results.push_back({ Constants::websiteTag, temp, static_cast<int>(temp.length()), static_cast<int>(found) });
	}
}

void Comparison::dob_list_comparison(string password) {
	/*
		HERE DOB LISTS WILL BE COMPARED AGAINST PASSWORD STRING
		STEP 1. AN ITERATOR WILL SET ON DOB LIST VECTOR
		STEP 2. WHILE LOOP WILL CHECK IF ANY DOB EXISTS IN PASSWORD STRING
		STEP 3. IF SO THEN RESULT WILL BE ADDED WITH LOCATION, LENGTH, TAG AND CONTENT
	*/
	/*
	vector<string>::iterator it = Resources::dobsList.begin();
	while (it != Resources::dobsList.end()) {
		size_t found = password.find(*it);
		if (found != string::npos) {
			results.push_back({ Constants::dobListTag, *it, static_cast<int>(it->length()), static_cast<int>(found) });
		}
		it++;
	}
	*/
	for (int i = 0; i < passwordSubStrings.size(); i++) {
		if (Resources::dobsList1.find(passwordSubStrings[i]) != Resources::dobsList1.end()) {
			results.push_back({ Constants::dobListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
			//n2Results.push_back({ Constants::nameListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
		}
	}
}


void Comparison::location_list_comparison(string password) {
	
	/*
		HERE LOCATION LISTS WILL BE COMPARED AGAINST PASSWORD STRING
		STEP 1. AN ITERATOR WILL SET ON LOCATION LIST VECTOR
		STEP 2. WHILE LOOP WILL CHECK IF ANY LOCATION EXISTS IN PASSWORD STRING
		STEP 3. IF SO THEN RESULT WILL BE ADDED WITH LOCATION, LENGTH, TAG AND CONTENT
	*/
	/*
	vector<string>::iterator it = Resources::locationsList.begin();
	while (it != Resources::locationsList.end()) {
		size_t found = password.find(*it);
		if (found != string::npos) {
			results.push_back({ Constants::locationListTag, *it, static_cast<int>(it->length()), static_cast<int>(found) });
		}
		it++;
	}
	*/
	for (int i = 0; i < passwordSubStrings.size(); i++) {
		if (Resources::locationsList1.find(passwordSubStrings[i]) != Resources::locationsList1 .end()) {
			results.push_back({ Constants::locationListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
			//n2Results.push_back({ Constants::nameListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
		}
	}
}

void Comparison::mobile_number_comparison(string password) {
	/*
		HERE PASSWORD STRING WILL BE EXAMINED TO TEST IF THEIR ANY MOBILE NUMBER EXISTS
		STEP 1. FOR LOOP WILL ITERATE OVER EVERY CHARACTER OF PASSWORD STRING
		STEP 2. FIRST IF WILL CHECK IF CURRENT CHARACTER IS A DIGIT OR NOT. IF IT IS A DIGIT
				THEN PROGRAM WILL CONTINUE TO FURTHER STATEMENTS ELSE WILL BE CONTINUE TO NEXT CHARACTER.
		STEP 3. SECOND IF WILL CHECK IF PASSWORD HAS ANOTHER 3 CHARACTER AFTER CURRENT CHARACTER
				IF NOT THEN LOOP WILL BE BRAKED
		STEP 4. THIRD IF WILL CHECK  IF ALL THESE 4 CHARACTER INCLUDING CURRENT CHARACTER ARE DIGITS OR NOT.
				IF NOT THEN LOOP WILL BE CONTINUED TO NEXT CHARACTER.
		STEP 5. SECOND FOR LOOP WILL CHECK AFTER THESE 4 CHARACTER INCLUDING CURRENT CHARACTER ARE THERE
				ANYMORE DIGITS ARE PRESENT. IF THERE ARE MORE DIGIT THEN IT WILL CHECK HOW MANY ARE THERE.
		STEP 6. FINALLY RESULT WILL BE ADDED WITH LOCATION, LENGTH, TAG AND CONTENT
	*/
	size_t passLen = password.length();
	bool flag = false;
	for (int i = 0; i < passLen; i++) {
		if (dataCleanser.is_digit(password[i])) {
			if ((i + (size_t)3) < passLen) {
				if (dataCleanser.is_digit(password[i + (size_t)3]) && dataCleanser.is_digit(password[i + (size_t)1]) && dataCleanser.is_digit(password[i + (size_t)2])) {
					//int j = 0;
					for (int j = (i + (size_t)3); j < passLen; j++) {
						if (!dataCleanser.is_digit(password[j])) {
							results.push_back({ Constants::mobileListTag, password.substr(i, j - (size_t)i), (j - i), i });
							flag = true;
							break;
						}
						else if (dataCleanser.is_digit(password[j]) && (j + (size_t)1) == passLen) {
							results.push_back({ Constants::mobileListTag, password.substr(i, passLen), (j - i + 1), i });
							flag = true;
							break;
						}
					}
					if (flag) {
						break;
					}
				}
				else
				{
					continue;
				}
			}
			else
			{
				break;
			}
		}
		else
		{
			continue;
		}
	}
}

void Comparison::common_word_list_comparison(string password) {
	/*
		HERE COMMON WORDS LISTS WILL BE COMPARED AGAINST PASSWORD STRING
		STEP 1. AN ITERATOR WILL SET ON COMMON WORDS LIST VECTOR
		STEP 2. WHILE LOOP WILL CHECK IF ANY COMMON WORD EXISTS IN PASSWORD STRING
		STEP 3. MAXIMUM 3 COMMON WORDS WILL BE FIND IN A SINGLE PASSWORD STRING (USING IF STATEMENTS)
		STEP 3. IF SO THEN RESULT WILL BE ADDED WITH LOCATION, LENGTH, TAG AND CONTENT
	*/
	/*
	vector<string>::iterator it = Resources::commonsList.begin();
	string rawS1, rawS2;
	bool flag1 = false, flag2 = false, flag3 = false;
	while (it != Resources::commonsList.end()) {
		size_t found = password.find(*it);
		if (found != string::npos && !flag1) {
			results.push_back({ Constants::common1ListTag, *it, static_cast<int>(it->length()), static_cast<int>(found) });
			rawS1 = password.substr(0, found);
			rawS2 = password.substr(found + it->length(), password.length() - 1);
			found = string::npos;
			flag1 = true;
		}
		found = rawS1.find(*it);
		if (found != string::npos && (flag1 && !flag2)) {
			results.push_back({ Constants::common2ListTag, *it, static_cast<int>(it->length()), static_cast<int>(found) });
			found = string::npos;
			flag2 = true;
		}
		found = rawS2.find(*it);
		if ((found != string::npos && flag1) && (flag2 && !flag3)) {
			results.push_back({ Constants::common3ListTag, *it, static_cast<int>(it->length()), static_cast<int>(found) });
			flag3 = true;
		}
		it++;
	}
	flag1 = false; flag2 = false; flag3 = false;
	*/


	bool flag1 = false, flag2 = false, flag3 = false;
	int i=0;
	while (i<passwordSubStrings.size()) {
		if (!flag1 && Resources::commonsList1.find(passwordSubStrings[i]) != Resources::commonsList1.end()) {
			results.push_back({ Constants::common1ListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
			flag1 = true;
			i++;
			continue;
		}
		if ((!flag2 && flag1) && Resources::commonsList1.find(passwordSubStrings[i]) != Resources::commonsList1.end()) {
			results.push_back({ Constants::common2ListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
			flag2 = true;
			i++;
			continue;
		}
		if ((!flag3 && Resources::commonsList1.find(passwordSubStrings[i]) != Resources::commonsList1.end()) && (flag2 && flag1)) {
			results.push_back({ Constants::common3ListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
			flag3 = true;
			i++;
			break;
		}
		i++;
	}
	flag1 = false; flag2 = false; flag3 = false;
	/*
	bool flag1 = false, flag2 = false, flag3 = false;
	for (int i = 0; i < passwordSubStrings.size(); i++) {
		if (!flag1 && Resources::commonsList1.find(passwordSubStrings[i]) != Resources::commonsList1.end()) {
			results.push_back({ Constants::common1ListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
			flag1 = true;
			continue;
		}
		if ((!flag2 && flag1) && Resources::commonsList1.find(passwordSubStrings[i]) != Resources::commonsList1.end()) {
			results.push_back({ Constants::common2ListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
			flag2 = true;
			continue;
		}
		if ((!flag3 && Resources::commonsList1.find(passwordSubStrings[i]) != Resources::commonsList1.end()) && (flag2 && flag1)) {
			results.push_back({ Constants::common3ListTag, passwordSubStrings[i], static_cast<int>(passwordSubStrings[i].size()), static_cast<int>(password.find(passwordSubStrings[i])) });
			flag3 = true;
			break;
		}
	}
	flag1 = false; flag2 = false; flag3 = false;
	*/
}

void Comparison::clear_and_shrink() {
	/*
		Here vectors and other members will be cleared and shrinked to release memory
	*/
	results.clear(); results.shrink_to_fit();
	passwordsList.clear(); passwordsList.shrink_to_fit();
	emailNamesList.clear(); emailNamesList.shrink_to_fit();
	websitesList.clear(); websitesList.shrink_to_fit();
}