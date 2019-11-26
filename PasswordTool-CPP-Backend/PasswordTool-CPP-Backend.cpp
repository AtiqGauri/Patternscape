#include <iostream>
#include"APILayer.h"

/*
************************************
PROJECT SETTINGS
************************************
1. Project -> Project Properties -> C/C++ -> Language -> C++ Language Standard -> std:c++latest

2. Set Project in Release mode

3. Set Arch to 64x (optional)
*/


int main()
{

	auto start = APILayer::time_stamp();
	APILayer::main_program(4);
	//APILayer::pattern_stats(2);
	auto stop = APILayer::time_stamp();
	cout << "Program RunTime:  "; APILayer::time_elasped(start, stop);

	int i; cin >> i;
	return 0;
}