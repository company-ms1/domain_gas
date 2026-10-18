#!/usr/bin/env python3
"""Build MCP translations from ru/mcp.html and assets/mcp/translations.json."""
import json
import re
from html import escape
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRANSLATIONS = json.loads((ROOT / 'assets/mcp/translations.json').read_text())
CYRILLIC = re.compile(r'[А-Яа-яЁё]')


class Translate(HTMLParser):
    def __init__(self, language):
        super().__init__(convert_charrefs=False)
        self.language = language
        self.output = []

    def translate(self, text):
        if not CYRILLIC.search(text):
            return text
        key = text.strip()
        if key not in TRANSLATIONS:
            raise ValueError(f'Missing translation: {key!r}')
        return text.replace(key, TRANSLATIONS[key][self.language], 1)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        result = []
        for key, value in attrs:
            if value is None:
                result.append(key)
                continue
            if key in ('aria-label', 'title', 'content', 'alt'):
                value = self.translate(value)
            if tag == 'html' and key == 'lang':
                value = self.language
            if key == 'href' and value == '/?lang=ru':
                value = f'/?lang={self.language}'
            if key == 'href' and value == '/ru/blog':
                value = f'/{self.language}/blog'
            if (attributes.get('rel') == 'canonical' and key == 'href') or (attributes.get('property') == 'og:url' and key == 'content'):
                value = f'https://www.gasfree4you.com/{self.language}/mcp'
            if key == 'aria-current' and attributes.get('hreflang'):
                continue
            result.append(f'{key}="{escape(value, quote=True)}"')
        if tag == 'a' and attributes.get('hreflang') == self.language:
            result.append('aria-current="page"')
        self.output.append('<' + tag + (' ' + ' '.join(result) if result else '') + '>')

    def handle_endtag(self, tag):
        self.output.append(f'</{tag}>')

    def handle_data(self, text):
        self.output.append(escape(self.translate(text), quote=False))

    def handle_entityref(self, name):
        self.output.append(f'&{name};')

    def handle_charref(self, name):
        self.output.append(f'&#{name};')

    def handle_decl(self, decl):
        self.output.append(f'<!{decl}>')

    def handle_comment(self, comment):
        self.output.append(f'<!--{comment}-->')


if __name__ == '__main__':
    source = (ROOT / 'ru/mcp.html').read_text()
    for language in ('en', 'es', 'id'):
        parser = Translate(language)
        parser.feed(source)
        output = ''.join(parser.output)
        assert not CYRILLIC.search(output), f'Untranslated text in {language}'
        target = ROOT / language / 'mcp.html'
        target.parent.mkdir(exist_ok=True)
        target.write_text(output)
        print(f'Built {language}/mcp.html')
