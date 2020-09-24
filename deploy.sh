# build
cd docs

yarn 

yarn build

yarn generate

# navigate into the build output directory
cd docs

git init
git add -A
git commit -m 'Deplying docs'

git push -f git@github.com:hunterliu1003/vue-final-modal.git master:gh-pages
