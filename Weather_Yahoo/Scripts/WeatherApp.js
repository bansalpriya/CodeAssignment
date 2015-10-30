(function(){

    "use strict";

    var app = angular.module("WeatherApp", []);

    app.run(["$templateCache", function ($templateCache) {
        $templateCache.put('Views/Tabs.html', '<div class="TabContainer"><span class="Tab" ng-class="{ActiveButton: selectedTab == tab}" ng-repeat="tab in tabsData" ng-click="getWeatherReport($event, tab)">{{::tab}}</span></div>')
        $templateCache.put('Views/DisplayWeather.html', '<section><h3>{{::channelInfo.title}}</h3><div ng-bind-html="channelInfo.item.description"></div><img ng-src="{{::channelInfo.image.url}}" ng-style="imgCss" /></section>');
    }]);

    app.config(["$sceProvider", function ($sceProvider) {
        $sceProvider.enabled(false);
    }]);
    app.service("WeatherService", ["$http", function ($http) {
        this.getWeatherOfGivenCity = function (url) {
            var promise = $http({
                url: url,
                method: 'GET'
            }).success(function (data, status, header, config) {
                return data;
            }).error(function (data, status, header, config) {
                return data;
            });
            return promise;
        };
    }]);

    
    app.factory("UrlFactory", [function () {
        var factory = {};
        factory.getUrlForWeather = function (city) {
             return 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + city + '%2C%20india%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        };
        return factory;
    }])

    app.controller("WeatherController", ['$scope', 'UrlFactory', 'WeatherService', function ($scope, UrlFactory, WeatherService) {
        $scope.tabsData = ['Mumbai', 'Pune', 'Chennai', 'Bangalore', 'Jaipur'];

        $scope.textMessage = "Please select the city";
        $scope.selectedTab = "";
        $scope.channelInfo = {};
        $scope.toggleVisibility = false;
        $scope.getWeatherReport = function (eventInfo, tab) {
            $scope.textMessage = "Fetching info...";
            $scope.selectedTab = tab;
            var url = UrlFactory.getUrlForWeather($scope.selectedTab);
            $scope.channelInfo = {};
            $scope.toggleVisibility = false;
            WeatherService.getWeatherOfGivenCity(url).then(function (data) {
                $scope.textMessage = "";
                $scope.channelInfo = data.data.query.results.channel;
                $scope.toggleVisibility = true;
            }, function (data) {
                $scope.toggleVisibility = false;
                $scope.textMessage = "Something went wrong...";
            });
        }
    }]);

    app.directive('tabArea', [function () {
        var dirInfo = {
            restrict: 'E',
            replace: true,
            scope: "=",
            templateUrl: 'Views/Tabs.html'
        };
        return dirInfo;
    }]);

    app.directive('displayWeather', [function () {
        var dirInfo = {
            restrict: 'E',
            replace: true,
            templateUrl: 'Views/DisplayWeather.html',
        }
        return dirInfo;
    }]);

})()