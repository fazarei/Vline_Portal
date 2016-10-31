(function() {
	
	
	
	var onComplteMain = function() {
		
		/*
		 * Function: fnGetColumnData
		 * Purpose:  Return an array of table values from a particular column.
		 * Returns:  array string: 1d data array
		 * Inputs:   object:oSettings - dataTable settings object. This is always the last argument past to the function
		 *           int:iColumn - the id of the column to extract the data from
		 *           bool:bUnique - optional - if set to false duplicated values are not filtered out
		 *           bool:bFiltered - optional - if set to false all the table data is used (not only the filtered)
		 *           bool:bIgnoreEmpty - optional - if set to false empty values are not filtered from the result array
		 * Author:   Benedikt Forchhammer <b.forchhammer /AT\ mind2.de>
		 */
		$.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
		    // check that we have a column id
		    if ( typeof iColumn == "undefined" ) return new Array();
		     
		    // by default we only want unique data
		    if ( typeof bUnique == "undefined" ) bUnique = true;
		     
		    // by default we do want to only look at filtered data
		    if ( typeof bFiltered == "undefined" ) bFiltered = true;
		     
		    // by default we do not want to include empty values
		    if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;
		     
		    // list of rows which we're going to loop through
		    var aiRows;
		     
		    // use only filtered rows
		    if (bFiltered == true) aiRows = oSettings.aiDisplay;
		    // use all rows
		    else aiRows = oSettings.aiDisplayMaster; // all row numbers
		 
		    // set up data array   
		    var asResultData = new Array();
		     
		    for (var i=0,c=aiRows.length; i<c; i++) {
		        iRow = aiRows[i];
		        var aData = this.fnGetData(iRow);
		        var sValue = aData[iColumn];
		         
		        // ignore empty values?
		        if (bIgnoreEmpty == true && sValue.length == 0) continue;
		 
		        // ignore unique values?
		        else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;
		         
		        // else push the value onto the result data array
		        else asResultData.push(sValue);
		    }
		     
		    return asResultData;
		}
		
		$.fn.dataTableExt.oPagination.listbox = {
    /*
     * Function: oPagination.listbox.fnInit
     * Purpose:  Initalise dom elements required for pagination with listbox input
     * Returns:  -
     * Inputs:   object:oSettings - dataTables settings object
     *             node:nPaging - the DIV which contains this pagination control
     *             function:fnCallbackDraw - draw function which must be called on update
     */
    "fnInit": function (oSettings, nPaging, fnCallbackDraw) {
        var nInput = document.createElement('select');
        var nPage = document.createElement('span');
        var nOf = document.createElement('span');
        nOf.className = "paginate_of";
        nPage.className = "paginate_page";
        if (oSettings.sTableId !== '') {
            nPaging.setAttribute('id', oSettings.sTableId + '_paginate');
        }
        nInput.style.display = "inline";
        nPage.innerHTML = "Page ";
        nPaging.appendChild(nPage);
        nPaging.appendChild(nInput);
        nPaging.appendChild(nOf);
        $(nInput).change(function (e) { // Set DataTables page property and redraw the grid on listbox change event.
            window.scroll(0,0); //scroll to top of page
            if (this.value === "" || this.value.match(/[^0-9]/)) { /* Nothing entered or non-numeric character */
                return;
            }
            var iNewStart = oSettings._iDisplayLength * (this.value - 1);
            if (iNewStart > oSettings.fnRecordsDisplay()) { /* Display overrun */
                oSettings._iDisplayStart = (Math.ceil((oSettings.fnRecordsDisplay() - 1) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength;
                fnCallbackDraw(oSettings);
                return;
            }
            oSettings._iDisplayStart = iNewStart;
            fnCallbackDraw(oSettings);
        }); /* Take the brutal approach to cancelling text selection */
        $('span', nPaging).bind('mousedown', function () {
            return false;
        });
        $('span', nPaging).bind('selectstart', function () {
            return false;
        });
    },
      
    /*
     * Function: oPagination.listbox.fnUpdate
     * Purpose:  Update the listbox element
     * Returns:  -
     * Inputs:   object:oSettings - dataTables settings object
     *             function:fnCallbackDraw - draw function which must be called on update
     */
	    "fnUpdate": function (oSettings, fnCallbackDraw) {
	        if (!oSettings.aanFeatures.p) {
	            return;
	        }
	        var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
	        var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1; /* Loop over each instance of the pager */
	        var an = oSettings.aanFeatures.p;
	        for (var i = 0, iLen = an.length; i < iLen; i++) {
	            var spans = an[i].getElementsByTagName('span');
	            var inputs = an[i].getElementsByTagName('select');
	            var elSel = inputs[0];
	            if(elSel.options.length != iPages) {
	                elSel.options.length = 0; //clear the listbox contents
	                for (var j = 0; j < iPages; j++) { //add the pages
	                    var oOption = document.createElement('option');
	                    oOption.text = j + 1;
	                    oOption.value = j + 1;
	                    try {
	                        elSel.add(oOption, null); // standards compliant; doesn't work in IE
	                    } catch (ex) {
	                        elSel.add(oOption); // IE only
	                    }
	                }
	                spans[1].innerHTML = " of " + iPages;
	            }
	          elSel.value = iCurrentPage;
	        }
	    }
	};
		
		var fnCreateSelect = function( aData )
		{
		    var r='<select><option value=""></option>', i, iLen=aData.length;
		    for ( i=0 ; i<iLen ; i++ )
		    {
		        r += '<option value="'+aData[i]+'">'+aData[i]+'</option>';
		    }
		    return r+'</select>';
		}
		
		 /* Initialise the DataTable */
	    var oTable = $('#example').dataTable( {
	        "oLanguage": {
	            "sSearch": "Search all columns:"
	            
	        },
	        "sPaginationType": "listbox",
	        "aaSorting": [ [1,'desc'] ]
	    } );
	    
	    //oTable.fnPageChange( 'last' );
	     
	    /* Add a select menu for each TH element in the table footer */
	    $("tfoot th").each( function ( i ) {
	        this.innerHTML = fnCreateSelect( oTable.fnGetColumnData(i) );
	        $('select', this).change( function () {
	            oTable.fnFilter( $(this).val(), i );
	            
	        } );
	    } );
	    
	    
		
	}
	
	var tableGenerator = function (){
		//alert('Test');
		var data = tableData;
		var htmlTable = '';
		
		htmlTable = '<table id="example" class="full-width table-fix1"><thead><tr><th>User ID</th><th>Date</th><th>Time</th><th>Action</th><th>Table</th></tr></thead><tbody>';
		// populate the data from the array into a table
		for(var i=0; i < data.length; i++) {
			if(i%2 == 0){
				htmlTable += '<tr class="even"><td>'+data[i][0]+'</td><td>'+data[i][1]+'</td><td>'+data[i][2]+'</td><td>'+data[i][3]+'</td><td>'+data[i][4]+'</td></tr>';
			}else{
				htmlTable += '<tr class="odd"><td>'+data[i][0]+'</td><td>'+data[i][1]+'</td><td>'+data[i][2]+'</td><td>'+data[i][3]+'</td><td>'+data[i][4]+'</td></tr>';
			}
		};
		htmlTable += '</tbody><tfoot><tr><th></th><th></th><th></th><th></th><th></th></tr></tfoot></table>';
		
		$('.logTableHolder').html(htmlTable);
		
		onComplteMain();
	}
	
	if(!tableData.length){
		
		$.ajax({
			url: '../getinfo.php',
			type: 'POST',
			data: {mode: 'auditlog' }
		})
		.done(function( text ) {
			log(text);
			//alert(text);
			tableData = $.csv.toArrays(text);
			tableGenerator();
	
		})
		.fail(function(jqXHR, textStatus) {
			if(textStatus == 'abort') return;
			
			log('Error loading trainee data: '+jqXHR.status );
			
			// FOR LOCAL TESTING
			var testData = ''
				+ 'user1,23-05-2013,14:22:26,login,table1\r\n'
				+ 'peter,23-05-2013,14:23:40,login,table1\r\n'
				+ 'peter,23-05-2013,14:27:53,Logout,table3\r\n'
				+ 'ishti,23-05-2013,14:35:57,Logout,table3\r\n'
				+ 'ishti,23-05-2013,14:31:23,Insert,table2'; 
			tableData = $.csv.toArrays(testData);
			tableGenerator();
			// END TESTING
		})
	
	}else{
		tableGenerator();
	}
	/*var testData = ''
			+ 'user1,23-05-2013,14:22:26,login,table1\r\n'
			+ 'peter,23-05-2013,14:23:40,login,table1\r\n'
			+ 'peter,23-05-2013,14:27:53,Logout,table3\r\n'
			+ 'ishti,23-05-2013,14:35:57,Logout,table3\r\n'
		    + 'user1,23-05-2013,14:22:26,login,table1\r\n'
			+ 'peter,23-05-2013,14:23:40,login,table1\r\n'
			+ 'peter,23-05-2013,14:27:53,Logout,table3\r\n'
			+ 'ishti,23-05-2013,14:35:57,Logout,table3\r\n'
			+ 'user1,23-05-2013,14:22:26,login,table1\r\n'
			+ 'peter,23-05-2013,14:23:40,login,table1\r\n'
			+ 'peter,23-05-2013,14:27:53,Logout,table3\r\n'
			+ 'ishti,23-05-2013,14:35:57,Logout,table3\r\n'
			+ 'user1,23-05-2013,14:22:26,login,table1\r\n'
			+ 'peter,23-05-2013,14:23:40,login,table1\r\n'
			+ 'peter,23-05-2013,14:27:53,Logout,table3\r\n'
			+ 'ishti,23-05-2013,14:35:57,Logout,table3\r\n';
	tableData = $.csv.toArrays(testData);
	tableGenerator();*/
	
	
	
})();
	
	
    

 


 
 
