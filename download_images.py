import urllib2
import ssl
import os

ctx = ssl._create_unverified_context()

images = [
    ("hero_main.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_7515-scaled.jpg"),
    ("couple_1.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_7664-2-1-scaled.jpg"),
    ("couple_2.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/WhatsApp-Image-2026-07-29-at-8.34.34-PM-1.jpeg"),
    ("couple_3.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_7496-scaled.jpg"),
    ("couple_4.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_9910.JPG-scaled.jpeg"),
    ("couple_5.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_1552-scaled.jpg"),
    ("couple_6.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_6617-1-scaled.jpg"),
    ("story_1.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_7513-1-scaled.jpg"),
    ("story_2.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_7216-1-scaled.jpg"),
    ("story_3.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_7569-scaled.jpg"),
    ("editorial_1.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/NVF06380.JPG-1-edited-1.jpeg")
]

dest_dir = "/Users/wedsofbohemmac3/.gemini/antigravity/scratch/weds-of-bohem/assets/images"
if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

for filename, url in images:
    path = os.path.join(dest_dir, filename)
    print("Downloading %s from %s..." % (filename, url))
    try:
        req = urllib2.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib2.urlopen(req, context=ctx, timeout=20)
        with open(path, "wb") as f:
            f.write(resp.read())
        print("Saved %s (%d bytes)" % (filename, os.path.getsize(path)))
    except Exception as e:
        print("Failed %s: %s" % (filename, e))
