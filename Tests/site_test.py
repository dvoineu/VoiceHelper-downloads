import json
import re
import unittest
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parent.parent
SITE_DIR = ROOT / "site"
PUBLIC_SITE = "https://dvoineu.github.io/VoiceHelper-downloads/"
PUBLIC_REPO = "https://github.com/dvoineu/VoiceHelper-downloads"
RELEASE = PUBLIC_REPO + "/releases/download/v1.1-build.4/"


class SemanticHTMLInspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.headings = []
        self.images = []
        self.details_names = []
        self.scroll_progress_attrs = None
        self.meta_tags = []
        self.link_tags = []
        self.anchors = []
        self.local_resources = []
        self.in_json_ld = False
        self.json_ld_blocks = []
        self._current_json_ld = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "a":
            self.anchors.append(attr_dict)
        if attr_dict.get("src"):
            self.local_resources.append(attr_dict["src"])
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self.headings.append(int(tag[1]))
        elif tag == "img":
            self.images.append(attr_dict)
        elif tag == "details":
            self.details_names.append(attr_dict.get("name"))
        elif tag == "div" and attr_dict.get("id") == "scroll-progress":
            self.scroll_progress_attrs = attr_dict
        elif tag == "meta":
            self.meta_tags.append(attr_dict)
        elif tag == "link":
            self.link_tags.append(attr_dict)
        elif tag == "script" and attr_dict.get("type") == "application/ld+json":
            self.in_json_ld = True
            self._current_json_ld = []

    def handle_endtag(self, tag):
        if tag == "script" and self.in_json_ld:
            self.in_json_ld = False
            self.json_ld_blocks.append("".join(self._current_json_ld).strip())

    def handle_data(self, data):
        if self.in_json_ld:
            self._current_json_ld.append(data)


class VoiceHelperSiteTests(unittest.TestCase):
    def test_site_files_exist(self):
        required = [
            SITE_DIR / "index.html",
            SITE_DIR / "css" / "styles.css",
            SITE_DIR / "js" / "app.js",
            SITE_DIR / "js" / "scene3d.js",
            SITE_DIR / "js" / "i18n.js",
            SITE_DIR / "vendor" / "three.module.min.js",
            SITE_DIR / "robots.txt",
            SITE_DIR / "sitemap.xml",
            SITE_DIR / "site.webmanifest",
            SITE_DIR / "assets" / "favicon.svg",
            SITE_DIR / "assets" / "og-cover.svg",
            SITE_DIR / "assets" / "icon-192.png",
            SITE_DIR / "assets" / "icon-512.png",
        ]
        for path in required:
            self.assertTrue(path.is_file(), f"Missing required site file: {path}")

    def test_html_semantics_and_seo_metadata(self):
        html_text = (SITE_DIR / "index.html").read_text(encoding="utf-8")
        self.assertTrue(html_text.startswith("<!DOCTYPE html>"))

        inspector = SemanticHTMLInspector()
        inspector.feed(html_text)

        # Single H1 and non-skipping heading hierarchy
        h1_count = sum(1 for level in inspector.headings if level == 1)
        self.assertEqual(h1_count, 1, "Page must have exactly one <h1>")
        for prev, curr in zip(inspector.headings, inspector.headings[1:]):
            self.assertLessEqual(
                curr - prev,
                1,
                f"Heading hierarchy skipped from h{prev} to h{curr}",
            )

        # Scroll progress bar must have aria-hidden="true"
        self.assertIsNotNone(inspector.scroll_progress_attrs)
        self.assertEqual(inspector.scroll_progress_attrs.get("aria-hidden"), "true")

        # All images must declare width, height, and alt
        self.assertGreaterEqual(len(inspector.images), 2)
        for img in inspector.images:
            self.assertIn("width", img)
            self.assertIn("height", img)
            self.assertIn("alt", img)

        # Exclusive accordion FAQ uses <details name="faq">
        self.assertGreaterEqual(len(inspector.details_names), 5)
        for name in inspector.details_names:
            self.assertEqual(name, "faq")

        # Canonical & hreflang links
        rels = [link.get("rel") for link in inspector.link_tags]
        self.assertIn("canonical", rels)
        hreflangs = {
            link.get("hreflang")
            for link in inspector.link_tags
            if link.get("rel") == "alternate"
        }
        self.assertEqual(hreflangs, {"ru", "en", "x-default"})

        # JSON-LD structured data validation
        self.assertEqual(len(inspector.json_ld_blocks), 1)
        ld_data = json.loads(inspector.json_ld_blocks[0])
        self.assertEqual(ld_data.get("@context"), "https://schema.org")
        graph_types = {item.get("@type") for item in ld_data.get("@graph", [])}
        self.assertIn("SoftwareApplication", graph_types)
        self.assertIn("FAQPage", graph_types)
        self.assertIn("WebSite", graph_types)

    def test_modern_web_guidance_css_and_threejs_lifecycle(self):
        css_text = (SITE_DIR / "css" / "styles.css").read_text(encoding="utf-8")
        self.assertIn("content-visibility: auto", css_text)
        self.assertIn("contain-intrinsic-size:", css_text)
        self.assertIn("prefers-reduced-motion: reduce", css_text)
        self.assertIn("animation-timeline: scroll", css_text)
        self.assertIn("timeline-scope:", css_text)

        scene_js = (SITE_DIR / "js" / "scene3d.js").read_text(encoding="utf-8")
        self.assertIn("THREE.WebGLRenderer", scene_js)
        self.assertIn("contentvisibilityautostatechange", scene_js)
        self.assertIn("prefers-reduced-motion: reduce", scene_js)

    def test_sitemap_and_manifest_valid(self):
        manifest = json.loads((SITE_DIR / "site.webmanifest").read_text(encoding="utf-8"))
        self.assertEqual(manifest["short_name"], "VoiceHelper")
        self.assertGreaterEqual(len(manifest["icons"]), 3)

        tree = ET.fromstring((SITE_DIR / "sitemap.xml").read_text(encoding="utf-8"))
        self.assertTrue(tree.tag.endswith("urlset"))

    def test_public_downloads_and_project_site_urls(self):
        inspector = SemanticHTMLInspector()
        html = (SITE_DIR / "index.html").read_text(encoding="utf-8")
        inspector.feed(html)
        buttons = {a.get("data-i18n"): a for a in inspector.anchors}
        for key, filename in {
            "dlBtnDmg": "VoiceHelper-1.1-4-arm64.dmg",
            "dlBtnZip": "VoiceHelper-1.1-4-arm64.zip",
            "dlInstall": "INSTALL.txt",
            "dlChecksums": "SHA256SUMS",
        }.items():
            self.assertEqual(buttons[key]["href"], RELEASE + filename)
        for anchor in inspector.anchors:
            href = anchor.get("href", "")
            if href.startswith("https://github.com/"):
                self.assertTrue(href == PUBLIC_REPO or href.startswith(PUBLIC_REPO + "/"), href)
        canonical = next(link["href"] for link in inspector.link_tags if link.get("rel") == "canonical")
        self.assertEqual(canonical, PUBLIC_SITE)
        for link in inspector.link_tags:
            if link.get("rel") == "alternate":
                self.assertTrue(link["href"].startswith(PUBLIC_SITE))
        graph = json.loads(inspector.json_ld_blocks[0])["@graph"]
        software = next(item for item in graph if item["@type"] == "SoftwareApplication")
        self.assertEqual(software["downloadUrl"], buttons["dlBtnDmg"]["href"])
        self.assertNotIn("codeRepository", software)
        for meta in inspector.meta_tags:
            if meta.get("property") in {"og:url", "og:image"} or meta.get("name") == "twitter:image":
                self.assertTrue(meta["content"].startswith(PUBLIC_SITE))
        sitemap = ET.fromstring((SITE_DIR / "sitemap.xml").read_text())
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        self.assertEqual(sitemap.find("s:url/s:loc", ns).text, PUBLIC_SITE)
        self.assertIn("Sitemap: " + PUBLIC_SITE + "sitemap.xml", (SITE_DIR / "robots.txt").read_text())
        for path in [SITE_DIR / "index.html", *sorted((SITE_DIR / "js").glob("*.js"))]:
            self.assertNotIn("git clone", path.read_text())
            self.assertNotIn("voicehelper.dev", path.read_text())

    def test_local_assets_resolve_under_pages_project_path(self):
        inspector = SemanticHTMLInspector()
        inspector.feed((SITE_DIR / "index.html").read_text())
        resources = inspector.local_resources + [
            link["href"] for link in inspector.link_tags
            if link.get("rel") in {"stylesheet", "icon", "apple-touch-icon", "manifest"}
        ]
        manifest = json.loads((SITE_DIR / "site.webmanifest").read_text())
        resources.extend(icon["src"] for icon in manifest["icons"])
        for resource in resources:
            resolved = urljoin(PUBLIC_SITE, resource)
            self.assertTrue(resolved.startswith(PUBLIC_SITE), resolved)
            relative = urlparse(resolved).path.removeprefix(urlparse(PUBLIC_SITE).path)
            self.assertTrue((SITE_DIR / relative).is_file(), relative)

    def test_english_html_fallback_and_language_links(self):
        html = (SITE_DIR / "index.html").read_text()
        self.assertIn('<html lang="en">', html)
        self.assertIn('>Install VoiceHelper on your Mac</h2>', html)
        inspector = SemanticHTMLInspector()
        inspector.feed(html)
        languages = {a["data-language"]: a for a in inspector.anchors if "data-language" in a}
        self.assertEqual(set(languages), {"en", "ru"})
        for language, link in languages.items():
            self.assertEqual(link["href"], "?lang=" + language)
            self.assertEqual(link["lang"], language)
        self.assertEqual(languages["en"]["aria-current"], "true")
        self.assertNotIn("aria-current", languages["ru"])
        self.assertEqual(json.loads((SITE_DIR / "site.webmanifest").read_text())["lang"], "en")
        website = json.loads(inspector.json_ld_blocks[0])["@graph"][0]
        self.assertEqual(website["inLanguage"], ["en", "ru"])

    def test_current_release_has_visible_bilingual_change_list(self):
        html = (SITE_DIR / "index.html").read_text()
        dictionary = (SITE_DIR / "js/i18n.js").read_text()
        self.assertIn('id="whats-new"', html)
        self.assertIn('>What’s new in VoiceHelper</h2>', html)
        for key in ["newKicker", "newTitle", "newSubtitle", "newSetupTitle", "newSetupBody",
                    "newTrialTitle", "newTrialBody", "newModelTitle", "newModelBody", "newPreserved", "newFullNotes"]:
            self.assertIn('data-i18n="' + key + '"', html)
            self.assertEqual(len(re.findall(r'\b' + key + r':\s*[\'\"][^\'\"]+', dictionary)), 2, key)
        self.assertIn(PUBLIC_REPO + "/releases/tag/v1.1-build.4", html)
        self.assertNotIn("v1.1-build.3", html)
        self.assertIn("VoiceHelper 1.1 (4)", html)


if __name__ == "__main__":
    unittest.main()
