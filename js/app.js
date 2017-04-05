var app = angular.module('myApp', []);
app.controller('netflixcontrol', function(APICalls, $scope, $http, $sce) {
	$scope.videos = {};
	$scope.appName = "MFTN Network";
	$scope.username = "mftn";
	$scope.password = "5797ec25db14348dd16d2e14d4d1de39";
	$scope.info = [];
	var videoCountPerCat = [];

	$http.get('http://tvstartup.biz/mng-channel/vpanel/api/allstreams.php?user=' + $scope.username + '&pass=' + $scope.password).success(function(data) {
		$scope.livestreams = data.allstreams;
		console.log('livestreams', $scope.livestreams);
	});

	$http.get('http://tvstartup.biz/mng-channel/vpanel/api/vodcategories.php?user=' + $scope.username + '&pass=' + $scope.password).success(function(cats) {
		$scope.categories = cats.categories;
		console.log('categories', $scope.categories);
		for (var i = 0; i < $scope.categories.length; i++) {	
			var myDataPromise = APICalls.getVideosWithCatId($scope.categories[i].id, i);
			myDataPromise.then(function(result) {  
				$scope.videos[result.data.catId] = result.data.videos;
				videoCountPerCat[result.data.index] = result.data.videos.length;
			});		
		} 
	});

	function findCatPos(index) {
		var i = 0;
		index += 1;	
		while (index > videoCountPerCat[i]) {
			index -= videoCountPerCat[i];
			i++;
		}

		return i;
	}

	$scope.itemClicked = function($event) {
		$scope.curSelectedElement = $event.target.parentElement;
		$(".selected").removeClass('selected');
		$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
		$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
	}

	$scope.itemKeyDown = function($event) {
		var items = $(".vitem");
		var index = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i] == $scope.curSelectedElement) {
				index = i;
				break;
			}
		}

		if (index == -1) return;

		switch($event.key) {
			case "ArrowDown":
				var catpos = findCatPos(index);
				if (catpos != $scope.categories.length-1 && catpos < $scope.categories.length) {
					index = 0;
					for (var i = 0; i <= catpos; i++) {
						index += videoCountPerCat[i];
					}
					$scope.curSelectedElement = items[index];
					$(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";

					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				}
				break;
			case "ArrowUp":
				var catpos = findCatPos(index);
				if (catpos != 0 && catpos < $scope.categories.length) {
					index = 0;
					for (var i = 0; i < catpos-1; i++) {
						index += videoCountPerCat[i];
					}
					$scope.curSelectedElement = items[index];
					$(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				}
				break;
			case "ArrowLeft":
				var catpos = findCatPos(index);
				var catpos1 = findCatPos(index-1);
				if (index > 0 && catpos == catpos1) {
					$scope.curSelectedElement = items[index-1];
					$(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				} else if (index == 0) {
					$scope.curSelectedElement = items[videoCountPerCat[catpos1]-1];
					$(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				} else if (index > 0 && catpos != catpos1) {
					$scope.curSelectedElement = items[index-1+videoCountPerCat[catpos]];
					$(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				}
				break;
			case "ArrowRight":
				var catpos = findCatPos(index);
				var catpos1 = findCatPos(index+1);
				if (index < items.length-1 &&  catpos == catpos1) {
					$scope.curSelectedElement = items[index+1];
					$(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				} else if (catpos != catpos1) {
					$scope.curSelectedElement = items[index+1-videoCountPerCat[catpos]];
					$(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				}
				break;
			case "Enter":
				alert("Hello " + $scope.curSelectedElement);
				break;
		}
	}
});

app.factory('APICalls', function($http) {
	appName = "MFTN Network";
	username = "mftn";
	password = "5797ec25db14348dd16d2e14d4d1de39";

	var getVideosWithCatId = function(id, index) {
		return $http.get('http://tvstartup.biz/mng-channel/vpanel/api/vodplaylist.php?user=' + username + '&pass=' + password + '&id=' + id).success(function(vids) {
			vids.catId = id;
			vids.index = index;
			return vids.videos;
		});	
	};


	return { getVideosWithCatId: getVideosWithCatId };
});
