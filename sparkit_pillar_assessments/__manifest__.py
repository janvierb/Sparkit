# -*- coding: utf-8 -*-
{
    'name': "Sparkit: Pillar Assessment Forms",

    'summary': """
        Pillar Assessment addon module for pillar assessment forms.""",

    'description': """
        Pillar assessment forms ranking communities based on
        facilitators perceptions of how well they are doing on the
        pillars each week.
    """,

    'author': "Spark MicroGrants",
    'website': "http://www.sparkmicrogrants.org",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/odoo/addons/base/module/module_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'sparkit'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
        'views/pillar_assessment_views.xml',
        'views/sparkit_community_views.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
}