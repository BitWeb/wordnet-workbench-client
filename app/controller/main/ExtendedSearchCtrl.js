/**
 * Created by ivar on 1.12.15.
 */

define([
	'angularAMD',
    'service/LexiconService',
    'service/ExtendedSearchModalService'
], function(angularAMD) {

	angularAMD.controller('main/ExtendedSearchCtrl', [ '$scope', '$state', '$log', '$uibModal', '$uibModalInstance', 'wnwbApi',  'spinnerService', 'service/ExtendedSearchModalService', function($scope, $state, $log, $uibModal, $uibModalInstance, wnwbApi,  spinnerService, extendedSearchModalService) {

		$log.log('main/ExternalSearchCtrl');
        

        
        var SearchTypes = {
                synset      : 'Synset', 
                lexentry    : 'Lexentry',
                sense      : 'Sense'
        
        };

        
      

	   var CommonFields = 
                {
                    lexid : { 
                                type : 'Int'
                                , operators : [ '=' ] 
                                , default : 1
                                , id : 'lexid'
                                , placeholder : 'lexid'
                                , object : 'common'
                        },
                    creator : { 
                                type : 'Char'
                                , operators : [ '=', 'like', 'isempty' ] 
                                , default : 1
                                , id : 'creator'
                                , placeholder : 'creator'
                                , object : 'common'
                                , max: 50
                        },
                    date_created : { 
                                type : 'DateTime'
                                , operators : [ '=', '<>', '>', '>=', '<', '<=', 'isempty' ] 
                                , default : 0
                                , id : 'date_created'
                                , placeholder : 'DD-MM-YY HH:MM'
                                , object : 'common'
                    
                        },
                    
                    contributor : {
                                type : 'Char'
                                , operators : [ '=', 'like', 'isempty' ] 
                                , default : 0
                                , id : 'contributor'
                                , placeholder : ''
                                , object : 'common'
                                , max: 50
                     
                        },
                    
                    date_updated : {
                    
                                type : 'DateTime'
                                , operators : [ '=', '<>', '>', '>=', '<', '<=', 'isempty' ] 
                                , default : 0
                                , id : 'date_updated'
                                , placeholder : 'DD-MM-YY HH:MM'
                                , object : 'common'

                        },
                    
                     is_deleted : {
                    
                                type : 'Char'
                                , operators : [ '=' ] 
                                , default : 0
                                , id : 'is_deleted'
                                , placeholder : 'Is deleted'
                                , object : 'common'
                                , fixed_options : ['Y','N','T','F']
                        }
                };
                var SynsetFields ={    //Synset otsingu parameetrid on:
                         label : {
                    
                                type : 'Char'
                                , operators : [ '=', 'like', 'isempty'] 
                                , default : 1
                                , id : 'label'
                                , placeholder : 'Synset label'
                                , object : 'synset'
                                , max: 30
                            }
                         , synset_type : {
                    
                                type : 'Char'
                                , operators : [ '=' ] 
                                , default : 0
                                , id : 'synset_type'
                                , placeholder : 'Synset type'
                                , object : 'synset'
                                , fixed_options : ['C', 'I']
                            }
                    
                        , status : {
                    
                                type : 'Char'
                                , operators : [ '=' ] 
                                , default : 0
                                , id : 'status'
                                , placeholder : 'Synset status'
                                , object : 'synset'
                                , fixed_options : ['D','N', 'V']
                            }
                        , comment : {
                    
                                type : 'Text'
                                , operators : [ '=' ,'like', 'isempty'] 
                                , default : 0
                                , id : 'comment'
                                , placeholder : 'Synset text'
                                , object : 'synset'

                            }
                    , has_sense_label : {
                    
                               type : 'Char'
                                , operators : [ '=' , 'like'] 
                                , default : 0
                                , id : 'has_sense_label'
                                , placeholder : 'Synset has_sense_label'
                                , object : 'synset'
                                , max: 30

                            }
                      , has_sense_count : {
                    
                               type : 'Number'
                                , operators : [ '=', '<>', '>', '>=', '<', '<='] 
                                , default : 0
                                , id : 'has_sense_count'
                                , placeholder : 'Synset has_sense_count'
                                , object : 'synset'
                        } 

                          , has_word : {
                    
                               type : 'Char'
                                , operators : [ '=', 'like'] 
                                , default : 0
                                , id : 'has_word'
                                , placeholder : 'Synset has_word'
                                , object : 'synset'
                                , max: 100
                            }
                        , part_of_speech : {
                    
                               type : 'Char'
                                , operators : [ '='] 
                                , default : 0
                                , id : 'part_of_speech'
                                , placeholder : 'Synset part_of_speech'
                                , object : 'synset'
                                 , fixed_options : ['n','v','a','b','r','s','pn','c','p','x','u']
                            }
                    , definition : {
                    
                               type : 'Text'
                                , operators : [ '=','like','isempty'] 
                                , default : 0
                                , id : 'definition'
                                , placeholder : 'Synset definition'
                                , object : 'synset'
                                 
                            }
                    , domain : {
                    
                               type : 'Char'
                                , operators : [ '=' , 'like','isempty'] 
                                , default : 0
                                , id : 'domain'
                                , placeholder : 'Synset domain'
                                , object : 'synset'
                                , max: 30

                            }
                    , has_rel_count : {
                    
                               type : 'Number'
                               , operators : [ '=', '<>', '>', '>=', '<', '<='] 
                                , default : 0
                                , id : 'has_rel_count'
                                , placeholder : 'Synset has_rel_count'
                                , object : 'synset'
                               

                    }
                    // is_source_in_rel : Char(30) in SynsetRelationType.OMWREL_CHOICES; ops : (=,like)
                    // is_target_in_rel : Char(30) in SynsetRelationType.OMWREL_CHOICES; ops : (=,like)
                    // is_in_rel : Char(30) in SynsetRelationType.OMWREL_CHOICES; ops : (=,like)

                };
                    
             var SenseFields = {
                 
                 label : {                   
                                type : 'Char'
                                , operators : [ '=', 'like', 'isempty'] 
                                , default : 1
                                , id : 'label'
                                , placeholder : 'Sense label'
                                , object : 'sense'
                                , max: 30
                            }
                 , lemma : {
                    
                                type : 'Char'
                                , operators : [ '=', 'like'] 
                                , default : 1
                                , id : 'lemma'
                                , placeholder : 'Sense lemma'
                                , object : 'sense'
                                , max: 100
                            }
                 
                 , nr : {
                    
                               type : 'Number'
                               , operators : [ '=', '<>', '>', '>=', '<', '<='] 
                                , default : 0
                                , id : 'nr'
                                , placeholder : 'Sense nr'
                                , object : 'sense'
                               

                    }
                  , status : {
                    
                                type : 'Char'
                                , operators : [ '=' ] 
                                , default : 0
                                , id : 'status'
                                , placeholder : 'Sense status'
                                , object : 'sense'
                                , fixed_options : ['D','N', 'V']
                            }
                 , comment : {
                    
                                type : 'Text'
                                , operators : [ '=' ,'like', 'isempty'] 
                                , default : 0
                                , id : 'comment'
                                , placeholder : 'Sense text'
                                , object : 'sense'

                }
                 , source : {
                    
                                type : 'Text'
                                , operators : [ '=' ,'like', 'isempty'] 
                                , default : 0
                                , id : 'source'
                                , placeholder : 'Sense source'
                                , object : 'sense'

                }
                 
                 , part_of_speech : {
                    
                               type : 'Char'
                                , operators : [ '='] 
                                , default : 0
                                , id : 'part_of_speech'
                                , placeholder : 'Sense part_of_speech'
                                , object : 'sense'
                                 , fixed_options : ['n','v','a','b','r','s','pn','c','p','x','u']
                            }
                 ,   style : {
                    
                                type : 'Char'
                                , operators : [ '=', 'like', 'isempty'] 
                                , default : 1
                                , id : 'style'
                                , placeholder : 'Sense style'
                                , object : 'sense'
                                , max: 30
                            }
                 
                
                  ,   geography : {
                    
                                type : 'Char'
                                , operators : [ '=', 'like', 'isempty'] 
                                , default : 0
                                , id : 'geography'
                                , placeholder : 'Sense geography'
                                , object : 'sense'
                                , max: 30
                            }
                  , definition : {
                    
                                type : 'Text'
                                , operators : [ '=' ,'like', 'isempty'] 
                                , default : 0
                                , id : 'definition'
                                , placeholder : 'Sense definition'
                                , object : 'sense'

                }
                 , example : {
                    
                                type : 'Text'
                                , operators : [ '=' ,'like', 'isempty'] 
                                , default : 0
                                , id : 'example'
                                , placeholder : 'Sense example'
                                , object : 'sense'

                }
                  , has_rel_count : {
                    
                               type : 'Number'
                               , operators : [ '=', '<>', '>', '>=', '<', '<='] 
                                , default : 0
                                , id : 'has_rel_count'
                                , placeholder : 'Sense has_rel_count'
                                , object : 'sense'
                               

                    }
   
            };
                      /*
                is_source_in_rel : Char(30) in SenseRelationType.OMWREL_CHOICES; ops : (=,like)
                is_target_in_rel : Char(30) in SenseRelationType.OMWREL_CHOICES; ops : (=,like)
                is_in_rel : Char(30) in SenseRelationType.OMWREL_CHOICES; ops : (=,like)
               */
            var LexentryFields = {
                
                lemma : {
                    
                                type : 'Char'
                                , operators : [ '=', 'like'] 
                                , default : 1
                                , id : 'lexentry'
                                , placeholder : 'Lexentry lemma'
                                , object : 'lexentry'
                                , max: 100
                            }
                 , part_of_speech : {
                    
                               type : 'Char'
                                , operators : [ '='] 
                                , default : 0
                                , id : 'part_of_speech'
                                , placeholder : 'Lexentry part_of_speech'
                                , object : 'lexentry'
                                 , fixed_options : ['n','v','a','b','r','s','pn','c','p','x','u']
                            }
                
                , note : {
                    
                                type : 'Text'
                                , operators : [ '=' ,'like', 'isempty'] 
                                , default : 0
                                , id : 'note'
                                , placeholder : 'Lexentry note'
                                , object : 'lexentry'

                }
                 , source : {
                    
                                type : 'Text'
                                , operators : [ '=' ,'like', 'isempty'] 
                                , default : 0
                                , id : 'source'
                                , placeholder : 'Lexentry source'
                                , object : 'lexentry'

                }
                 , distinctive_case : {
                    
                                type : 'Char'
                                , operators : [ '=', 'like'] 
                                , default : 1
                                , id : 'distinctive_case'
                                , placeholder : 'Lexentry distinctive_case'
                                , object : 'lexentry'
                                , max: 20
                            }
                 , distinctive_form : {
                    
                                type : 'Char'
                                , operators : [ '=', 'like'] 
                                , default : 1
                                , id : 'distinctive_form'
                                , placeholder : 'Lexentry distinctive_form'
                                , object : 'lexentry'
                                , max: 100
                            }
                 , grammatical_number : {
                    
                                type : 'Char'
                                , operators : [ '=' ] 
                                , default : 0
                                , id : 'grammatical_number'
                                , placeholder : 'Lexentry grammatical_number'
                                , object : 'lexentry'
                                , fixed_options : ['sg', 'pl']
                            }
                 , grammatical_gender : {
                    
                                type : 'Char'
                                , operators : [ '=' ] 
                                , default : 0
                                , id : 'grammatical_gender'
                                , placeholder : 'Lexentry grammatical_gender'
                                , object : 'lexentry'
                                , fixed_options : ['n', 'm', 'f']
                            }
                 
            };

            var Fields = {
                common: CommonFields,
                synset : SynsetFields,
                sense : SenseFields,
                lexentry : LexentryFields
            }
       
            var Types = {
                
                Int : {
                        regexp :'\\d+',
                        max: 1000,
                        min: 1,
                        errorMessage : 'Only numeric values are allowed.'
                      },
                DateTime : {
                       // regexp :'\\d\d\.\d\d\.\d\d \d\d\:\d\d',
                        regexp :'\\d\\d\\-\\d\\d\\-\\d\\d \\d\\d\\:\\d\\d',
                        errorMessage : 'Correct value example: " 28-02-17 12:00 ".'
                        
                        
                      }
                
            };
         
        
            
            $scope.filterRows = [];
            $scope.filterRows.common = [];
            $scope.filterRows.synset = [];
            $scope.filterRows.sense = [];
            $scope.filterRows.lexentry = [];
         
            this.init = function () {
                $scope.Fields = Fields;               
                $scope.TypeValidation = Types;
                $scope.searchTypes = SearchTypes;
               // $scope.availableFields = Fields;
                
                if (extendedSearchModalService.getSearchFilterRows()!==false) {
                    $scope.filterRows = extendedSearchModalService.getSearchFilterRows();
                    $scope.selectedSearchType = extendedSearchModalService.getSearchType();
                } else {
                    $scope.resetAllFilterRows(); 
                }
              
                if (!$scope.selectedSearchType) {
                   $scope.selectedSearchType = 'synset'; 
                }

            };
        
          
        
        
        
        $scope.changeSearchType = function(key) {
            
             $scope.selectedSearchType = key;
            console.log('selectedTypechanged');
   
        }
            
         $scope.resetFilterRows = function(key) {
            $scope.filterRows[key] = []; 
             for (var fieldid in Fields[key]){
                if (Fields[key][fieldid].default == 1)
                {
                    var newField = angular.copy(Fields[key][fieldid]);
                    if (newField.operators.length==1){
                        newField.selectedOps = newField.operators[0];

                    }
                  $scope.filterRows[key].push(newField);   
                }
            } 
        }
        
        
        $scope.resetAllFilterRows = function() {
                $scope.resetFilterRows('common');
                $scope.resetFilterRows('synset');
                $scope.resetFilterRows('sense');
                $scope.resetFilterRows('lexentry');
                extendedSearchModalService.saveSearchFilterRows($scope.filterRows);
                extendedSearchModalService.saveSearchType($scope.selectedSearchType);
        }
          

          $scope.cancel = function() {
              $uibModalInstance.close(null);
          }
		
          
          $scope.evaluateAllFields = function() 
          {
              
              
              
          }
        
          $scope.evaluateField = function(field) {
               console.log('scope', $scope);
              
              console.log('field for evaluation', field);
                             
          }
          
          
		  $scope.doSearch = function() {
              
                extendedSearchModalService.saveSearchFilterRows($scope.filterRows);
                extendedSearchModalService.saveSearchType($scope.selectedSearchType);
                                           
                var searchTerm = $scope.searchTerm;
                var hasSynset = null;
                  $log.log('main/LexicalEntry.query (prefix: ');
                if (1) {
                    spinnerService.show('searchLemmaSpinner');
                    var results = wnwbApi.LexicalEntry.query({
                        prefix : 'po',
                        lexid : 6
                    }, function() {
                        $scope.searchResults = [];				
                        spinnerService.hide('searchLemmaSpinner');
                    });
                }
		};

		this.init();

	} ]);
});