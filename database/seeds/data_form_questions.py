"""Form questions data - migrated from frontend mock data."""

# Mock form questions data from frontend/questions.ts
FORM_QUESTIONS = [
    {
        "id": "1",
        "question": "Your name",
        "type": "text",
        "order": 0,
        "options": []
    },
    {
        "id": "2",
        "question": "Your email",
        "type": "text",
        "order": 1,
        "options": []
    },
    {
        "id": "3",
        "question": "Grant Team",
        "type": "single",
        "order": 2,
        "options": [
            {"label": "Health and Medical"},
            {"label": "International"},
            {"label": "ARC-D"},
            {"label": "RDS"},
            {"label": "Research Infrastructure"}
        ]
    },
    {
        "id": "4",
        "question": "Stage of Query",
        "type": "single",
        "order": 3,
        "options": [
            {"label": "Pre-Award"},
            {"label": "Post-Award"},
            {"label": "Other"}
        ]
    },
    {
        "id": "5",
        "question": "Is this a simple query or complex referral?",
        "type": "single",
        "order": 4,
        "options": [
            {
                "label": "Simple",
                "followUp": {
                    "id": "5.1",
                    "question": "Simple Query Details",
                    "type": "multi",
                    "options": [
                        {
                            "label": "Grant Scheme",
                            "followUp": {
                                "id": "5.1.1",
                                "question": "Select Grant Scheme",
                                "type": "single",
                                "options": [
                                    {"label": "NHMRC"},
                                    {"label": "MRFF"},
                                    {"label": "ARC"},
                                    {"label": "ECR"},
                                    {"label": "NIH"},
                                    {"label": "Other"}
                                ],
                                "order": 0
                            }
                        },
                        {
                            "label": "MRI Involvement",
                            "followUp": {
                                "id": "5.1.2",
                                "question": "Does this involve an MRI?",
                                "type": "single",
                                "options": [
                                    {"label": "Yes"},
                                    {"label": "No"},
                                    {"label": "Other"}
                                ],
                                "order": 1
                            }
                        },
                        {
                            "label": "Query Type",
                            "followUp": {
                                "id": "5.1.3",
                                "question": "Type of Query",
                                "type": "single",
                                "options": [
                                    {
                                        "label": "Review of contractual clause",
                                        "followUp": {
                                            "id": "5.1.3.1",
                                            "question": "Select clauses to review",
                                            "type": "multi",
                                            "options": [
                                                {"label": "Background IP"},
                                                {"label": "Project IP"},
                                                {"label": "Liability"},
                                                {"label": "Indemnity"},
                                                {"label": "Warranty"},
                                                {"label": "Insurance"},
                                                {"label": "Publication"},
                                                {"label": "Moral Rights"},
                                                {"label": "Other"}
                                            ],
                                            "order": 0
                                        }
                                    },
                                    {"label": "Support with negotiations"},
                                    {"label": "Advice on appropriate agreement"},
                                    {"label": "Advice on compliance with grant obligations"},
                                    {"label": "Other"}
                                ],
                                "order": 2
                            }
                        }
                    ],
                    "order": 0
                }
            },
            {
                "label": "Complex",
                "followUp": {
                    "id": "5.2",
                    "question": "Complex Referral Details",
                    "type": "multi",
                    "options": [
                        {
                            "label": "Grant Scheme",
                            "followUp": {
                                "id": "5.2.1",
                                "question": "Select Grant Scheme",
                                "type": "single",
                                "options": [
                                    {"label": "NHMRC"},
                                    {"label": "MRFF"},
                                    {"label": "ARC"},
                                    {"label": "ECR"},
                                    {"label": "NIH"},
                                    {"label": "Other"}
                                ],
                                "order": 0
                            }
                        },
                        {
                            "label": "MRI Involvement",
                            "followUp": {
                                "id": "5.2.2",
                                "question": "Does this involve an MRI?",
                                "type": "single",
                                "options": [
                                    {"label": "Yes"},
                                    {"label": "No"},
                                    {"label": "Other"}
                                ],
                                "order": 1
                            }
                        },
                        {
                            "label": "Chief Investigator",
                            "followUp": {
                                "id": "5.2.3",
                                "question": "Chief Investigator Name",
                                "type": "text",
                                "order": 2
                            }
                        },
                        {
                            "label": "Faculty Details",
                            "followUp": {
                                "id": "5.2.4",
                                "question": "Faculty and Department",
                                "type": "text",
                                "order": 3
                            }
                        },
                        {
                            "label": "Project Title",
                            "followUp": {
                                "id": "5.2.5",
                                "question": "Project Title",
                                "type": "text",
                                "order": 4
                            }
                        },
                        {
                            "label": "UoM Lead Status",
                            "followUp": {
                                "id": "5.2.6",
                                "question": "Is UoM the lead?",
                                "type": "single",
                                "options": [
                                    {"label": "Lead"},
                                    {"label": "Non-Lead"}
                                ],
                                "order": 5
                            }
                        },
                        {
                            "label": "Other Parties",
                            "followUp": {
                                "id": "5.2.7",
                                "question": "Are there other parties involved in the Project?",
                                "type": "single",
                                "options": [
                                    {
                                        "label": "Yes",
                                        "followUp": {
                                            "id": "5.2.7.1",
                                            "question": "Other Party Details",
                                            "type": "multi",
                                            "options": [
                                                {
                                                    "label": "Party Name",
                                                    "followUp": {
                                                        "id": "5.2.7.1.1",
                                                        "question": "Other Party 1 - Name",
                                                        "type": "text",
                                                        "order": 0
                                                    }
                                                },
                                                {
                                                    "label": "Party Role",
                                                    "followUp": {
                                                        "id": "5.2.7.1.2",
                                                        "question": "Other Party 1 - Role in the project",
                                                        "type": "single",
                                                        "options": [
                                                            {"label": "Funder"},
                                                            {"label": "Administering Organisation"},
                                                            {"label": "Collaborator"},
                                                            {"label": "Incoming party"},
                                                            {"label": "Outgoing party"},
                                                            {"label": "Other"}
                                                        ],
                                                        "order": 1
                                                    }
                                                }
                                            ],
                                            "order": 0
                                        }
                                    },
                                    {"label": "No"}
                                ],
                                "order": 6
                            }
                        },
                        {
                            "label": "Agreement Type",
                            "followUp": {
                                "id": "5.2.8",
                                "question": "Type of Agreement for review",
                                "type": "multi",
                                "options": [
                                    {"label": "Multi-institutional agreement"},
                                    {"label": "Collaboration agreement"},
                                    {"label": "Partner organisation letter"},
                                    {"label": "Acquisition of services agreement"},
                                    {"label": "Novation agreement"},
                                    {"label": "Accession agreement"},
                                    {"label": "Subaward agreement"},
                                    {"label": "Subcontract agreement"},
                                    {"label": "Variation agreement"},
                                    {"label": "Funding agreement"},
                                    {"label": "Other"}
                                ],
                                "order": 7
                            }
                        },
                        {
                            "label": "HPECM Reference",
                            "followUp": {
                                "id": "5.2.9",
                                "question": "HPECM reference",
                                "type": "text",
                                "order": 8
                            }
                        },
                        {
                            "label": "Related Agreements",
                            "followUp": {
                                "id": "5.2.10",
                                "question": "Are there other agreements that relate to this project?",
                                "type": "text",
                                "order": 9
                            }
                        },
                        {
                            "label": "Help Request",
                            "followUp": {
                                "id": "5.2.11",
                                "question": "How can we help?",
                                "type": "text",
                                "order": 10
                            }
                        },
                        {
                            "label": "Additional Notes",
                            "followUp": {
                                "id": "5.2.12",
                                "question": "Other notes",
                                "type": "text",
                                "order": 11
                            }
                        },
                        {
                            "label": "Document Attachments",
                            "followUp": {
                                "id": "5.2.13",
                                "question": "Attach all relevant documents",
                                "type": "text",
                                "order": 12
                            }
                        },
                        {
                            "label": "Urgency",
                            "followUp": {
                                "id": "5.2.14",
                                "question": "Is there urgency on this request?",
                                "type": "single",
                                "options": [
                                    {
                                        "label": "Yes",
                                        "followUp": {
                                            "id": "5.2.14.1",
                                            "question": "Provide urgency date",
                                            "type": "text",
                                            "order": 0
                                        }
                                    },
                                    {"label": "No"}
                                ],
                                "order": 13
                            }
                        }
                    ],
                    "order": 1
                }
            }
        ]
    }
]
