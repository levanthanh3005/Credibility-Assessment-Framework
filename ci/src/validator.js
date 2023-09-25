const path = require('path');
const fs = require('fs');

// const upsim = require("../../Credibility-Development-Kit");
const upsim = "../../Credibility-Development-Kit";

const { XMLParser } = require('fast-xml-parser');

function parseModelDescription(xmlString) {
    const parserOptions = {
        ignoreAttributes : false
    };
    const xmlParser = new XMLParser(parserOptions);
    return xmlParser.parse(xmlString);
}

function mapConceptToFunction(phaseName) {
    var phaseMap = {
        "stmd:AnalysisPhase" : "analysis",
        "stmd:RequirementsPhase" : "requirements",
        "stmd:DesignPhase" : "design",
        "stmd:ImplementationPhase" : "implementation",
        // "stmd:IntegrateSimulation"
        "stmd:ExecutionPhase" : "execution",
    }
    return phaseMap[phaseName];
}

function validator(stmdFolder) {
    var results = [];

    try{
        var stmdFilename = path.join(stmdFolder,"/extra/net.pmsf.ssp.stmd/SimulationTask.stmd");

        var stmdDesText =  fs.readFileSync(stmdFilename, {encoding:'utf8'});
        var stmdDesJson = parseModelDescription(stmdDesText);
        var stmdFilePath = path.dirname(stmdFilename);

        var stmdGUID;
        try{
            stmdGUID = stmdDesJson["stmd:SimulationTaskMetaData"]["@_GUID"]
        } catch(eguid) {
            return {
                validated : false,
                error : "Error 1 at stmdBuilder: STMD file does not have GUID"
            }
        }

        var cdkTasks = stmdDesJson["stmd:SimulationTaskMetaData"];
                
        for (var phase in cdkTasks) {
            if (cdkTasks[phase]!="" && phase!="stmd:GeneralInformation" && phase.indexOf("stmd:") == 0) {
                for (var step in cdkTasks[phase]) {
                    var checkCDK = false;
                    if (cdkTasks[phase][step]["stc:Rationale"] && cdkTasks[phase][step]["stc:Rationale"]["stc:Resource"] && cdkTasks[phase][step]["stc:Rationale"]["stc:Resource"]["@_kind"]=="rationale" && cdkTasks[phase][step]["stc:Rationale"]["stc:Resource"]["stc:Content"]) {
                        checkCDK = true;
                    }

                    if (checkCDK == false) {
                        //Not CDK 
                        continue;
                    }

                    var evidenceList = cdkTasks[phase][step]["stc:Rationale"]["stc:Resource"]["stc:Content"]["cdk:Credibility"]["cdk:Evidence"];

                    if (!evidenceList[0]) {
                        evidenceList = [evidenceList];
                    }

                    for (var evidenceIndex in evidenceList) {
                        var level = evidenceList[evidenceIndex]["@_level"];

                        if (level == undefined) {
                            continue;
                        }

                        var metricList = evidenceList[evidenceIndex]["cdk:Metric"];
                        if (!metricList[0]) {
                            metricList = [metricList];
                        }

                        for (var metricIndex in metricList) {
                            var metric = metricList[metricIndex];
                            var funcName = metric["@_function"];
                            
                            if (funcName == undefined) {
                                continue;
                            }                            

                            var testList = metric["cdk:Test"];
                            if (!testList[0]) {
                                testList = [metric["cdk:Test"]];
                            }

                            for (var testIndex in testList) {

                                var testId = testList[testIndex]["@_id"];
                                var funcArgs = testList[testIndex]["cdk:FunctionArgument"];

                                if (!funcArgs) {
                                    continue;
                                }

                                if (!funcArgs[0]) {
                                    funcArgs = [funcArgs];
                                }
                                var argList = funcArgs.map(function(x){
                                    if (x["@_source"]) {
                                        var xpathrs = path.resolve(path.join(stmdFilePath,x["@_source"]))
                                    // console.log(xpathrs);
                                        var xrs = fs.readFileSync(xpathrs, "utf8");
                                        return xrs;
                                    } else if (x["#text"]){
                                        return x["#text"];
                                    }

                                    return "";
                                });
                                
                                // console.log("argList:",argList);
                                
                                var fnRs;
                                // var fnc = upsim[funcName];
                                // console.log(phase)
                                var fncImport = require(path.resolve(__dirname+"/"+upsim+"/metrics/"+mapConceptToFunction(phase)+"/level_"+level))

                                var fnc = fncImport[funcName];

                                if (!fnc) {
                                    fnRs = {
                                        result : false,
                                        log: "Function "+funcName+" for "+testId+" is undefined"
                                    }
                                } else {
                                    try{
                                        // if (fnc.constructor.name === "AsyncFunction") {
                                        //     fnRs = await fnc(...argList);
                                        // } else {
                                            fnRs = fnc(...argList);
                                        // };
                                    }catch(e) {
                                        fnRs = {
                                            result : false,
                                            log: e.toString()
                                        } 
                                    }
                                }

                                results.push({
                                    stmdGUID,
                                    phase,
                                    step,
                                    level,
                                    test : testId,
                                    function : funcName,
                                    result : fnRs.result,
                                    log : fnRs.log
                                })
                            }
                        }
                    }
                }
            }
        }

        // fs.writeFileSync(stmdFilePath+"/result.cdk", newModel);

        return {
            result : true,
            log : "STMD file has been validated with result",
            results
        }

    } catch (exception) {
        console.log(exception)
        return {
            result : false,
            log : "Error 2 at stmdBuilder: "+exception.toString(),
            results : []
        }
    }
}

module.exports = {
    validator
}