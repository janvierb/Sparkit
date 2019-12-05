# -*- coding: utf-8 -*-

from odoo import models, fields, api

class Community(models.Model):
	_name = 'sparkit.community'
	_inherit = 'sparkit.community'


	#Pillar Assessments
	pillar_assessment_ids = fields.One2many('sparkit.pillarassessment', 'community_id',
		track_visibility='onchange', string="Pillar Assessments")
