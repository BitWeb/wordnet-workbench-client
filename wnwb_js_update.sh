# run with sudo

npm install -g bower@latest
npm install -g npm-check-updates@latest
bower list > before_upgrade.txt
ncu -a -u -m bower
bower list > after_upgrade.txt
