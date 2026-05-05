from pathlib import Path
p = Path('src/app/pages/rent-page/rent-page.ts')
text = p.read_text(encoding='utf-8')
idx = text.find('this.trasteroService.getUsuario')
print('idx', idx)
print(repr(text[idx-80:idx+200]))
