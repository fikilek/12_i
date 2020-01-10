//this object incorporates all all objects used in iREPS
const ireps = (function() { //ireps

//create a constructor for user natural person (unp) object. when unp object is created by js, there must be at least
//unp_id or email adress know before. the rest of the data is collected from the unp db table.
	const Unp = function(unp_id) {
		this.unp_id = unp_id;
		this.surname = "";
		this.name = "";
		this.email = "";
		this.email_verified_on_datetime = "";
		this.mobile_no = "";
		this.mobile_no_verified_on_datetime = "";
		this.id_no = "";
		this.dob = "";
		this.acc_status = "not active", //this will be either 'active' (boolean 1 ot true) or 'non active' (boolean 0 or false)
		this.acc_created_on_datetime = "";

//	this function goes to the db unp table and use either unp_id or unp_email to collect unp data
		this.set_unp_details = function(unp_obj) {
//			this.unp_id = 12;
			this.surname = unp_obj.surname;
			this.name = unp_obj.name;
			this.email = unp_obj.email;
			this.email_verified_on_datetime = unp_obj.email_verified_on_datetime;
			this.mobile_no = unp_obj.mobile_no;
			this.mobile_no_verified_on_datetime = unp_obj.mobile_no_verified_on_datetime;
			this.id_no = unp_obj.id_no;
			this.dob = unp_obj.dob;
			this.acc_status = unp_obj.acc_status //this will be either 'active' (boolean 1 ot true) or 'non active' (boolean 0 or false)
			this.acc_created_on_datetime = unp_obj.acc_created_on_datetime;
			return this;
		}

//  user roles are stored inna separate table called unp_role. when constructing a unp object, the unp_rile table must
//  queried to collect all user roles. these roles are then used to set unp roles array in the unp object
		this.roles = {};
		this.set_roles = function() {
			this.roles = new Urs(this.unp_id).set_unp_roles().get_unp_roles();
			return this;
		};

//	user menu permissions (ump's) are stored in a role_menu_permissions db table. once user roles are known, they are
//  used to query role_menu_permissions which are then merged to form one user menu permissions which is the used
//  to initiate "this.menu_permissions"
		this.menu_permissions = {};
		this.set_menu_permissions = function() {
			this.menu_permissions = new Ump(this).set_ump().get_ump();
			return this;
		};
		this.home_adr = new Adr();
		this.work_adr = new Adr();
//		this.set_unp_details();
	}

//create user menu permissions (ump)object constructor. the user gets its menu permissions via the user role
//so, its accurately role menu permissions than user menu per missions
	const Ump = function(user) {
		this.unp_id = user.unp_id;
		this.ump = -1;
		this.set_ump = function() {
//		let rmp; //rmp is role menu permissions
//		first check if user has role(s). all users must have roles.
//    a user that does not have a role is not fully registered.
			if(user.roles) {
//			user has role or roles. proceed to query role_menu table for all role records belonging to unp_id user.
//      a user may have more than one role, so iterate over all roles and create one unp menu permissions object.

//				simulate menu permissions from the role_menu table
					let role_mp = {
						manager : {
							trn: {
								create: false,
								view: true,
								modify: true
							},
							asr: {
								create: true,
								view: true,
								modify: false
							},
							unp: {
								create: true,
								view: true,
								modify: false
							}
						},
						electrician : {
							trn: {
								create: false,
								view: false,
								modify: true
							},
							asr: {
								create: true,
								view: true,
								modify: false
							},
							unp: {
								create: true,
								view: true,
								modify: false
							}
						}
					}

				for(const role_name in user.roles) {
//				const mp = {}; // mp is short for menu permissions
					const mp = role_mp[role_name]; // mp is short for menu permissions

//				query role_menu table to get all menu permissions associated with the role
//				todo: write code to query db table role_menu to get all menu permissions for the role

					if(this.ump === -1) {
//					for the first iteration, just add to ump
						this.ump = mp;
					} else {
						for(const menu in mp) {
							let create_permission = false, view_permission = false, modify_permission = false;
							if(mp[menu].create || this.ump[menu].create) {
							 create_permission = true;
							}
							if(mp[menu].view || this.ump[menu].view) {
							 view_permission = true;
							}
							if(mp[menu].modify || this.ump[menu].modify) {
							 modify_permission = true;
							}
							this.ump[menu] = {
								create: create_permission,
								view: view_permission,
								modify: modify_permission
							}
						}
					}
				}
			} else {
//			throw an exception, user has no roles
			}
			return this;
		};
		this.get_ump = function() {
			return this.ump;
		}
	}

//create roles object constructor
	const Urs = function(unp_id) {
		this.ur_id = unp_id;
		this.ur = {}; //ur stands for user role
		this.rmp = {}; // rmp stands for role menu permission
		this.set_unp_roles = function() {
			const user_role = {};
			let roles = [];
//	  todo: write code to populate ur object with unp roles from unp_roless table
			"this function goes to the unp_roles table with the unp_id and collect all user roles for the unp_id user"
//		1. query the unp_roles table for all roles for the given unp_id. this will return a json object
//    todo: write code to query unp_roles table then iterate over the roles and populate ur object with each role.\
//    these are the roles returned by the db query
			roles = [
				{name: "manager", description: "this is the manager"},
				{name: "electrician", description: "this is the electrician"}
			];
//		iterate over the roles array and populate ur object
			roles.forEach( (value, index, array) => {
				this.ur[value.name] = value;
			})
			return this;
		};
		this.get_unp_roles = function() {
			return this.ur
		}
	}

//create address constructor
	const Adr = function(erf) {

//	properties
		this.erf = erf;
		this.complex_no = "",
		this.complex_name = "",
		this.street_house_no = "5511",
		this.street_name = "",
		this.area_name = "",
		this.ward_name = "",
		this.township_suburb = "vuli valley",
		this.town = "butterworth",
		this.local_municipality = "mnquma",
		this.district_municipality = "amathiole",
		this.province = "eastern cape",
		this.country = "south africa"

//	methods

	}

//create transaction object (trn) constructor
	const Trn = function(trn_id) {
		this.trn_id = trn_id;

	}

//create asset constructor (ast)
	const Ast = function(ast_id) {
		this.ast_id = ast_id;

	}

//create mobile number (mn) constructor
	const Mno = function(cell_no) {
		this.mn = cell_no;
		this.format = function() {

			return this;
		};
		this.get_mn = function() {
			return this.mn;
		}
	}

//create menu object constructor
	const Menu = function() {
		this.id = "";
		this.name = "";
		this.category = ""; //there are only three menu categories (1)menu level1 [ml1] (2) menu level2 [ml2] and (3) page menu [pm]
		this.description = "";
		this.output =

		this.status = "disabled"//enabled or disabled
		this.enable = function() {
			this.status = "enable";
			return this;
		};
		this.disable = function() {
			this.status = "disabled";
			return this;
		}

		this.state = "hidden"; //there are only two menu states (1) shown and (2) hidden (default)
		this.show = function() {
			this.state = "show";
			return this;
		};
		this.hide = function() {
			this.state = "hidden";
			return this;
		}
	}

//create ireps menu system (ms) object.
	const MenuSystem = function() {
		this.menus = {};
		this.set_ms = function() {
//		go to the db menu_table and get all records
//todo: write code to collect menu system from db table.
			this.menus = { //menus is the simulation of data obtained from the db table
				ml1 : { //menu level 1
					ml1_dbd : { //name of ml1 object
						id : "",
						name : "ml1_dbd",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_ast : {
						id : "",
						name : "ml1_ast ",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_trn : {
						id : "",
						name : "ml1_trn",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_unp : {
						id : "",
						name : "ml1_unp",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_adm : {
						id : "",
						name : "ml1_adm",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_wos : {
						id : "",
						name : "ml1_wos",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
				},
				ml2 : { //menu level 2
					ml2_unp_profile : { //unp profile detail
						id : "",
						name : "ml2_unp_profile",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml2_unp_stats : { //unp sms
						id : "",
						name : "ml2_unp_stats",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml2_unp_logon_history : { //unp profile detail
						id : "",
						name : "ml2_unp_logon_history",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml2_unp_boqs : { //unp sms
						id : "",
						name : "ml2_unp_boqs",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml2_unp_smss : { //unp sms
						id : "",
						name : "ml2_unp_smss",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml2_unp_emails : { //unp sms
						id : "",
						name : "ml2_unp_emails",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					}
				},
				pgm : { //page menu
					pgm_page_title : {
						id : "",
						name : "pgm_page_title",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					pgm_daterange : {
						id : "",
						name : "pgm_daterange",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					pgm_edit : {
						id : "",
						name : "pgm_edit",
						description : "",
						output : "" ,
						status : "hide",
						state : "enabled",
					},
					pgm_cancel : {
						id : "",
						name : "pgm_cancel",
						description : "",
						output : "" ,
						status : "hide",
						state : "enabled",
					},
					pgm_save : {
						id : "",
						name : "pgm_save",
						description : "",
						output : "" ,
						status : "hide",
						state : "disabled",
					},


//				pmr menus
					pgm_copy : {
						id : "",
						name : "pgm_copy",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					pgm_excel : {
						id : "",
						name : "pgm_excel",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					pgm_pdf : {
						id : "",
						name : "pgm_pdf",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					pgm_csv : {
						id : "",
						name : "pgm_date_range",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					pgm_print : {
						id : "",
						name : "pgm_print",
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
				}
			};
			return this;
		}
		this.get_menu = function(menu_name) {
//		todo: this code needs more thinkibng. the requirement is ot find menu even in nested levels. as it is now. the code on;ly works for the first level

			let menu = null;
//		from this menu system, find menu with the menu_id or menu name
			if( menu_name in this.menus ) {
				menu = this.menus[menu_name];
			}
			return menu;
		}
		this.get_menus = function() {
			return this.menus;
		}
	}

	return {
		Unp: Unp, //user natural person
		Ump: Ump, //user menu permissions
		Urs: Urs, //usr roles
		Adr: Adr, //address object
		Menu: Menu, //ireps menu object
		MenuSystem: MenuSystem, //ireps menu system
	}
})();

//this is the user natural person (unp) user interface controller. its the only object that interacts with html.
const unp_ui_controller = (function(){

	let dom_strings, set_unp_profile_acc, initialize_menus, get_unp_profile_acc, update_unp_pgm_on_save_or_cancel;
	let update_unp_pgm_on_edit;

	dom_strings = {
		unp_surname: "#unp_surname",
		unp_name: "#unp_name",
		unp_email_adr: "#unp_email_adr",
		unp_email_adr_dtv: "#unp_email_adr_dtv",
		unp_mobile_number: "#unp_mobile_number",
		unp_mobile_number_dtv: "#unp_mobile_number_dtv",
		unp_id_no:  "#unp_id_no",
		unp_dob:  "#unp_dob",
		unp_acc_status: "#unp_acc_status",
		unp_date_acc_created: "#unp_date_acc_created",
		unp_id: "#unp_id",

		ml2_unp_profile: "#ml2_unp_profile",
		ml2_unp_stats: "#ml2_unp_stats",
		ml2_unp_logon_history: "#ml2_unp_logon_history",
		ml2_unp_boqs: "#ml2_unp_boqs",
		ml2_unp_smss: "#ml2_unp_smss",
		ml2_unp_emails: "#ml2_unp_emails",

		pgm_edit: "#pgm_edit",
		pgm_cancel: "#pgm_cancel",
		pgm_save: "#pgm_save",
		pgm_daterange: "#pgm_daterange",
//		pgm_view: "pgm_view",
//		pgm_history: "",
		pgm_copy: "#pgm_copy",
		pgm_excel: "#pgm_excel",
		pgm_pdf: "#pgm_pdf",
		pgm_csv: "#pgm_csv",
		pgm_print: "#pgm_print",
		pgm_page_title: "#pgm_page_title",
	}

	initialize_menus = function(ms) {
//  loop through ml1, ml2 and pgm. in each case loop though the individual menus, check the status and use it to
//  show/hide and enable/disable menus.
		for(const menu_category in ms) { //menu category includes ml1, ml2 and pgm
			for(const menu_name in ms[menu_category]) { //menu_name is also the element id can therefore be used for selection
//			check the menu status, then show or hide
				const status = ms[menu_category][menu_name]["status"];
				if(status === "show") {
					$('#'+menu_name).show();
				} else if(status === "hide") {
					$('#'+menu_name).hide();
				} else {
//				todo: throw an error
				}
//			check the menu state, then enable or disable
				const state = ms[menu_category][menu_name]["state"];
				if(state === "enable") {
					$('#'+menu_name).removeAttr("disabled");
				} else if(state === "disabled") {
					$('#'+menu_name).attr("disabled", "true");
				} else {
//				todo: throw an error
				}
			}
		}

//  initialize the date range picker object
    $(function() {
      var start = moment();
      var end = moment();

      function cb(start, end) {
        $('#pgm_daterange span')
        .html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      }

      var drp = $('#pgm_daterange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
         'Today': [moment(), moment()],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), moment()],
         'Last 30 Days': [moment().subtract(29, 'days'), moment()],
         'This Month': [moment().startOf('month'), moment().endOf('month')],
         'Last Month': [moment().subtract(1, 'month')
              .startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
      }, cb);
      cb(start, end);
    });
	}

	set_unp_profile_acc = function(unp){

		let email_adr, email_label, email_verified, mobile_no, mobile_no_label, mobile_no_verified , acc_status_options;

//	initialize unp id
		document.querySelector(dom_strings.unp_id).innerText = unp.unp_id;

//	initialize surname
		document.querySelector(dom_strings.unp_surname).value = unp.surname ;

//  initialize name
		document.querySelector(dom_strings.unp_name).value = unp.name;

// initialize email adr and label
		email_adr = document.querySelector(dom_strings.unp_email_adr)
		email_adr.value = unp.email;
		email_label = email_adr.parentNode.firstElementChild.innerText

		if(!(email_label.search("verified") === -1)) {
			email_label = email_label.substr(0, email_label.indexOf("(") )
		}
		if(unp.email_verified_on_datetime){
			email_verified = "(verified on : " + unp.email_verified_on_datetime + ")";
		} else {
			email_verified = "(email adr NOT verified)";
			email_adr.style.color = 'red'
		}
		email_adr.parentNode.firstElementChild.innerText = email_label + " " + email_verified;

// initialize email adr dtv
		document.querySelector(dom_strings.unp_email_adr_dtv).value = unp.email_verified_on_datetime;;

//  todo: [conform with DRY RULE]consolidate initialization of the mobile number and email adr. both require testing verification.
//  initialize mobile number and label
		mobile_no = document.querySelector(dom_strings.unp_mobile_number);
		mobile_no.value = unp.mobile_no;
		mobile_no_label = mobile_no.parentNode.firstElementChild.innerText

		if(!(mobile_no_label.search("verified") === -1)) {
			mobile_no_label = mobile_no_label.substr(0, email_label.indexOf("(") )
		}
		if(unp.mobile_no_verified_on_datetime){
			mobile_no_verified = "(verified on : " + unp.mobile_no_verified_on_datetime + ")";
		} else {
//    todo: annimate the display of the NOT verified mobile no
			mobile_no_verified = "(mobile number NOT verified)";
			mobile_no.style.color = 'red'
		}
		mobile_no.parentNode.firstElementChild.innerText = mobile_no_label + " " + mobile_no_verified;

// initialize mobile no dtv
		document.querySelector(dom_strings.unp_mobile_number_dtv).value = unp.mobile_no_verified_on_datetime;;

//	initialize id number
		document.querySelector(dom_strings.unp_id_no).value = unp.id_no ;

//  initialize date of birth (dob)
		document.querySelector(dom_strings.unp_dob).value = unp.dob ;

//  initialize account status
		Array.from(document.querySelector(dom_strings.unp_acc_status).children).forEach(function(current_value, index, arr){
			if(current_value.value === unp.acc_status){
				arr[index].setAttribute("selected", "selected");
			}
		});

//  initialize datetime user account was created
		document.querySelector(dom_strings.unp_date_acc_created).value = unp.acc_created_on_datetime;

//	disable all editable fields
		$('.editable').attr('disabled', true);
		$('.non_editable').attr('disabled', true);
	}

	get_unp_profile_acc = function(){
		return {
			surname: document.querySelector(dom_strings.unp_surname).value.trim(),
			name: document.querySelector(dom_strings.unp_name).value.trim(),
			email: document.querySelector(dom_strings.unp_email_adr).value,
			email_verified_on_datetime: document.querySelector(dom_strings.unp_email_adr_dtv).value.trim(),
			mobile_no: document.querySelector(dom_strings.unp_mobile_number).value.trim(),
			mobile_no_verified_on_datetime: document.querySelector(dom_strings.unp_mobile_number_dtv).value.trim(),
			id_no: document.querySelector(dom_strings.unp_id_no).value.trim(),
			dob: document.querySelector(dom_strings.unp_dob).value.trim(),
			acc_status: $(dom_strings.unp_acc_status+" :selected").val().trim(),
			acc_created_on_datetime: document.querySelector(dom_strings.unp_date_acc_created).value.trim(),
		}
	}

	update_unp_pgm_on_save_or_cancel = 	function() {
    $('.editable').attr('disabled', true);
    $(dom_strings.pgm_edit).show().removeAttr('disabled');
    $(dom_strings.pgm_cancel).hide().attr('disabled', true);
    $(dom_strings.pgm_save).hide().attr('disabled', true);
	}

	update_unp_pgm_on_edit = 	function() {
    $('.editable').removeAttr('disabled');
    $(dom_strings.pgm_cancel).show().removeAttr('disabled');
    $(dom_strings.pgm_save).show().addClass('pgm_btn_disabled'); //the save btn must show but be doasabled until a field in the unp acc is modified.
    $(dom_strings.pgm_edit).hide().attr('disabled', true);
    $('.editable').on('input', function() {
      $(dom_strings.pgm_save).removeAttr('disabled').removeClass('pgm_btn_disabled');
    });
//  set the focus on the surname input element as soon as the page get to edit mode.
    let surname = $(dom_strings.unp_surname).val();
    $(dom_strings.unp_surname).val("").val(surname).focus();
	}

	return {
		dom_strings: dom_strings,
		initialize_menus: initialize_menus,
		set_unp_profile_acc: set_unp_profile_acc,
		get_unp_profile_acc: get_unp_profile_acc,
		update_unp_pgm_on_save_or_cancel: update_unp_pgm_on_save_or_cancel,
		update_unp_pgm_on_edit: update_unp_pgm_on_edit,
	}

})(); //uuc

//this is the unp data controller. all unp properties and methods will be here. this represents a unp object.
const unp_data_controller = (function(app){
//instantiate a unp object
	const user_id = 8;
//todo: write code to collect unp data from ieps unp table using unp_id
	const unp_obj = {
		surname: "kentane",
		name: "fi",
		email: "fikilek@innopen.co.za",
		email_verified_on_datetime: "190912 13:23",
		mobile_no: "081 310 0063",
		mobile_no_verified_on_datetime: "",
		id_no: "680416 6044 080",
		dob: "680416",
		acc_status: "" ,//this will be either 'active' (boolean 1 ot true) or 'non active' (boolean 0 or false)
		acc_created_on_datetime: "190912 10:23",
	};
	const user = new app.Unp(user_id).set_unp_details(unp_obj).set_roles().set_menu_permissions();
	const menu_system = new app.MenuSystem().set_ms();
	return {
		user: user,
		ms: menu_system,
	}

})(ireps); //udc

//this is the controller for the event generated in the unp module
//uuc : unp user interface controller (ui controller)
//udc : unp data controller. this is where all unp data is stored.
(function(uuc, udc) {

	let dom, unp, ms;


//get user from udc
	unp = udc.user;
//get menu system from udc
	ms = udc.ms.get_menus();
//initialize menus on the ui
	uuc.initialize_menus(ms);
//set unp profile data on the ui
	uuc.set_unp_profile_acc(unp);
//setup event listeners
	(function() {

//  get dom strings uuc
		dom = uuc.dom_strings;

//	event listeners for ml2 buttons
		document.querySelector(dom.ml2_unp_profile).addEventListener("click", function(){
			console.log("profile");
		})

		document.querySelector(dom.ml2_unp_stats).addEventListener("click", function(){
			console.log("stats");
		})

	  document.querySelector(dom.ml2_unp_logon_history).addEventListener("click", function(){
			console.log("history");
		})

	  document.querySelector(dom.ml2_unp_boqs).addEventListener("click", function(){
			console.log("BoQ's");
		})

	  document.querySelector(dom.ml2_unp_smss).addEventListener("click", function(){
			console.log("sms's");
		})

	  document.querySelector(dom.ml2_unp_emails).addEventListener("click", function(){
			console.log("emails");
		})

//	event listeners for pgm buttons

		document.querySelector(dom.pgm_page_title).addEventListener("click", function(){
	    alert("title");
		})

		document.querySelector(dom.pgm_daterange).addEventListener("click", function(){
//	    alert("daterange");

		})

	  document.querySelector(dom.pgm_edit).addEventListener("click", function(){
//	  update pgm after edit btn clicked
			uuc.update_unp_pgm_on_edit();
		})

		document.querySelector(dom.pgm_cancel).addEventListener("click", function(){
//		user may have already modified (edited) some fields which must be rest on cancel, these must be rest to their
//    current unp field values. this is same as form reset.
			uuc.set_unp_profile_acc(unp);
//		update page menu ui after cancel pgm clicked
			uuc.update_unp_pgm_on_save_or_cancel();
			console.log("unp on cancel", unp);
		})

		document.querySelector(dom.pgm_save).addEventListener("click", function(){
//		get unp profile acc data and update unp at udc
			unp.set_unp_details(uuc.get_unp_profile_acc())
//		update page menu ui after save pgm clicked
			uuc.update_unp_pgm_on_save_or_cancel();
			console.log("unp on save", unp);
		})

//		document.querySelector(dom.pgm_view).addEventListener("click", function(){
//
//		})
//
//		document.querySelector(dom.pgm_history).addEventListener("click", function(){
//
//		})

		document.querySelector(dom.pgm_copy).addEventListener("click", function(){
	    alert("copy");

		})

		document.querySelector(dom.pgm_excel).addEventListener("click", function(){
	    alert("excel");

		})

		document.querySelector(dom.pgm_pdf).addEventListener("click", function(){
	    alert("pdf");

		})

		document.querySelector(dom.pgm_csv).addEventListener("click", function(){
	    alert("csv");

		})

		document.querySelector(dom.pgm_print).addEventListener("click", function(){
	    alert("printer");

		})

	})();

	console.log("ireps has started");

})(unp_ui_controller, unp_data_controller);
