/**
 * Created by ivar on 1.12.15.
 */

define([
	'angularAMD'
], function(angularAMD) {

	angularAMD.controller('common/extRefUsageCtrl', [ '$scope',  '$log', '$uibModal', '$uibModalInstance', 'wnwbApi',  'searchType', 'searchParams', 'currentItem', 'existingExtRefs', 'currentExtRef', 'spinnerService',    function( $scope,  $log, $uibModal, $uibModalInstance, wnwbApi, searchType, searchParams, currentItem, existingExtRefs, currentExtRef, spinnerService) {

		$log.log('common/extRefUsage (searchType: ' + searchType + ')');

        
		
		$scope.searchType = searchType;
		$scope.searchParams = searchParams;
		currentItemId = currentItem.id;
		$scope.currentItemId = currentItem.id;
        console.log('$scope.searchType', $scope.searchType);
        console.log('$scope.searchParams', $scope.searchParams);
        console.log('$scope.currentItemId', $scope.currentItemId);

        
        
        mergeCurrentExtRef = function(RefsArray, currentExtRef) {
            for (key in RefsArray) {
                //siin tuleb veel temp_row juhtumi ära lahendama
                if (currentExtRef && currentExtRef.id && RefsArray[key].id && currentExtRef.id==RefsArray[key].id) {
                    RefsArray[key] =  currentExtRef;
                    currentExtRef = null;   
                }
            
                if (currentExtRef && !currentExtRef.id && !RefsArray[key].id 
                        && currentExtRef['rel_type'].date_created==RefsArray[key]['rel_type'].date_created 
                        && currentExtRef['rel_type'].created_by==RefsArray[key]['rel_type'].created_by) {
                    RefsArray[key] =  currentExtRef;
                    currentExtRef = null;   
                }
            }
            //salvestama uus rida
            if (currentExtRef) {
                RefsArray.push(currentExtRef);
            }
            
            return RefsArray;  
        }
         
        makeExistingRefsDict = function (RefsArray) {
            RefsDict={};
            for (key in RefsArray) {
               
                if (RefsArray[key].reference == searchParams.key && (searchParams.reltype == null || RefsArray[key].type_ref_code == searchParams.reltype ))
                {
                    console.log('RefsArray item', RefsArray[key]);
                    if (RefsArray[key].id) {
                        var relId = RefsArray[key].id;    
                    } else {
                       var relId =  'new_'+key;  

                    }
                    RefsDict[relId]  = {};
                    RefsDict[relId].id  = relId;
                    RefsDict[relId].type_ref_code = RefsArray[key].type_ref_code;
                    RefsDict[relId].obj_label = currentItem.label;
                    RefsDict[relId].obj_primary_definition = currentItem.primary_definition;
                    RefsDict[relId].obj_variants_str = currentItem.variants_str;
                    RefsDict[relId].system = RefsArray[key].system;
                    RefsDict[relId].synset = currentItemId;
                    RefsDict[relId].sense = currentItemId;
                }
            }
            
            console.log('RefsDict', RefsDict);
            return RefsDict;
        };
        
        
		$scope.init = function(result) {
             
            console.log('search result', result);
            existingExtRefs = mergeCurrentExtRef(existingExtRefs, currentExtRef);
            $scope.existingRefsList = makeExistingRefsDict(existingExtRefs);
            
            for (key in result) {
                result[key].system = searchParams.system;
                console.log(result[key].synset, currentItemId);
                var relId = result[key].id
                if (relId in $scope.existingRefsList) {
                    console.log('relId in current Refs', relId);
                    if ($scope.existingRefsList[relId].type_ref_code != result[key].type_ref_code)
                    {
                        result[key].type_ref_code_old = result[key].type_ref_code; 
                        result[key].type_ref_code = $scope.existingRefsList[relId].type_ref_code; 
                        result[key].status  =  'modified';
                    }
                    
                   
                    delete $scope.existingRefsList[result[key].id];
                }
                else if (searchType=='synset' && result[key].synset == currentItemId){
                    result[key].status  =  'deleted';
                    //kui synset v sense id on sama ja rel on sama, aga tulemuses ei ole, siis on kustutatud
                }
       
            }
            console.log('new search result', result);
            $scope.resultList = result;
		};



		$scope.close = function() {
			$uibModalInstance.close(null);
		};
        
        if (!searchParams['reltype'] || searchParams['reltype'].length == 0) {
            searchParams['reltype'] = null;
        }
        var checkExtRefUsagePromise = wnwbApi.ExtRefUsage.query({
                            reltype : searchParams['reltype']
                            , system : searchParams['system']
                            , key : searchParams['key']
                            , lexid : searchParams['lexid']
                        }).$promise;
        

         checkExtRefUsagePromise.then(function (result) {
             
             
             $scope.init(result);
         });
       
        
	} ]);
});