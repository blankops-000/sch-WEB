@echo off
echo Uploading to GitHub...
cd "c:\Users\ERICK\Documents\sch WEB"
git init
git add .
git commit -m "Mobile responsive admin panel with handbook management"
git branch -M main
git remote add origin https://github.com/blankops-000/sch-WEB.git
git push -u origin main
echo Upload complete!
pause