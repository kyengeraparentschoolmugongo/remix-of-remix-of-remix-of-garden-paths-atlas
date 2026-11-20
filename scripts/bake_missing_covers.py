import json,hashlib,os,subprocess,tempfile,sys,urllib.request
from concurrent.futures import ThreadPoolExecutor
OUT='/tmp/thumbs/out'
def bake(url):
    fid=hashlib.sha1(url.encode()).hexdigest()[:16]; dst=f'{OUT}/{fid}.webp'
    if os.path.exists(dst) or os.path.exists(dst+'.fail'): return
    with tempfile.TemporaryDirectory() as t:
        try:
            p=f'{t}/a.pdf'
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=60) as r: open(p,'wb').write(r.read())
            subprocess.run(['pdftoppm','-jpeg','-scale-to-x','320','-scale-to-y','-1','-f','1','-l','1','-singlefile',p,f'{t}/c'],check=True,timeout=30,capture_output=True)
            subprocess.run(['cwebp','-q','78','-quiet',f'{t}/c.jpg','-o',dst],check=True,timeout=15)
        except Exception as e: open(dst+'.fail','w').write(str(e)[:200])
urls=[]
for f in sys.argv[1:]:
    urls+=[x['pdfUrl'] for x in json.load(open(f)) if not x.get('thumbUrl') and x['pdfUrl'].lower().endswith('.pdf')]
urls=list(dict.fromkeys(urls)); print(len(urls),flush=True)
with ThreadPoolExecutor(24) as ex: list(ex.map(bake,urls))
print('done',flush=True)
