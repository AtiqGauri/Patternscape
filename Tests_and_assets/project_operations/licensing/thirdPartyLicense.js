/*
#########################################################################
                        IMPORTANT NOTE
#########################################################################
1. CHECK PROJECT ROOT FOLDER VARIABLE(PROJECT_ROOT) IT SHOULD RESOLVE TO
REPOSITORY FOLDER (Parent folder of PasswordTool_GUI)

2. OUTPUT FILE(./ThirdPartyLicense.txt) WILL HAVE FAILED CASES AT THE 
END OF FILE. WITH A LABEL NOT FOUND FOR LICENSE FIELD.

3. DOWNLOAD LICENSE FORM REPOSITORY URL AND ADD THEM MANUALLY. YOU CAN 
USE PREVIOUSLY GATHERED FAILED CASES DATA AS MENTIONED BELOW. 

4. PERVIOUS MANUALLY HANDLED PACKAGE LICENSE CAN BE FOUND AT 
./manualLicensing.txt

5. UPDATE "./manualLicensing.txt" FILE MANUALLY AND THEN USE IT TO FILL 
FAILED CASES.
#########################################################################
#########################################################################
*/



//GET PLATFORM SPECIFIC USER/APP DATA PATH TO ACCESS NPM GLOBAL PACKAGES
const user_data_path = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
//REQUIRE LICENSE_CHECKER PACKAGE GLOBALLY TO ELSE SHOW ERROR
var license_checker;
try {
  license_checker = require(user_data_path + '/npm/node_modules/license-checker');
} catch (err) {
  console.error("\x1b[31mERROR: license-checker is not installed globally.\n"+
  "APP/USER Data path: "+ user_data_path + "\n"+
  "please install license-checker package globally to process further.\n"+
  "Execute this command to install: npm install -g license-checker \x1b[0m");
  process.exit();
}
const path = require('path');
//PROJECT ROOT FOLDER ADDRESS
PROJECT_ROOT = path.join('..','..','..');
const fs = require(path.join(PROJECT_ROOT, 'PasswordTool_GUI', 'node_modules', 'fs-extra'));


//PATH OF OUTPUT FILE(THIRD PARTY DEPENDENCIES LICENSES)
var output_file = path.join(__dirname, "ThirdPartyLicense.txt");
//ARRAY TO STORE LICENSES
var packages_licenses = [];
//ARRAY TO STORE FAILED CASES (LICENSE NOT FOUND)
var failed_cases = [];
//ARRAY TO STORE FORMATTED RESULTS

//INTEGER TO STORE TOTAL NUMBER OF CASES
var total_packages=0;

license_checker.init(
  {
    //DIRECTORY PATH TO SEARCH DEPENDENCIES
    //CHANGE (IF REQUIRED) IT TO NODE_MODULE PATH
    start: path.join(__dirname, PROJECT_ROOT, "PasswordTool_GUI")
  },
  function(error, json) {
    if (error) {
      console.log(error);
    } else {
        store_package_license(json);
    }
  }
);

/**
 * FUNCTION TO VALIDATE AND STORE FETCHED DATA AS LICENSES
 * @param {OBJECT} json json object containing packages data
 * STEP 1. STORE ALL PACKAGES DATA IN AN ARRAY
 * STEP 2. PRINT ALL PACKAGES NAME IN OUTPUT FILE
 * STEP 3. VALIDATE LICENSE PATH AND ADD SUCCESSFUL CASES
 * STEP 4. ADD FAILED CASES PROFILE WITH NOT_FOUND TAG
 * STEP 5. PRINT NUMBER OF (IF)SUCCESSFUL CASES AND OUTPUT FILE PATH 
 * STEP 6. PRINT NUMBER OF (IF)FAILED CASES WITH FURTHER INSTRUCTION
 */
function store_package_license(json) {  
  Object.keys(json).forEach(function(key) {
      let obj = json[key];
      obj.module = key;
      packages_licenses.push(obj);
    });
    //save total packages numbers to print failed and successfully cases
    total_packages = packages_licenses.length;

    //make a list of packages names and print them in output file
    packages_names();

    //validate(find license file) and add licenses to output file
    validate_add_licenses();

    //add failed cases profile at the end of output file
    add_empty_failed_cases();

    //print successful cases if any
    if((total_packages-failed_cases.length)>0){
      console.log("\n\n\x1b[32mSuccessfully found " + (total_packages-failed_cases.length) + 
      " out of "+ total_packages + " packages license.\n");
      console.log("List of third party dependency licenses can be found at: \x1b[0m" + output_file + " \n");
    }
    //if some licenses are not found then print them on console to handle them manually
    if(failed_cases.length>0){
      console.error("\n\x1b[31m%s\x1b[0m" , "ERROR: WE ARE NOT ABLE TO FIND "
      + failed_cases.length +" LICENSES HANDLE THEM MANUALLY.\n" + 
      "IMPORTANT: FURTHER INSTRUCTION CAN BE FOUND IN \"thirdPartyLicense.js\" SCRIPT.\n\n");
    }
}

/**
 * FUNCTION TO PRINT BOILERPLATE AND PACKAGES NAMES
 * STEP 1. MAKE A OUTPUT STRING AND ADD BOILERPLATE IN IT
 * STEP 2. ADD NAMES OF ALL PACKAGES IN OUTPUT STRING
 * STEP 3. PRINT OUTPUT STRING IN OUTPUT FILE 
 */
function packages_names(){
  //BOILERPLATE
  var output_string="\n\nTHIRD PARTY LICENSES\n\n\n"+
  "LIST OF PACKAGES(DEPENDENCIES, DEV-DEPENDENCIES AND TRANSITIVE-DEPENDENCIES) USED IN THIS PROJECT\n\n";
  
  //ADD PACKAGES NAMES
  for (let i = 0; i < packages_licenses.length; i++) {
    output_string += packages_licenses[i].module + "\n";
  }
  output_string+="\n\n\n\n"+
  "LICENSE OF PACKAGES: \n";

  var file = fs.createWriteStream(output_file);
  file.on('error', function(err) { 
    console.error(err);
  });
  file.write(output_string);
  file.end();
}

/**
 * FUNCTION TO VALIDATE AND ADD PACKAGES LICENSE
 * STEP 1. LOOP THROUGH ALL PACKAGES OBJECTS
 * STEP 2. CHECK IF WE HAVE CORRECT FILE ADDRESS OF LICENSE FILE
 * STEP 3. REMOVE AND STORE FAILED CASES
 * STEP 5. ADD SUCCESSFUL CASES TO OUTPUT FILE
 */
function validate_add_licenses(){
  for (let i = 0; i < packages_licenses.length; i++) {
    //check if license file address is correct
    if (!license_found(packages_licenses[i].licenseFile)){
      //store failed case
      failed_cases.push(packages_licenses[i]);
      //remove failed case
      packages_licenses.splice(i, 1);
      //adjust spliced index
      i--;
    }else{
      //add successful case
      add_license(packages_licenses[i]);
    }
  }
}

/**
 * FUNCTION TO VALIDATE LICENSE FILE ADDRESS
 * STEP 1. SPLIT FILE PATH STRING ACCORDING TO PLATFORM
 * STEP 2. CHECK THE LAST TOKEN OF PATH
 * STEP 3. IF IT IS README FILE THEN RETURN FALSE ELSE TRUE
 * @param {string} filename license file address
 */
function license_found(filename) {
  if (filename) {
    //split path of mac & linux
    var path = filename.split("/");
    if(!filename.includes("/")){
      //split for windows
      path = filename.split("\\");
    }
    if (path.length) {
      let readme = path[path.length - 1];
      //check if last token is readme file 
      if (
        (readme && readme.toUpperCase() == "README.MD") ||
        (readme && readme.toUpperCase() == "README.MARKDOWN")
      ) {
        //it's not license file
        return false;
      }
    }
  }
  return true;
}

/**
 * FUNCTION TO ADD LICENSE TO OUTPUT FILE
 * STEP 1. READ LICENSE FILE
 * STEP 2. ADD PACKAGE, PUBLISHER, LICENSE TYPE AND REPOSITORY NAMES IN OUTPUT STRING
 * STEP 3. ADD LICENSE FILE IN OUTPUT STRING
 * STEP 4. PRINT OUTPUT STRING IN OUTPUT FILE
 * @param {object} item package detail object
 */
function add_license(item) {
  var outputString = "";
  try {
    if (item.licenseFile) {
      let licenseFile = fs.readFileSync(`${item.licenseFile}`, "utf8");
      outputString += "###############################################################\n\n\n\n\n";
      outputString += "Package: " + item.module + "\n";
      outputString += "Publisher: "+ item.publisher + "\t\t\t\tLicense Type: " + item.licenses + "\n";
      outputString += "Repository: " + item.repository + "\n\n";
      outputString += licenseFile;
      outputString += "\n\n\n\n###############################################################\n";
      append_license_file(output_file, outputString);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * FUNCTION TO ADD FAILED CASE PROFILE TO OUTPUT FILE
 * STEP 1. LOOP THROUGH FAILED CASES ARRAY
 * STEP 2. ADD PACKAGE, PUBLISHER, LICENSE TYPE AND REPOSITORY NAMES IN OUTPUT STRING
 * STEP 3. ADD NOT_FOUND IN LICENSE FILED
 * STEP 4. PRINT OUTPUT STRING IN OUTPUT FILE
 */
function add_empty_failed_cases(){
  try {
    for (let i = 0; i < failed_cases.length; i++) {
      var outputString = "";
      if (failed_cases[i].licenseFile) {
        //let licenseFile = fs.readFileSync(`${failed_cases[i].licenseFile}`, "utf8");
        outputString += "###############################################################\n\n\n\n\n";
        outputString += "Package: " + failed_cases[i].module + "\n";
        outputString += "Publisher: "+ failed_cases[i].publisher + "\t\t\t\tLicense Type: " + failed_cases[i].licenses + "\n";
        outputString += "Repository: " + failed_cases[i].repository + "\n\n";
        outputString += "NOT_FOUND";
        outputString += "\n\n\n\n###############################################################\n";
        append_license_file(output_file, outputString);
      }
    }
  } catch (error) {
    console.error(error);
  }
}


/**
 * FUNCTION TO APPEND PACKAGE LICENSE TO OUTPUT FILE
 * @param {string} output_file output file address
 * @param {string} output data string
 */
function append_license_file(output_file, data) {
  fs.appendFile(output_file, data, err => {
    if (err) throw err;
  });
}