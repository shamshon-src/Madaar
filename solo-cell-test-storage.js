(() => {
  const params=new URLSearchParams(location.search),colored=params.has('colored'),group=params.get('mode')==='group';
  const real=window.localStorage,prefix=colored?`madaarColoredCellTest:${group?'group':'solo'}:`:'madaarSoloCellTest:';window.MadaarCellTestPrefix=prefix;
  const adapter={getItem:key=>sessionStorage.getItem(prefix+key)??(['madaarTheme','madaarLanguage','madaarFontSize'].includes(key)?real.getItem(key):null),setItem:(key,value)=>sessionStorage.setItem(prefix+key,String(value)),removeItem:key=>sessionStorage.removeItem(prefix+key)};
  Object.defineProperty(window,'localStorage',{value:adapter,configurable:true});window.MadaarCellTest=true;
  if(!adapter.getItem('madaarSetup')){
    adapter.setItem('madaarSetup',JSON.stringify({mode:group?1:0,targetScore:50,category:'العبادات',topic:'الصيام'}));adapter.setItem('madaarPlayers',JSON.stringify(group?['لاعب التجربة 1','لاعب التجربة 2']:['لاعب التجربة']));adapter.setItem('madaarPlayerColors',JSON.stringify(['#8b5cf6','#f59e0b']));adapter.setItem('madaarTestService',JSON.stringify({mode:'mock',scenario:'normal'}));
  }
})();
