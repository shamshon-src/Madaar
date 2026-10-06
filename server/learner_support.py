"""Local learner scaffolding; uses supplied evidence without model calls."""
from app.services.adaptation import profile_rules


def learner_profile(cfg):
    young = cfg['ageGroup'] == '8-16'
    new = cfg['knowledgeProfile'] == 'new_to_islam'
    return {**profile_rules(cfg['ageGroup'], cfg['knowledgeProfile'], 'ar'),
            'level': 1 if new else 2 if young else 3,
            'intro': ('نتعلم خطوة بخطوة. اقرأ النص بهدوء، ثم جرّب الإجابة.' if young and new else
                      'لنكتشف المعنى معًا. اقرأ النص وفكر في السؤال.' if young else
                      'يمكنك التعلم على مهل. اقرأ النص، ثم أجب بحسب ما فهمته.' if new else
                      'اقرأ الدليل، ثم اربط معناه بالسؤال وعلّل إجابتك عند الحاجة.')}


def adapt_card(card, entry, cfg, difficulty):
    profile = learner_profile(cfg)
    level = min(difficulty or profile['level'], profile['level'])
    card = {**card, 'adaptiveDifficulty': level, 'explanation': entry['simple']}
    if card['type'] == 'explore':
        prefix = 'scenario' if level == 1 else 'classify' if level == 2 else None
        if prefix:
            card.update(prompt=entry[prefix + '_q'], choices=entry[prefix + '_choices'],
                        correctChoiceIndex=entry[prefix + '_correct'])
    if card['type'] == 'analyze':
        guide = ('يمكنك الإجابة في سطرين: ماذا حدث؟ وما أثره؟' if level == 1 else
                 'حدد موضع الخلل، ثم اذكر أثره في جملة أو جملتين.' if level == 2 else
                 'حلّل العلاقة بين التصرف وأثره، وبيّن وجه الاستدلال من النص.')
        card['prompt'] += '\n' + guide
    card['prompt'] = profile['intro'] + '\n\n' + card['prompt']
    return card, profile


def correct_answer(card, entry):
    if card['type'] != 'analyze':
        return card['choices'][card['correctChoiceIndex']]
    return 'عناصر الإجابة المكتملة:\n' + '\n'.join('• ' + item for item in entry['required'])


def feedback_text(grade, maximum, entry, cfg):
    profile = learner_profile(cfg)
    if grade == maximum:
        lead = 'أحسنت! وصلت إلى الإجابة المطلوبة.'
    elif grade:
        lead = 'أحسنت المحاولة. بقي جزء من الإجابة؛ راجع العناصر المطلوبة.'
    else:
        lead = 'لا بأس، هذه فرصة للتعلم. قارن الإجابة المطلوبة بالدليل.'
    return lead + '\n' + (entry['deep'] if profile['level'] == 3 else entry['simple'])


def expanded_explanation(card, entry, cfg, more=False):
    profile = learner_profile(cfg)
    parts = [profile['intro'], 'المعنى ببساطة: ' + entry['simple'],
             'كيف يرتبط الدليل بالإجابة؟ ' + entry['deep'],
             correct_answer(card, entry)]
    if more:
        parts += ['مثال للتطبيق: ' + entry['scenario_q'],
                  'التصرف المناسب في المثال: ' + entry['scenario_choices'][entry['scenario_correct']],
                  'للمراجعة: ' + entry['classify_q'],
                  'الحالة المناسبة: ' + entry['classify_choices'][entry['classify_correct']]]
    else:
        parts += ['مثال للتطبيق: ' + entry['scenario_q'],
                  'التصرف المناسب: ' + entry['scenario_choices'][entry['scenario_correct']]]
    return '\n\n'.join(parts)
