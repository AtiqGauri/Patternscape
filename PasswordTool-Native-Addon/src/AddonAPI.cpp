#include "AddonAPI.h"
#include "APILayer.h"

//Working
std::string AddonAPI::stats_generator_api(int numberOfThreads){
	/*
		Function to call stats generator function of c++ backend.
		To generate pattern categories, category data files, popularity of each category.
		@ param { int } numberOfThreads Number of threads for parallel execution.
	*/
	//check if number of threads are out of boundaries
	if(numberOfThreads > 8 || numberOfThreads < 2){
		numberOfThreads = 2;
	}
	//call backend
	APILayer::pattern_stats(numberOfThreads);
	
	//acknowledgment
  	return "Stats Generated";
}

Napi::String AddonAPI::stats_generator_wrapped(const Napi::CallbackInfo& info)
{	
	/*
		Wrapper for stats_generator_api() function. This wrapper is required to convert
		c++ datatypes into javascirpt form.
		This will check if passed arguments is a number.
	*/

	//next-generation-api(Napi) operations
	Napi::Env env = info.Env();

	//check if there is only one argument and it is a number.
	if(info.Length()<1 || !info[0].IsNumber()){
		Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
	}

	//convert c++ datatype to javascripts
	Napi::Number first = info[0].As<Napi::Number>();

	//get c++ function return value and return it in javascript
	Napi::String returnValue = Napi::String::New(env, AddonAPI::stats_generator_api(first.Int32Value()));

	return returnValue;
}


int AddonAPI::analyze_data_api(int numberOfThreads){
	/*
		Api function to call main process of c++ backend (detect patterns out raw data)
	*/
	
	//check if number of threads are out of boundaries
	if(numberOfThreads > 8 || numberOfThreads < 2){
		numberOfThreads = 2;
	}
	//call C++ backend
	APILayer::main_program(numberOfThreads);
  	//acknowledgment 
	return numberOfThreads;
}

Napi::Number AddonAPI::analyze_data_wrapped(const Napi::CallbackInfo& info){
	/*
		Wrapper for analyze_data_api() function. This wrapper is required to convert
		c++ datatypes into javascirpt form.
		This will check if passed arguments is a number.
	*/
	
	//next-generation-api(Napi) operations
	Napi::Env env = info.Env();

	//check if there is only one argument and it is a number.	
	if(info.Length()<1 || !info[0].IsNumber()){
		Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
	}

	//convert c++ datatype to javascripts
	Napi::Number first = info[0].As<Napi::Number>();

	//get c++ function return value and return it in javascript
	int returnValue = AddonAPI::analyze_data_api(first.Int32Value());
	return Napi::Number::New(env, returnValue);
}



//Export API function
Napi::Object AddonAPI::Init(Napi::Env env, Napi::Object exports) 
{
	//export stats function
	exports.Set("stats_generator_api", Napi::Function::New(env, AddonAPI::stats_generator_wrapped));
	//export analyze function
	exports.Set("analyze_data_api", Napi::Function::New(env, AddonAPI::analyze_data_wrapped));

	return exports;
}