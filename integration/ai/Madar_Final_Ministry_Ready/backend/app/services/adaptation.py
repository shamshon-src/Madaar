def profile_rules(age_group,knowledge_profile,language):
 young=age_group=="8-16"; new=knowledge_profile=="new_to_islam"
 if young and new:return {"tone":"warm_simple","plain_language":True,"depth":"high_support"}
 if young:return {"tone":"interactive","plain_language":True,"depth":"medium"}
 if new:return {"tone":"respectful_reassuring","plain_language":True,"depth":"high_support"}
 return {"tone":"reasoned_evidence","plain_language":True,"depth":"analytical"}
def simplify_item(e,age_group,knowledge_profile,language):
 rules=profile_rules(age_group,knowledge_profile,language)
 if language=="en": return {"text":"Falak explains the verified concept in simple English, while the primary religious text remains unavailable until an approved bilingual translation is loaded. The system does not machine-translate primary religious texts.","transliteration":["Salah","Wudu","Niyyah","Taharah"],"rules":rules}
 return {"text":e["deep"] if rules["depth"]=="analytical" else e["simple"],"rules":rules}
