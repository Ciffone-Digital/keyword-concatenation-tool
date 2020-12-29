jQuery( document ).ready(function( $ ) {
    /*************************************
     ** Keyword Set Functions ************
     *************************************/

    //Set up object to store data

    var set0 = {groupa: "", groupb: "", groupc: "", groupd: "", results: ""};

    //Declare empty array to store each keyword set and set index

    var keywordSets = [];
    keywordSets[0] = set0;

    //Set count and declare current set

    var setCount = 0; // add to from function newSet()
    var currentSet = 0;

    //Function to save the set values

    function saveSet(setIndex) {
      keywordSets[setIndex].groupa = $('#kwGroupA').val();
      keywordSets[setIndex].groupb = $('#kwGroupB').val();
      keywordSets[setIndex].groupc = $('#kwGroupC').val();
      keywordSets[setIndex].groupd = $('#kwGroupD').val();
      keywordSets[setIndex].results = $('#output').val();
    }

    //Function to retrieve set values

    function loadSet(setIndex) {
      $('#kwGroupA').val(keywordSets[setIndex].groupa);
      $('#kwGroupB').val(keywordSets[setIndex].groupb);
      $('#kwGroupC').val(keywordSets[setIndex].groupc);
      $('#kwGroupD').val(keywordSets[setIndex].groupd);
      $('#output').val(keywordSets[setIndex].results);
    }

    $(".kwsets").on("click", "li > a", function(e){
        e.preventDefault();

        /*Code to add new set */
        if( $(this).hasClass('add-set') ){
            saveSet(currentSet);
            setCount++;
            var newset = {groupa: "", groupb: "", groupc: "", groupd: "", results: ""};
            keywordSets[setCount] = newset;
            $('.kwsets').append('<li><a class="change-set" href="#" data-tab="'+setCount+'">Set '+(setCount + 1)+'</a></li>');
            loadSet(setCount);
            currentSet = setCount;
            $(".kwsets > li > a.active").removeClass('active');
            $(".kwsets > li > a[data-tab='"+setCount+"']").addClass('active');

        }else if( $(this).hasClass('change-set') && $(this).hasClass('active') ){
            //Do Nothing, this is already active.
            
        }else if( $(this).hasClass('change-set') ){
            $(".kwsets > li >a.active").removeClass('active');
            $(this).addClass('active');
            saveSet(currentSet);
            loadSet($(this).attr('data-tab'));
            currentSet = $(this).attr('data-tab');
        }        
    });

    function getStrings() {
        var tmp = [];
        var stringMod = $("#options-nav").attr("mod-type");

        $('#output').val('');

        // added .trim() to strip empty lines
        tmp[0] = $('#kwGroupA').val().trim().split("\n");
        tmp[1] = $('#kwGroupB').val().trim().split("\n");
        tmp[2] = $('#kwGroupC').val().trim().split("\n");
        tmp[3] = $('#kwGroupD').val().trim().split("\n");

        for(var a = 0; a < tmp[0].length; a++){
          for(var b = 0; b < tmp[1].length; b++){
            for(var c = 0; c < tmp[2].length; c++){
              for(var d = 0; d < tmp[3].length; d++){
                if(stringMod === 'broad-match'){
                  var kw = "";
                  if( tmp[0][a].trim() ){
                    kw += '\+'+tmp[0][a].trim();
                  }
                  if( tmp[1][b].trim() ){
                    kw += " \+"+tmp[1][b].trim();
                  }
                  if( tmp[2][c].trim() ){
                    kw += " \+"+tmp[2][c].trim();
                  }
                  if( tmp[3][d].trim() ){
                    kw += " \+"+tmp[3][d].trim();
                  }
                } else if( stringMod === 'exact-match') {
                  var kw = "[" + tmp[0][a].trim() + " " + tmp[1][b].trim() + " " + tmp[2][c].trim() + " " + tmp[3][d].trim() + "]";
                } else if( stringMod === 'phrase-match') {
                  var kw = '"' + tmp[0][a].trim() + " " + tmp[1][b].trim() + " " + tmp[2][c].trim() + " " + tmp[3][d].trim() + '"';
                } else {
                  var kw = tmp[0][a].trim() + " " + tmp[1][b].trim() + " " + tmp[2][c].trim() + " " + tmp[3][d].trim();
                }                        

                $("#output").val($("#output").val() + kw.trim().replace(/\s+/g,' ') + "\n"); // added .replace(/\s+/g,' ') to strip extra spaces.
              }
            }
          }
        }

        /*Save to array*/
        saveSet( $('.kwsets > li > a.active').attr('data-tab') );
    }

    function keywordsToCSV() {
        var keywords = keywordSets[$('.kwsets > li > a.active').attr('data-tab')]["results"].split("\n");
        var csv = "Set "+( parseInt( $('.kwsets > li > a.active').attr('data-tab') ) + 1 )+" Keywords\n";
        keywords.forEach(function(row) {
            csv += row + "\n";
        });

        // console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'keywords.csv';
        hiddenElement.click();
    }

    function vm_export_all_sets(){

        var keywords = keywordSets;
            csv = 'ALL DATA SETS \n\n';

        keywords.forEach(function(kwds){

            var output = kwds['results'].split("\n");

            output.forEach(function(row){
                csv += row + "\n";
            });
        });
            
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'allsetskeywords.csv';
        hiddenElement.click();
    }

    $("#kwGen").click(function (e) {
        e.preventDefault();
        getStrings();
    });

    $('#fields').click(function (e) {
        e.preventDefault();
        $('.group').val("");
    });

    $("#csvExport").on("click", function (e) {
        e.preventDefault();
        keywordsToCSV();
    });
    $("#csvExportall").on('click',function(e){
        e.preventDefault();
        vm_export_all_sets();
    });

    //Event handler for adding special characters to keywords
    $("#options-nav").on("click",'>.kwType  > a ',function(e){
        e.preventDefault();
        if( ! $(this).hasClass("active") ){
            var attr = $(this).attr('mod-type');
            $(this).parent().parent().attr("mod-type", attr );
            $("#options-nav > li > a.active").removeClass("active");
            $(this).addClass('active');
        }        
    });


    $('.button').mousedown(function (e) {
        e.preventDefault();
        var target = e.target;
        var rect = target.getBoundingClientRect();
        var ripple = target.querySelector('.ripple');
        $(ripple).remove();
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
        var top = e.pageY - rect.top - ripple.offsetHeight / 2 -  document.body.scrollTop;
        var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
        ripple.style.top = top + 'px';
        ripple.style.left = left + 'px';
        return false;
    });

});