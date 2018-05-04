yarn build
cd dist

echo 'whitemiao.us' >> CNAME

git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/flamingwhite/flamingwhite.github.io.git
git push -f origin master

firebase use miaocontacts-production
firebase deploy
firebase use miaocontacts