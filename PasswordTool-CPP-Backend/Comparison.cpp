#include "Comparison.h"
#include "Constants.h"

DataCleanser dataCleanser;

void Comparison::load_data(vector<string>::iterator beginIt, vector<string>::iterator endIt, int reserveSize) {
	/*
		Here data will be loaded into a vector according to reserveSize value
	*/
	rawData.reserve(reserveSize);
	rawData.insert(rawData.end(), beginIt, endIt);
}

void Comparison::lower_case_raw_data() {
	/*
		Here data will be lower cased 
	*/
	for (auto it = rawData.begin(); it != rawData.end(); it++) {
		transform(it->begin(), it->end(), it->begin(), ::tolower);
	}
}

void Comparison::extract_email_and_password(string delimiter) {
	/*
		delimiter is seperating string of email and password e.g. ':'
		Here email and password will be extracted out and stored in respective vectors
		Step 1. for loop will iterate over rawdata one by one
		Step 2. first we will find @ from there we will find delimiter. This is for avoiding
				front part which can include ':' delimiter
		Step 3. content before delimiter and after delimiter will be sperated on basis of locations
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
		Here we will extract email both half part as email name and website
		Step 1. first we will find @ symbol which can be seen as middle location
		Step 2. content before @ and after @ will be seperated out in two strings
		Step 3. both strings will be stored in respective vectors
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
		Here password string will be compared against all common name lists
		Step 1. an iterator will set on name list vector
		Step 2. while loop will check if any name exists in password string
		Step 3. if so then result will be added with location, length, tag and content
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
		Here email name/ front part of email will be compared against password string
		Step 1. first according to password number its respective email front will be called
		Step 2. if statement will check if front part exists in password or not
		Step 3. if so then result will be added with location, length, tag and content
	*/
	string temp = emailNamesList.at(distance(passwordsList.begin(), password_it));
	size_t found = password.find(temp);
	if (found != string::npos) {
		results.push_back({ Constants::emailNameTag, temp, static_cast<int>(temp.length()), static_cast<int>(found) });
	}
}

void Comparison::website_list_comparison(string password, vector<string>::iterator& password_it) {
	/*
		Here website part of email will be compared against password string
		Step 1. first according to password number its respective website part will be called
		Step 2. if statement will check if website part exists in password or not
		Step 3. if so then result will be added with location, length, tag and content
	*/
	string temp = websitesList.at(distance(passwordsList.begin(), password_it));
	size_t found = password.find(temp);
	if (found != string::npos) {
		results.push_back({ Constants::websiteTag, temp, static_cast<int>(temp.length()), static_cast<int>(found) });
	}
}

void Comparison::dob_list_comparison(string password) {
	/*
		Here DOB lists will be compared against password string
		Step 1. an iterator will set on DOB list vector
		Step 2. while loop will check if any dob exists in password string
		Step 3. if so then result will be added with location, length, tag and content
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
		Here location lists will be compared against password string
		Step 1. an iterator will set on location list vector
		Step 2. while loop will check if any location exists in password string
		Step 3. if so then result will be added with location, length, tag and content
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
		Here common words lists will be compared against password string
		Step 1. an iterator will set on common words list vector
		Step 2. while loop will check if any common word exists in password string
		Step 3. maximum 3 common words will be find in a single password string (using if statments)
		Step 3. if so then result will be added with location, length, tag and content
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