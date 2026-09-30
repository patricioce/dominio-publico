import pandas as pd, json, unicodedata, re
from collections import Counter
df=pd.read_csv('/mnt/user-data/uploads/query.csv')
df['qid']=df.autor.str.split('/').str[-1]
cur=json.load(open('curated.json'))
norm=lambda s:unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().lower().strip()
cur_by_name={norm(c['n']):c for c in cur}

HIST=re.compile(r'Imperio|Raj |Cisleitania|Hetmanato|Gran Ducado|Principado|Zarato|Mandato|nazi|Weimar|República Popular Ucraniana|República del Don|República Rusa|Reino de los Serbios|Rusia Soviética|República Democrática de Azerbaiyán|Segunda República polaca')
def countries(s):
    if pd.isna(s): return ''
    parts=[p.strip() for p in s.split(',')]
    keep=[p for p in parts if not HIST.search(p)] or parts
    keep=[p.replace('Reino Unido de Gran Bretaña e Irlanda','Reino Unido').replace('Reino de Italia','Italia').replace('Reino de Dinamarca','Dinamarca').replace('Reino de los Países Bajos','Países Bajos') for p in keep]
    out=[]
    for p in keep:
        if p not in out: out.append(p)
    return ' / '.join(out[:2])

LIT={'escritor','poeta','dramaturgo','letrista'}
def category(occs):
    o=set(occs)
    if 'director de cine' in o and 'dramaturgo' not in o: return 'Cine e historieta'
    if 'historietista' in o and not (o & {'pintor'}): return 'Cine e historieta'
    if o & LIT and not (o & {'pintor','escultor','fotógrafo'}): return 'Literatura'
    if o & {'pintor','escultor','fotógrafo'} and not (o & {'escritor','dramaturgo'}): return 'Artes visuales'
    if 'compositor' in o and not (o & {'escritor','poeta','dramaturgo'}): return 'Música'
    if o & LIT: return 'Literatura'
    if 'compositor' in o: return 'Música'
    return 'Artes visuales'
OVERRIDE_CAT={'Q313096':'Artes visuales','Q78877':'Música','Q449054':'Artes visuales','Q713017':'Artes visuales',
 'Q164703':'Artes visuales','Q2724714':'Artes visuales','Q55198':'Cine e historieta','Q3453278':'Literatura',
 'Q231690':'Literatura','Q158255':'Artes visuales','Q61028':'Música','Q1394538':'Literatura'}
# Correcciones verificadas de fechas en disputa
KNOWN={'Q158255':('1871-07-17','1956-01-13'),'Q57277':(None,'1956-07-07'),'Q590512':(None,'1956-10-12'),
       'Q161135':(None,'1956-02-04'),'Q508270':(None,'1956-01-03')}

MON=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
def fmt(iso): y,m,d=iso.split('-'); return f"{int(d)} de {MON[int(m)-1]} de {y}"

people=[]; report={'filas':len(df),'unicos':int(df.qid.nunique()),'sin_etiqueta':[], 'muerte_disputa':[], 'nac_disputa':[],
        'muerte_solo_anio':[], 'sin_wp_es':0, 'sin_pais':[], 'corregidos':[], 'curados_fusionados':[], 'curados_ausentes':[]}
used_cur=set()
for qid,g in df.groupby('qid',sort=False):
    r=g.iloc[0]; label=r.autorLabel
    if re.fullmatch(r'Q\d+',label):
        report['sin_etiqueta'].append(qid); continue
    flags=[]
    day=g[g.precision>=11].muerte.str[:10].unique().tolist()
    births=sorted(set(g.nacimiento.dropna().str[:10]))
    if len(day)==1: d=day[0]; ddisp=fmt(d)
    elif len(day)>1:
        d=sorted(day)[0]; ddisp='1956'; flags.append('muerte')
        report['muerte_disputa'].append(f"{label}: {', '.join(sorted(day))}")
    else:
        d='1956-01-01'; ddisp='1956'; flags.append('anio'); report['muerte_solo_anio'].append(label)
    if len(births)==1: b=births[0]; bdisp=fmt(b)
    else:
        b=births[0]; yrs=sorted(set(x[:4] for x in births))
        bdisp=' o '.join(yrs) if len(yrs)>1 else yrs[0]
        flags.append('nacimiento'); report['nac_disputa'].append(f"{label}: {', '.join(births)}")
    if qid in KNOWN:
        kb,kd=KNOWN[qid]
        if kb: b=kb; bdisp=fmt(kb); flags=[f for f in flags if f!='nacimiento']
        if kd: d=kd; ddisp=fmt(kd); flags=[f for f in flags if f!='muerte']
        report['corregidos'].append(label)
    occs=[o.strip() for o in str(r.ocupaciones).split(',')]
    p=countries(r.paises)
    if not p: report['sin_pais'].append(label); p='Sin dato'
    wp=None if pd.isna(r.wikipediaEs) else r.wikipediaEs
    if not wp: report['sin_wp_es']+=1
    rec={'id':qid.lower(),'qid':qid,'n':label,'b':b,'d':d,'bd':bdisp,'dd':ddisp,'p':p,
         'o':OVERRIDE_CAT.get(qid,category(occs)),'occ':occs,'sl':int(r.sitelinks),
         'wp':wp,'img':None if pd.isna(r.foto) else r.foto,'flags':flags,'src':'wikidata'}
    c=cur_by_name.get(norm(label))
    if c and c['d'][:4]=='1956':
        used_cur.add(c['id']); report['curados_fusionados'].append(label)
        rec.update({'bio':c['bio'],'w':c['w'],'o':c['o'],'id':c['id']})
        if c.get('c'): rec['c']=c['c']
        # fechas curadas y verificadas mandan
        rec['b'],rec['d']=c['b'],c['d']; rec['bd'],rec['dd']=fmt(c['b']),fmt(c['d'])
        rec['flags']=[f for f in rec['flags'] if f not in('muerte','nacimiento','anio')]
        rec['src']='wikidata+curado'
    rec['conf']='check' if (rec.get('c') or rec['flags']) else 'ok'
    people.append(rec)

for c in cur:
    if c['id'] in used_cur: continue
    if c['d'][:4]=='1956': report['curados_ausentes'].append(c['n'])
    rec=dict(c); rec.update({'bd':fmt(c['b']),'dd':fmt(c['d']),'flags':[],'src':'curado','occ':[]})
    people.append(rec)

json.dump(people,open('data.json','w'),ensure_ascii=False)
json.dump(report,open('report.json','w'),ensure_ascii=False,indent=1)
print(len(people)); print(json.dumps({k:(v if not isinstance(v,list) else len(v)) for k,v in report.items()},ensure_ascii=False))
print(report['curados_ausentes']); print(report['muerte_disputa'][:30])
print(Counter(p['o'] for p in people if p['d'][:4]=='1956'))
