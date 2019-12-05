# -*- coding: utf-8 -*-
from odoo import http

# class SparkitFinanceExchangeRateWizard(http.Controller):
#     @http.route('/sparkit_finance_exchange_rate_wizard/sparkit_finance_exchange_rate_wizard/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/sparkit_finance_exchange_rate_wizard/sparkit_finance_exchange_rate_wizard/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('sparkit_finance_exchange_rate_wizard.listing', {
#             'root': '/sparkit_finance_exchange_rate_wizard/sparkit_finance_exchange_rate_wizard',
#             'objects': http.request.env['sparkit_finance_exchange_rate_wizard.sparkit_finance_exchange_rate_wizard'].search([]),
#         })

#     @http.route('/sparkit_finance_exchange_rate_wizard/sparkit_finance_exchange_rate_wizard/objects/<model("sparkit_finance_exchange_rate_wizard.sparkit_finance_exchange_rate_wizard"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('sparkit_finance_exchange_rate_wizard.object', {
#             'object': obj
#         })