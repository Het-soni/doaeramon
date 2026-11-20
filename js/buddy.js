(() => {
  const {records,idf} = window.dwBuddyModel;
  window.dwBuddyReply = question => {
    const q = question.toLowerCase().trim();
    const terms = new Set(q.match(/[\p{L}\p{M}\p{N}]+/gu) || []);
    let best, maximum = 0;
    for(const row of records){
      const matches = row.terms.filter(t => terms.has(t));
      const phrase = row.aliases.some(a => a && q.includes(a.toLowerCase()));
      const score = matches.reduce((s,t)=>s+idf[t],0) + (phrase && matches.length ? 8 : 0);
      if(score>maximum){best=row;maximum=score;}
    }
    if(!best || maximum<2) return "";
    for(const [field,pattern] of Object.entries({
      birthday:/birthday|birth date|janam|जन्मदिन/,family:/family|parivar|परिवार/,
      home:/where.*live|kaha.*reht|घर/,movie:/which movie|kis movie|कौन सी फिल्म/
    })) if(pattern.test(q) && best.facts?.[field]) return best.name+" · "+field+" — "+best.facts[field];
    return best.name+" — "+best.answer;
  };
})();
