#include "AddonAPI.h"
#include "APILayer.h"
#include "Constants.h"

//Working
std::string AddonAPI::stats_generator_api(int numberOfThreads, string projectDirectory){
	/*
		Function to call stats generator function of c++ backend.
		To generate pattern categories, category data files, popularity of each category.
		@ param { int } numberOfThreads Number of threads for parallel execution.
	*/
	//check if number of threads are out of boundaries
	if(numberOfThreads < 2){
		numberOfThreads = 2;
	}
	if(numberOfThreads > 4){
		numberOfThreads = 4;
	}

	//set project directory path
	Constants::add_project_directory_path(projectDirectory);

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
	if(info.Length()<2 || !info[0].IsNumber() || !info[1].IsString()){
		Napi::TypeError::New(env, "arg1::Number, arg2::String expected").ThrowAsJavaScriptException();
	}

	//convert c++ datatype to javascripts
	Napi::Number first = info[0].As<Napi::Number>();
 	Napi::String second = info[1].As<Napi::String>();	

	//get c++ function return value and return it in javascript
 	Napi::String returnValue = Napi::String::New(env, AddonAPI::stats_generator_api(first.Int32Value(), second.Utf8Value()));

	return returnValue;
}


std::string AddonAPI::analyze_data_api(int numberOfThreads, string projectDirectory){
	/*
		Api function to call main process of c++ backend (detect patterns out raw data)
	*/
	
	//check if number of threads are out of boundaries
	if(numberOfThreads < 2){
		numberOfThreads = 2;
	}
	if(numberOfThreads > 8){
		numberOfThreads = 6;
	}

	//set project directory path
	Constants::add_project_directory_path(projectDirectory);

	//call C++ backend
	APILayer::main_program(numberOfThreads);
  	//acknowledgment 
	return std::to_string(numberOfThreads);
}

Napi::String AddonAPI::analyze_data_wrapped(const Napi::CallbackInfo& info){
	/*
		Wrapper for analyze_data_api() function. This wrapper is required to convert
		c++ datatypes into javascirpt form.
		This will check if passed arguments is a number.
	*/
	
	//next-generation-api(Napi) operations
	Napi::Env env = info.Env();

	//check if there is only one argument and it is a number.	
	if(info.Length()<1 || !info[0].IsNumber() || !info[1].IsString()){
		Napi::TypeError::New(env, "arg1::Number, arg2::String expected").ThrowAsJavaScriptException();
	}

	//convert c++ datatype to javascripts
	Napi::Number first = info[0].As<Napi::Number>();
 	Napi::String second = info[1].As<Napi::String>();

	//get c++ function return value and return it in javascript
	Napi::String returnValue = Napi::String::New(env, AddonAPI::analyze_data_api(first.Int32Value(), second.Utf8Value()));
	return returnValue;
}


std::string AddonAPI::target_password_api(string password, string email, string projectDirectory){
	/*
		Function to call target process of c++ backend.
		To detect pattern out of single password and email.
		@ param { string } password string this is required 
		@ param { string } email string this is optional 
	*/

	string resultString;

	//set project directory path
	Constants::add_project_directory_path(projectDirectory);

	//call backend
	if(email!=""){
		resultString = APILayer::process_target(password, email);
	}else{
		resultString = APILayer::process_target(password);
	}
	
	//result
  	return resultString;
}

Napi::String AddonAPI::target_password_wrapped(const Napi::CallbackInfo& info)
{	
	/*
		Wrapper for target_password_api() function. This wrapper is required to convert
		c++ datatypes into javascirpt form.
		This will check if passed arguments is a string.
	*/

	//next-generation-api(Napi) operations
	Napi::Env env = info.Env();

	//check if there is both arguments and they are strings.
	if(info.Length()<2 || !info[0].IsString() || !info[1].IsString() || !info[2].IsString()){
		Napi::TypeError::New(env, "arg1::String, arg2::String, arg3::String expected").ThrowAsJavaScriptException();
	}

	//convert c++ datatype to javascripts
	Napi::String first = info[0].As<Napi::String>();
	Napi::String second = info[1].As<Napi::String>();
 	Napi::String third = info[2].As<Napi::String>();

	//get c++ function return value and return it in javascript
 	Napi::String returnValue = Napi::String::New(env, AddonAPI::target_password_api(first.Utf8Value(), second.Utf8Value(), third.Utf8Value()));

	return returnValue;
}



//Export API function
Napi::Object AddonAPI::Init(Napi::Env env, Napi::Object exports) 
{
	//export stats function
	exports.Set("stats_generator_api", Napi::Function::New(env, AddonAPI::stats_generator_wrapped));
	//export analyze function
	exports.Set("analyze_data_api", Napi::Function::New(env, AddonAPI::analyze_data_wrapped));
	//export target password function
	exports.Set("target_password_api", Napi::Function::New(env, AddonAPI::target_password_wrapped));

	return exports;
}