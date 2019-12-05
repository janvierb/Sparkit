# -*- coding: utf-8 -*-
from odoo import http

# class SparkitSparkitLogo(http.Controller):
#     @http.route('/sparkit_sparkit_logo/sparkit_sparkit_logo/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/sparkit_sparkit_logo/sparkit_sparkit_logo/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('sparkit_sparkit_logo.listing', {
#             'root': '/sparkit_sparkit_logo/sparkit_sparkit_logo',
#             'objects': http.request.env['sparkit_sparkit_logo.sparkit_sparkit_logo'].search([]),
#         })

#     @http.route('/sparkit_sparkit_logo/sparkit_sparkit_logo/objects/<model("sparkit_sparkit_logo.sparkit_sparkit_logo"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('sparkit_sparkit_logo.object', {
#             'object': obj
#         })