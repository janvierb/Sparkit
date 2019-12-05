odoo.define('SparkHomeDashboards', function(require){
    "use strict";

    var core = require('web.core');
    var Widget = require('web.Widget');
    var rpc = require('web.rpc');
    var session = require('web.session');


    //ManagementHome
    var ManagementHomeWidget = Widget.extend({
        template: 'ManagementHome'
    });
    core.action_registry.add('sparkit.managementhome', ManagementHomeWidget);


    //ACAHome
    var ACAHomeWidget = Widget.extend({
        template: 'ACAHome'
    });
    core.action_registry.add('sparkit.acahome', ACAHomeWidget);

    //FacilitatorDashboard
    var FacilitatorDashboardWidget = Widget.extend({
        template: 'FacilitatorDashboard',
        events: {
          'click .fac_dashboard_date_calendar': 'open_calendar',
          'click .all_communities': 'toggle_list_table',
          'click .this_week_communities': 'toggle_visits_this_week',
          'click .vrfs_submitted_this_week':'toggle_vrfs_this_week',
          'click .this_week_vrfs': 'toggle_vrfs_this_week',
          'click .visits_today': 'toggle_visits_this_week',
          'click .visits_this_week': 'toggle_visits_this_week',
          'click .new_indprojectupdate': 'new_indprojectupdate',
          'click .new_savingsgroup_update': 'new_savingsgroup_update',
          'click .new_partnership_update': 'new_partnership_update',
          'click .new_independentproject': 'new_independentproject',
          'click .new_vrf': 'new_vrf',
        },
        start: function() {
          return $.when(
            new WelcomeCurrentUser(this).appendTo(this.$('.hello_user')),
            new FacilitatorCommunityList(this).appendTo(this.$('.fac_dashboard_community_bucket')),
            new ListVisitsThisWeek(this).appendTo(this.$('.list_visits_this_week')),
            new PrintDate(this).appendTo(this.$('.fac_dashboard_date')),
            new CountVisitsToday(this).appendTo(this.$('.highlight_visits_today_number')),
            new CountVisitsThisWeek(this).appendTo(this.$('.highlight_visits_this_week_number')),
            new CountVRFsThisWeek(this).appendTo(this.$('.highlight_vrfs_submitted_this_week_number')),
            new ListVRFsThisWeek(this).appendTo(this.$('.list_vrfs_this_week'))
          )
        },
        toggle_list_table: function(event) {
          $(".fac_dashboard_community_bucket").slideToggle(200);
        },
        toggle_vrfs_this_week: function(event) {
          $(".list_vrfs_this_week").slideToggle(200);
        },
        toggle_visits_this_week: function(event) {
          $(".list_visits_this_week").slideToggle(200);
        },
        toggle_vrfs_this_week: function(event) {
          $(".list_vrfs_this_week").slideToggle(200);
        },
        open_calendar: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.community',
            views: [[false, 'calendar']],
            target: 'new',
          });
        },
        new_indprojectupdate: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.independentprojectupdate',
            views: [[false, 'form']],
          });
        },
        new_savingsgroup_update: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.savingsgroupupdate',
            views: [[false, 'form']],
          });
        },
        new_partnership_update: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.partnershipupdate',
            views: [[false, 'form']],
          });
        },
        new_independentproject: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.independentproject',
            views: [[false, 'form']],
          });
        },
        new_vrf: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.vrf',
            views: [[false, 'form']],
            context: {'default_created_on_odoo':'True'},
          })
        }
    });
    core.action_registry.add('sparkit.facilitatordashboard', FacilitatorDashboardWidget);


    //Counters
    var WelcomeCurrentUser = Widget.extend({
        template: "WelcomeCurrentUser",
        start: function() {
            var self = this;
            var session2 = this.getSession(); //alert('ss..'+session.uid); alert('ss2..'+session2.uid);var domain = [];
            var domain = [ ['id', '=', session.uid] ];
            var args = [domain];    //search_read: [domain, ['id', 'name']];

            rpc.query({ 
                model: 'res.users', 
                method: 'search_read', 
                args: args,   //[[['id', '=', session.uid]]],
            }).then(function(result){   //console.log(result[0]);
                var res = result[0];
                self.$el.text("Hello" + ", " + res.name);
            });
        },
    });

    var CountVisitsToday = Widget.extend({
        template: "GetVisitsToday",
        events: {
            'click .visits_today': 'selected_item',
        },
        start: function() {
            var self = this;  //var session = this.getSession();
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd;
            var domain = [ ['facilitator_id', '=', session.uid],['next_visit_date', '=', today] ];
            var args = [domain];

            rpc.query({ 
                model: 'sparkit.community', 
                method: 'search_read', 
                args: args,
            }).then(function(result){
                self.$el.text(result.length);
            });
        },
        selected_item: function (event) {
          this.do_action({
              type: 'ir.actions.act_window',
              view_type: 'list',
              view_mode: 'list',
              res_model: 'sparkit.community',
              views: [[false, 'list']],
            });
        },
    });

    var CountVisitsThisWeek = Widget.extend({
        template: "CountVisitsThisWeek",
        //Function from Calendar Module
        iso8601Week: function(date) {
          var time,
            checkDate = new Date(date.getTime());

          // Find Thursday of this week starting on Monday
          checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

          time = checkDate.getTime();
          checkDate.setMonth(0); // Compare with Jan 1
          checkDate.setDate(1);
          return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        start: function() {
            var self = this;
            var today = new Date();
            var week = this.iso8601Week(today)
            var domain = [ ['facilitator_id', '=', session.uid],['next_visit_date_week', '=', week] ];
            var args = [domain]; 

            rpc.query({ 
                model: 'sparkit.community', 
                method: 'search_read', 
                args: args,
            }).then(function(result){
                self.$el.text(result.length);
            });
        },
    });    

    var PrintDate = Widget.extend({
        template: "PrintDate",
        start: function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            today = dd+'/'+mm+'/'+yyyy;
            return this.$el.append(today)
        },
    });

    var FacilitatorCommunityList = Widget.extend({
        template: "FacilitatorCommunityList",
        events: {
            'click .community_list_row': 'selected_item',
        },
        start: function () {
            var self = this;
            var domain = [ ['facilitator_id', '=', session.uid],['is_partnered', '=', 'True'] ]; 
            var args = [domain];

            rpc.query({ 
                model: 'sparkit.community', 
                method: 'search_read', 
                args: args,
            }).then(function(results){
                _(results).each(function (item) {
                        self.$el.append(QWeb.render('FacilitatorCommunity', {item: item}));
                });
            });
        },
        selected_item: function (event) {
          this.do_action({
              type: 'ir.actions.act_window',
              name: this.title,
              res_model: 'sparkit.community',
              res_id: $(event.currentTarget).data('id'),
              views: [[false, 'form']],
            });
        },
    });

    var ListVisitsThisWeek = Widget.extend({
        template: "ListVisitsThisWeek",
        events: {
            'click .community_list_row': 'selected_item',
        },
        iso8601Week: function(date) {
          var time,
            checkDate = new Date(date.getTime());

          // Find Thursday of this week starting on Monday
          checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

          time = checkDate.getTime();
          checkDate.setMonth(0); // Compare with Jan 1
          checkDate.setDate(1);
          return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        start: function() {
            var self = this;
            var today = new Date();
            var week = this.iso8601Week(today);
            var domain = [ ['facilitator_id', '=', session.uid], ['next_visit_date_week', '=', week] ]; 
            var args = [domain];

            rpc.query({ 
                model: 'sparkit.community', 
                method: 'search_read', 
                args: args,
            }).then(function(results){
                _(results).each(function (item) {
                        self.$el.append(QWeb.render('CommunityVisitThisWeek', {item: item}));
                });
            });
        },
        selected_item: function (event) {
          this.do_action({
              type: 'ir.actions.act_window',
              name: this.title,
              res_model: 'sparkit.community',
              res_id: $(event.currentTarget).data('id'),
              views: [[false, 'form']],
            });
        },
    });

    var ListVRFsThisWeek = Widget.extend({
        template: "ListVRFsThisWeek",
        events: {
            'click .community_list_row': 'selected_item',
        },
        iso8601Week: function(date) {
          var time,
            checkDate = new Date(date.getTime());

          // Find Thursday of this week starting on Monday
          checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

          time = checkDate.getTime();
          checkDate.setMonth(0); // Compare with Jan 1
          checkDate.setDate(1);
          return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        start: function() {
            var self = this;
            var today = new Date();
            var week = this.iso8601Week(today);
            var domain = [ ['facilitator_id', '=', session.uid],['visit_date_week', '=', week] ]; 
            var args = [domain];

            rpc.query({ 
                model: 'sparkit.vrf', 
                method: 'search_read', 
                args: args,
            }).then(function(results){
                _(results).each(function (item) {
                        self.$el.append(QWeb.render('VRFSubmitted', {item: item}));
                });
            });
        },
        selected_item: function (event) {
          this.do_action({
              type: 'ir.actions.act_window',
              res_model: 'sparkit.vrf',
              res_id: $(event.currentTarget).data('id'),
              views: [[false, 'form']],
            });
        },
    });

    var CountVRFsThisWeek = Widget.extend({
        template: "CountVRFsThisWeek",
        //Function from Calendar Module
        iso8601Week: function(date) {
          var time,
            checkDate = new Date(date.getTime());

          // Find Thursday of this week starting on Monday
          checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

          time = checkDate.getTime();
          checkDate.setMonth(0); // Compare with Jan 1
          checkDate.setDate(1);
          return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        start: function() {
            var self = this;
            var today = new Date();
            var week = this.iso8601Week(today)
            var domain = [ ['facilitator_id', '=', session.uid],['visit_date_week', '=', week] ]; 
            var args = [domain];

            rpc.query({ 
                model: 'sparkit.vrf', 
                method: 'search_read', 
                args: args,
            }).then(function(result){
                self.$el.text(result.length);
            });
        },
    });


});


console.log('Loaded facilitator_dashboard.js');



/**
**  -- This is the Old code 
**  -- for Odoo version 9
*/

/*
odoo.sparkit = function(instance, local) {
    var _t = instance.web._t,
        _lt = instance.web._lt;

    var QWeb = instance.web.qweb;


    local.ManagementHome = instance.Widget.extend({
        template: "ManagementHome"
        })

    instance.web.client_actions.add(
        'sparkit.managementhome', 'instance.sparkit.ManagementHome');

    local.ACAHome = instance.Widget.extend({
        template: "ACAHome"
        })

    instance.web.client_actions.add(
        'sparkit.acahome', 'instance.sparkit.ACAHome');

    local.FacilitatorDashboard = instance.Widget.extend({
        template: "FacilitatorDashboard",
        events: {
          'click .fac_dashboard_date_calendar': 'open_calendar',
          'click .all_communities': 'toggle_list_table',
          'click .this_week_communities': 'toggle_visits_this_week',
          'click .vrfs_submitted_this_week':'toggle_vrfs_this_week',
          'click .this_week_vrfs': 'toggle_vrfs_this_week',
          'click .visits_today': 'toggle_visits_this_week',
          'click .visits_this_week': 'toggle_visits_this_week',
          'click .new_indprojectupdate': 'new_indprojectupdate',
          'click .new_savingsgroup_update': 'new_savingsgroup_update',
          'click .new_partnership_update': 'new_partnership_update',
          'click .new_independentproject': 'new_independentproject',
          'click .new_vrf': 'new_vrf',
        },
        start: function() {
          return $.when(
            new local.WelcomeCurrentUser(this).appendTo(this.$('.hello_user')),
            new local.FacilitatorCommunityList(this).appendTo(this.$('.fac_dashboard_community_bucket')),
            new local.ListVisitsThisWeek(this).appendTo(this.$('.list_visits_this_week')),
            new local.PrintDate(this).appendTo(this.$('.fac_dashboard_date')),
            new local.CountVisitsToday(this).appendTo(this.$('.highlight_visits_today_number')),
            new local.CountVisitsThisWeek(this).appendTo(this.$('.highlight_visits_this_week_number')),
            new local.CountVRFsThisWeek(this).appendTo(this.$('.highlight_vrfs_submitted_this_week_number')),
            new local.ListVRFsThisWeek(this).appendTo(this.$('.list_vrfs_this_week'))
          )
        },
        toggle_list_table: function(event) {
          $(".fac_dashboard_community_bucket").slideToggle(200);
        },
        toggle_vrfs_this_week: function(event) {
          $(".list_vrfs_this_week").slideToggle(200);
        },
        toggle_visits_this_week: function(event) {
          $(".list_visits_this_week").slideToggle(200);
        },
        toggle_vrfs_this_week: function(event) {
          $(".list_vrfs_this_week").slideToggle(200);
        },
        open_calendar: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.community',
            views: [[false, 'calendar']],
            target: 'new',
          });
        },
        new_indprojectupdate: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.independentprojectupdate',
            views: [[false, 'form']],
          });
        },
        new_savingsgroup_update: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.savingsgroupupdate',
            views: [[false, 'form']],
          });
        },
        new_partnership_update: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.partnershipupdate',
            views: [[false, 'form']],
          });
        },
        new_independentproject: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.independentproject',
            views: [[false, 'form']],
          });
        },
        new_vrf: function(event) {
          this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'sparkit.vrf',
            views: [[false, 'form']],
            context: {'default_created_on_odoo':'True'},
          })
        }
    });

    instance.web.client_actions.add(
        'sparkit.facilitatordashboard', 'instance.sparkit.FacilitatorDashboard');

    local.CountVisitsToday = instance.Widget.extend({
        template: "GetVisitsToday",
        events: {
            'click .visits_today': 'selected_item',
        },
        start: function() {
            var self = this;
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-' + dd;
            return new instance.web.Model("sparkit.community")
                .query(["id"])
                .filter([['facilitator_id', '=', self.session.uid],['next_visit_date', '=', today]])
                .all()
                .then(function(result) {
                    self.$el.text(result.length);
                });
        },
        selected_item: function (event) {
          this.do_action({
              type: 'ir.actions.act_window',
              view_type: 'list',
              view_mode: 'list',
              res_model: 'sparkit.community',
              views: [[false, 'list']],
            });
        },
    });

    local.CountVisitsThisWeek = instance.Widget.extend({
        template: "CountVisitsThisWeek",
        //Function from Calendar Module
        iso8601Week: function(date) {
      		var time,
      			checkDate = new Date(date.getTime());

      		// Find Thursday of this week starting on Monday
      		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

      		time = checkDate.getTime();
      		checkDate.setMonth(0); // Compare with Jan 1
      		checkDate.setDate(1);
      		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      	},
        start: function() {
            var self = this;
            var today = new Date();
            var week = this.iso8601Week(today)

            return new instance.web.Model("sparkit.community")
                .query(["id"])
                .filter([['facilitator_id', '=', self.session.uid],['next_visit_date_week', '=', week]])
                .all()
                .then(function(result) {
                    self.$el.text(result.length);
                });
        },
    });

    local.WelcomeCurrentUser = instance.Widget.extend({
        template: "WelcomeCurrentUser",
        start: function() {
            var self = this;
            return new instance.web.Model("res.users")
                .query(["name"], ["id"])
                .filter([['id', '=', self.session.uid]])
                .first()
                .then(function(result) {
                    self.$el.text("Hello" + ", " + result.name);
                });
        },
    });

    local.PrintDate = instance.Widget.extend({
        template: "PrintDate",
        start: function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            today = dd+'/'+mm+'/'+yyyy;
            return this.$el.append(today)
        },
    });

    local.FacilitatorCommunityList = instance.Widget.extend({
        template: "FacilitatorCommunityList",
        events: {
            'click .community_list_row': 'selected_item',
        },
        start: function () {
            var self = this;
            return new instance.web.Model('sparkit.community')
                .query(['name', 'id', 'community_number', 'phase_name', 'state_name', 'next_visit_date','avg_attendance','avg_percent_pg_participation', 'avg_percent_female_attendance', 'avg_percent_participation', 'avg_percent_female_participation'])
                .filter([['facilitator_id', '=', self.session.uid],['is_partnered', '=', 'True']])
                .all()
                .then(function (results) {
                    _(results).each(function (item) {
                        self.$el.append(QWeb.render('FacilitatorCommunity', {item: item}));
                });
            });
        },
        selected_item: function (event) {
          this.do_action({
              type: 'ir.actions.act_window',
              name: this.title,
              res_model: 'sparkit.community',
              res_id: $(event.currentTarget).data('id'),
              views: [[false, 'form']],
            });
        },
    });

    local.ListVisitsThisWeek = instance.Widget.extend({
        template: "ListVisitsThisWeek",
        events: {
            'click .community_list_row': 'selected_item',
        },
        iso8601Week: function(date) {
      		var time,
      			checkDate = new Date(date.getTime());

      		// Find Thursday of this week starting on Monday
      		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

      		time = checkDate.getTime();
      		checkDate.setMonth(0); // Compare with Jan 1
      		checkDate.setDate(1);
      		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      	},
        start: function() {
            var self = this;
            var today = new Date();
            var week = this.iso8601Week(today)

            return new instance.web.Model('sparkit.community')
                .query(['name', 'id', 'community_number', 'phase_name', 'state_name', 'next_visit_date'])
                .filter([['facilitator_id', '=', self.session.uid], ['next_visit_date_week', '=', week]])
                .all()
                .then(function (results) {
                    _(results).each(function (item) {
                        self.$el.append(QWeb.render('CommunityVisitThisWeek', {item: item}));
                });
            });
        },
        selected_item: function (event) {
          this.do_action({
              type: 'ir.actions.act_window',
              name: this.title,
              res_model: 'sparkit.community',
              res_id: $(event.currentTarget).data('id'),
              views: [[false, 'form']],
            });
        },
    });

    local.ListVRFsThisWeek = instance.Widget.extend({
        template: "ListVRFsThisWeek",
        events: {
            'click .community_list_row': 'selected_item',
        },
        iso8601Week: function(date) {
          var time,
            checkDate = new Date(date.getTime());

          // Find Thursday of this week starting on Monday
          checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

          time = checkDate.getTime();
          checkDate.setMonth(0); // Compare with Jan 1
          checkDate.setDate(1);
          return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        start: function() {
            var self = this;
            var today = new Date();
            var week = this.iso8601Week(today)

            return new instance.web.Model('sparkit.vrf')
                .query(['community_name', 'id', 'visit_date', 'phase_name', 'state_name', 'next_visit_date', 'form_type'])
                .filter([['facilitator_id', '=', self.session.uid],['visit_date_week', '=', week]])
                .all()
                .then(function (results) {
                    _(results).each(function (item) {
                        self.$el.append(QWeb.render('VRFSubmitted', {item: item}));
                });
            });
        },
        selected_item: function (event) {
          this.do_action({
              type: 'ir.actions.act_window',
              res_model: 'sparkit.vrf',
              res_id: $(event.currentTarget).data('id'),
              views: [[false, 'form']],
            });
        },
    });

    local.CountVRFsThisWeek = instance.Widget.extend({
        template: "CountVRFsThisWeek",
        //Function from Calendar Module
        iso8601Week: function(date) {
          var time,
            checkDate = new Date(date.getTime());

          // Find Thursday of this week starting on Monday
          checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

          time = checkDate.getTime();
          checkDate.setMonth(0); // Compare with Jan 1
          checkDate.setDate(1);
          return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },
        start: function() {
            var self = this;
            var today = new Date();
            var week = this.iso8601Week(today)

            return new instance.web.Model("sparkit.vrf")
                .query(["id"])
                .filter([['facilitator_id', '=', self.session.uid],['visit_date_week', '=', week]])
                .all()
                .then(function(result) {
                    self.$el.text(result.length);
                });
        },
    });


}
*/



