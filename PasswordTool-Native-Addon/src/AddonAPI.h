#include <napi.h>
#include <iostream>
#include <string>
#include <vector>
#include <fstream>

using namespace std;

namespace AddonAPI {

	/*
		Function to call stats generator function of c++ backend.
		To generate pattern categories, category data files, popularity of each category.
		@ param { int } numberOfThreads Number of threads for parallel execution.
	*/
  	std::string stats_generator_api(int numberOfThreads);
  	
	/*
		Wrapper for stats_generator_api() function. This wrapper is required to convert
		c++ datatypes into javascirpt form.
		This will check if passed arguments is a number.
	*/
	Napi::String stats_generator_wrapped(const Napi::CallbackInfo& info);
	
	/*
		Api function to call main process of c++ backend (detect patterns out raw data)
	*/
  	int analyze_data_api(int numberOfThreads);
  	
	/*
		Wrapper for analyze_data_api() function. This wrapper is required to convert
		c++ datatypes into javascirpt form.
		This will check if passed arguments is a number.
	*/
	Napi::Number analyze_data_wrapped(const Napi::CallbackInfo& info);


	//Export API
  	Napi::Object Init(Napi::Env env, Napi::Object exports);
  	NODE_API_MODULE(taddon, Init)
}