(() => {
const groups = {
		worship: ["الوضوء", "الصلاة", "الصيام", "الزكاة", "الحج"],
		transactions: ["البيع والشراء", "الأمانة في المعاملات", "الربا", "حفظ الحقوق", "الصدق في التجارة"],
		belief: ["التوحيد", "أركان الإيمان", "الإيمان بالملائكة", "الإيمان باليوم الآخر", "أسماء الله الحسنى"],
		history: ["الهجرة النبوية", "غزوة بدر", "صلح الحديبية", "فتح مكة", "السيرة النبوية"],
		quran: ["تفسير سورة الفاتحة", "أسباب النزول", "جمع القرآن", "قصص القرآن", "آداب تلاوة القرآن"],
		ethics: ["بر الوالدين", "صلة الرحم", "الرفق", "الأمانة", "آداب الحوار"]
	};
const normalize = value => String(value || '').normalize('NFKC').replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/\s+/g,' ').trim();
const aliases = {'القرآن الكريم':'علوم القرآن','القرآن':'علوم القرآن','الفاتحة':'تفسير سورة الفاتحة','سورة الفاتحة':'تفسير سورة الفاتحة','الوضوء والصلاة':'الوضوء'};
const entries = Object.entries(groups).flatMap(([category,topics])=>topics.map(topic=>({topic,category})));
entries.push({topic:'علوم القرآن',category:'quran'});
function find(value){const text=normalize(value);const alias=Object.entries(aliases).find(([key])=>normalize(key)===text);return entries.find(entry=>normalize(entry.topic)===normalize(alias ? alias[1] : text) || window.MadaarI18n?.translate(entry.topic).toLowerCase()===text.toLowerCase()) || null;}
window.MadaarTopics={groups,find,add:items=>{for(const entry of items)if(!entries.some(existing=>existing.topic===entry.topic&&existing.category===entry.category))entries.push(entry);},suggestions:category=>(groups[category]||groups.worship).slice(0,3)};
})();
