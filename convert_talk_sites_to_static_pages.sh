#!/bin/bash

# list of all domains to modify convert to from ourboros talk to static page index.html
declare -a TALK_DOMAINS=("talk.projectstardate.org"
                         "talk.condorwatch.org"
                         "talk.higgshunters.org"
                         "talk.orchidobservers.org"
                         "talk.sunspotter.org"
                         "talk.sciencegossip.org"
                         "talk.notesfromnature.org"
                         "talk.planktonportal.org"
                         "talk.milkywayproject.org"
                         "talk.wormwatchlab.org"
                         "talk.chicagowildlifewatch.org"
                         "talk.asteroidzoo.org"
                         "radiotalk.galaxyzoo.org"
                         "quenchtalk.galaxyzoo.org"
                         "talk.cyclonecenter.org"
                         "talk.floatingforests.org"
                         "talk.diskdetective.org"
                         "talk.snapshotserengeti.org"
                         "talk.planetfour.org"
                         "talk.chimpandsee.org"
                         "talk.planethunters.org"
                         "talk.operationwardiary.org"
                         "talk.penguinwatch.org"
                         "talk.galaxyzoo.org"
                         "talk.spacewarps.org"
                         )

for domain in "${TALK_DOMAINS[@]}"
do
  DEPLOY_PATH="s3://zooniverse-static/${domain}/"

  # preseve the original index file for rollback / posterity
  #
  # check the cmd looks right via --dryrun flag
  #aws s3 cp --dryrun "${DEPLOY_PATH}index.html" "${DEPLOY_PATH}ouroboros_talk_index_`date '+%Y-%m-%d-%H:%M:%S'`.html"
  # run the backup (no --dryrun)
  aws s3 cp "${DEPLOY_PATH}index.html" "${DEPLOY_PATH}ouroboros_talk_index_`date '+%Y-%m-%d-%H:%M:%S'`.html"

  # enable the static version of the site - overwrite the old index file
  # aws s3 cp --dryrun "${DEPLOY_PATH}recent/index.html" "${DEPLOY_PATH}index.html"
  aws s3 cp "${DEPLOY_PATH}recent/index.html" "${DEPLOY_PATH}index.html"

  echo "${domain} talk site converted to static archive"
  echo "-----------------------------------------------"
  echo
done
