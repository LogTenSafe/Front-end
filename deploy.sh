yarn build
rsync -rvz --delete --force dist/ deploy@logtensafe.com:/var/www/logtensafe.com/
