'use strict';
var configureCtrl =  function (SFDCData, $sce, $http, $routeParams,  $resource, $scope, $rootScope, $location) {

    angular.element(document).ready(function () {
        jQuery(".ng-view").foundation();
    });
    //var url = ($rootScope.sf) && ($rootScope.sf.client.targetOrigin + $rootScope.sf.context.links.restUrl) || '/proxy';
    //console.log ('hitting : ' +url);
    //$http.get('/proxy' + '/query/?q=' + "select id, name, RecordType.Name, khdev__ThumbImage69Id__c,  khdev__Description__c from khdev__product__c where id = '" + $routeParams.id + "'")

    $scope.enableaddtocart = false;
    $scope.productConfig = { };
    
	SFDCData.query("khdev__Product__c", "*",  [{field: "Id", equals: $routeParams.id}])
    	.then(function (data) {

            $scope.product = data[0];
            //console.log ('config meta : ' + $scope.product.khdev__ConfigMetaData__c);
            $scope.productConfigPrice = $scope.product.khdev__Base_Price__c || 0;
            $scope.productConfigMetaData = angular.fromJson($scope.product.khdev__ConfigMetaData__c);
            
            // can we light up add to cart?
            var notfinished = false;
            for (var c in $scope.productConfigMetaData) {
                var copt = $scope.productConfigMetaData[c];
                if (copt.required && !$scope.productConfig[copt.name]) {
                    notfinished = true;
                }
            }
            if (!notfinished) $scope.enableaddtocart = true;
            
            
            $scope.getRichDescroption =  function() {
                return $sce.trustAsHtml($scope.product.khdev__Description__c);
            };
            /*
            $http.get('/proxy/chatter/files/' + $scope.product.khdev__ThumbImage69Id__c)
                .success(function (cdata) {
                        $scope.productConfigPrice = 0;
                        $scope.product.imgsrc = 'https://eu2.salesforce.com' + cdata.downloadUrl;

            });
            */

        });

    $scope.toggleAccordion = function(val) {
        if ($scope.accordion[val] == true) {
            $scope.accordion[val] = false;
            $("#panelContent" + val).slideToggle("slow");

        } else {
            $scope.accordion[val] = true;
            $("#panelContent" + val).slideToggle("slow");
            for (var i in $scope.accordion) {
                if (i !== val) {
                    if ($scope.accordion[i] == true) {
                        $("#panelContent" + i).slideToggle("slow");
                        $scope.accordion[i] = false;
                    }
                }
            }
        }
    }
    
    
    $scope.addselection = function (category, val) {
        $scope.productConfig[category] = val;
        $scope.toggleAccordion(category);
        var notfinished = false;
        $scope.productConfigPrice = $scope.product.khdev__Base_Price__c || 0;
        for (var c in $scope.productConfigMetaData) {
            var copt = $scope.productConfigMetaData[c];
            if (copt.required && !$scope.productConfig[copt.name]) {
                notfinished = true;
            } else {
                for (var vopt in copt.values) {
                    if (copt.values[vopt].name === $scope.productConfig[copt.name]) {
                        $scope.productConfigPrice += copt.values[vopt].price;
                    }
                }
            }
        }
        if (!notfinished) $scope.enableaddtocart = true;

    }
    $scope.addtobasket = function() {
        $rootScope.addBasket ($scope.product, $scope.productConfigPrice, $scope.productConfig);
        jQuery('#itemadded_modal').foundation('reveal', 'open');

    }

}
