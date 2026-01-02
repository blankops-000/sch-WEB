@echo off
echo Uploading to GitHub...
cd "c:\Users\ERICK\Documents\sch WEB"
git add .
git commit -m "Mobile responsive admin panel with handbook management"
git push origin main
echo Upload complete!
pause