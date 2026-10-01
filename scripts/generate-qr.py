# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "qrcode[pil]",
# ]
# ///
"""
Generates clean vector SVG QR codes with white background and black modules (4-module quiet zone)
for Caelum Systems team LinkedIn profiles.
"""
from pathlib import Path
import qrcode

PROFILES = [
    {
        "id": "christian-gonzalez",
        "name": "Christian González Pérez",
        "url": "https://www.linkedin.com/in/christiangonzalezperez/",
    },
    {
        "id": "alejandro-gil",
        "name": "Alejandro Gil Getino",
        "url": "https://www.linkedin.com/in/alejandro-gil-getino",
    },
    {
        "id": "guillermo-alba",
        "name": "Guillermo Alba Buitrón",
        "url": "https://www.linkedin.com/in/guillermo-alba-buitron/",
    },
]

def generate_svg_qr(url: str) -> str:
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=1,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    matrix = qr.get_matrix()
    n = len(matrix)
    
    path_commands = []
    for y, row in enumerate(matrix):
        x = 0
        while x < n:
            if row[x]:
                start_x = x
                while x < n and row[x]:
                    x += 1
                length = x - start_x
                path_commands.append(f"M{start_x},{y}h{length}v1h{-length}z")
            else:
                x += 1
                
    d = "".join(path_commands)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" '
        f'shape-rendering="crispEdges" width="100%" height="100%" aria-label="QR Code">\n'
        f'  <rect width="{n}" height="{n}" fill="#ffffff"/>\n'
        f'  <path d="{d}" fill="#000000"/>\n'
        f'</svg>\n'
    )

def main():
    out_dir = Path("presentations/esabic-caelum-2026/qr")
    out_dir.mkdir(parents=True, exist_ok=True)
    
    for profile in PROFILES:
        svg_content = generate_svg_qr(profile["url"])
        out_file = out_dir / f"qr-{profile['id']}.svg"
        out_file.write_text(svg_content, encoding="utf-8")
        print(f"Generated {out_file} ({len(svg_content)} bytes) for {profile['name']} -> {profile['url']}")

if __name__ == "__main__":
    main()
