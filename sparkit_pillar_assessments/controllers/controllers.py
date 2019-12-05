# -*- coding: utf-8 -*-
from odoo import http

# class SparkitPillarAssessments(http.Controller):
#     @http.route('/sparkit_pillar_assessments/sparkit_pillar_assessments/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/sparkit_pillar_assessments/sparkit_pillar_assessments/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('sparkit_pillar_assessments.listing', {
#             'root': '/sparkit_pillar_assessments/sparkit_pillar_assessments',
#             'objects': http.request.env['sparkit_pillar_assessments.sparkit_pillar_assessments'].search([]),
#         })

#     @http.route('/sparkit_pillar_assessments/sparkit_pillar_assessments/objects/<model("sparkit_pillar_assessments.sparkit_pillar_assessments"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('sparkit_pillar_assessments.object', {
#             'object': obj
#         })