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

//	  user menu permissions (ump's) are stored in a role_menu_permissions db table. once user roles are known, they are
//    used to query role_menu_permissions which are then merged to form one user menu permissions which is the used
//    to initiate "this.menu_permissions"
			this.menu_permissions = {};
			this.set_menu_permissions = function() {
				this.menu_permissions = new Ump(this).set_ump().get_ump();
				return this;
			};

//	  user logon history (ulh is user or unp logon history)
			this.logon_history = [];
			this.set_logon_history = () => {
				this.logon_history = new Ulh(this.unp_id).set_ulh().get_ulh();
				return this;
			}
			this.get_logon_history = () => this.logon_history;
//	  get user logon history columns
			this.get_logon_history_cols = () => {
				return create_dt_columns(this.logon_history);
			}

//	  user boqs
			this.boqs = [];
			this.set_boqs = () => {
				this.boqs = new Uboqs(this.unp_id).set_uboqs().get_uboqs();
				return this;
			}
			this.get_boqs_data = () => this.boqs;
//	  get user boqs columns
			this.get_boqs_cols = () => {
				return create_dt_columns(this.boqs);
			}

			this.home_adr = new Adr();
			this.work_adr = new Adr();
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
					{	unpha12_log_on_at_datetime	:"2020/01/22 20:49",	unpha13_log_out_at_datetime	:"2020/01/22 20:37"}	,
					{	unpha12_log_on_at_datetime	:"2020/01/22 02:30",	unpha13_log_out_at_datetime	:"2020/01/22 20:37"}	,
					{	unpha12_log_on_at_datetime	:"2020/01/22 02:30",	unpha13_log_out_at_datetime	:"2020/01/20 02:20"}	,
					{	unpha12_log_on_at_datetime	:"2020/01/21 00:33",	unpha13_log_out_at_datetime	:"2020/01/20 02:20"}	,
					{	unpha12_log_on_at_datetime	:"2020/01/20 02:21",	unpha13_log_out_at_datetime	:"2020/01/20 02:20"}	,
					{	unpha12_log_on_at_datetime	:"2020/01/20 02:19",	unpha13_log_out_at_datetime	:"2020/01/20 02:20"}	,
					{	unpha12_log_on_at_datetime	:"2020/01/20 02:19",	unpha13_log_out_at_datetime	:"2020/01/20 02:18"}	,
					{	unpha12_log_on_at_datetime	:"2020/01/18 23:24",	unpha13_log_out_at_datetime	:"2020/01/20 02:18"}	,
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
	//			this.uboqs = [{cycle	: "jan 19",	qap	: "129"}];
			}
			set_uboqs = () => {
	//	todo: connect to the ireps db and retrieve unp logon history data and then set ulh
				this.uboqs = [

					{"cycle":"jan 19", "qap":"147", "12grv":"0", "21ret":"0", "23alc":"129", "27rtd":"0", "43uni":"0", "44com":"0", "5iins":"0", "5rrea":"0", "5ppur":"0", "53uni":"0", "5mmai":"0", "5ffwn":"0", "5ddcn":"0", "5rrcn":"0", "5lala":"0", "62rec":"0", "83rep":"0"},
					{"cycle":"feb 19", "qap":"168", "12grv":"1", "21ret":"1", "23alc":"130", "27rtd":"1", "43uni":"1", "44com":"1", "5iins":"1", "5rrea":"1", "5ppur":"1", "53uni":"1", "5mmai":"1", "5ffwn":"1", "5ddcn":"1", "5rrcn":"1", "5lala":"1", "62rec":"1", "83rep":"1"},
					{"cycle":"mar 19", "qap":"32", "12grv":"2", "21ret":"2", "23alc":"131", "27rtd":"2", "43uni":"2", "44com":"2", "5iins":"2", "5rrea":"2", "5ppur":"2", "53uni":"2", "5mmai":"2", "5ffwn":"2", "5ddcn":"2", "5rrcn":"2", "5lala":"2", "62rec":"2", "83rep":"2"},
					{"cycle":"apr 19", "qap":"106", "12grv":"3", "21ret":"3", "23alc":"132", "27rtd":"3", "43uni":"3", "44com":"3", "5iins":"3", "5rrea":"3", "5ppur":"3", "53uni":"3", "5mmai":"3", "5ffwn":"3", "5ddcn":"3", "5rrcn":"3", "5lala":"3", "62rec":"3", "83rep":"3"},
					{"cycle":"may 19", "qap":"56", "12grv":"4", "21ret":"4", "23alc":"133", "27rtd":"4", "43uni":"4", "44com":"4", "5iins":"4", "5rrea":"4", "5ppur":"4", "53uni":"4", "5mmai":"4", "5ffwn":"4", "5ddcn":"4", "5rrcn":"4", "5lala":"4", "62rec":"4", "83rep":"4"},
					{"cycle":"jun 19", "qap":"131", "12grv":"5", "21ret":"5", "23alc":"134", "27rtd":"5", "43uni":"5", "44com":"5", "5iins":"5", "5rrea":"5", "5ppur":"5", "53uni":"5", "5mmai":"5", "5ffwn":"5", "5ddcn":"5", "5rrcn":"5", "5lala":"5", "62rec":"5", "83rep":"5"},
					{"cycle":"jul 19", "qap":"79", "12grv":"6", "21ret":"6", "23alc":"135", "27rtd":"6", "43uni":"6", "44com":"6", "5iins":"6", "5rrea":"6", "5ppur":"6", "53uni":"6", "5mmai":"6", "5ffwn":"6", "5ddcn":"6", "5rrcn":"6", "5lala":"6", "62rec":"6", "83rep":"6"},
					{"cycle":"aug 19", "qap":"96", "12grv":"7", "21ret":"7", "23alc":"136", "27rtd":"7", "43uni":"7", "44com":"7", "5iins":"7", "5rrea":"7", "5ppur":"7", "53uni":"7", "5mmai":"7", "5ffwn":"7", "5ddcn":"7", "5rrcn":"7", "5lala":"7", "62rec":"7", "83rep":"7"},
					{"cycle":"sep 19", "qap":"115", "12grv":"8", "21ret":"8", "23alc":"137", "27rtd":"8", "43uni":"8", "44com":"8", "5iins":"8", "5rrea":"8", "5ppur":"8", "53uni":"8", "5mmai":"8", "5ffwn":"8", "5ddcn":"8", "5rrcn":"8", "5lala":"8", "62rec":"8", "83rep":"8"},
					{"cycle":"oct 19", "qap":"72", "12grv":"9", "21ret":"9", "23alc":"138", "27rtd":"9", "43uni":"9", "44com":"9", "5iins":"9", "5rrea":"9", "5ppur":"9", "53uni":"9", "5mmai":"9", "5ffwn":"9", "5ddcn":"9", "5rrcn":"9", "5lala":"9", "62rec":"9", "83rep":"9"},


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



//  start ireps assets *************************************************************************************************
//  ********************************************************************************************************************

//  create assets constructor
		class Asts {
			constructor(ml2){
				this.asts = new IdbAsts(ml2).set_asts().get_asts();
			}
			get_asts = () => this.asts;
			get_asts_cols = () => {
				return create_dt_columns(this.asts);
			}
		}

	//create asset constructor (ast). this uses only ast and asf
		class Ast {
			constructor(asr_a01_id = ''){
				this.asr_a01_id = asr_a01_id;
				this.ast = {}
			}
			set_ast = () => {
//			go to ast, asf and ast_?? table and use ast_id to get ast data and set this.ast.
//        todo: retrieve ast data from ast, asf and ast_?? tables
//      this.ast = set this.ast with data from from ast, asf and ast_?? tables
				this.ast = {
//        common asset data
//				asset identity data
					"ast_a01_id" : this.asr_a01_id,
					"ast_a02_uuid" : "ac20a762-e183-455f-a840-186efe5be79a",
					"ast_a03_asset_no" : "", //if em. asset no wol be meter no
					"ast_a04_barcode" : "",
					"ast_a05_rfid" : "",

//        asset user interaction data
					"ast_b01_created_by_unp_id" : 1,
					"ast_b02_created_on_datetime" : "2019-06-14T08:45:45Z",
					"ast_b03_updated_by_unp_id" : 1,
					"ast_b04_updated_on_datetime" : "2019-06-14T08:45:45Z",

//        asset properties data
					"ast_c01_arcd" : 'em', //asset category is em
					"ast_c02_ass" : 'operation', //asset state is in operation
					"ast_c03_manufacture_amb_id" : 3,

//				asset other data
					"ast_d01_supplier_ten_id" : null,
					"ast_d02_asset_verification_avs_id" : null,
					"ast_d03_adr_id" : null, //current asset address

//        asset finance
					"asf_a01_id": "",
					"asf_a02_purchase_order_no": "",
					"asf_a03_cost_excl_vat": "",
					"asf_a04_delivery_datetime": "",
					"asf_a05_supplier_name": "" ,
					"asf_a06_supplier_contact_person_name": "",
					"asf_a07_supplier_contact_no": "",
				}
				return this;
			}
			get_ast = () =>  this.ast
		}

	//create ast em and inherit ast
		class AstEm extends Ast{
			constructor(asr_a01_id = ''){
				super(asr_a01_id);
	//			let super_ast = super(asr_a01_id);
	//			super_ast.set_ast()
			}
			set_ast_em = () => {
				this.set_ast();
	//		go to ast_em table and use ast_id to get ast em technical data and set this.ast.
	//    todo: retrieve ast_em data for the specified ast_id
				const ast_technical = {
					"ase_meter_phase": "one phase",
					"ase_meter_type": "pre-paid",
					"ase_seal_no": "123456789",
				}
				this.ast = Object.assign(this.ast, ast_technical);
				return this;
			}
		}

	//create asset constructor (ast). this uses only ast and asf
		class AstEmpty extends Ast {
			constructor(){
				super()
				this.ast = {
					"ast_a01_id" : "0",
					"ast_a02_uuid" : "0",
					"ast_a03_asset_no" : "0",
					"ast_a04_barcode" : "0",
					"ast_a05_rfid" : "0",
			}
				return this;
			}
		}

//	creat ireps db object to for asts. pass menu level options
		class IdbAsts {
			constructor(ml2){
				this.ml2 = ml2;
				this.asts = [];
			}
			set_asts = () => {
				if( this.ml2 == '' ){
//  			use only ast and asf to construct asts. go to the db ast and asf tables and get all assets data.
//		  	todo: go to the db ast and asf tables and get all assets data because no ml2 is supplied
					this.asts =  [
						new Ast(1).set_ast().get_ast(),
						new Ast(2).set_ast().get_ast(),
						new Ast(3).set_ast().get_ast(),
						new Ast(4).set_ast().get_ast(),
						new Ast(5).set_ast().get_ast(),
						new Ast(6).set_ast().get_ast(),
						new Ast(7).set_ast().get_ast(),
					]
				} else if ( this.ml2 == 'em')  {
//  			use only ast and asf to construct asts. go to the db ast and asf tables and get all assets data.
//		  	todo: go to the db ast and asf tables and get all assets data.
					this.asts =   [
						new AstEm(1).set_ast_em().get_ast(),
						new AstEm(2).set_ast_em().get_ast(),
						new AstEm(3).set_ast_em().get_ast(),
						new AstEm(4).set_ast_em().get_ast(),
						new AstEm(5).set_ast_em().get_ast(),
						new AstEm(6).set_ast_em().get_ast(),
						new AstEm(7).set_ast_em().get_ast(),
					]
				} else {
					this.asts =   [
//						new AstEm(1).set_ast_empty().get_ast(),
						new AstEmpty().get_ast(),
					]
				}
				return this;
			}
			get_asts = () => this.asts;
		}

//  ********************************************************************************************************************
//  end ireps assets ***************************************************************************************************


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
						pgm_view : {
							id : "",
							name : "pgm_view",
							description : "",
							output : "" ,
							status : "hide",
							state : "enabled",
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


//  start ireps transactions *******************************************************************************************
//  ********************************************************************************************************************

	//create a transactions object
		class Trns {
//    dr is daterange which is an object with start date and end date
//    asc is asset category ['bk', 'em', 'wm', 'pl', 'cb', 'cl']
//    trn is transaction ['grv', rdg, pur, etc]

			constructor(dr, asc = '', trn = ''){  //todo: add dr and st to the arguments of the constructor
//			trns is an array of transactions
//      IdbTrns is an object use to go to the ireps trns table and get all requested transactions
//      all objects starting with Idb are ireps database object that ae used ot interact with ireps db.
				this.dr = dr;
				this.asc = 'em';
				this.trn = '';
				this.trns = new IdbTrns(dr, asc. trn).set_trns(asc).get_trns();
			}
			get_trns = () => this.trns;
			get_trns_cols = () => {
				return create_dt_columns(this.trns);
			}
		}

	//create transaction object (trn) constructor. trn never goes directly to the trn ireps database table.
	//it always collects its data from IdbTrn. if IdbTrns does  not have, then IdbTrns will go to the trn db table and
	//collect
		class Trn {
			constructor(trn_a01_id = ''){
				this.trn_a01_id = trn_a01_id;
				this.trn = {};
			}
			set_trn = (asc) => {
				this.trn = {
//        common trn data
//				asset identity data
					"trn_aa1_id": this.trn_a01_id,
					"trn_aa2_uuid": "ac20a762-e183-455f-a840-186efe5be79a",

					"trn_ab1_arc": asc,  //asset category
					"trn_ab2_trn": "12grv",  //transaction name [grv
					"trn_ab3_tst": "pending",  //transaction state [pending, submitted, qa_fail, qa_pass, qa_pending, no_access, arrangement]

					"trn_ac1_ast_id": "", //id of the asset linked to the transaction
					"trn_ac2_qa": "", //whether this is a qza transaction or not
					"trn_ac3_form_id": "",
					"trn_ac4_access": "",

					"trn_ad1_server_created_by": "fikile kentane",
					"trn_ad2_server_created_on_datetime": "2019-06-14T08:45:45Z",
					"trn_ad3_server_updated_by": "sitha kentane",
					"trn_ad4_server_updated_on_datetime": "2019-06-14T08:45:45Z",

					"trn_ae1_mobile_device_updated_by": "fikile kentane",
					"trn_ae2_mobile_device_updated_on_datetime": "2019-06-14T08:45:45Z",
					"trn_ae3_mobile_device_updated_by": "siya kentane",
					"trn_ae4_mobile_device_updated_on_datetime": "2019-06-14T08:45:45Z",

				};
				return this;
			}
			get_trn = () =>  this.trn
		}

//	create an object to connect to the db and get transactions. this should always be given daterange (dr)
		class IdbTrns {
			constructor(dr, asc, trn){
//			todo: collect all the required data from the db using dr, asc and trn then assign to this.trns. there will be no need for set_trns, only get_trns will be needed.
				this.dr = dr
				this.trns = [];
			}
			set_trns = (asc) => {
				this.trns = [
					new Trn(1).set_trn(asc).get_trn(),
					new Trn(2).set_trn(asc).get_trn(),
					new Trn(3).set_trn(asc).get_trn(),
					new Trn(5).set_trn(asc).get_trn(),
					new Trn(6).set_trn(asc).get_trn(),
					new Trn(7).set_trn(asc).get_trn(),
				]
				return this;
			}
			get_trns = () => this.trns;
		}

//	create form section config object
		class TrnFormConfig {
			constructor(){
				this.form_sections = {};
			}
			set_form_sections = () => {
				this.form_sections = new IdbFormSectionsConfig().get_fs(); //fsc stands for form sections configuration
			}
			get_form_section = (asc) => {
				return this.form_sections(asc);
			}
		}

//	create trn form sections configuration object. data for this object comes for the db
		class IdbFormSectionsConfig {
//    asc stands for asset category [bk, em, wm, pl, cb, tr]
//		trc stands for transaction category [grv, alo, etc]
			construction(asc = '', trc){
//			todo: write code to collect dataty from the db table
//      for now assume asc is em
				this.fs = { //fs stands for form sections
					em: {
						"1_2_grv": {
							metadata: '1',
							np_customer_contact_details: '0',
							jp_customer_contact_details: '0',
							customer_adr: '0',
							customer_acc: '0',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '1',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '0',
							token_purchase: '0',
							meter_audit: '0',
							access: '0',
							unp_details: '1',
						}, //from supplier to stores [12grv]
						"2_1_ret": {
							metadata: '1',
							np_customer_contact_details: '0',
							jp_customer_contact_details: '0',
							customer_adr: '0',
							customer_acc: '0',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '1',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '0',
							token_purchase: '0',
							meter_audit: '0',
							access: '0',
							unp_details: '1',
						},	//from stores back to supplier [21ret]
 						"2_3_alc": {
							metadata: '1',
							np_customer_contact_details: '0',
							jp_customer_contact_details: '0',
							customer_adr: '0',
							customer_acc: '0',
							asset_adr: '0',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '0',
							conventional_billing_detail: '0',
							asset_commissioning: '0',
							reading: '0',
							token_purchase: '0',
							meter_audit: '0',
							access: '0',
							unp_details: '1',
						}, //from stores to allocated [23alc]
 						"2_6_mis": {
							metadata: '1',
							np_customer_contact_details: '0',
							jp_customer_contact_details: '0',
							customer_adr: '0',
							customer_acc: '0',
							asset_adr: '0',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '0',
							conventional_billing_detail: '0',
							asset_commissioning: '0',
							reading: '0',
							token_purchase: '0',
							meter_audit: '0',
							access: '0',
							unp_details: '1',
						}, //from stores to missing
						"2_7_rtd": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //from stores to retired
						"3_2_una": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //from allocated to back stores
						"3_4_ins": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //from allocated to installation
						"3_8_rep": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //from allocated to repairs
						"3_6_mis": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //from stores to missing [missing]
						"4_3_uni": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //from field to store [uninstallation]
						"4_4_com": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //from installation to commissionining
						"4_6_mis": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"5_1_ins": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //in operation inspection
						"5_r_rea": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //in operation meter reading
						"5_p_pur": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //in operation purchase
						"5_3_uni": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						}, //from operation to allocated
						"5_6_mis": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"5_m_mai": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"5_f_fwn": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"5_d_dcn": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"5_r_rcn": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"5_l_ala": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"6_2_rec": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"7_2_bac": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"7_6_mis": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"8_3_rep": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
						"8_6_mis": {
							metadata: '1',
							np_customer_contact_details: '1',
							jp_customer_contact_details: '1',
							customer_adr: '1',
							customer_acc: '1',
							asset_adr: '1',
							asset_technical_detail: '1',
							asset_finance_detail: '0',
							pre_paid_billing_detail: '1',
							conventional_billing_detail: '1',
							asset_commissioning: '0',
							reading: '1',
							token_purchase: '0',
							meter_audit: '0',
							access: '1',
							unp_details: '1',
						},
					},
					wm: {

					},
				}
				get_fs = this.fs;
			}
		}

//  ********************************************************************************************************************
//  end ireps transactions *********************************************************************************************

//  helper functions that are private to ireps class
//	create helper function to create columns of datatables
		const create_dt_columns = (dt_data) => {
			let cols, columns;
			if(dt_data){
				cols = Object.keys(dt_data[0]);
				columns = cols.map((value, index) => {
					return { 'data': value, 'title': value };
				});
			} else (
				columns = { 'data': 'empty', 'title': 'empty' }
			)
			return columns;
		}

		return {
			Unp: Unp, //user natural person
			Ump: Ump, //user menu permissions
			Urs: Urs, //usr roles
			Adr: Adr, //address object
			Menu: Menu, //ireps menu object
			MenuSystem: MenuSystem, //ireps menu system
			Asts: Asts, //assets
			Trns: Trns, //transactions
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

	class IrepsPathname {

		constructor(){
			this.pathname = location.pathname;
			this.pathname_parts = this.pathname.split('/'); //pnp is pathname_parts
			this.npp = ''; //normalised_pathname_parts is npp
			this.path = '';
		}

		set_path = () => {
			this.pathname_parts = this.pathname.split('/');
			if(this.pathname_parts[1] === 'idt'){
				if(this.rest_of_pathname_parts_empty(this.pathname_parts)){ //pathname_parts [2] [3] [4] and [5]	are all empty
					this.path = this.pathname_parts[2];
				} else {  //pathname_parts [2] [3] [4] and [5]	are NOT all empty
					this.path = this.make_path(this.pathname_parts);
				}
			} else {
				this.path = this.pathname_parts[1];
			}
			return this;
		}

		get_path = () => this.path;

		set_npp = () => {
			if(this.pathname_parts[1] === 'idt'){
				//  delete the idt part
				this.pathname_parts.splice(this.pathname_parts.indexOf('idt'),1);
			}
			this.npp = this.pathname_parts;
			return this;
		}

		get_npp = () => this.npp;

		get_ml1 = () => this.pathname_parts[2];

		make_path = (pn_parts) => {  // pn_parts is pathname parts
			let path = pn_parts[2]; //ml1
			for( let key = 3; key < pn_parts.length ; key++){
				if(pn_parts[key] == '' || pn_parts[key] == '%20') { // pn_part is NOT empty. ml2
					continue
				} else {
					path = path + "_" + pn_parts[key];
				}
			}
			return path;
		}

		rest_of_pathname_parts_empty = (pn_parts) => {
			for( let key = 3; key < pn_parts.length ; key++){
				if(pn_parts[key] == '' || pn_parts[key] == '%20'){
					continue;
				} else {
					return false
				}
			}
			return true;
		}

		normalise_pnp = () => {
			this.pathname_parts.forEach((cv, index, ar) => { //cv is current_value
				cv =='%20'? ar[index] = '': cv = cv ;
			})
			return this;
		}

		get_pnp = () => this.pathname_parts;

	}

	const dom_strings = {
//	unp profile acc
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

//  menu level 1 (ml1)
		ml1_ireps: "#ml1_ireps",
		ml1_dbd: "#ml1_dbd",
		ml1_asts: "#ml1_asts",
		ml1_trns: "#ml1_trns",
		ml1_wos: "#ml1_wos",
		ml1_knbs: "#ml1_knbs",
		ml1_admin: "#ml1_admin",
		ml1_signup: "#ml1_signup",
		ml1_signin: "#ml1_signin",
		ml1_signout: "#ml1_signout",
		ml1_unp: "#ml1_unp",

//  menu level 2 (ml2)
		ml2_unp_profile: "#ml2_unp_profile",
		ml2_unp_stats: "#ml2_unp_stats",
		ml2_unp_logon_history: "#ml2_unp_logon_history",
		ml2_unp_boqs: "#ml2_unp_boqs",
		ml2_unp_smss: "#ml2_unp_smss",
		ml2_unp_emails: "#ml2_unp_emails",

//	menu level 4 (ml4)
//  ml4 left
		pgm_page_title: "#pgm_page_title",
		pgm_daterange: "#pgm_daterange",
		pgm_view: "#pgm_view", // view will also show history
		pgm_smss: "#pgm_smss",
		pgm_emails: "#pgm_emails",

//  ml4 right
		pgm_copy: "#pgm_copy",
		pgm_excel: "#pgm_excel",
		pgm_pdf: "#pgm_pdf",
		pgm_csv: "#pgm_csv",
		pgm_print: "#pgm_print",


//	menu level 5 (ml5) these are modal menus

		page_menu_div: "#page_menu_div",

	}

	const idt_columns_map = () => {
		columns_map = new Map();

//	column names for unp_logon_history dt
		columns_map.set('unpha12_log_on_at_datetime', 'signin');
		columns_map.set('unpha13_log_out_at_datetime', 'signout');

//	column names for unp_boqs dt
		columns_map.set("cycle", "cycle" );
		columns_map.set("qap", "qap" );
		columns_map.set("12grv", "grv" );
		columns_map.set("21ret", "ret" );
		columns_map.set("23alc", "alc" );
		columns_map.set("26mis", "mis" );
		columns_map.set("27rtd", "rtd" );
		columns_map.set("32una", "una" );
		columns_map.set("34ins", "ins" );
		columns_map.set("38rep", "rep" );
		columns_map.set("36mis", "mis" );
		columns_map.set("43uni", "uni" );
		columns_map.set("44com", "com" );
		columns_map.set("46mis", "mis" );
		columns_map.set("5iins", "ins" );
		columns_map.set("5rrea", "rea" );
		columns_map.set("5ppur", "pur" );
		columns_map.set("53uni", "uni" );
		columns_map.set("56mis", "mis" );
		columns_map.set("5mmai", "mai" );
		columns_map.set("5ffwn", "fwn" );
		columns_map.set("5ddcn", "dcn" );
		columns_map.set("5rrcn", "rcn" );
		columns_map.set("5lala", "ala" );
		columns_map.set("62rec", "rec" );
		columns_map.set("72bac", "bac" );
		columns_map.set("76mis", "mis" );
		columns_map.set("83rep", "rep" );
		columns_map.set("86mis", "mis" );
		return columns_map;
	}

	const initialize_menus = function(ms) {
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

	const set_unp_profile_acc = function(unp) {
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

	const get_unp_profile_acc = function(){
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

	const set_unp_profile_modal = function(unp_profile_acc_data) {
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

	const get_unp_profile_modal = function() {
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

	const set_unp_acc_status = status => {
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

	const show_unp_profile_acc_modal = function() {
		$(dom_strings.unp_profile_user_acc_details_modal).modal('show');

	}

	const hide_unp_profile_acc_modal = function() {
		$(dom_strings.unp_profile_user_acc_details_modal).modal('hide');

	}

//**********************************************************************************************************************
//END unp profile
//**********************************************************************************************************************


//**********************************************************************************************************************
//START Idt
//**********************************************************************************************************************
//todo: get all rows to display row numbers
	class Idt {
		constructor(cols, data){
			this.cols = cols;
			this.data = data;
			this.dt_instance = $('#idt').DataTable({
				select: 'single',
	      "columns": this.cols,
	      "data": this.data,
	      "dom": '<"top"<"pmrb"B>>rt <"bottom"lip>',
				"initComplete": (settings, json) => {

	        //create the input search boxes at the top of the datatable on a row (tr) below thead.
	        //this is done by cloning tr of thead and append it to same thead of the datatable (#ireps_dt)
	        $('#idt thead tr').clone(false).appendTo( '#idt thead' );
	        $('#idt thead tr:eq(1) th').each( function () {
            let title = idt_columns_map().get($(this).text().trim());
            $(this).html( '<input class="col_search" type="text" placeholder=" '+title+' " />' );
	        });

	        // Apply the search. this search function actually filters the column for a value in the input box
	        let self = this;
	        $('#idt thead').on('keyup change', '.col_search', function () {
            self.dt_instance.column( $(this).parent().index() ).search( this.value ).draw();
	        });

				},
	    });

			//  respond when a row is selected
			this.dt_instance.on( 'select', function ( e, dt, type, indexes ) {
				const npp = new IrepsPathname().set_npp().get_npp();
				if(npp[1] === 'asts' || npp[1] === 'trns' || npp[1] === "unp_boqs"){
					$('#pgm_view').show();
				} else {
					$('#pgm_view').hide();
				}
			});

			//  respond when a row is deselcted
			this.dt_instance.on( 'deselect', function ( e, dt, type, indexes ) {
				$('#pgm_view').hide();
			});

		}

		set_cols = (idt_columns_map) => {
			let self = this;
			self.dt_instance.columns().every(function(key, value) {
				$(self.dt_instance.column(key).header()).text(idt_columns_map().get($(self.dt_instance.column(key).header()).text().trim()));
			})
			return this;
		}
	}


//**********************************************************************************************************************
//END Idt
//**********************************************************************************************************************

	const table_empty_flash = (path) => {
			$('#div-flash').append(
				'<div class="alert alert-dismissible alert-warning fade show">'+
	        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
	        '  <span aria-hidden="true">×</span>'+
	        '</button>'+
	        ' '+path+ ' table empty'+
        '</div>')
	}


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
		IrepsPathname: IrepsPathname,
		table_empty_flash: table_empty_flash,
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
	const user = new app.Unp(user_id)
		.set_unp_details(unp_obj)
		.set_roles()
		.set_menu_permissions()
		.set_logon_history()
		.set_boqs();
	const menu_system = new app.MenuSystem().set_ms();
	const Asts = app.Asts;
	const Trns = app.Trns;
	return {
		user: user,
		ms: menu_system,
		Asts: Asts,
		Trns: Trns
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

		//get pathname
		//		const path = new uuc.IrepsPathname().set_path().get_path()
		const path = '';
		const pnp = new uuc.IrepsPathname().normalise_pnp().get_pnp() //pnp is pathname parts
		const ml1 = pnp[1];
		const ml2 = pnp[2];
		const ml3 = pnp[3];
		if(ml1 === 'ireps'){

		} else if (ml1 === 'dbd'){

		} else if (ml1 === 'asts'){

			const asts = new udc.Asts(ml2);
			const data = asts.get_asts();
			const cols = asts.get_asts_cols();
			const asts_dt = new uuc.Idt(cols, data).set_cols(uuc.idt_columns_map);

		} else if (ml1 === 'trns'){

			const trns = new udc.Trns();
			const data = trns.get_trns();
			const cols = trns.get_trns_cols();
			const trns_dt = new uuc.Idt(cols, data).set_cols(uuc.idt_columns_map);

		} else if (ml1 === 'wos'){

		} else if (ml1 === 'knb'){

		} else if (ml1 === 'admin'){

		} else if (ml1 === 'unp'){

			if(ml2 === 'profile'){

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

			} else if (ml2 === 'stats'){

			} else if (ml2 === 'logon_history'){

				//to initialise dom for unp logon history, the following are needed:
				//  1. column names for the unp logon history datatable. this comes from udc.
				//  3. rows data for the unp logon history datatable. this comes from udc.
				const cols = unp.get_logon_history_cols();
				const data = unp.get_logon_history();
				const ulh = new uuc.Idt(cols, data).set_cols(uuc.idt_columns_map);

			} else if (ml2 === 'boqs'){

				//to initialise dom for unp boqs, the following are needed:
				//  1. column names for boqs datatable. this comes from udc.
				//  3. rows data for the boqs datatable. this comes from udc.
				const cols = unp.get_boqs_cols();
				const data = unp.get_boqs_data();
				const uboqs = new uuc.Idt(cols, data ).set_cols(uuc.idt_columns_map);

			} else if (ml2 === 'smss'){


			} else if (ml2 === 'email'){


			}

		} else {

			//  todo: throw an error

		}

		console.log("ireps has started");

	})(unp_ui_controller, unp_data_controller);

   console.log('END ireps.js document ready function')

});

console.log('END running ireps.js')
