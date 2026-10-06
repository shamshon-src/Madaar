from uuid import uuid4
from app.services.game_rules import CARD_SPECS

def citation():
    return {
        "sourceTitle":"Approved Demo Corpus — replace with reviewed RAG source in production",
        "sourceType":"Curated Demo","page":None,"url":None,"excerpt":None
    }

def build_demo_card(settings:dict, card_type:str, adaptive_difficulty:int)->dict:
    lang=settings.get("language","ar"); topic=settings.get("topic","الأمانة"); spec=CARD_SPECS[card_type]
    if lang=="en":
        if card_type=="know":
            return {"id":str(uuid4()),"type":"know","dok":1,"title":"Know","prompt":f"Which statement best reflects {topic}?","choices":["Preserving entrusted rights","Using entrusted information for personal gain","Delaying rights without reason"],"correctChoiceIndex":0,"requiredElements":None,"explanation":"Direct recall.","citation":citation(),"points":1,"steps":1,"language":"en"}
        if card_type=="explore":
            return {"id":str(uuid4()),"type":"explore","dok":2,"title":"Explore","prompt":"A person is entrusted with an item and its owner requests it back. What is the best action?","choices":["Keep it longer","Return it as entrusted","Give it to another person"],"correctChoiceIndex":1,"requiredElements":None,"explanation":"Application.","citation":citation(),"points":2,"steps":2,"language":"en"}
        return {"id":str(uuid4()),"type":"analyze","dok":3,"title":"Analyze","prompt":"A person disclosed entrusted private information for personal gain. Identify the error and its effect.","choices":None,"correctChoiceIndex":None,"requiredElements":["error/cause","resulting effect"],"explanation":"Objective two-element rubric.","citation":citation(),"points":3,"steps":3,"language":"en"}

    if card_type=="know":
        return {"id":str(uuid4()),"type":"know","dok":1,"title":"اعرف","prompt":f"أي عبارة تعبّر بصورة أوضح عن المعنى الأساسي لمفهوم «{topic}»؟","choices":["حفظ الحقوق وأداء ما اؤتمن عليه الإنسان","استخدام ما اؤتمن عليه لتحقيق مصلحة شخصية","تأخير الحقوق دون سبب معتبر"],"correctChoiceIndex":0,"requiredElements":None,"explanation":"يقيس الاستدعاء المباشر.","citation":citation(),"points":1,"steps":1,"language":"ar"}
    if card_type=="explore":
        return {"id":str(uuid4()),"type":"explore","dok":2,"title":"استكشف","prompt":"أعطاك شخص غرضًا لتحفظه ثم طلبه منك. ما التصرف الأقرب لتطبيق قيمة الأمانة؟","choices":["الاحتفاظ به مدة أطول دون إذن","إعادته لصاحبه كما استلمته","إعطاؤه لشخص آخر دون الرجوع لصاحبه"],"correctChoiceIndex":1,"requiredElements":None,"explanation":"يقيس التطبيق على موقف واقعي.","citation":citation(),"points":2,"steps":2,"language":"ar"}
    return {"id":str(uuid4()),"type":"analyze","dok":3,"title":"حلل","prompt":"ائتمن شخص زميله على معلومة خاصة فنشرها لتحقيق منفعة شخصية. حدّد موضع الخلل، ثم بيّن الأثر الأخلاقي المترتب عليه.","choices":None,"correctChoiceIndex":None,"requiredElements":["موضع الخلل","الأثر المترتب"],"explanation":"التقييم يعتمد على عنصرين موضوعيين.","citation":citation(),"points":3,"steps":3,"language":"ar"}
