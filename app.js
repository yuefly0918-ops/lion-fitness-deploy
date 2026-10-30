/* 赖恩健身器材 · 产品展示站 逻辑 */
(function(){
  var D = window.SITE_DATA;
  var brand = D.brand;
  var curCat = 'pilates-machine';
  var curSub = 'all';
  var kw = '';

  // 配件功能分组
  var ACC_GROUPS = [
    {key:'all', name:'全部'},
    {key:'wheel', name:'滑轮·脚轮·轴套', test:n=>/滑轮|脚轮|轴套/.test(n)},
    {key:'spring', name:'弹簧', test:n=>/弹簧/.test(n)},
    {key:'hook', name:'挂钩·锁扣', test:n=>/簧钩|头钩|锁扣|链接环/.test(n)},
    {key:'bracket', name:'托架·挂簧·手柄', test:n=>/托架|挂簧|挂绳杆|手柄|梁/.test(n)},
    {key:'frame', name:'立柱·推杆·滑轨·炮筒', test:n=>/立柱|推杆|横棍|横杆|滑轨|炮筒|拉销|钥匙|销/.test(n)},
    {key:'step', name:'踏板·方箱·延长板', test:n=>/踏板|方箱|方盒|延长板|盒|筒/.test(n)},
    {key:'soft', name:'软包·靠垫·头枕', test:n=>/头枕|滑车垫|座垫|肩靠|肩托|靠垫|背板|滚轴|软包/.test(n)},
    {key:'rope', name:'拉绳·握把·环·勾脚带', test:n=>/拉绳|拉把|把杆套|把套|拉带|手套|单环|双环|勾脚带|菊花带|套装/.test(n)},
    {key:'other', name:'限位·五金·其他', test:n=>/限位|夹绳|地脚|网格垫|秋千|立柱\+滑轮/.test(n)},
  ];
  // 器械子分组（按系列）
  var MC_GROUPS = [{key:'all',name:'全部'}].concat(
    ['枫木系列','橡木系列','榉木系列','铝合金系列','其他配套产品'].map(function(s){return {key:s,name:s}})
  );

  function el(t,c){var e=document.createElement(t);if(c)e.className=c;return e}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

  function searchMatch(p){
    if(!kw) return true;
    var hay = (p.name+' '+(p.series||'')+' '+(p.model||'')+' '+(p.config||'')+' '+(p.size||'')+' '+(p.weight||'')+' '+((p.specs||[]).join(' '))+' '+(p.desc||'')+' '+(p.usage||'')).toLowerCase();
    return kw.split(/\s+/).every(function(t){return t && hay.indexOf(t)>=0});
  }

  function accGroup(a){
    for(var i=1;i<ACC_GROUPS.length;i++) if(ACC_GROUPS[i].test(a.name)) return ACC_GROUPS[i].key;
    return 'other';
  }

  function renderStats(){
    var box=document.getElementById('stats');box.innerHTML='';
    D.categories.forEach(function(c){
      var s=el('div','stat');
      s.innerHTML='<b>'+(c.count? c.count+'+' : '筹备')+'</b><span>'+esc(c.name)+'</span>';
      box.appendChild(s);
    });
    var total=(D.machines?D.machines.length:0)+(D.accessories?D.accessories.length:0)+(D.shaping?D.shaping.length:0)+(D.foreign?D.foreign.length:0);
    var s=el('div','stat');s.innerHTML='<b>'+total+'</b><span>在售产品</span>';box.appendChild(s);
  }

  // ---- 联系我们 ----
  function icoSvg(name){
    var m={
      phone:'<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>',
      email:'<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4v2l8 5 8-5V8l-8 5-8-5z"/></svg>',
      addr:'<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
      clock:'<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>'
    };
    return m[name]||'';
  }
  function renderContact(){
    var c=D.contact||{};if(!c.company)return;
    var cl=document.getElementById('contactList');
    if(cl){
      var html='';
      (c.phone||[]).forEach(function(p){
        var href=p.href?('href="'+esc(p.href)+'"'):'';
        html+='<li><span class="ico">'+icoSvg('phone')+'</span>'+
          '<span class="lab">'+esc(p.lab||'电话')+'</span>'+
          '<span class="val">'+(href?'<a '+href+'>'+esc(p.val)+'</a>':esc(p.val))+'</span></li>';
      });
      if(c.email){
        html+='<li><span class="ico">'+icoSvg('email')+'</span>'+
          '<span class="lab">邮箱</span>'+
          '<span class="val"><a href="mailto:'+esc(c.email)+'">'+esc(c.email)+'</a></span></li>';
      }
      if(c.hours){
        html+='<li><span class="ico">'+icoSvg('clock')+'</span>'+
          '<span class="lab">营业</span><span class="val">'+esc(c.hours)+'</span></li>';
      }
      cl.innerHTML=html;
    }
    var ca=document.getElementById('contactAddr');
    if(ca){
      ca.innerHTML='<span class="lab">公司地址</span><span class="val">'+esc(c.address||'地址待补充')+'</span>';
    }
    var cs=document.getElementById('contactSocial');
    if(cs){
      var qrHtml='';
      if(c.wechat_qr){
        qrHtml='<div class="contact-qr" data-qr="'+esc(c.wechat_qr)+'">'+
          '<img src="'+esc(c.wechat_qr)+'" alt="微信二维码">'+
          '</div>';
      }
      var socialHtml=(c.social||[]).map(function(s){
        return '<a href="'+esc(s.href||'#')+'"><span class="si">●</span>'+esc(s.lab)+' · '+esc(s.val)+'</a>';
      }).join('');
      cs.innerHTML=qrHtml+socialHtml;
      // 二维码点击放大
      var qr=cs.querySelector('.contact-qr');
      if(qr){
        qr.onclick=function(){
          var src=qr.getAttribute('data-qr');
          openModal('<div class="mc-close" data-close>×</div>'+
            '<img class="qr-big" src="'+src+'" alt="微信二维码大图">'+
            '<div class="qr-big-cap">微信扫码加好友 · 赖恩健身器材</div>');
        };
      }
    }
    var y=document.getElementById('footYear');
    if(y){y.textContent=new Date().getFullYear()}
  }

  function machineCard(p){
    var c=el('div','card');
    var fig=el('div','fig');
    if(p.img){
      fig.innerHTML='<img src="'+p.img+'" alt="'+esc(p.name)+'" loading="lazy"><span class="wm">'+esc(brand)+'</span>';
    }else{
      fig.innerHTML='<div class="ph">图片待补充<br>'+esc(p.series)+'</div>';
    }
    c.appendChild(fig);
    var b=el('div','card-body');
    b.innerHTML='<h3 class="card-name">'+esc(p.name)+'</h3>'+
      '<div class="card-specs">'+sizeChip(p.size)+'</div>'+
      '<div class="card-series">'+esc(p.series)+'</div>';
    c.appendChild(b);
    c.onclick=function(){showMachineModal(p)};
    return c;
  }
  function sizeChip(sz){
    if(!sz||sz==='—') return '';
    return '<span class="sp">尺寸 '+esc(sz)+'</span>';
  }

  function accCard(p){
    var c=el('div','card');
    var fig=el('div','fig');
    if(p.img){
      fig.innerHTML='<img src="'+p.img+'" alt="'+esc(p.name)+'" loading="lazy"><span class="no-badge">'+p.no+'</span><span class="wm">'+esc(brand)+'</span>';
    }else{
      fig.innerHTML='<div class="ph">图片待补充</div>';
    }
    c.appendChild(fig);
    var b=el('div','card-body');
    var specs=(p.specs||[]).slice(0,3).map(function(s){return '<span class="sp">'+esc(s)+'</span>'}).join('');
    b.innerHTML='<h3 class="card-name">'+esc(p.name)+'</h3>'+
      '<div class="card-specs">'+specs+'</div>';
    c.appendChild(b);
    c.onclick=function(){showAccModal(p)};
    return c;
  }

  function renderEmpty(cat){
    var c=el('div','card empty-card');
    c.innerHTML='<div class="fig"><div class="big">⚒</div></div>'+
      '<div class="card-body">'+
      '<h3 class="card-name">'+esc(cat.name)+' · 资料整理中</h3>'+
      '<div class="card-specs"><span class="sp">敬请期待</span></div></div>';
    return c;
  }

  function render(){
    var main=document.getElementById('main');main.innerHTML='';
    var anyHit=false;
    D.categories.forEach(function(cat){
      // 决定该分类是否显示（搜索时显示全部，否则只显示当前分类）
      var showThis = (curCat==='all' || curCat===cat.id);
      if(!showThis) return;
      var sec=el('section','cat-sec');sec.id='cat-'+cat.id;
      var head=el('div','cat-head');
      head.innerHTML='<span class="no">'+esc(cat.id===curCat?'●':'●')+'</span>'+
        '<h2>'+esc(cat.name)+'</h2><span class="cnt">'+cat.count+' 款</span>';
      sec.appendChild(head);
      var d=el('p','cat-desc');d.textContent=cat.desc;sec.appendChild(d);

      if(cat.id==='pilates-machine'){
        sec.appendChild(renderChips(MC_GROUPS,'mc'));
        var groups={};
        D.machines.forEach(function(p){var g=p.series;if(curSub!=='all'&&g!==curSub)return;if(!searchMatch(p))return;(groups[g]=groups[g]||[]).push(p)});
        var grid=el('div','grid');
        Object.keys(groups).forEach(function(g){
          var note=el('p','series-note');note.innerHTML=esc(g)+' <span class="ct">· '+groups[g].length+' 款</span>';
          grid.appendChild(note);
          groups[g].forEach(function(p){grid.appendChild(machineCard(p));anyHit=true});
        });
        if(!Object.keys(groups).length) grid.appendChild(emptyTip());
        sec.appendChild(grid);
      } else if(cat.id==='pilates-accessory'){
        sec.appendChild(renderChips(ACC_GROUPS,'acc'));
        var groups2={};
        D.accessories.forEach(function(p){var g=accGroup(p);if(curSub!=='all'&&g!==curSub)return;if(!searchMatch(p))return;(groups2[g]=groups2[g]||[]).push(p)});
        var grid2=el('div','grid');
        Object.keys(groups2).forEach(function(g){
          var lab=(ACC_GROUPS.filter(function(x){return x.key===g})[0]||{}).name;
          var note=el('p','series-note');note.innerHTML=esc(lab)+' <span class="ct">· '+groups2[g].length+' 款</span>';
          grid2.appendChild(note);
          groups2[g].forEach(function(p){grid2.appendChild(accCard(p));anyHit=true});
        });
        if(!Object.keys(groups2).length) grid2.appendChild(emptyTip());
        sec.appendChild(grid2);
      } else if(cat.id==='shaping' && D.shaping && D.shaping.length){
        var grid3=el('div','grid');
        D.shaping.forEach(function(p){grid3.appendChild(shapingCard(p));anyHit=true});
        sec.appendChild(grid3);
      } else if(cat.id==='foreign' && D.foreign && D.foreign.length){
        var grid4=el('div','grid');
        D.foreign.forEach(function(p){if(!searchMatch(p))return;grid4.appendChild(foreignCard(p));anyHit=true});
        if(!grid4.children.length) grid4.appendChild(emptyTip());
        sec.appendChild(grid4);
      } else {
        var g=el('div','grid');g.appendChild(renderEmpty(cat));sec.appendChild(g);
      }
      main.appendChild(sec);
    });
    if(!anyHit && kw){var t=el('p');t.style.cssText='text-align:center;color:var(--faint);padding:40px';t.textContent='未找到匹配「'+kw+'」的产品';main.appendChild(t)}
  }

  function renderChips(groups,kind){
    var box=el('div','chips');
    groups.forEach(function(g){
      var b=el('button','chip'+(curSub===g.key?' active':''));
      b.textContent=g.name;
      b.onclick=function(){
        curSub=g.key;
        render();
        // 重新高亮（render会重建）
      };
      box.appendChild(b);
    });
    return box;
  }
  function emptyTip(){
    var p=el('p');p.style.cssText='grid-column:1/-1;text-align:center;color:var(--faint);padding:30px';
    p.textContent='暂无匹配产品';return p;
  }

  // ---- modal ----
  function openModal(html){
    document.getElementById('modalCard').innerHTML=html;
    var m=document.getElementById('modal');m.hidden=false;
    document.body.style.overflow='hidden';
  }
  function closeModal(){document.getElementById('modal').hidden=true;document.body.style.overflow=''}
  document.addEventListener('click',function(e){if(e.target.hasAttribute('data-close')||e.target.closest('[data-close]'))closeModal()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});

  function configList(cfg){
    if(!cfg)return '';
    var parts=cfg.split(/；|;/).map(function(s){return s.trim()}).filter(Boolean);
    return parts.map(function(s){return '• '+esc(s)}).join('\n');
  }
  function showMachineModal(p){
    var html='<div class="mc-close" data-close>×</div>';
    if(p.img) html+='<img class="mc-img" src="'+p.img+'" alt="'+esc(p.name)+'">';
    html+='<div class="mc-body">'+
      '<h3>'+esc(p.name)+'</h3>'+
      '<div class="mc-meta">'+esc(p.series)+' · 普拉提器械</div>'+
      (p.size&&p.size!=='—'?'<div class="mc-row"><h4>产品尺寸 / 包装尺寸 (mm)</h4>'+esc(p.size)+'</div>':'')+
      '<div class="mc-row"><h4>出口标配配置</h4><div class="mc-config">'+configList(p.config)+'</div></div>'+
      '<div class="mc-wm">'+esc(brand)+' · 支持贴牌 LOGO 与材质升级定制</div>'+
      '</div>';
    openModal(html);
  }
  function showAccModal(p){
    var specs=(p.specs||[]).map(function(s){return '<span class="sp">'+esc(s)+'</span>'}).join('');
    var html='<div class="mc-close" data-close>×</div>';
    if(p.img) html+='<img class="mc-img" src="'+p.img+'" alt="'+esc(p.name)+'">';
    html+='<div class="mc-body">'+
      '<h3>'+esc(p.name)+'</h3>'+
      '<div class="mc-meta">编号 '+p.no+' · 普拉提配件</div>'+
      (specs?'<div class="mc-row"><h4>规格</h4><div class="mc-specs">'+specs+'</div></div>':'')+
      (p.desc?'<div class="mc-row"><h4>识别特征</h4><div class="mc-desc">'+esc(p.desc)+'</div></div>':'')+
      (p.usage?'<div class="mc-row"><h4>用途说明</h4><div class="mc-usage">'+esc(p.usage)+'</div></div>':'')+
      (!p.desc&&!p.usage?'<div class="mc-row"><div class="mc-usage">更多详情以实物为准，欢迎咨询定制。</div></div>':'')+
      '<div class="mc-wm">'+esc(brand)+' · 配件支持颜色与规格定制</div>'+
      '</div>';
    openModal(html);
  }

  // ---- 塑形器械 ----
  function shapingCard(p){
    var c=el('div','card');
    var fig=el('div','fig');
    if(p.img){
      fig.innerHTML='<img src="'+p.img+'" alt="'+esc(p.name)+'" loading="lazy"><span class="no-badge">'+p.no+'</span><span class="wm">'+esc(brand)+'</span>';
    }else{
      fig.innerHTML='<div class="ph">'+esc(p.name)+'<br>图片待补充</div>';
    }
    c.appendChild(fig);
    var b=el('div','card-body');
    var specs=(p.specs||[]).slice(0,4).map(function(s){return '<span class="sp">'+esc(s)+'</span>'}).join('');
    b.innerHTML='<h3 class="card-name">'+esc(p.name)+'</h3><div class="card-specs">'+specs+'</div>';
    c.appendChild(b);
    c.onclick=function(){showShapingModal(p)};
    return c;
  }
  function showShapingModal(p){
    var specs=(p.specs||[]).map(function(s){return '<span class="sp">'+esc(s)+'</span>'}).join('');
    var html='<div class="mc-close" data-close>×</div>';
    if(p.img) html+='<img class="mc-img" src="'+p.img+'" alt="'+esc(p.name)+'">';
    html+='<div class="mc-body">'+
      '<h3>'+esc(p.name)+'</h3>'+
      '<div class="mc-meta">编号 '+p.no+' · 塑形器械</div>'+
      (specs?'<div class="mc-row"><h4>器型 / 规格</h4><div class="mc-specs">'+specs+'</div></div>':'')+
      '<div class="mc-row"><div class="mc-usage">各器型尺寸以实物为准，支持圆管 / 方管 / 力健款定制，欢迎咨询。</div></div>'+
      '<div class="mc-wm">'+esc(brand)+' · 支持贴牌 LOGO 与颜色定制</div>'+
      '</div>';
    openModal(html);
  }

  // ---- 外贸款器械 ----
  function foreignCard(p){
    var c=el('div','card');
    var fig=el('div','fig');
    if(p.img){
      fig.innerHTML='<img src="'+p.img+'" alt="'+esc(p.name)+'" loading="lazy"><span class="no-badge">'+esc(p.model)+'</span><span class="wm">'+esc(brand)+'</span>';
    }else{
      fig.innerHTML='<div class="ph">'+esc(p.name)+'<br>图片待补充</div>';
    }
    c.appendChild(fig);
    var b=el('div','card-body');
    var chips=sizeChip(p.size)+((p.weight&&p.weight!=='—')?'<span class="sp">'+esc(p.weight)+'</span>':'');
    b.innerHTML='<h3 class="card-name">'+esc(p.name)+'</h3>'+
      '<div class="card-specs">'+chips+'</div>'+
      '<div class="card-series">'+esc(p.model)+'</div>';
    c.appendChild(b);
    c.onclick=function(){showForeignModal(p)};
    return c;
  }
  // 出口标配配置按 "N." 序号拆分为列表
  function configList2(cfg){
    if(!cfg)return '';
    var s=cfg.replace(/\s+/g,' ').trim();
    var m=s.match(/\d+\..*?(?=\s*\d+\.|$)/g);
    if(!m||!m.length) return esc(s);
    return m.map(function(it){return '• '+esc(it.trim())}).join('\n');
  }
  function showForeignModal(p){
    var html='<div class="mc-close" data-close>×</div>';
    if(p.img) html+='<img class="mc-img" src="'+p.img+'" alt="'+esc(p.name)+'">';
    html+='<div class="mc-body">'+
      '<h3>'+esc(p.name)+'</h3>'+
      '<div class="mc-meta">型号 '+esc(p.model)+' · 外贸款器械</div>'+
      (p.size&&p.size!=='—'?'<div class="mc-row"><h4>产品尺寸 / 包装尺寸 (mm)</h4>'+esc(p.size)+'</div>':'')+
      (p.weight&&p.weight!=='—'?'<div class="mc-row"><h4>净重 / 毛重 (kg)</h4>'+esc(p.weight)+'</div>':'')+
      '<div class="mc-row"><h4>出口标配配置</h4><div class="mc-config">'+configList2(p.config)+'</div></div>'+
      '<div class="mc-wm">'+esc(brand)+' · 支持贴牌 LOGO 与材质升级定制</div>'+
      '</div>';
    openModal(html);
  }

  // ---- events ----
  document.getElementById('nav').addEventListener('click',function(e){
    var b=e.target.closest('.nav-btn');if(!b)return;
    // 联系我们按钮：平滑滚动到 footer
    if(b.dataset.scroll){
      var tgt=document.getElementById(b.dataset.scroll);
      if(tgt){tgt.scrollIntoView({behavior:'smooth',block:'start'})}
      document.querySelectorAll('.nav-btn').forEach(function(x){x.classList.remove('active')});
      b.classList.add('active');
      return;
    }
    curCat=b.dataset.cat;curSub='all';kw='';
    document.getElementById('searchInput').value='';
    document.querySelectorAll('.nav-btn').forEach(function(x){x.classList.toggle('active',x===b)});
    render();
    // 移动端：横向滚动时让被选按钮居中可见
    try{b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})}catch(e){}
    window.scrollTo({top:document.getElementById('main').offsetTop-70,behavior:'smooth'});
  });
  var si=document.getElementById('searchInput'),st;
  si.addEventListener('input',function(){clearTimeout(st);st=setTimeout(function(){
    kw=si.value.trim().toLowerCase();
    if(kw){curCat='all'/* will not match single cat block */;}
    render();
  },180)});

  // 移动端搜索：点击圆钮展开 / 失焦收起（仅 ≤820 视觉生效，桌面无影响）
  var searchBox=document.querySelector('.search');
  if(searchBox){
    si.addEventListener('focus',function(){
      if(!searchBox.classList.contains('open')) searchBox.classList.add('open');
    });
    si.addEventListener('blur',function(){
      setTimeout(function(){ if(!si.value) searchBox.classList.remove('open'); },160);
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&searchBox.classList.contains('open')){
        searchBox.classList.remove('open');si.blur();
      }
    });
  }

  // init：支持 URL 参数 ?cat=&sub=&kw=&modal=
  try{
    var qs=new URLSearchParams(location.search);
    if(qs.get('cat')) curCat=qs.get('cat');
    if(qs.get('sub')) curSub=qs.get('sub');
    if(qs.get('kw')){kw=qs.get('kw').toLowerCase();si=si||document.getElementById('searchInput');si.value=qs.get('kw');}
    document.querySelectorAll('.nav-btn').forEach(function(x){x.classList.toggle('active',x.dataset.cat===curCat)});
  }catch(e){}
  renderStats();
  render();
  renderContact();
  try{
    var qs2=new URLSearchParams(location.search);
    if(qs2.get('modal')==='acc'){showAccModal(D.accessories[47])}
    if(qs2.get('modal')==='mc'){showMachineModal(D.machines[0])}
    if(qs2.get('modal')==='shaping'){showShapingModal(D.shaping[3])}
    if(qs2.get('modal')==='foreign'){showForeignModal(D.foreign[0])}
  }catch(e){}
})();
