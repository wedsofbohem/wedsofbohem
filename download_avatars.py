import urllib2
import ssl
import os

ctx = ssl._create_unverified_context()

avatars = [
    ("avatar_gayathri.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_6617-2-150x150.jpg"),
    ("avatar_noora.jpeg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_9906.JPG-150x150.jpeg"),
    ("avatar_stephen.jpg", "https://1238347.us8.myftpupload.com/wp-content/uploads/2026/08/IMG_7496-2-150x150.jpg")
]

dest_dir = "/Users/wedsofbohemmac3/.gemini/antigravity/scratch/weds-of-bohem/assets/images"

for filename, url in avatars:
    path = os.path.join(dest_dir, filename)
    print("Downloading %s from %s..." % (filename, url))
    try:
        req = urllib2.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib2.urlopen(req, context=ctx, timeout=15)
        with open(path, "wb") as f:
            f.write(resp.read())
        print("Saved %s (%d bytes)" % (filename, os.path.getsize(path)))
    except Exception as e:
        print("Failed %s: %s" % (filename, e))
