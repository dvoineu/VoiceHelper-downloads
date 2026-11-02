import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]


class ForwardingTests(unittest.TestCase):
    def test_language_section_and_extra_query_survive(self):
        script = (ROOT / "site/js/redirect.js").read_text()
        cases = [
            ("", "", "https://dvoineu.github.io/Frazia/"),
            ("?lang=en", "#video", "https://dvoineu.github.io/Frazia/?lang=en#video"),
            ("?lang=ru", "#download", "https://dvoineu.github.io/Frazia/?lang=ru#download"),
            ("?lang=ru&from=old", "#video", "https://dvoineu.github.io/Frazia/?lang=ru&from=old#video"),
        ]
        for search, fragment, expected in cases:
            harness = 'const window={location:{search:' + json.dumps(search) + ',hash:' + json.dumps(fragment) + ',replace:(url)=>console.log(url)}};const document={querySelectorAll:()=>[]};'
            actual = subprocess.check_output(["node", "-e", harness + script], text=True).strip()
            self.assertEqual(actual, expected)

    def test_manual_links_and_script_are_available(self):
        html = (ROOT / "site/index.html").read_text()
        self.assertIn('src="./js/redirect.js"', html)
        self.assertIn('href="https://dvoineu.github.io/Frazia/"', html)
        self.assertIn('href="https://dvoineu.github.io/Frazia/?lang=ru"', html)
        self.assertIn('https://github.com/dvoineu/VoiceHelper-downloads/releases', html)


if __name__ == "__main__":
    unittest.main()
