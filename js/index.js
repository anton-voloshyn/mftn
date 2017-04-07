var myCarousel = function(category) {
	var carousel = angular.element("#videos-in-"+category).waterwheelCarousel({
		category: category,
		separation: 350,
		separationMultiplier: 1,
		horizonOffsetMultiplier: 1,
		sizeMultiplier: 1,
		keyboardNav: 'true',
		activeClassName: 'selected',
		imageNav: 'false',
		speed: 200,
		clickedCenter: function ($item) {
		},
		movingToCenter: function ($item) {
//			alert("moingToCenter");
		},
		movedToCenter: function ($item) {
//			alert("movedToCenter");
		},
		movingFromCenter: function ($item) {
//			alert("movingFromCenter");
		},
		movedFromCenter: function ($item) {
//			alert("movedFromCenter");
		},
})};
// angular.element(document).ready();