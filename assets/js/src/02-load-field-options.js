/**
 * Gets the WordPress and Salesforce field results via an Ajax call
 * @param string system whether we want WordPress or Salesforce data
 * @param string object_name the value for the object name from the the <select>
 */
function loadFieldOptions( system, object_name ) {
	var data = {
		'action' : 'get_' + system + '_object_fields',
	}
	var selectField = '.column-' + system + '_field select';
	var fields = '';
	var first_field = $( selectField + ' option').first().text();
	if ( '' !== $( selectField ).val() ) {
		return;
	}
	fields += '<option value="">' + first_field + '</option>';
	if ( 'wordpress' === system ) {
		data['wordpress_object'] = object_name;
	} else if ( 'salesforce' === system ) {
		data['salesforce_object'] = object_name;
	} else {
		return fields;
	}

	$.ajax({
		type: 'POST',
		url: ajaxurl,
		data: data,
		beforeSend: function() {
			$( '.spinner-' + system ).addClass( 'is-active' );
		},
		success: function( response ) {
			$.each( response.data.fields, function( index, value ) {
				if ( 'wordpress' === system ) {
					fields += '<option value="' + value.key + '">' + value.key + '</option>';
				} else if ( 'salesforce' === system ) {
					fields += '<option value="' + value.name + '">' + value.label + '</option>';
				}
			});
			$( selectField ).html( fields );
		},
		complete: function () {
			$( '.spinner-' + system ).removeClass( 'is-active' );
		}
	});
}

// load available options if the wordpress object changes
$( document ).on( 'change', 'select#wordpress_object', function() {
	var timeout;
	loadFieldOptions( 'wordpress', $( this ).val() );
	clearTimeout( timeout );
	timeout = setTimeout( function() {
		$( 'table.fields tbody tr' ).fadeOut();
		$( 'table.fields tbody tr' ).not( '.fieldmap-template' ).remove();
	}, 1000 );
});

// load available options if the salesforce object changes
$( document ).on( 'change', 'select#salesforce_object', function() {
	var timeout;
	loadFieldOptions( 'salesforce', $( this ).val() );
	clearTimeout( timeout );
	timeout = setTimeout( function() {
		$( 'table.fields tbody tr' ).fadeOut();
		$( 'table.fields tbody tr' ).not( '.fieldmap-template' ).remove();
	}, 1000 );
});
