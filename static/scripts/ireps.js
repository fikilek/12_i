console.log('START running ireps.js')

$(document).ready(function() {
  console.log('START ireps.js document ready function')


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
			this.unp_id = unp_obj.unp_id;
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

//	user logon history (ulh is user or unp logon history)
		this.logon_history = [];
		this.set_logon_history = () => {
			this.logon_history = new Ulh(this.unp_id).set_ulh().get_ulh();
			return this;
		}
		this.get_logon_history = () => this.logon_history;

//	get user logon history columns
		this.get_logon_history_cols = () => {
			const cols = Object.keys(this.logon_history[0]);
			const cloumns = cols.map((value, index) => {
				return { 'data': value, 'title': value }
			});
			return cloumns;
		}


//	user boqs
		this.boqs = [];
		this.set_boqs = () => {
			this.boqs = new Uboqs(this.unp_id).set_uboqs().get_uboqs();
			console.log('inside set_boqs')
//			this.boqs = new Uboqs(this.unp_id).get_uboqs();
//			let new_boqs = new Uboqs(this.unp_id);
//			this.boqs = new_boqs.get_uboqs();
			return this;
		}
		this.get_boqs_data = () => this.boqs;

//	get user boqs columns
		this.get_boqs_cols = () => {
			const cols = Object.keys(this.boqs[0]);
			const cloumns = cols.map((value, index) => {
				return { 'data': value, 'title': value }
			});
			return cloumns;
		}


		this.home_adr = new Adr();
		this.work_adr = new Adr();
//		this.set_unp_details();
	}

//create a db object to connect to the ireps db and collect unp logon history data
	class Ulh {
		constructor(unp_id) {
			this.unp_id = unp_id;
			this.ulh = [];
		}
		set_ulh = () => {
//		todo: connect to the ireps db and retrieve unp logon history data and then set ulh
			this.ulh = [
				{	unpha12_log_on_at_datetime	:	"	2020/01/22 20:49	"	,	unpha13_log_out_at_datetime	:	"	2020/01/22 20:37	"	}	,
				{	unpha12_log_on_at_datetime	:	"	2020/01/22 02:30	"	,	unpha13_log_out_at_datetime	:	"	2020/01/22 20:37	"	}	,
				{	unpha12_log_on_at_datetime	:	"	2020/01/22 02:30	"	,	unpha13_log_out_at_datetime	:	"	2020/01/20 02:20	"	}	,
				{	unpha12_log_on_at_datetime	:	"	2020/01/21 00:33	"	,	unpha13_log_out_at_datetime	:	"	2020/01/20 02:20	"	}	,
				{	unpha12_log_on_at_datetime	:	"	2020/01/20 02:21	"	,	unpha13_log_out_at_datetime	:	"	2020/01/20 02:20	"	}	,
				{	unpha12_log_on_at_datetime	:	"	2020/01/20 02:19	"	,	unpha13_log_out_at_datetime	:	"	2020/01/20 02:20	"	}	,
				{	unpha12_log_on_at_datetime	:	"	2020/01/20 02:19	"	,	unpha13_log_out_at_datetime	:	"	2020/01/20 02:18	"	}	,
				{	unpha12_log_on_at_datetime	:	"	2020/01/18 23:24	"	,	unpha13_log_out_at_datetime	:	"	2020/01/20 02:18	"	}	,
			]
			return this;
		}
		get_ulh = () => this.ulh;
	}


//create a db object to connect to the ireps db and collect unp boq data
	class Uboqs {
		constructor(unp_id) {
			this.unp_id = unp_id;
			this.uboqs = [];
//			this.uboqs = [{boq_cycle	: "jan 2019",	qap	: "129"}];
		}
		set_uboqs = () => {
//	todo: connect to the ireps db and retrieve unp logon history data and then set ulh
			this.uboqs = [

				{	"	boq_cycle	"	:"	jan 2019	",	"	qap	"	:"	129	",	"	12grv	"	:"	0	",	"	21ret"	:"	0	",	"	23alc	"	:"	129	",	"	26mis	"	:"	0	",	"	27rtd	"	:"	0	",	"	36mis	"	:"	0	",	"	43uni	"	:"	0	",	"	44com	"	:"	0	",	"	46mis	"	:"	0	",	"	5iins	"	:"	0	",	"	5rrea	"	:"	0	",	"	5ppur	"	:"	0	",	"	53uni	"	:"	0	",	"	56mis	"	:"	0	",	"	5mmai	"	:"	0	",	"	5ffwn	"	:"	0	",	"	5ddcn	"	:"	0	",	"	5rrcn	"	:"	0	",	"	5lala	"	:"	0	",	"	62rec	"	:"	0	",	"	72bac	"	:"	0	",	"	76mis	"	:"	0	",	"	83rep	"	:"	0	",	"	86mis	"	:"	0	"	},

				{	"	boq_cycle	"	:"	feb 2019	",	"	qap	"	:"	129	",	"	12grv	"	:"	0	",	"	21ret"	:"	0	",	"	23alc	"	:"	129	",	"	26mis	"	:"	0	",	"	27rtd	"	:"	0	",	"	36mis	"	:"	0	",	"	43uni	"	:"	0	",	"	44com	"	:"	0	",	"	46mis	"	:"	0	",	"	5iins	"	:"	0	",	"	5rrea	"	:"	0	",	"	5ppur	"	:"	0	",	"	53uni	"	:"	0	",	"	56mis	"	:"	0	",	"	5mmai	"	:"	0	",	"	5ffwn	"	:"	0	",	"	5ddcn	"	:"	0	",	"	5rrcn	"	:"	0	",	"	5lala	"	:"	0	",	"	62rec	"	:"	0	",	"	72bac	"	:"	0	",	"	76mis	"	:"	0	",	"	83rep	"	:"	0	",	"	86mis	"	:"	0	"	},

				{	"	boq_cycle	"	:"	mar 2019	",	"	qap	"	:"	129	",	"	12grv	"	:"	0	",	"	21ret"	:"	0	",	"	23alc	"	:"	129	",	"	26mis	"	:"	0	",	"	27rtd	"	:"	0	",	"	36mis	"	:"	0	",	"	43uni	"	:"	0	",	"	44com	"	:"	0	",	"	46mis	"	:"	0	",	"	5iins	"	:"	0	",	"	5rrea	"	:"	0	",	"	5ppur	"	:"	0	",	"	53uni	"	:"	0	",	"	56mis	"	:"	0	",	"	5mmai	"	:"	0	",	"	5ffwn	"	:"	0	",	"	5ddcn	"	:"	0	",	"	5rrcn	"	:"	0	",	"	5lala	"	:"	0	",	"	62rec	"	:"	0	",	"	72bac	"	:"	0	",	"	76mis	"	:"	0	",	"	83rep	"	:"	0	",	"	86mis	"	:"	0	"	},

//				{"boq_cycle"	: "jan 2019",	"qap"	: "129", "12grv": "1"},
//				{"boq_cycle"	: "feb 2019",	"qap"	: "140",	"12grv": "2"},
//				{"boq_cycle"	: "mar 2019",	"qap"	: "12",	"12grv": "3"},
//				{"boq_cycle"	: "apr 2019",	"qap"	: "5",	"12grv": "4"},

			]
			return this;
		}
		get_uboqs = () => this.uboqs;
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

//create menu system (ms) object.
	const MenuSystem = function() {
		this.menus = {};
		this.set_ms = function() {
//		go to the db menu_table and get all records
//todo: write code to collect menu system from db table.
			this.menus = { //menus is the simulation of data obtained from the db table
				ml1 : { //menu level 1
					ml1_ireps : { //name of ml1 object
						id : "",
						name : "ml1_ireps", //ireps home page
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_dbd : {
						id : "",
						name : "ml1_dbd", //dashboard
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_ast : {
						id : "",
						name : "ml1_ast ", //assets
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_trn : {
						id : "",
						name : "ml1_trn", //transactions
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_wos : {
						id : "",
						name : "ml1_wos", //works orders
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_knowledge_base : {
						id : "",
						name : "ml1_knowledge_base", //knowledge base
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_adm : {
						id : "",
						name : "ml1_adm", //admin
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_signup : {
						id : "",
						name : "ml1_signup", //ml1_signup
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_signin : {
						id : "",
						name : "ml1_signin", //ml1_signin
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_signout : {
						id : "",
						name : "ml1_signout", //ml1_signout
						description : "",
						output : "" ,
						status : "show",
						state : "enabled",
					},
					ml1_unp : {
						id : "",
						name : "ml1_unp", //user natural persons
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

//unp profile
//todo: change color of all unp profile btns to light grey. use scss color variable

//unp proflie acc
//todo: disable the upn profile add button. unp is added when a user registers with ireps and ehrer after gets only edited
//unp nok
//todo: ad functionality to add next of kin. THere shouyld vonly be one nok pre unp.
//unp roles
//todo: add functionality to add user role. these should be added as sub-cards on the existing unp roles card
//todo: add functionality to edit user role. this should be on the respective role card
//todo: add functionality to delete user role. this should be on the respective role card


	let dom_strings, set_unp_profile_acc, initialize_menus, get_unp_profile_acc, update_unp_pgm_on_save_or_cancel;
	let update_unp_pgm_on_edit, hide_pgm, idt_column_map, ireps_pathname;

	ireps_pathname = {
		pathname : location.pathname,
	}

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
		unp_profile_data_edit_btn: "#unp_profile_data_edit_btn",

//  unp profile user acc modal id
		unp_profile_user_acc_details_modal: "#unp_profile_user_acc_details_modal",
		unp_id_modal: "#unp_id_modal",
		unp_surname_modal: "#unp_surname_modal",
		unp_name_modal: "#unp_name_modal",
		unp_email_adr_modal: "#unp_email_adr_modal",
		unp_mobile_number_modal: "#unp_mobile_number_modal",
		unp_id_no_modal: "#unp_id_no_modal",
		unp_dob_modal: "#unp_dob_modal",
		unp_acc_status_modal: "#unp_acc_status_modal",
		unp_acc_created_on_datetime_modal: "#unp_acc_created_on_datetime_modal",
		unp_profile_user_acc_details_modal_submit_btn: "#unp_profile_user_acc_details_modal_submit_btn",

		ml1_ireps: "#ml1_ireps",
		page_menu_div: "#page_menu_div",

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

	idt_columns_map = () => {
		columns_map = new Map();

//	column names for unp_logon_history dt
		columns_map.set('unpha12_log_on_at_datetime', 'signin');
		columns_map.set('unpha13_log_out_at_datetime', 'signout');

//	column names for unp_boqs dt
columns_map.set("	12grv	"	,	"	12grv	" );
columns_map.set("	21ret	"	,	"	21ret	" );
columns_map.set("	23alc	"	,	"	23alc	" );
columns_map.set("	26mis	"	,	"	26mis	" );
columns_map.set("	27rtd	"	,	"	27rtd	" );
columns_map.set("	32una	"	,	"	32una	" );
columns_map.set("	34ins	"	,	"	34ins	" );
columns_map.set("	38rep	"	,	"	38rep	" );
columns_map.set("	36mis	"	,	"	36mis	" );
columns_map.set("	43uni	"	,	"	43uni	" );
columns_map.set("	44com	"	,	"	44com	" );
columns_map.set("	46mis	"	,	"	46mis	" );
columns_map.set("	5iins	"	,	"	5iins	" );
columns_map.set("	5rrea	"	,	"	5rrea	" );
columns_map.set("	5ppur	"	,	"	5ppur	" );
columns_map.set("	53uni	"	,	"	53uni	" );
columns_map.set("	56mis	"	,	"	56mis	" );
columns_map.set("	5mmai	"	,	"	5mmai	" );
columns_map.set("	5ffwn	"	,	"	5ffwn	" );
columns_map.set("	5ddcn	"	,	"	5ddcn	" );
columns_map.set("	5rrcn	"	,	"	5rrcn	" );
columns_map.set("	5lala	"	,	"	5lala	" );
columns_map.set("	62rec	"	,	"	62rec	" );
columns_map.set("	72bac	"	,	"	72bac	" );
columns_map.set("	76mis	"	,	"	76mis	" );
columns_map.set("	83rep	"	,	"	83rep	" );
columns_map.set("	86mis	"	,	"	86mis	" );

		return columns_map;
	}

	initialize_menus = function(ms) {
		let loaded_file;
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

//	hide pgm if ireps or knwoledgebase is clicked
		loaded_file = location.pathname;
		if(loaded_file == '/' || loaded_file == '/knowledge_base') {
			$(dom_strings.page_menu_div).hide();
		} else {
			$(dom_strings.page_menu_div).show();
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

//**********************************************************************************************************************
//START unp profile
//**********************************************************************************************************************

	set_unp_profile_acc = function(unp) {
//
//		let email_adr, email_label, email_verified, mobile_no, mobile_no_label, mobile_no_verified , acc_status_options;

//	initialize unp id
		if(document.body.contains(document.querySelector(dom_strings.unp_id))) {
			document.querySelector(dom_strings.unp_id).innerText = unp.unp_id
		}

//	initialize surname
		if(document.body.contains(document.querySelector(dom_strings.unp_surname))){
			document.querySelector(dom_strings.unp_surname).innerText = unp.surname
		}

//  initialize name
		if(document.body.contains(document.querySelector(dom_strings.unp_name))){
			document.querySelector(dom_strings.unp_name).innerText = unp.name
		}

// initialize email adr and label
		if(document.body.contains(document.querySelector(dom_strings.unp_email_adr))){
			document.querySelector(dom_strings.unp_email_adr).innerText = unp.email
		}

//  initialize mobile number
		if(document.body.contains(document.querySelector(dom_strings.unp_mobile_number))){
			document.querySelector(dom_strings.unp_mobile_number).innerText = unp.mobile_no
		}

//	initialize id number
		if(document.body.contains(document.querySelector(dom_strings.unp_id_no))){
			document.querySelector(dom_strings.unp_id_no).innerText = unp.id_no
		}

//  initialize date of birth (dob)
		if(document.body.contains(document.querySelector(dom_strings.unp_dob))){
			document.querySelector(dom_strings.unp_dob).innerText = unp.dob
		}

//  initialize account status
		if(document.body.contains(document.querySelector(dom_strings.unp_acc_status))){
			document.querySelector(dom_strings.unp_acc_status).innerText = unp.acc_status
		}

//  initialize datetime user account was created
		if(document.body.contains(document.querySelector(dom_strings.unp_date_acc_created))){
			document.querySelector(dom_strings.unp_date_acc_created).innerText = unp.acc_created_on_datetime
		}

	}

	get_unp_profile_acc = function(){
		return {
			unp_id: document.querySelector(dom_strings.unp_id).innerText.trim(),
			surname: document.querySelector(dom_strings.unp_surname).innerText.trim(),
			name: document.querySelector(dom_strings.unp_name).innerText.trim(),
			email: document.querySelector(dom_strings.unp_email_adr).innerText.trim(),
//			email_verified_on_datetime: document.querySelector(dom_strings.unp_email_adr_dtv).innerText.trim(),
			mobile_no: document.querySelector(dom_strings.unp_mobile_number).innerText.trim(),
//			mobile_no_verified_on_datetime: document.querySelector(dom_strings.unp_mobile_number_dtv).innerText.trim(),
			id_no: document.querySelector(dom_strings.unp_id_no).innerText.trim(),
			dob: document.querySelector(dom_strings.unp_dob).innerText.trim(),
			acc_status: document.querySelector(dom_strings.unp_acc_status).innerText.trim(),
			acc_created_on_datetime: document.querySelector(dom_strings.unp_date_acc_created).innerText.trim(),
		}
	}

	set_unp_profile_modal = function(unp_profile_acc_data) {
		document.querySelector(dom_strings.unp_id_modal).value = unp_profile_acc_data.unp_id;
		document.querySelector(dom_strings.unp_surname_modal).value = unp_profile_acc_data.surname;
		document.querySelector(dom_strings.unp_name_modal).value = unp_profile_acc_data.name;
		document.querySelector(dom_strings.unp_email_adr_modal).value = unp_profile_acc_data.email;
		document.querySelector(dom_strings.unp_mobile_number_modal).value = unp_profile_acc_data.mobile_no;
		document.querySelector(dom_strings.unp_id_no_modal).value = unp_profile_acc_data.id_no;
		document.querySelector(dom_strings.unp_dob_modal).value = unp_profile_acc_data.dob;
		set_unp_acc_status(unp_profile_acc_data.acc_status);
		document.querySelector(dom_strings.unp_acc_created_on_datetime_modal).value = unp_profile_acc_data.acc_created_on_datetime;
	}

	get_unp_profile_modal = function() {
		return {
			unp_id: document.querySelector(dom_strings.unp_id_modal).value.trim(),
			surname: document.querySelector(dom_strings.unp_surname_modal).value.trim(),
			name: document.querySelector(dom_strings.unp_name_modal).value.trim(),
			email: document.querySelector(dom_strings.unp_email_adr_modal).value.trim(),
			mobile_no: document.querySelector(dom_strings.unp_mobile_number_modal).value.trim(),
			id_no: document.querySelector(dom_strings.unp_id_no_modal).value.trim(),
			dob: document.querySelector(dom_strings.unp_dob_modal).value.trim(),
			acc_status: document.querySelector(dom_strings.unp_acc_status_modal).checked == true? 'active' : 'disabled',
			acc_created_on_datetime: document.querySelector(dom_strings.unp_acc_created_on_datetime_modal).value.trim(),
		}
	}

	set_unp_acc_status = status => {
		if(status == 'active') {
			$(dom_strings.unp_acc_status_modal)[0].checked = true;
			$(dom_strings.unp_acc_status_modal)[0].parentNode.children[1].innerText = 'active';
		} else if (status == 'disabled') {
			$(dom_strings.unp_acc_status_modal)[0].checked = false;
			$(dom_strings.unp_acc_status_modal)[0].parentNode.children[1].innerText = 'disabled';
		} else {
//			todo: throw an error
		}
	}

	show_unp_profile_acc_modal = function() {
		$(dom_strings.unp_profile_user_acc_details_modal).modal('show');

	}

	hide_unp_profile_acc_modal = function() {
		$(dom_strings.unp_profile_user_acc_details_modal).modal('hide');

	}

//**********************************************************************************************************************
//END unp profile
//**********************************************************************************************************************


//**********************************************************************************************************************
//START unp logon history
//**********************************************************************************************************************
//todo: get all rows to display row numbers
//the method create_dt is used to create ireps datatable
	class Idt {
		constructor(cols, data){
			this.cols = cols;
			this.data = data;
			this.dt_instance = $('#idt').DataTable({
	      "columns": this.cols,
	      "data": this.data,
	      "dom": '<"top"<"pml"><"pmr"B>>>rt <"bottom"lip>',
	      "autoWidth": true,
				"initComplete": (settings, json) => {

	        //create the input search boxes at the top of the datatable on a row (tr) below thead.
	        //this is done by cloning tr of thead and append it to same thead of the datatable (#ireps_dt)
	        $('#idt thead tr').clone(false).appendTo( '#idt thead' );
	        $('#idt thead tr:eq(1) th').each( function () {
	            let title = idt_columns_map().get($(this).text());
	            $(this).html( '<input class="col_search" type="text" placeholder="Search '+title+'" />' );
	        });

	        // Apply the search. this search function actually filters the column for a value in the input box
	        let this_dt = this;
	        $('#idt thead').on('keyup change', '.col_search', function () {
	            this_dt.dt_instance.column( $(this).parent().index() ).search( this.value ).draw();
	        });
				},
	    });
		}
		set_cols = (idt_columns_map) => {
			let self = this;
			self.dt_instance.columns().every(function(key, value) {
				const header_title = idt_columns_map().get($(self.dt_instance.column(key).header()).text());
				$(self.dt_instance.column(key).header()).text( header_title );
			})
			return this;
		}
	}


//**********************************************************************************************************************
//END unp logon history
//**********************************************************************************************************************


	return {
		dom_strings: dom_strings,
		initialize_menus: initialize_menus,
		set_unp_profile_acc: set_unp_profile_acc,
		get_unp_profile_acc: get_unp_profile_acc,
		set_unp_profile_modal: set_unp_profile_modal,
		get_unp_profile_modal: get_unp_profile_modal,
		show_unp_profile_acc_modal: show_unp_profile_acc_modal,
		hide_unp_profile_acc_modal: hide_unp_profile_acc_modal,
		set_unp_acc_status: set_unp_acc_status,
		Idt: Idt,
		idt_columns_map: idt_columns_map,
		ireps_pathname: ireps_pathname,
	}

})(); //uuc

//this is the unp data controller. all unp properties and methods will be here. this represents a unp object.
const unp_data_controller = (function(app){
//instantiate a unp object
	const user_id = 8;
//todo: write code to collect unp data from ieps unp table using unp_id
	const unp_obj = {
		unp_id: "73512",
		surname: "kentane",
		name: "fikile",
		email: "fikilek@innopen.co.za",
		email_verified_on_datetime: "190912 13:23",
		mobile_no: "081 310 0063",
		mobile_no_verified_on_datetime: "",
		id_no: "680416 6044 080",
		dob: "680416",
		acc_status: "active" ,//this will be either 'active' (boolean true) or 'disabled' (boolean false)
//	todo: any other value should throw an error
		acc_created_on_datetime: "190912 10:23",
	};
	const user = new app.Unp(user_id).set_unp_details(unp_obj)
		.set_roles()
		.set_menu_permissions()
		.set_logon_history()
		.set_boqs();
	const menu_system = new app.MenuSystem().set_ms();
	return {
		user: user,
		ms: menu_system,
	}

})(ireps); //udc

//this is the controller for the events generated in the unp module
//uuc : unp user interface controller (ui controller)
//udc : unp data controller. this is where all unp data is stored.
(function(uuc, udc) {

//get dom strings uuc
	const dom = uuc.dom_strings;

//get user from udc
	const unp = udc.user;

//get menu system from udc
	const ms = udc.ms.get_menus();

//initialize menus on the ui
	uuc.initialize_menus(ms);

//**********************************************************************************************************************
//START initialise dom in unp profile
//**********************************************************************************************************************

//set unp profile data on the ui
	if(uuc.ireps_pathname.pathname == '/unp_profile'){
		uuc.set_unp_profile_acc(unp);

		//set unp profile stats
		//todo: code to set unp stats

		//set unp profile picture
		//todo: code to set unp picture


		//setup event listeners for unp profile
		(function() {
		//	unp profile acc - edit
		//  display unp edit user profile modal on the click of edit modal btn
				document.querySelector(dom.unp_profile_data_edit_btn).addEventListener("click", function(){
					uuc.show_unp_profile_acc_modal();
				})

		//	take action and prepare data to display on the modal. respond to modal show event
				$(dom.unp_profile_user_acc_details_modal).on('show.bs.modal', function (e) {
					uuc.set_unp_profile_modal(uuc.get_unp_profile_acc());
				})

		//	take action and prepare to save modal data
				$(dom.unp_profile_user_acc_details_modal).on('hide.bs.modal', function (e) {
		//    todo: clean up when the modal hides
				})

		//  submit changes made on the unp profile acc modal
				document.querySelector(dom.unp_profile_user_acc_details_modal_submit_btn).addEventListener("click", function(e){
					e.preventDefault();
		//		get unp profile acc data from a modified modal form and update unp at udc
					unp.set_unp_details(uuc.get_unp_profile_modal())
		//		hide unp profile scc modal
					uuc.hide_unp_profile_acc_modal();
		//		update uuc with new unp data
					uuc.set_unp_profile_acc(unp);
				})



		//  unp profile nok (next of kin) - there will only be one nok
		//  todo: write event handler for adding a new nok. nok data will be displayed in a modal form like unp profile acc modal

		//  todo: write event handler for editing a nok

		//  todo: write event handler tp delete a nok

		//  unp profile role (user roles) - there may be more than  one role per user
		//  todo: write event handler for adding a new user role. user role data will be displayed in a modal form

		//  todo: write event handler for editing a user role

		//  todo: write event handler tp delete a user role

				document.querySelector(dom.unp_acc_status_modal).addEventListener("click", function(e){
					uuc.set_unp_acc_status(this.checked == true ? 'active' : 'disabled')
				})

			})();

	}

//**********************************************************************************************************************
//END initialise dom in unp profile
//**********************************************************************************************************************


//**********************************************************************************************************************
//START initialise dom unp logon history
//**********************************************************************************************************************
//first check if 'unp_logon_history' is the pathname
	if(uuc.ireps_pathname.pathname == '/unp_logon_history'){
	//to initialise dom for unp logon history, the following are needed:
	//  1. column names for the unp logon history datatable. this comes from udc.
	//  3. rows data for the unp logon history datatable. this comes from udc.
			const ulh = new uuc.Idt(unp.get_logon_history_cols(), unp.get_logon_history()).set_cols(uuc.idt_columns_map);
	}
//**********************************************************************************************************************
//END initialise dom unp logon history
//**********************************************************************************************************************

//**********************************************************************************************************************
//START initialise dom unp boqs
//**********************************************************************************************************************
//first check if 'unp_boqs' is the pathname
	if(uuc.ireps_pathname.pathname == '/unp_boqs'){
	//to initialise dom for unp boqs, the following are needed:
	//  1. column names for boqs datatable. this comes from udc.
	//  3. rows data for the boqs datatable. this comes from udc.
		const cols = unp.get_boqs_cols();
		const data = unp.get_boqs_data();
		const uboqs = new uuc.Idt(cols, data ).set_cols(uuc.idt_columns_map);
	}
//**********************************************************************************************************************
//END initialise dom unp logon history
//**********************************************************************************************************************


//setup event listeners
	(function() {



//	event listeners for ml2 buttons
		document.querySelector(dom.ml1_ireps).addEventListener("click", function(e){
			console.log("ml1_ireps");
		})

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
	    alert("daterange");

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

  console.log('END ireps.js document ready function')

});

console.log('END running ireps.js')
