"""Build localized blog pages and update their sitemap entries."""
import json
import xml.etree.ElementTree as ET
from datetime import date
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'blog/content/welcome.json'
WALLET_CONTENT = ROOT / 'blog/content/wallet.json'
BUY_CONTENT = ROOT / 'blog/content/buy-trx.json'
SUB_CONTENT = ROOT / 'blog/content/subleasing.json'
EXAMPLE = ROOT / 'blog/assets/tron_wallet.py'
LANGUAGES = {'en': 'English', 'ru': 'Русский', 'es': 'Español', 'id': 'Bahasa Indonesia'}
DOMAIN = 'https://www.gasfree4you.com'
ARTICLE = 'getting-started.html'
BUY_ARTICLE = 'how-to-buy-trx.html'
SUB_ARTICLE = 'tron-energy-subleasing.html'
TRANSACTIONS = json.loads((ROOT / 'blog/content/subleasing-transactions.json').read_text())
SOURCES = {
    'tronlink': ('TronLink', 'https://support.tronlink.org/hc/en-us/articles/5012004270361-How-to-Create-an-Account-in-TronLink-Extension'),
    'trust': ('Trust Wallet · TRON', 'https://trustwallet.com/tron-wallet'),
    'ledger': ('Ledger · TRC20', 'https://www.ledger.com/coin/wallet/trc20'),
    'trezor': ('Trezor · TRON / TRC20', 'https://trezor.io/guides/sending-receiving-staking-funds/sending-receiving/send-and-receive-tron-and-trc-20-tokens-in-trezor-suite'),
    'tron': ('TRON · Accounts and keys', 'https://developers.tron.network/docs/account'),
    'resources': ('TRON · Resource model', 'https://developers.tron.network/docs/resource-model'),
    'tronpy': ('TronPy · Keys and Addresses', 'https://tronpy.readthedocs.io/en/latest/keys.html'),
    'security': ('Ledger · Security tips', 'https://www.ledger.com/academy/hardwarewallet/best-practices-when-using-a-hardware-wallet'),
    'sunswap': ('SunSwap', 'https://sunswap.com/'),
    'fixedfloat': ('FixedFloat · FAQ', 'https://ff.io/faq'),
    'kraken': ('Kraken · TRX', 'https://www.kraken.com/buy/trx'),
    'bit2me': ('Bit2Me · TRX', 'https://bit2me.com/es/comprar-tron'),
    'indodax': ('INDODAX · TRX/IDR', 'https://indodax.com/trade/TRXIDR'),
    'tokocrypto': ('Tokocrypto · TRX/USDT', 'https://www.tokocrypto.com/en/trade/TRX_USDT'),
    'ojk': ('OJK · Daftar penyelenggara', 'https://ojk.go.id/id/Fungsi-Utama/ITSK/Perizinan-ITSK-Aset-Keuangan-Digital-Aset-Kripto/Pages/Daftar-Penyelenggara-Perdagangan-Aset-Keuangan-Digital-Posisi-25-Mei-2026.aspx'),
    'bestchange': ('BestChange', 'https://www.bestchange.ru/'),
    'subleasing': ('GasFree4you · Subleasing', '../../sub_rent.html'),
}


def e(value):
    return escape(str(value), quote=True)


def shell(lang, d, filename, title, description, body):
    structured_data = ''
    if filename != 'index.html':
        url = f'{DOMAIN}/{lang}/blog/{filename}'
        schema = {
            '@context': 'https://schema.org', '@type': 'BlogPosting',
            '@id': url + '#article', 'url': url,
            'mainEntityOfPage': {'@type': 'WebPage', '@id': url},
            'headline': title, 'description': description, 'inLanguage': lang,
            'datePublished': d['datePublished'], 'dateModified': d['dateModified'],
            'author': {'@type': 'Organization', 'name': d['authorName'], 'url': DOMAIN + '/'},
            'publisher': {'@type': 'Organization', 'name': 'GasFree4you', 'url': DOMAIN + '/'},
        }
        structured_data = '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False).replace('<', '\\u003c') + '</script>'
    alternatives = ''.join(
        f'<link rel="alternate" hreflang="{code}" href="{DOMAIN}/{code}/blog/{filename}">'
        for code in LANGUAGES
    )
    languages = ''.join(
        f'<a href="../../{code}/blog/{filename}" lang="{code}" hreflang="{code}"'
        f'{" aria-current=\"page\"" if code == lang else ""}>{name}</a>'
        for code, name in LANGUAGES.items()
    )
    return f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)} — GasFree4you</title>
<meta name="description" content="{e(description)}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="{DOMAIN}/{lang}/blog/{filename}">
{alternatives}
<link rel="alternate" hreflang="x-default" href="{DOMAIN}/en/blog/{filename}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(description)}">
<meta property="og:type" content="{'website' if filename == 'index.html' else 'article'}">
<meta property="og:url" content="{DOMAIN}/{lang}/blog/{filename}">
{structured_data}
<link rel="icon" href="../../favicon.png">
<link rel="stylesheet" href="../../blog/assets/blog.css">
</head>
<body>
<a class="skip" href="#main">{e(d['skip'])}</a>
<header class="header"><div class="wrap header-inner">
<a class="brand" href="../../index.html">GasFree<span>4you</span></a>
<nav aria-label="{e(d['blog'])}"><a href="index.html">{e(d['blog'])}</a><a href="../../index.html">{e(d['service'])} ↗</a></nav>
<div class="languages" role="navigation" aria-label="{e(d['language'])}">{languages}</div>
</div></header>
<main id="main" class="wrap">{body}</main>
<footer class="wrap footer"><span>GasFree4you · {e(d['blog'])}</span><span>{e(d['footer'])}</span></footer>
</body></html>
'''


def cta(d):
    return f'''<aside class="cta"><div><h2>{e(d['ctaTitle'])}</h2><p>{e(d['ctaText'])}</p></div><a class="button" href="{e(d.get('ctaHref', '../../index.html'))}">{e(d.get('ctaButton', d['service']))} ↗</a></aside>'''


def home(d, second, third):
    route = ''.join(f'<div class="diagram-row"><b>0{i}</b><span>{e(s)}</span></div>' for i, s in enumerate(d['route'], 1))
    cards = ''.join(f'''<article class="card"><span class="number">0{i} / {e(category)}</span><h3>{e(title)}</h3><p>{e(desc)}</p><div class="planned">{e(d['planned'])}</div></article>''' for i, (category, title, desc) in enumerate(d['cards'], 1))
    topics = ''.join(f'<span>{e(t)}</span>' for t in d['topics'])
    return f'''
<section class="hero"><div class="eyebrow">{e(d['eyebrow'])}</div><h1>{e(d['headline'])}</h1><p>{e(d['intro'])}</p></section>
<section aria-labelledby="start"><div class="section-heading"><h2 id="start">{e(d['featured'])}</h2><span>{e(d['count'])}</span></div>
<article class="featured"><div class="featured-copy"><div class="meta"><span class="tag">{e(d['category'])}</span><span>·</span><span>{e(d['time'])}</span></div>
<h2><a href="{ARTICLE}">{e(d['title'])}</a></h2><p>{e(d['description'])}</p><a class="read" href="{ARTICLE}">{e(d['read'])} <span aria-hidden="true">→</span></a></div>
<div class="diagram"><div class="diagram-title">{e(d['diagramTitle'])}</div>{route}</div></article></section>
<section aria-labelledby="more"><div class="section-heading"><h2 id="more">{e(d['moreArticles'])}</h2></div>
<div class="more-grid"><article class="card"><div class="meta"><span class="tag">{e(second['category'])}</span><span>·</span><span>{e(second['time'])}</span></div><h3><a href="{BUY_ARTICLE}">{e(second['title'])}</a></h3><p>{e(second['description'])}</p><a class="read" href="{BUY_ARTICLE}">{e(d['read'])} →</a></article>
<article class="card partner-card"><div class="meta"><span class="tag">{e(third['category'])}</span><span>·</span><span>{e(third['time'])}</span></div><h3><a href="{SUB_ARTICLE}">{e(third['title'])}</a></h3><p>{e(third['description'])}</p><a class="read" href="{SUB_ARTICLE}">{e(d['read'])} →</a></article></div></section>
<section aria-labelledby="next"><div class="section-heading"><h2 id="next">{e(d['next'])}</h2></div><div class="grid">{cards}</div></section>
<section aria-labelledby="topics"><div class="section-heading"><h2 id="topics">{e(d['topicsTitle'])}</h2></div><div class="topics">{topics}</div></section>
{cta(d)}'''


def code_block(label, value):
    return f'<h3>{e(label)}</h3><pre tabindex="0" aria-label="{e(label)}"><code>{e(value)}</code></pre>'


def example(d):
    online = 'python3 -m pip download --only-binary=:all: --dest wheelhouse tronpy==0.6.1'
    offline = ('python3 -m venv .venv\n'
               '.venv/bin/python -m pip install --no-index --find-links=wheelhouse tronpy==0.6.1\n'
               '.venv/bin/python tron_wallet.py --demo')
    output = ('DEMO ONLY - PUBLIC KEY MATERIAL - DO NOT SEND FUNDS\n'
              'Private key: 0000000000000000000000000000000000000000000000000000000000000001\n'
              'TRON address: TMVQGm1qAQYVdetCeGRRkTWYYrLXuHK2HC')
    return (code_block(d['onlineTitle'], online)
            + code_block(d['codeTitle'], EXAMPLE.read_text())
            + f'<a class="download" href="../../blog/assets/tron_wallet.py" download>{e(d["download"])} ↓</a>'
            + code_block(d['offlineTitle'], offline)
            + '<p class="platform-note">macOS / Linux: <code>.venv/bin/python</code><br>Windows: <code>.venv\\Scripts\\python.exe</code></p>'
            + code_block(d['outputTitle'], output)
            + code_block(d['randomTitle'], '.venv/bin/python tron_wallet.py'))


def transaction_case(items):
    result = '<div class="transaction-case">'
    for item in items:
        tx = TRANSACTIONS[item['key']]
        url = f'https://tronscan.org/transaction/{tx["hash"]}/overview'
        path = Path('blog/assets/subleasing') / tx['image']
        # User supplies screenshots later; never emit broken image URLs.
        screenshot = ''
        if (ROOT / path).is_file():
            screenshot = f'<a href="../../{path.as_posix()}"><img src="../../{path.as_posix()}" alt="{e(item["alt"])}" loading="lazy" decoding="async"></a>'
        result += f'''<figure class="transaction-step"><h3>{e(item['title'])}</h3><p>{e(item['text'])}</p>{screenshot}<figcaption>{e(item['caption'])}</figcaption><a class="tx-link" href="{url}">Tronscan ↗ <span>{tx['hash']}</span></a><time datetime="{tx['time']}">{tx['time'].replace('T', ' ').replace('Z', ' UTC')}</time></figure>'''
    return result + '</div>'


def article(d):
    toc = ''.join(f'<a href="#section-{i}">{e(section["title"])}</a>' for i, section in enumerate(d['sections'], 1))
    sections = ''
    for i, section in enumerate(d['sections'], 1):
        body = ''.join(f'<p>{e(p)}</p>' for p in section.get('paragraphs', []))
        if section.get('flow'):
            body += '<ul class="payment-flow">' + ''.join(f'<li>{e(step)}</li>' for step in section['flow']) + '</ul>'
        if section.get('case'):
            body += transaction_case(section['case'])
        if section.get('steps'):
            body += '<ol>' + ''.join(f'<li>{e(step)}</li>' for step in section['steps']) + '</ol>'
        if section.get('image'):
            picture = section['image']
            path = ROOT / picture['path']
            if not path.is_file():
                raise FileNotFoundError(f'Missing article image: {path}')
            src = '../../' + picture['path']
            body += f'<figure class="guide-screenshot"><a href="{e(src)}"><img src="{e(src)}" alt="{e(picture["alt"])}" width="{int(picture["width"])}" height="{int(picture["height"])}" loading="lazy" decoding="async"></a><figcaption>{e(picture["caption"])}</figcaption></figure>'
        if section.get('note'):
            body += f'<aside class="note">{e(section["note"])}</aside>'
        if section.get('code'):
            body += example(d)
        body += ''.join(f'<p>{e(p)}</p>' for p in section.get('after', []))
        if section.get('refs'):
            refs = ', '.join(f'<a href="{e(SOURCES[key][1])}">{e(SOURCES[key][0])}</a>' for key in section['refs'])
            body += f'<p class="sources">{e(d["sourceLabel"])}: {refs}.</p>'
        sections += f'<section id="section-{i}"><h2>{e(section["title"])}</h2>{body}</section>'
    related = ''
    if d.get('relatedHref'):
        related = f'<aside class="note"><strong>{e(d["relatedTitle"])}</strong><br><a class="read" href="{e(d["relatedHref"])}">{e(d["relatedText"])} →</a></aside>'
    byline = f'<p class="byline">{e(d["authorLabel"])}: {e(d["authorName"])}<br>{e(d["publishedLabel"])}: <time datetime="{e(d["datePublished"])}">{e(d["datePublished"])}</time> · {e(d["modifiedLabel"])}: <time datetime="{e(d["dateModified"])}">{e(d["dateModified"])}</time></p>'
    return f'''
<nav class="breadcrumb" aria-label="{e(d['blog'])}"><a href="index.html">{e(d['blog'])}</a><span aria-hidden="true">/</span><span>{e(d['category'])}</span></nav>
<header class="hero article-hero"><div class="meta"><span class="tag">{e(d['category'])}</span><span>·</span><span>{e(d['time'])}</span></div><h1>{e(d['title'])}</h1><p>{e(d['description'])}</p>{byline}</header>
<div class="article-layout"><nav class="toc" aria-label="{e(d['toc'])}"><strong>{e(d['toc'])}</strong>{toc}</nav>
<article class="prose">{sections}<details><summary>{e(d['faqTitle'])}</summary><p>{e(d['faqAnswer'])}</p></details>{related}{cta(d)}<a class="back" href="index.html">← {e(d['back'])}</a></article></div>'''


def update_sitemap(entries):
    namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
    ET.register_namespace('', namespace)
    tag = lambda name: f'{{{namespace}}}{name}'
    path = ROOT / 'sitemap.xml'
    tree = ET.parse(path)
    root = tree.getroot()
    existing = {}
    for node in root.findall(tag('url')):
        loc = node.find(tag('loc'))
        loc.text = loc.text.replace('https://gasfree4you.com/', DOMAIN + '/')
        existing[loc.text] = node
    for url, modified in entries.items():
        date.fromisoformat(modified)
        node = existing.get(url)
        if node is None:
            node = ET.SubElement(root, tag('url'))
            ET.SubElement(node, tag('loc')).text = url
        lastmod = node.find(tag('lastmod'))
        if lastmod is None:
            lastmod = ET.SubElement(node, tag('lastmod'))
        lastmod.text = modified
    ET.indent(tree, space='  ')
    tree.write(path, encoding='utf-8', xml_declaration=True)


def main():
    content = json.loads(CONTENT.read_text())
    wallet = json.loads(WALLET_CONTENT.read_text())
    buy = json.loads(BUY_CONTENT.read_text())
    subleasing = json.loads(SUB_CONTENT.read_text())
    sitemap_entries = {}
    for lang in LANGUAGES:
        d = {**content[lang], **wallet[lang]}
        second = {**content[lang], **buy[lang]}
        third = {**content[lang], **subleasing[lang]}
        for item in (d, second, third):
            assert date.fromisoformat(item['dateModified']) >= date.fromisoformat(item['datePublished'])
        folder = ROOT / lang / 'blog'
        folder.mkdir(parents=True, exist_ok=True)
        (folder / 'index.html').write_text(shell(lang, d, 'index.html', d['headline'], d['intro'], home(d, second, third)))
        (folder / ARTICLE).write_text(shell(lang, d, ARTICLE, d['title'], d['description'], article(d)))
        (folder / BUY_ARTICLE).write_text(shell(lang, second, BUY_ARTICLE, second['title'], second['description'], article(second)))
        (folder / SUB_ARTICLE).write_text(shell(lang, third, SUB_ARTICLE, third['title'], third['description'], article(third)))
        for filename, modified in [('index.html', max(d['dateModified'], second['dateModified'], third['dateModified'])), (ARTICLE, d['dateModified']), (BUY_ARTICLE, second['dateModified']), (SUB_ARTICLE, third['dateModified'])]:
            sitemap_entries[f'{DOMAIN}/{lang}/blog/{filename}'] = modified
    update_sitemap(sitemap_entries)
    print('Built 16 pages: a blog index and three articles in each language.')


if __name__ == '__main__':
    main()
