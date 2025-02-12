#!/bin/bash

function tearDown {
  echo -e "\nBye!"
  exit 0
}

trap tearDown SIGINT SIGHUP SIGTERM

# Available env variables passed from docker commandline are
# ICORE_BASE_URL_WITH_PORT
# ICORE_BASE_URL
# ICORE_APP_URL


if [[ -z "${ICORE_BASE_URL_WITH_PORT}" ]]; then
  echo "-------Did not find any URL, hence using localhost as url"
else
  echo "-------Creating documentation for URL: ${ICORE_BASE_URL_WITH_PORT}"
  pwd
  file="/usr/local/apache2/htdocs"
  ls $file
  URL_ONLY=$(echo $ICORE_BASE_URL| awk -F[/:] '{print $4}')
  find . -not -empty -type f -name bundle*.js -exec sed -i "s|https://icorev5-dev.indx.ai:3000|$ICORE_BASE_URL_WITH_PORT|g" {} +
  find . -not -empty -type f -name bundle*.js -exec sed -i "s|https://icorev5-dev.indx.ai|https://$URL_ONLY|g" {} +

  if [[ "${ICORE_APP_URL}" ]]; then
    echo "Setting up app url: ${ICORE_APP_URL}"
    APP_URL_ONLY=$(echo $ICORE_APP_URL| awk -F[/:] '{print $4}')
    sed -i "s/icorev5-dev.indx.ai/$APP_URL_ONLY/g" /usr/local/apache2/conf/httpd.conf
  else
    echo "No app url found hence setting it up icore base url"
    sed -i "s/icorev5-dev.indx.ai/$URL_ONLY/g" /usr/local/apache2/conf/httpd.conf
  fi
fi

httpd-foreground