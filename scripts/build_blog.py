"""Build the four static blog prototypes: python3 scripts/build_blog.py."""
import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'blog/content/welcome.json'
WALLET_CONTENT = ROOT / 'blog/content/wallet.json'
BUY_CONTENT = ROOT / 'blog/content/buy-trx.json'
EXAMPLE = ROOT / 'blog/assets/tron_wallet.py'
LANGUAGES = {'en': 'English', 'ru': 'Русский', 'es': 'Español', 'id': 'Bahasa Indonesia'}
DOMAIN = 'https://www.gasfree4you.com'
ARTICLE = 'getting-started.html'
BUY_ARTICLE = 'how-to-buy-trx.html'
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
}


def e(value):
    return escape(str(value), quote=True)


def shell(lang, d, filename, title, description, body):
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
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="{DOMAIN}/{lang}/blog/{filename}">
{alternatives}
<link rel="alternate" hreflang="x-default" href="{DOMAIN}/en/blog/{filename}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(description)}">
<meta property="og:type" content="{'website' if filename == 'index.html' else 'article'}">
<meta property="og:url" content="{DOMAIN}/{lang}/blog/{filename}">
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


def home(d, second):
    route = ''.join(f'<div class="diagram-row"><b>0{i}</b><span>{e(s)}</span></div>' for i, s in enumerate(d['route'], 1))
    cards = ''.join(f'''<article class="card"><span class="number">0{i} / {e(category)}</span><h3>{e(title)}</h3><p>{e(desc)}</p><div class="planned">{e(d['planned'])}</div></article>''' for i, (category, title, desc) in enumerate(d['cards'], 1))
    topics = ''.join(f'<span>{e(t)}</span>' for t in d['topics'])
    return f'''
<section class="hero"><div class="eyebrow">{e(d['eyebrow'])}</div><h1>{e(d['headline'])}</h1><p>{e(d['intro'])}</p></section>
<section aria-labelledby="start"><div class="section-heading"><h2 id="start">{e(d['featured'])}</h2><span>{e(d['count'])}</span></div>
<article class="featured"><div class="featured-copy"><div class="meta"><span class="tag">{e(d['category'])}</span><span>·</span><span>{e(d['time'])}</span><span class="draft">{e(d['draft'])}</span></div>
<h2><a href="{ARTICLE}">{e(d['title'])}</a></h2><p>{e(d['description'])}</p><a class="read" href="{ARTICLE}">{e(d['read'])} <span aria-hidden="true">→</span></a></div>
<div class="diagram"><div class="diagram-title">{e(d['diagramTitle'])}</div>{route}</div></article></section>
<section aria-labelledby="more"><div class="section-heading"><h2 id="more">{e(d['moreArticles'])}</h2></div>
<article class="card"><div class="meta"><span class="tag">{e(second['category'])}</span><span>·</span><span>{e(second['time'])}</span><span class="draft">{e(d['draft'])}</span></div><h3><a href="{BUY_ARTICLE}">{e(second['title'])}</a></h3><p>{e(second['description'])}</p><a class="read" href="{BUY_ARTICLE}">{e(d['read'])} →</a></article></section>
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


def article(d):
    toc = ''.join(f'<a href="#section-{i}">{e(section["title"])}</a>' for i, section in enumerate(d['sections'], 1))
    sections = ''
    for i, section in enumerate(d['sections'], 1):
        body = ''.join(f'<p>{e(p)}</p>' for p in section.get('paragraphs', []))
        if section.get('steps'):
            body += '<ol>' + ''.join(f'<li>{e(step)}</li>' for step in section['steps']) + '</ol>'
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
    return f'''
<nav class="breadcrumb" aria-label="{e(d['blog'])}"><a href="index.html">{e(d['blog'])}</a><span aria-hidden="true">/</span><span>{e(d['category'])}</span></nav>
<header class="hero article-hero"><div class="meta"><span class="tag">{e(d['category'])}</span><span>·</span><span>{e(d['time'])}</span><span class="draft">{e(d['draft'])}</span></div><h1>{e(d['title'])}</h1><p>{e(d['description'])}</p></header>
<div class="article-layout"><nav class="toc" aria-label="{e(d['toc'])}"><strong>{e(d['toc'])}</strong>{toc}</nav>
<article class="prose">{sections}<details><summary>{e(d['faqTitle'])}</summary><p>{e(d['faqAnswer'])}</p></details>{related}{cta(d)}<a class="back" href="index.html">← {e(d['back'])}</a></article></div>'''


def main():
    content = json.loads(CONTENT.read_text())
    wallet = json.loads(WALLET_CONTENT.read_text())
    buy = json.loads(BUY_CONTENT.read_text())
    for lang in LANGUAGES:
        d = {**content[lang], **wallet[lang]}
        second = {**content[lang], **buy[lang]}
        folder = ROOT / lang / 'blog'
        folder.mkdir(parents=True, exist_ok=True)
        (folder / 'index.html').write_text(shell(lang, d, 'index.html', d['headline'], d['intro'], home(d, second)))
        (folder / ARTICLE).write_text(shell(lang, d, ARTICLE, d['title'], d['description'], article(d)))
        (folder / BUY_ARTICLE).write_text(shell(lang, second, BUY_ARTICLE, second['title'], second['description'], article(second)))
    print('Built 12 pages: a blog index and two articles in each language.')


if __name__ == '__main__':
    main()
