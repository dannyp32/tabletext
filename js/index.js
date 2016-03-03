$('.add-party').click(function (event) {
  $('.add-party-form').show();
});
$('.add-party-submit').click(function (event) {
	$('.add-party-submit').attr("disabled", true);
  
  // do ajax call here...
  
  // when ajax call is done 
  $('.add-party-form').hide();
});