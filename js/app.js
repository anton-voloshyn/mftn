var curCategory;
var curCatPos = -1;
var app = angular.module('myApp', []);
app.controller('netflixcontrol', function(APICalls, $scope, $http, $sce) {
	$scope.videos = {};
	$scope.appName = "MFTN Network";
	$scope.username = "mftn";
	$scope.password = "5797ec25db14348dd16d2e14d4d1de39";
	$scope.info = [];
	var videoCountPerCat = [];
	var selPerCat = [];

	$http.get('http://tvstartup.biz/mng-channel/vpanel/api/allstreams.php?user=' + $scope.username + '&pass=' + $scope.password).success(function(data) {
		$scope.livestreams = data.allstreams;
		console.log('livestreams', $scope.livestreams);
	});

	$http.get('http://tvstartup.biz/mng-channel/vpanel/api/vodcategories.php?user=' + $scope.username + '&pass=' + $scope.password).success(function(cats) {
		$scope.categories = cats.categories;
//		$scope.categories.shift();
		console.log('categories', $scope.categories);
		for (var i = 0; i < $scope.categories.length; i++) {	
			var myDataPromise = APICalls.getVideosWithCatId($scope.categories[i].id, i);
			myDataPromise.then(function(result) {  
				$scope.videos[result.data.catId] = result.data.videos;
				videoCountPerCat[result.data.index] = result.data.videos.length;
			});
			selPerCat[$scope.categories[i].id] = 0;
		}
		curCatPos = 0;
		curCategory = getCategoryfromCatPos(curCatPos);
/*		selPerCat[curCatPos] = 0;*/
//		$scope.curSelectedElement = $('#videos-in-'+curCategory).children()[selPerCat[curCategory]];
	});

	function getCategoryfromCatPos(catPos) {
		return $scope.categories[catPos].id;
	}

	function getCatPosfromCategory(category) {
		for (var i = 0; i < $scope.categories.length; i++) {
			if ($scope.categories[i].id === category) {
				return i;
			}
		}

		return -1;
	}

	function getIndexAsChild(childElement) {
		var parentElement = childElement.parentElement;
		for (var i = 0; i < parentElement.children.length; i++) {
			if (childElement === parentElement.children[i]) {
				return i;
			}
		}
		return -1;
	}

	function getChildFromIndex(catPos, index) {
		var category = getCategoryfromCatPos(catPos);
		var parentElement = $("#videos-in-" + category)[0];

		return parentElement.children[index];
	}

	function changeSelectedClass(selectedElement) {
		$(selectedElement.id).siblings().removeClass('selected');
		selectedElement.className += " selected";
		angular.element(".selCat").removeClass('selCat');
		selectedElement.parentElement.className += " selCat";
	}

	function changeSelCatClass(selectedElement) {
		angular.element(".selCat").removeClass('selCat');
		selectedElement.parentElement.className += " selCat";
	}

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
		$scope.curSelectedElement = $event.target/*.parentElement*/;
		changeSelectedClass ($scope.curSelectedElement);
		$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});

		var parentVideo = $scope.curSelectedElement.parentElement;
		curCategory = parentVideo.getAttribute("catid");
		curCatPos = getCatPosfromCategory(curCategory);
		selPerCat[curCategory] = getIndexAsChild($scope.curSelectedElement);
	}

	$scope.itemKeyDown = function($event) {
/*		var items = angular.element(".vitem");
		var index = -1;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === $scope.curSelectedElement) {
				index = i;
				break;
			}
		}
*/
/*		if ($event.key === "Enter") {
			myCarousel();
			return;
		}
*/
//		if (index === -1) return;
		if (curCatPos < 0) return;

		switch($event.key) {
			case "ArrowDown":
				curCatPos = (curCatPos + 1) % $scope.categories.length;
				curCategory = $scope.categories[curCatPos].id;

				var newCatItem = getChildFromIndex(curCatPos, selPerCat[curCategory]);
				changeSelCatClass (newCatItem);

				$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});

/*
				var catpos = findCatPos(index);
				if (catpos != $scope.categories.length-1 && catpos >= 0) {
					index = 0;
					for (var i = 0; i <= catpos; i++) {
						index += videoCountPerCat[i];
					}
					$scope.curSelectedElement = selPerCat[curCategory];
					angular.element(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";

					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
					curCategory = $scope.curSelectedElement.parentElement.getAttribute("catid");
				}*/
				$event.preventDefault();
				break;
			case "ArrowUp":
				curCatPos = curCatPos - 1;
				if (curCatPos < 0) {
					curCatPos = $scope.categories.length - 1;
				}
				curCategory = $scope.categories[curCatPos].id;

				var newCatItem = getChildFromIndex(curCatPos, selPerCat[curCategory]);
				changeSelCatClass (newCatItem);

//				$scope.curSelectedElement = getChildFromIndex(curCatPos, selPerCat[curCategory]);
//				changeSelectedClass ($scope.curSelectedElement);

				$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});

				/*curCatPos = (curCatPos - 1) % $scope.categories.length;
				curCategory = $scope.categories[curCatPos].id;
				var catpos = findCatPos(index);
				if (catpos != 0 && catpos < $scope.categories.length) {
					index = 0;
					for (var i = 0; i < catpos-1; i++) {
						index += videoCountPerCat[i];
					}
					$scope.curSelectedElement = items[index];
					angular.element(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
					curCategory = $scope.curSelectedElement.parentElement.getAttribute("catid");
				}*/
				$event.preventDefault();
				break;
			case "ArrowLeft":
				/*selPerCat[curCategory] --;
				if (selPerCat[curCategory] < 0) { selPerCat[curCategory] = videoCountPerCat[curCatPos] - 1; }
				$scope.curSelectedElement = getChildFromIndex(curCatPos, selPerCat[curCategory]);
				changeSelectedClass ($scope.curSelectedElement);

				$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});*/



				/*var catpos = findCatPos(index);
				var catpos1 = findCatPos(index-1);
				var catID = $scope.categories[catpos1][id];
				$("waterwheelCarousel");
				alert (catID);
				if (index > 0 && catpos === catpos1) {
					$scope.curSelectedElement = items[index-1];
					angular.element(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				} else if (index === 0) {
					$scope.curSelectedElement = items[videoCountPerCat[catpos1]-1];
					angular.element(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				} else if (index > 0 && catpos != catpos1) {
					$scope.curSelectedElement = items[index-1+videoCountPerCat[catpos]];
					angular.element(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				}*/
/*				$event.preventDefault();
*/				break;
			case "ArrowRight":
/*				selPerCat[curCategory] = (selPerCat[curCategory] + 1) % videoCountPerCat[curCatPos];
				$scope.curSelectedElement = getChildFromIndex(curCatPos, selPerCat[curCategory]);
				changeSelectedClass ($scope.curSelectedElement);

				$scope.i*/nfo.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});

/*
				var catpos = findCatPos(index);
				var catpos1 = findCatPos(index+1);
				if (index < items.length-1 &&  catpos === catpos1) {
					$scope.curSelectedElement = items[index+1];
					angular.element(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				} else if (catpos != catpos1) {
					$scope.curSelectedElement = items[index+1-videoCountPerCat[catpos]];
					angular.element(".selected").removeClass('selected');
					$scope.curSelectedElement.className = $scope.curSelectedElement.className + " selected";
					$scope.info.push({title: $scope.curSelectedElement.title, content: $scope.curSelectedElement.description});
				}*/
/*				$event.preventDefault();
*/				break;
			case "Enter":
				alert("Hello " + $scope.curSelectedElement);
				break;
		}
	}
});

app.directive('categoryDirective', function() {
	return function(scope, element, attrs) {
		// angular.element(element).css('color', 'blue');
		if (scope.$last) {
//			window.alert("category last!");
		}
	};
});

app.directive('imgDirective', function() {
	return function(scope, element, attrs) {
		// angular.element(element).css('color', 'blue');
		if (scope.$last) {
			var parentElement = element.parent()[0];
			var catID = parentElement.getAttribute("catid");

			myCarousel(catID);
			
			if (catID === curCategory) {
				parentElement.className += " selCat";
			}
		}
	};
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
