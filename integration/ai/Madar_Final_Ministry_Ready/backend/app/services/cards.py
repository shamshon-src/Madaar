from app.services.retrieval import retrieve
def build(settings,card_type,difficulty,sequence=0):
 domain=settings.get("domain");topic=settings.get("topic");lang=settings.get("language","ar");hits=retrieve(topic or "",domain,topic,1)
 if not hits: raise ValueError("No approved evidence for this topic")
 e=hits[0]; source={"title":e["source_title"],"url":e["source_url"],"reference":e["reference"],"primaryText":e["text"] if lang=="ar" else None,"translationPolicyNote":None if lang=="ar" else "Approved English primary-text translation is not loaded; the system intentionally does not machine-translate it."}
 base={"id":f'{e["id"]}:{card_type}:{sequence}',"type":card_type,"topic":e["topic"],"source":source,"adaptiveDifficulty":difficulty}
 if card_type=="know": return {**base,"dok":1,"title":"اعرف" if lang=="ar" else "Know","prompt":e["know_q"] if lang=="ar" else f"Which option best matches the verified concept for {e['topic']}?","choices":e["know_choices"],"correctChoiceIndex":e["know_correct"],"points":1,"steps":1,"explanation":e["simple"]}
 if card_type=="explore":
  a=sequence%3
  if a==0:q=f'استنادًا إلى الدليل: «{e["text"]}» — {e["know_q"]}';ch=e["know_choices"];ci=e["know_correct"];arch="textual_deduction"
  elif a==1:q=e["scenario_q"];ch=e["scenario_choices"];ci=e["scenario_correct"];arch="case_scenario"
  else:q=e["classify_q"];ch=e["classify_choices"];ci=e["classify_correct"];arch="classification"
  if lang=="en": q="Apply the verified concept to the presented case. Approved primary-text translations must come from the bilingual corpus."
  return {**base,"dok":2,"title":"استكشف" if lang=="ar" else "Explore","prompt":q,"choices":ch,"correctChoiceIndex":ci,"points":2,"steps":2,"explanation":e["deep"],"archetype":arch}
 arch=["error_refutation","boundary_distinction","causal_analysis","multi_variable_case"][sequence%4]
 q=e["analysis_q"] if lang=="ar" else "Analyze the case objectively: identify the error/cause and the resulting effect in one or two concise sentences."
 return {**base,"dok":3,"title":"حلل" if lang=="ar" else "Analyze","prompt":q,"choices":None,"correctChoiceIndex":None,"points":3,"steps":3,"explanation":e["deep"],"requiredElements":e["required"],"archetype":arch,"evidenceId":e["id"]}
