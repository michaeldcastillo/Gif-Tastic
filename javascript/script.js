
//alert("vanilla javascript");

//$(document).ready(alert("jquery"));


$(document).ready(function() {

    var topicsArray = ["sofia vergara","laurence fishburne","constance wu","bradley cooper"];

    var host = "https://api.giphy.com";
    var endpoint = "/v1/gifs/search?";
    var api_key = "api_key=TfRfBWaE8ePPK3J0X4ce391QJmtYuGox";
    var limit = "&limit=10";
    var rating = "&rating=G";
    var q = "";
    var queryURL = "";
    //var buttonContainerID = 0;

    renderButtons();

//---------------------------------------------------------------------------
    function renderButtons() {
     
        $("#renderbuttons").empty(); 
        
        for(var i = 0, z = topicsArray.length; i < z; i++) {

            var newButtonContainer = $("<div>");
            newButtonContainer.attr("class","together");
   
            var removeButton = $("<button>");
            removeButton.attr("id", i)
            removeButton.addClass("delete-button"); //necessary for click event handler
            removeButton.text("x"); 

            var newButton = $("<button>"); 
            newButton.attr("class", "topic-button");
            newButton.attr("data-name", topicsArray[i]);
            newButton.text(topicsArray[i]);
            var condition = newButton.text().trim();

            if(condition==="sofia vergara"||condition==="laurence fishburne"||condition==="constance wu"||condition==="bradley cooper") {
                newButtonContainer.append(newButton);

            } else {
                newButtonContainer.append(removeButton);
                newButtonContainer.append(newButton);
            }

            $(newButtonContainer).appendTo("#renderbuttons");            
        }    

    };
//---------------------------------------------------------------------------
    function renderResponse() {
  
        
        $("div#error-duplicate").remove();
        $("div#error-search").remove();

        q = $(this).attr("data-name"); 
        console.log("q = " + q);
        queryURL = host + endpoint + api_key + limit + rating + "&q=" + q;
        console.log("queryURL = " + queryURL);

        $.ajax({url: queryURL, method: "GET"}).then(function(response) {
   
            console.log("response = ", response);

            if(response.data.length === 0) {
                //not success
                //console.log("error");
                var div = $("<div>");
                div.text("Sorry, that search didn't return any results. Please try again.");
                div.attr("id","error-search");
                div.attr("style","color:red;");
                $("#renderbuttons").append(div);

            } else { //success
                $("#renderresponse").empty(); 

                var responseArray = response.data;

                for(var i = 0, z = responseArray.length; i < z; i++) {
                
                    var responseElement = $("<div class='response'>");

                    var gifURLanimated = response.data[i].images["original"].url; 
                    var gifURLstill = response.data[i].images["original_still"].url; 

                    var gifElement = $("<img>").attr("src", gifURLanimated);
                    gifElement.attr("data-still", gifURLstill);
                    gifElement.attr("data-animate", gifURLanimated);
                    gifElement.attr("data-state", "animate"); // give an initial value of 'animate'
                    gifElement.attr("class", "gif");

                    responseElement.append(gifElement);
                /* --------------------------------------- */

                    var textElement = $("<div class='text'>");

                    var title = response.data[i].title;
                    var titleElement = $("<div>").text("Title: " + title);

                    var gifRating = response.data[i].rating; 
                    var ratingElement = $("<div>").text("Rating: " + gifRating.toUpperCase());

                    textElement.append(titleElement);
                    textElement.append(ratingElement);
                    responseElement.append(textElement);
                /* --------------------------------------- */
                    $("#renderresponse").prepend(responseElement);
                    $("#renderresponse").attr("style","border:2px solid #ededed;");  
                }   
            }



        });

    };
//---------------------------------------------------------------------------
  $("#submitbutton").on("click", function(event) {
    
    event.preventDefault(); 
    $("div#error-duplicate").remove();
    $("div#error-search").remove();

    var newTopic = $("#textinput").val().trim().toLowerCase();
    console.log("newTopic = " + newTopic);

    if(newTopic==="sofia vergara"||newTopic==="laurence fishburne"||newTopic==="constance wu"||newTopic==="bradley cooper") {
        //don't add the button
        //alert("A button already exists for that celebrity. Please type another name.");
        var div = $("<div>");
        div.text("A default button already exists for that celebrity. Please try again.");
        div.attr("id","error-duplicate");
        div.attr("style","color:red;");
        $("#renderbuttons").append(div);

    } else {
        //add the button
        topicsArray.push(newTopic);
        renderButtons(); 
    }

    console.log("topicsArray = " + topicsArray);

    

    $("#textinput").val(""); 

  });
//---------------------------------------------------------------------------
  $(document).on("click", ".topic-button", renderResponse); 

//---------------------------------------------------------------------------
  $(document).on("click", ".gif", function() {
      
      var clickedImage = $(this); //store reference to img that was clicked
      var currentState = clickedImage.attr("data-state"); 
      var stillURL = clickedImage.attr("data-still"); 
      var animateURL = clickedImage.attr("data-animate"); 

      if (currentState === "still") {
        
        clickedImage.attr("src", animateURL);
        clickedImage.attr("data-state", "animate");
          
      } else {
   
        clickedImage.attr("src", stillURL);
        clickedImage.attr("data-state", "still");
        
      } 

  });
//---------------------------------------------------------------------------
$(document).on("click", ".delete-button", function() {

    $("div#error-duplicate").remove();
    $("div#error-search").remove();
      
    var clickedButton = $(this); //store reference to the delete button that was clicked
    var ID = clickedButton.attr("id");
    //console.log("ID = " + ID);
    topicsArray.splice(ID,1);
    //console.log(topicsArray);
    clickedButton.parent().remove(); 

  });
//---------------------------------------------------------------------------
$(document).on("click", "#clearbutton", function() {
  
        location.reload();
    });
  //---------------------------------------------------------------------------
});