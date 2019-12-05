# -*- coding: utf-8 -*-

from odoo import models, fields, api

# class sparkit_facilitator_weekly_reports(models.Model):
#     _name = 'sparkit_facilitator_weekly_reports.sparkit_facilitator_weekly_reports'

#     name = fields.Char()
#     value = fields.Integer()
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         self.value2 = float(self.value) / 100